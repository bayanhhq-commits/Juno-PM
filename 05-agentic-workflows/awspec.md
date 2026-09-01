# Agent Workflow Spec (AWSpec) · Juno

> Module 5 · Agentic Workflows. A supervised workflow for Juno's evidence-backed Automated Prioritization capability.

**Workflow type:** Single-agent, tool-using, supervised workflow  
**Autonomy level:** Assisted / Copilot  
**Primary user:** RocketShip Product Manager  
**Final decision owner:** Product Manager

## Goal

Transform a PM-selected batch of approved interviews, support tickets, customer feedback, executive emails, and optional strategy context into a ranked, evidence-backed opportunity shortlist and editable Opportunity Brief.

The workflow should reduce the median time from raw inputs to a PM-approved shortlist by **50%**, while ensuring that:

- **100%** of ranked opportunities have valid, viewable source citations.
- **0** unsupported P0–P1 recommendations pass the evidence gate.
- Material conflicts and minority opinions remain visible.
- **100%** of final shortlists receive explicit PM approval.

Juno recommends and explains priorities. It does not own the roadmap decision.

## Trigger

The workflow begins only when a Product Manager explicitly selects **Analyse Evidence** in a Juno prioritization workspace.

Required trigger payload:

- Workspace and decision name
- Planning period
- PM-selected approved evidence sources
- Optional active strategy document
- Visible prioritization criteria and weights
- Requesting user identity and source permissions

Juno does not monitor systems or start prioritization runs in the background during V1.

## Preconditions

Before processing starts, Juno must confirm that:

1. At least one usable product-evidence source is present.
2. The requesting PM is permitted to access every selected source.
3. Each source has an ID, type, date, and version.
4. The strategy document, if supplied, has a visible version and planning period.
5. The PM understands whether the run will use **Strategy Mode** or **Quality Mode**.

If a precondition fails, the workflow pauses and tells the PM exactly what must be corrected.

## Steps & tools

| Step | Action | Tool / model | Guardrail |
|---:|---|---|---|
| 1 | Create an immutable run record containing the trigger payload and input versions | Workflow orchestrator and audit logger | Every run receives a unique trace ID; inputs cannot change silently during processing. |
| 2 | Validate file types, metadata, permissions, and unnecessary sensitive data | Input validator, access-policy engine, and PII filter | Reject unsupported, revoked, unapproved, or unauthorized content before retrieval. |
| 3 | Select the analysis mode | Deterministic rules engine | Strategy present means Strategy Mode; otherwise use Quality Mode and display a persistent warning that strategic alignment is unavailable. |
| 4 | Parse and index the approved documents | Document parser, chunker, embedding model, and vector index | Preserve source ID, exact excerpt boundaries, source type, date, permissions, and version on every chunk. |
| 5 | Retrieve and rerank relevant evidence | Hybrid semantic and keyword retriever plus reranker | Search only the approved corpus; retrieve top 10 candidates and rerank the five most relevant; never use unrestricted web knowledge. |
| 6 | Extract product signals and group related evidence | Structured-output LLM | Separate direct quotes, confirmed facts, interpretations, assumptions, and open questions; preserve conflicts and minority opinions. |
| 7 | Generate candidate opportunities | Structured-output LLM | Each opportunity must describe a user problem rather than merely repeat a proposed feature or executive request. |
| 8 | Score and rank candidates | Rules engine with LLM-generated rationale | In Strategy Mode, use explicit strategy clauses; in Quality Mode, use problem clarity, evidence quality, specificity, and anti-pattern checks. |
| 9 | Detect anti-patterns and risky requests | Rules engine and policy checker | Flag competitor copying, vanity requests, vague problems, arbitrary deadlines, and executive opinion without user evidence. Multiple anti-patterns may produce **Not Recommended**. |
| 10 | Validate grounding and citations | Citation validator and evidence-gate service | Every ranked item needs a valid source excerpt. P0–P1 items in Strategy Mode need direct product evidence and a cited strategy clause. Invalid or weak items become **Insufficient Evidence**. |
| 11 | Generate the draft shortlist and Opportunity Brief | LLM using validated structured data only | The generator may use only evidence that passed validation; assumptions and unresolved conflicts must be labelled. |
| 12 | Present the result for PM review | Juno review interface | Show scores, rationale, citations, conflicts, stale sources, mode, and evidence strength. Nothing is approved automatically. |
| 13 | Apply PM edits and overrides | Review interface and version service | Allow edit, reorder, reject, merge, split, and undo. Every override records the PM, timestamp, original value, new value, and reason. |
| 14 | Finalize the reviewed version | Approval service, exporter, and audit logger | Finalization requires explicit PM approval. Export may create Markdown or PDF only; no roadmap or delivery system is changed. |

