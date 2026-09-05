# Eval Stack — Juno

## What “good” means

Juno helps a PM reach a defensible product decision faster while keeping every important claim grounded, every consequential action human-approved, and every run recoverable.

Protected metrics:

- ≥90% usable citation coverage and citation precision on the golden set.
- ≥80/100 human quality score, with no safety/control dimension below 3/5.
- 100% approval gating for export or external action.
- 0 silent external writes and 0 secrets committed or persisted.
- 100% pass rate on critical UAT scenarios.

## Layered stack

| Layer | Evaluator | What it catches | Threshold / gate |
|---|---|---|---|
| Schema | JSON/output validators | Missing opportunities, roadmap path, artifacts, run IDs, or decision state | 100% required fields |
| Deterministic policy | Code checks | Ungrounded recommendation, export before approval, overwritten run, unsupported type | 100% critical policies |
| Integration | Node test runner with mocked providers and server | Provider contract, multi-batch ingestion, health/UI failure, V3→V2 mapping | All tests pass |
| Retrieval | Citation matcher | Missing source ID, wrong source, unsupported statement, stale snapshot | ≥90% precision and coverage |
| LLM-as-judge | Calibrated judge prompt | Internal contradiction, lifecycle mismatch, vague acceptance criteria, missing uncertainty | Mean ≥4/5; no critical contradiction |
| Human | PM rubric | Usefulness, strategic coherence, trust, decision quality, realistic edit burden | ≥80/100; no dimension <3/5 |
| UAT | Scenario owner | End-to-end workflow and recovery failures | 100% critical scenarios |

## Golden set

Initial set: 30 de-identified or synthetic workspaces.

- 8 strong-evidence reliability or usability problems.
- 6 vague requests with missing problem definition.
- 5 executive-opinion-only requests.
- 4 technically uncertain opportunities requiring a POC.
- 4 value-uncertain opportunities requiring an MVP.
- 3 launch or post-launch cases requiring operational decisions.

Every workspace contains an approved source manifest, expected evidence gate, acceptable priority range, expected lifecycle path, known unsupported claims, and reviewer notes. Changes to system prompts, scoring, ingestion, provider adapters, or artifact templates trigger regression evaluation.

## Evaluation cadence

- Pull request / local change: schema, policy, integration tests.
- Weekly during POC: golden-set regression and citation review.
- Before beta: two independent human graders on the full golden set.
- Before GA: critical UAT, safety review, rollback rehearsal, and support readiness.

## Release gate

A release is blocked when any critical test fails, any recommendation bypasses the evidence gate, any external action can occur without approval, any secret is persisted, citation precision is below 90%, or the human score is below 80/100.

## Current automated proof

Run from `agent/`:

```bash
npm test
npm run build
```

The current six tests cover core generation, oversized multi-batch reading, mocked OpenAI and Ollama adapters, server health/static UI delivery, and mapping agent output into the Product OS workspace.
