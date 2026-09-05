const OPENAI_URL = "https://api.openai.com/v1/responses";
const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";

export const PATHS = {
  "Fast Validation": ["Evidence", "Prototype", "MVP", "Launch", "Measure"],
  "Standard Product": ["Discovery", "Prototype", "POC", "MVP", "Beta", "GA", "Measure"],
  "High-Risk": ["Discovery", "Risk review", "POC", "Alpha", "Closed beta", "Gradual rollout", "GA", "Measure"],
  "Reliability Fix": ["Diagnose", "Fix", "Regression & UAT", "Gradual rollout", "GA", "Monitor"]
};

export const ARTIFACT_KEYS = [
  "opportunity_brief", "one_page_prd", "full_prd", "prototype_brief", "epic",
  "user_stories", "analytics_plan", "uat_plan", "gtm_plan", "rollout_checklist",
  "release_notes", "user_manual", "post_launch_review"
];

const scoreProperties = {
  impact: { type: "integer", minimum: 1, maximum: 5 },
  evidence_strength: { type: "integer", minimum: 1, maximum: 5 },
  strategy_alignment: { type: "integer", minimum: 1, maximum: 5 },
  urgency: { type: "integer", minimum: 1, maximum: 5 },
  effort: { type: "integer", minimum: 1, maximum: 5 },
  risk: { type: "integer", minimum: 1, maximum: 5 }
};

export const EVIDENCE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    sources_reviewed: {
      type: "array",
      items: {
        type: "object", additionalProperties: false,
        properties: {
          source_id: { type: "string" }, title: { type: "string" },
          key_findings: { type: "array", items: { type: "string" } },
          confidence: { type: "string", enum: ["high", "medium", "low"] }
        },
        required: ["source_id", "title", "key_findings", "confidence"]
      }
    },
    usage_signals: {
      type: "array",
      items: {
        type: "object", additionalProperties: false,
        properties: { module: { type: "string" }, signal: { type: "string" }, implication: { type: "string" } },
        required: ["module", "signal", "implication"]
      }
    },
    opportunities: {
      type: "array", minItems: 1,
      items: {
        type: "object", additionalProperties: false,
        properties: {
          id: { type: "string" }, title: { type: "string" }, user_problem: { type: "string" },
          evidence_source_ids: { type: "array", items: { type: "string" } },
          ...scoreProperties,
          rationale: { type: "string" }, success_outcome: { type: "string" }
        },
        required: ["id", "title", "user_problem", "evidence_source_ids", "impact", "evidence_strength", "strategy_alignment", "urgency", "effort", "risk", "rationale", "success_outcome"]
      }
    },
    gaps: { type: "array", items: { type: "string" } },
    assumptions: { type: "array", items: { type: "string" } },
    recommended_next_step: { type: "string" }
  },
  required: ["summary", "sources_reviewed", "usage_signals", "opportunities", "gaps", "assumptions", "recommended_next_step"]
};

export const ROADMAP_SCHEMA = {
  type: "object", additionalProperties: false,
  properties: {
    strategy_summary: { type: "string" },
    principles: { type: "array", items: { type: "string" } },
    roadmap_items: {
      type: "array", minItems: 1,
      items: {
        type: "object", additionalProperties: false,
        properties: {
          opportunity_id: { type: "string" }, title: { type: "string" },
          priority: { type: "string", enum: ["P0", "P1", "P2", "P3"] },
          lane: { type: "string", enum: ["Now", "Next", "Later"] },
          path: { type: "string", enum: Object.keys(PATHS) },
          stages: { type: "array", items: { type: "string" } },
          current_stage: { type: "string" }, success_metric: { type: "string" },
          owner: { type: "string" }, decision_gate: { type: "string" }
        },
        required: ["opportunity_id", "title", "priority", "lane", "path", "stages", "current_stage", "success_metric", "owner", "decision_gate"]
      }
    },
    risks: { type: "array", items: { type: "string" } },
    approval_needed: { type: "array", items: { type: "string" } }
  },
  required: ["strategy_summary", "principles", "roadmap_items", "risks", "approval_needed"]
};

const artifactProperties = Object.fromEntries(ARTIFACT_KEYS.map((key) => [key, { type: "string" }]));

export const PACK_SCHEMA = {
  type: "object", additionalProperties: false,
  properties: {
    selected_opportunity_id: { type: "string" },
    executive_summary: { type: "string" },
    artifacts: {
      type: "object", additionalProperties: false,
      properties: artifactProperties,
      required: ARTIFACT_KEYS
    },
    launch_plan: {
      type: "object", additionalProperties: false,
      properties: {
        stage: { type: "string" },
        readiness_checklist: { type: "array", items: { type: "string" } },
        rollback_plan: { type: "string" }
      },
      required: ["stage", "readiness_checklist", "rollback_plan"]
    }
  },
  required: ["selected_opportunity_id", "executive_summary", "artifacts", "launch_plan"]
};

