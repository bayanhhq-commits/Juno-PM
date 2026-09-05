# Product School Lab Mapping

This map shows how each referenced Product School lab appears as a repository artifact, a visible product behavior, and—in V3—an executable capability.

| Module / lab | Repository evidence | Product proof |
|---|---|---|
| M3 — Juno RAG Lab | [`03-rag-prd/prd.md`](./03-rag-prd/prd.md), [`agent/agent-core.mjs`](./agent/agent-core.mjs) | Approved corpus, file parsing, chunking, source IDs, evidence coverage, and grounded generation. |
| M3 — AI PRD Builder | [`03-rag-prd/prd.md`](./03-rag-prd/prd.md), [`07-product-delivery/one-page-prd.md`](./07-product-delivery/one-page-prd.md) | One-page and full PRD stages are connected to the approved opportunity and roadmap path. |
| M4 — AI User Flow Architect | [`04-ai-ux/user-flow.md`](./04-ai-ux/user-flow.md) | V2 expresses the path from knowledge to opportunity, roadmap, product pack, launch, and audit. |
| M4 — Juno AI-Native Lab | [`docs/v2/`](./docs/v2/), [`agent/`](./agent/) | The interface is organized around AI states, evidence inspection, draft review, and lifecycle work—not a chatbot wrapper. |
| M4 — AI-UX Trust Gap Checker | [`04-ai-ux/trust-gaps.md`](./04-ai-ux/trust-gaps.md) | Citations, uncertainty, approval, compare, undo, restore, cancel, and kill switch are visible controls. |
| M5 — Agent Workflow Spec Builder | [`05-agentic-workflows/awspec.md`](./05-agentic-workflows/awspec.md) | V3 implements staged ingestion, analysis, prioritization, generation, and decision recording. |
| M5 — Agent Control Panel | [`05-agentic-workflows/agent-control-panel.md`](./05-agentic-workflows/agent-control-panel.md), [`agent/index.html`](./agent/index.html) | Provider selection, run state, stop, kill, approvals, audit, and restore are managed in one control surface. |
| M5 — Juno Langflow Walkthrough | [`05-agentic-workflows/langflow-walkthrough.md`](./05-agentic-workflows/langflow-walkthrough.md), [`05-agentic-workflows/Juno Agent.json`](./05-agentic-workflows/Juno%20Agent.json) | The course flow is preserved as a portable JSON specification and mapped to the executable V3 pipeline. |

## Supporting modules

| Module | Repository evidence | Contribution to Juno |
|---|---|---|
| M1 — Prompting | [`01-prompting/system-prompt.md`](./01-prompting/system-prompt.md) | Defines role, modes, source discipline, failure handling, and the output contract. |
| M2 — Strategy | [`02-strategy/decision-matrix.md`](./02-strategy/decision-matrix.md), [`02-strategy/strategy-one-pager.md`](./02-strategy/strategy-one-pager.md) | Establishes target user, value, differentiation, risks, success measures, and priority logic. |
| M6 — Evaluation | [`06-evals/`](./06-evals/), [`agent/tests/`](./agent/tests/) | Combines human review criteria with automated pipeline, provider, server, and workspace checks. |

## Coverage by final product activity

| Product activity | Where to review it |
|---|---|
| Read all modules and approved context | V2 Knowledge & Usage; V3 ingestion |
| Analyze module usage | V2 Usage table; `sample-module-usage.csv`; V3 prompt context |
| Suggest and prioritize roadmap | V2 Opportunities + Roadmap; `07-product-delivery/roadmap.md` |
| One-pager and full PRD | M3 PRD; `07-product-delivery/one-page-prd.md` |
| Prototype definition | V1, V2, and V3; `07-product-delivery/prototype-brief.md` |
| Epic and stories | `07-product-delivery/epics-and-stories.md` |
| UAT | `07-product-delivery/uat-plan.md` |
| Release notes and GTM | `07-product-delivery/launch-pack.md` |
| Rollout checklist | `07-product-delivery/rollout-checklist.md` |
| User manual | `07-product-delivery/user-manual.md` |
| Post-launch learning | `07-product-delivery/post-launch-review.md` |

## Traceability rule

Every generated artifact should carry four links: `run_id`, `opportunity_id`, `source_ids`, and `roadmap_version`. The prototype demonstrates this relationship; V3 preserves `run_id` and source context in each run folder. Deeper per-paragraph citation rendering is the next traceability milestone.
