import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { ARTIFACT_KEYS, callOllama, callOpenAI, runJunoAgent } from "../agent-core.mjs";

function evidence() {
  return {
    summary: "Grounded portfolio summary",
    sources_reviewed: [{ source_id: "S-1", title: "Research", key_findings: ["Export fails"], confidence: "high" }],
    usage_signals: [{ module: "Reports", signal: "Low completion", implication: "Fix reliability" }],
    opportunities: [{
      id: "OPP-001", title: "Fix exports", user_problem: "Users cannot finish exports",
      evidence_source_ids: ["S-1"], impact: 5, evidence_strength: 5, strategy_alignment: 4,
      urgency: 5, effort: 2, risk: 2, rationale: "Grounded and urgent", success_outcome: "Export success above 99%"
    }],
    gaps: [], assumptions: [], recommended_next_step: "Diagnose failures"
  };
}

function roadmap() {
  return {
    strategy_summary: "Reliability first", principles: ["Evidence before priority"],
    roadmap_items: [{
      opportunity_id: "OPP-001", title: "Fix exports", priority: "P0", lane: "Now",
      path: "Reliability Fix", stages: ["Diagnose", "Fix", "Regression & UAT", "Gradual rollout", "GA", "Monitor"],
      current_stage: "Diagnose", success_metric: "99% successful exports", owner: "Platform PM", decision_gate: "Approve diagnosis"
    }],
    risks: ["Regression"], approval_needed: ["PM approval"]
  };
}

function pack() {
  return {
    selected_opportunity_id: "OPP-001",
    executive_summary: "A complete evidence-backed reliability plan.",
    artifacts: Object.fromEntries(ARTIFACT_KEYS.map((key) => [key, `# ${key}\n\nComplete draft.`])),
    launch_plan: { stage: "Hold", readiness_checklist: ["UAT passed"], rollback_plan: "Restore the last approved release." }
  };
}

async function mockServer(handler) {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  return { url: `http://127.0.0.1:${port}`, close: () => new Promise((resolve) => server.close(resolve)) };
}

test("runs the full autonomous product workflow", async () => {
  const calls = [];
  const result = await runJunoAgent({
    provider: "ollama", model: "test", projectName: "Demo", goal: "Build the roadmap", language: "English",
    sources: [{ id: "S-1", title: "Research", content: "Users report export failure." }],
    usage: [{ module: "Reports", users: 100, active: 60, completion: 40 }]
  }, {
    callModel: async (stage) => {
      calls.push(stage);
      if (stage === "evidence") return evidence();
      if (stage === "roadmap") return roadmap();
      return pack();
    }
  });
  assert.deepEqual(calls, ["evidence", "roadmap", "product_pack"]);
  assert.equal(result.evidence.opportunities[0].evidence_source_ids[0], "S-1");
  assert.equal(result.roadmap.roadmap_items[0].path, "Reliability Fix");
  assert.equal(Object.keys(result.productPack.artifacts).length, 13);
});

test("reads oversized source material in multiple batches before consolidating", async () => {
  const calls = [];
  await runJunoAgent({
    provider: "ollama", projectName: "Large", goal: "Read everything",
    sources: [{ id: "S-1", title: "Large source", content: "x".repeat(80000) }]
  }, {
    callModel: async (stage) => {
      calls.push(stage);
      if (stage === "evidence") return evidence();
      if (stage === "roadmap") return roadmap();
      return pack();
    }
  });
  assert.deepEqual(calls, ["evidence", "evidence", "evidence", "roadmap", "product_pack"]);
});

test("OpenAI adapter requests non-stored structured output", async () => {
  let received;
  const mock = await mockServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    received = { authorization: req.headers.authorization, body: JSON.parse(Buffer.concat(chunks).toString()) };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ output_text: JSON.stringify(evidence()) }));
  });
  try {
    const value = await callOpenAI({ stage: "evidence", prompt: "Analyze", schema: {}, apiKey: "test-key", endpoint: mock.url });
    assert.equal(value.summary, "Grounded portfolio summary");
    assert.equal(received.authorization, "Bearer test-key");
    assert.equal(received.body.store, false);
    assert.equal(received.body.text.format.type, "json_schema");
  } finally { await mock.close(); }
});

test("Ollama adapter sends a local schema and parses the assistant message", async () => {
  let received;
  const mock = await mockServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    received = JSON.parse(Buffer.concat(chunks).toString());
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: { role: "assistant", content: JSON.stringify(evidence()) }, done: true }));
  });
  try {
    const value = await callOllama({ stage: "evidence", prompt: "Analyze", schema: { type: "object" }, model: "local-test", endpoint: mock.url });
    assert.equal(value.opportunities.length, 1);
    assert.equal(received.model, "local-test");
    assert.equal(received.stream, false);
    assert.deepEqual(received.format, { type: "object" });
  } finally { await mock.close(); }
});