const SYSTEM_INSTRUCTIONS = `You are Juno, an autonomous but approval-gated AI product manager.
Work from supplied evidence and usage data. Never invent evidence, source IDs, metrics, or approvals.
Complete the requested product work yourself. Clearly mark gaps and assumptions.
Apply this transparent priority formula conceptually: impact 30%, evidence 25%, strategy 20%, urgency 15%, effort -5%, risk -5%.
Block weak or uncited requests from high priority. Choose one lifecycle path: Fast Validation, Standard Product, High-Risk, or Reliability Fix.
Everything you produce is a draft until a human approves it. Do not claim to publish, deploy, message users, or update external systems.
Write practical, specific product-management output in the requested language.`;

function safeName(value) {
  return String(value || "juno_stage").toLowerCase().replace(/[^a-z0-9_]+/g, "_").slice(0, 48);
}

function extractOpenAIText(payload) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) return payload.output_text;
  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && typeof content.text === "string") return content.text;
    }
  }
  throw new Error(payload.error?.message || "OpenAI returned no structured text output.");
}

function parseModelJson(text, stage) {
  const cleaned = String(text).trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try { return JSON.parse(cleaned); }
  catch { throw new Error(`${stage} returned invalid JSON.`); }
}

async function fetchWithTimeout(fetchImpl, url, options, timeoutMs, parentSignal) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(new Error("Model request timed out.")), timeoutMs);
  const abortParent = () => controller.abort(parentSignal.reason || new Error("Run cancelled."));
  if (parentSignal) {
    if (parentSignal.aborted) abortParent();
    else parentSignal.addEventListener("abort", abortParent, { once: true });
  }
  try { return await fetchImpl(url, { ...options, signal: controller.signal }); }
  finally {
    clearTimeout(timeout);
    parentSignal?.removeEventListener("abort", abortParent);
  }
}

export async function callOpenAI({ stage, prompt, schema, model = "gpt-5.6-terra", apiKey, signal, fetchImpl = fetch, endpoint = OPENAI_URL }) {
  if (!apiKey) throw new Error("OpenAI API key is required for this provider.");
  const response = await fetchWithTimeout(fetchImpl, endpoint, {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      instructions: SYSTEM_INSTRUCTIONS,
      input: prompt,
      store: false,
      max_output_tokens: stage === "product_pack" ? 24000 : 12000,
      text: { format: { type: "json_schema", name: safeName(stage), strict: true, schema } }
    })
  }, 300000, signal);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error?.message || `OpenAI request failed (${response.status}).`);
  return parseModelJson(extractOpenAIText(payload), stage);
}