## Decision logic

### Strategy Mode

Use when the PM provides a strategy document.

- The strategy document is the source of truth for strategic alignment.
- Product evidence remains the source of truth for user problems.
- Every opportunity receives P0–P3, a strategy pillar, an alignment score, a cited strategy clause, and a plain-language rationale.
- A strategy clause alone is never sufficient proof of customer need.
- A P0–P1 recommendation requires direct product evidence plus explicit strategy support.

### Quality Mode

Use when no strategy document is provided.

Juno scores each request from 0–100:

| Signal | Maximum points |
|---|---:|
| Problem clarity | 25 |
| Evidence quality | 25 |
| Requirement specificity | 25 |
| Anti-pattern check | 25 |

Priority mapping:

- **80–100:** P1 — high-quality request
- **50–79:** P2 — medium-quality request
- **20–49:** P3 — low-quality request
- **0–19:** P3 and potentially **Not Recommended**

Quality Mode must never describe its result as strategic alignment.

## Human-in-the-loop

Human review is mandatory at four points:

1. **Input confirmation:** The PM confirms selected sources, permissions, mode, strategy version, and prioritization criteria before starting.
2. **Exception review:** Juno pauses an item for PM review when evidence is conflicting, stale, restricted, malformed, or below the evidence threshold.
3. **Override review:** The PM may override Juno, but must provide a reason. Overrides remain visible in the audit trail.
4. **Final approval:** Only the PM can approve the final shortlist and Opportunity Brief.

Juno escalates to the PM immediately when:

- A citation is missing, invalid, or does not support the claim.
- Evidence coverage is below 70%.
- A P0–P1 item lacks direct product evidence.
- The active strategy is expired, superseded, or ambiguous.
- Sources materially conflict.
- Sensitive or restricted information is detected.
- The request involves legal, privacy, security, compliance, or financial risk.
- The model, retrieval layer, or structured-output schema fails.

## Permissions

Juno may autonomously:

- Read only the PM-approved sources the requesting user can access.
- Parse, retrieve, cluster, summarize, and draft.
- Recommend P0–P3 priorities.
- Flag weak evidence, anti-patterns, conflicts, and stale inputs.
- Create a draft shortlist and Opportunity Brief.
- Record audit and evaluation data.

Juno may not autonomously:

- Approve or finalize priorities.
- Edit the product roadmap.
- Create or update Jira delivery work.
- Send Slack messages or executive communications.
- Commit resources or promise delivery dates.
- Access unapproved company-wide sources.
- Ignore source permissions.
- Make legal, privacy, security, compliance, or financial decisions.
- Hide evidence gaps or fabricate missing context.

## Monitoring and audit data

Each run records:

- Trace ID and timestamps
- Trigger payload and source versions
- Strategy version and analysis mode
- Retrieved chunks and reranking scores
- Model and prompt version
- Candidate opportunities and original ranking
- Citation-validation results
- Evidence-gate decisions
- PM edits, overrides, rejection reasons, and approval
- Latency, token usage, estimated cost, retries, and errors

## Success & failure

- **Done when:** Every recommended opportunity has validated evidence, Strategy Mode P0–P1 items have direct product evidence plus strategy support, conflicts and assumptions are visible, PM overrides are recorded, and the PM explicitly approves the final version.
- **Fails safe when:** Validation, retrieval, permission checks, citation checks, or model generation fail; the strategy is unusable; evidence is insufficient; or the PM does not approve. Juno preserves the inputs and last approved version, shows the failing stage and reason, creates no plausible partial final ranking, and offers retry or manual review.

## V1 boundaries

V1 is a supervised prioritization copilot, not an autonomous roadmap agent. It ends with a PM-approved, exportable brief. External system changes, background monitoring, multi-agent delegation, and automatic delivery actions remain out of scope.