export async function callOllama({ stage, prompt, schema, model = "llama3.2", signal, fetchImpl = fetch, endpoint = OLLAMA_URL }) {
  const response = await fetchWithTimeout(fetchImpl, endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTIONS },
        { role: "user", content: prompt }
      ],
      format: schema,
      stream: false,
      options: { temperature: 0.1, num_ctx: 32768 }
    })
  }, 600000, signal);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Ollama request failed (${response.status}).`);
  return parseModelJson(payload.message?.content, stage);
}

export async function callProvider(config) {
  if (config.provider === "openai") return callOpenAI(config);
  if (config.provider === "ollama") return callOllama(config);
  throw new Error(`Unsupported provider: ${config.provider}`);
}

function sourceText(source) {
  return String(source.content || source.localContent || source.detail || "").trim();
}

function chunkSources(sources, maxCharacters = 70000) {
  const chunks = [];
  let current = [];
  let size = 0;
  for (const source of sources) {
    const normalized = { id: String(source.id || "source"), title: String(source.title || source.name || "Untitled"), type: String(source.type || "Document"), content: sourceText(source) };
    const segments = normalized.content.length > maxCharacters
      ? normalized.content.match(new RegExp(`[\\s\\S]{1,${maxCharacters}}`, "g")) || [""]
      : [normalized.content];
    for (let index = 0; index < segments.length; index += 1) {
      const part = { ...normalized, id: segments.length > 1 ? `${normalized.id}-part-${index + 1}` : normalized.id, content: segments[index] };
      if (current.length && size + part.content.length > maxCharacters) {
        chunks.push(current); current = []; size = 0;
      }
      current.push(part); size += part.content.length;
    }
  }
  if (current.length) chunks.push(current);
  return chunks;
}

function evidencePrompt({ projectName, goal, language, sources, usage, batch, totalBatches }) {
  return `PROJECT: ${projectName}\nGOAL: ${goal}\nOUTPUT LANGUAGE: ${language}\nEVIDENCE BATCH: ${batch}/${totalBatches}\n\nSOURCES:\n${JSON.stringify(sources)}\n\nMODULE USAGE:\n${JSON.stringify(usage)}\n\nRead every supplied source in this batch. Extract grounded findings, usage signals, and evidence-backed opportunities. Use only source IDs that appear above.`;
}

function consolidatePrompt({ projectName, goal, language, analyses, usage }) {
  return `PROJECT: ${projectName}\nGOAL: ${goal}\nOUTPUT LANGUAGE: ${language}\n\nPARTIAL EVIDENCE ANALYSES:\n${JSON.stringify(analyses)}\n\nMODULE USAGE:\n${JSON.stringify(usage)}\n\nConsolidate all batches without dropping material evidence. Deduplicate opportunities, preserve source IDs, expose contradictions, and produce one evidence analysis.`;
}

function roadmapPrompt({ projectName, goal, language, evidence }) {
  return `PROJECT: ${projectName}\nGOAL: ${goal}\nOUTPUT LANGUAGE: ${language}\n\nAPPROVED EVIDENCE ANALYSIS:\n${JSON.stringify(evidence)}\n\nPrioritize the full portfolio and produce a Now/Next/Later roadmap. Choose the smallest responsible lifecycle path for every item. Use exactly the stage sequence for its chosen path from this map: ${JSON.stringify(PATHS)}. Human approval must remain required at consequential gates.`;
}

function packPrompt({ projectName, goal, language, evidence, roadmap }) {
  return `PROJECT: ${projectName}\nGOAL: ${goal}\nOUTPUT LANGUAGE: ${language}\n\nEVIDENCE:\n${JSON.stringify(evidence)}\n\nROADMAP:\n${JSON.stringify(roadmap)}\n\nChoose the strongest Now item that has direct evidence. Create all thirteen complete product artifacts as Markdown strings. Include concrete evidence IDs, measurable success criteria, analytics, UAT, rollback, GTM, release notes, user guidance, and post-launch review. Do not approve the work yourself.`;
}

function assertStage(stage, value) {
  if (!value || typeof value !== "object") throw new Error(`${stage} did not return an object.`);
  if (stage === "evidence" && !Array.isArray(value.opportunities)) throw new Error("Evidence stage returned no opportunities.");
  if (stage === "roadmap" && !Array.isArray(value.roadmap_items)) throw new Error("Roadmap stage returned no items.");
  if (stage === "product_pack" && ARTIFACT_KEYS.some((key) => typeof value.artifacts?.[key] !== "string")) throw new Error("Product pack is incomplete.");
  return value;
}

export async function runJunoAgent(input, options = {}) {
  const provider = input.provider === "openai" ? "openai" : "ollama";
  const model = String(input.model || (provider === "openai" ? "gpt-5.6-terra" : "llama3.2"));
  const sources = Array.isArray(input.sources) ? input.sources.filter((source) => sourceText(source)) : [];
  if (!sources.length) throw new Error("Add at least one readable project source before starting Juno.");
  const usage = Array.isArray(input.usage) ? input.usage : [];
  const projectName = String(input.projectName || "Untitled product");
  const goal = String(input.goal || "Build an evidence-backed product roadmap and delivery pack.");
  const language = String(input.language || "English");
  const callModel = options.callModel || ((stage, prompt, schema) => callProvider({ stage, prompt, schema, provider, model, apiKey: input.apiKey, signal: options.signal }));
  const onStage = options.onStage || (() => {});

  const batches = chunkSources(sources);
  const analyses = [];
  for (let index = 0; index < batches.length; index += 1) {
    onStage({ stage: "evidence", status: "running", detail: `Reading source batch ${index + 1} of ${batches.length}` });
    analyses.push(assertStage("evidence", await callModel("evidence", evidencePrompt({ projectName, goal, language, sources: batches[index], usage, batch: index + 1, totalBatches: batches.length }), EVIDENCE_SCHEMA)));
  }
  const evidence = analyses.length === 1 ? analyses[0] : assertStage("evidence", await callModel("evidence", consolidatePrompt({ projectName, goal, language, analyses, usage }), EVIDENCE_SCHEMA));
  onStage({ stage: "evidence", status: "complete", detail: `${sources.length} sources read` });

  onStage({ stage: "roadmap", status: "running", detail: "Prioritizing and routing opportunities" });
  const roadmap = assertStage("roadmap", await callModel("roadmap", roadmapPrompt({ projectName, goal, language, evidence }), ROADMAP_SCHEMA));
  onStage({ stage: "roadmap", status: "complete", detail: `${roadmap.roadmap_items.length} roadmap items created` });

  onStage({ stage: "product_pack", status: "running", detail: "Writing the complete product and launch pack" });
  const productPack = assertStage("product_pack", await callModel("product_pack", packPrompt({ projectName, goal, language, evidence, roadmap }), PACK_SCHEMA));
  onStage({ stage: "product_pack", status: "complete", detail: `${ARTIFACT_KEYS.length} artifacts created` });

  return { provider, model, projectName, goal, language, evidence, roadmap, productPack };
}
