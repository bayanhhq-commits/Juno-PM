# Juno Langflow Walkthrough

> Module 5 · Agentic Workflows. A safe, repo-ready walkthrough for translating and testing Juno's supervised prioritization workflow in Langflow.

**Execution mode:** offline design validation and deterministic dry run  
**Live Langflow import:** not performed  
**Model/API calls:** none  
**Credentials or paid services:** none  
**External writes:** none  
**Result:** PASS for reference-workflow structure; live runtime verification remains required

## What this walkthrough proves

This walkthrough tests whether the Juno workflow is coherent, evidence-grounded, approval-gated, and reversible before anyone connects an LLM, vector store, or production data source.

It does not claim that `Juno Agent.json` is directly importable into stock Langflow. The file is a builder-neutral reference schema containing several custom node types. Those nodes must be mapped to supported Langflow components or implemented as controlled custom components before a live run.

The source of truth is:

- [Juno Agent.json](./Juno%20Agent.json) for nodes, edges, autonomy, and recovery controls.
- [Agent Workflow Spec](./awspec.md) for responsibilities, boundaries, escalation, and evaluation.
- [Agent Control Panel](./agent-control-panel.md) for supervision and operator controls.
- [M2 strategy](../02-strategy/strategy-one-pager.md) for the product and autonomy direction.
- [M3 PRD](../03-rag-prd/prd.md) for retrieval, grounding, and acceptance requirements.
- [M4 user flow](../04-ai-ux/user-flow.md) and [trust gaps](../04-ai-ux/trust-gaps.md) for the review experience and trust guardrails.

## Safety decision

The first walkthrough uses no Langflow account and no API key. This avoids credential exposure, paid inference, accidental uploads, and unreviewed external side effects.

The test corpus below is synthetic and exists only to exercise the workflow. It is not customer research and must never be presented as real RocketShip evidence.

## Run it now

Requirements: Python 3.10 or newer. The harness uses only the standard library; no account, API key, package install, or network access is needed.

From the repository root:

```bash
cd 05-agentic-workflows
python3 -m unittest -v test_juno_dry_run.py
python3 run_juno_dry_run.py --spec "Juno Agent.json" --fixture fixtures/juno-dry-run.json
```

The first command runs six policy and reversibility tests. The second prints a synthetic Quality Mode shortlist. The safe default is `pending_pm_approval`, so export remains blocked.

To exercise the explicit approval branch locally:

```bash
python3 run_juno_dry_run.py --approve
```

`--approve` changes only the in-memory dry-run result; it does not contact or modify any external system. Use `--json` for machine-readable output or `--out result.md` to save a local report.

To test your own synthetic data, copy `fixtures/juno-dry-run.json`, retain the same schema, and point `--fixture` to the copy. Do not use confidential or production data in this harness.

## Reference flow

1. The PM creates a prioritization workspace and selects approved sources.
2. Juno records an immutable input snapshot and trace ID.
3. Permission checks exclude unapproved, revoked, or inaccessible content.
4. The mode selector chooses Strategy Mode when a valid strategy is present; otherwise it chooses Quality Mode and shows a warning.
5. Retrieval searches only the approved corpus.
6. The model extracts opportunities, evidence, conflicts, assumptions, open questions, and anti-patterns.
7. The priority engine produces a transparent P0–P3 recommendation.
8. The evidence gate blocks unsupported or mismatched claims.
9. Juno creates a draft shortlist and Opportunity Brief.
10. The PM inspects citations, edits, reorders, rejects, or overrides with a reason.
11. Explicit PM approval is required.
12. The approved version is appended to immutable history.
13. Only the approved Markdown or PDF may be exported.
14. Audit logging records the run, decisions, overrides, costs, failures, and restoration events.

At any failure gate, the affected item or run moves to **Needs PM review**. No partial output becomes final.

## Langflow component map

| Reference node type | Langflow implementation | Required control |
|---|---|---|
| `StructuredInput` | Chat/Text Input plus structured parser | Reject missing required fields |
| `Snapshot` | Custom component writing an immutable run record | Never overwrite the input snapshot |
| `PolicyCheck` | Custom Python component or approved policy service | Fail closed on permission uncertainty |
| `Conditional` | Conditional Router | Keep Strategy and Quality modes explicit |
| `Retriever` | Document loader, embeddings, vector store, retriever, and reranker | Filter by approved source IDs and permissions |
| `OpenAI` | Chat model with structured output | Temperature 0.1; no unsupported claims |
| `ScoringEngine` | Custom deterministic scoring component | Expose inputs and score components |
| `CitationValidator` | Custom validator | Block unsupported recommendations |
| `Prompt` | Prompt Template plus structured formatter | Draft status only |
| `HumanReview` | External review UI or interrupt/resume service | Preserve state while paused |
| `ApprovalGate` | Human approval callback plus conditional router | No automatic approval |
| `VersionStore` | Append-only database or object store | Never delete an approved version |
| `RollbackControl` | Version service plus operator controls | Restore by adding a new event |
| `Exporter` | File output component | Markdown/PDF only after approval |
| `Logger` | Append-only tracing and evaluation sink | Redact unnecessary sensitive content |

Custom components must return typed, validated objects. A model response must not be allowed to choose its own permissions, bypass approval, edit history, or call an external system.

## Dry-run fixtures

### Fixture A — Strategy Mode

Use the repository's M2 strategy as `S-001`. Add these synthetic product-evidence records:

| ID | Type | Synthetic excerpt | Purpose |
|---|---|---|---|
| E-101 | PM interview | “I spend about four hours each week reconciling interviews, tickets, and email, then I still have to find every source again.” | Direct evidence for traceable prioritization |
| E-102 | Product-leader feedback | “I could not defend the order because the source trail was missing.” | Confirms the trust problem |
| E-103 | Executive email | “Copy the competitor's AI roadmap this quarter.” | Tests executive-opinion and competitor-copying anti-patterns |

Expected result:

| Candidate | Expected status | Why |
|---|---|---|
| Evidence-backed opportunity shortlist with viewable citations | P1 draft | E-101 and E-102 provide direct evidence; S-001 explicitly supports evidence-backed prioritization and source traceability |
| Copy the competitor's AI roadmap | P3 / Not Recommended | E-103 contains no user evidence and triggers two named anti-patterns |
| Any uncited recommendation | Insufficient Evidence | The evidence gate must exclude it from the recommended order |

The word “draft” is mandatory. The PM remains the final decision owner.

### Fixture B — Quality Mode

Run without a strategy document. The UI must display: **Quality Mode — this ranking reflects request quality, not strategic alignment.**

| ID | Type | Synthetic excerpt |
|---|---|---|
| E-201 | Support ticket | “CSV export freezes and crashes. I use screenshots as a workaround.” |
| E-202 | PM interview | “The same export failure costs me around two hours each week.” |
| E-203 | Executive email | “Ship dark mode next week.” |
| E-204 | Request | “Make the AI smarter.” |

Expected deterministic scoring:

| Candidate | Clarity | Evidence | Specificity | Anti-pattern check | Total | Expected result |
|---|---:|---:|---:|---:|---:|---|
| Fix CSV export failure | 25 | 25 | 20 | 25 | 95 | P1 draft in Quality Mode |
| Ship dark mode next week | 5 | 0 | 5 | 0 | 10 | P3 / Not Recommended |
| Make the AI smarter | 5 | 0 | 0 | 0 | 5 | Insufficient Evidence / research needed |

The CSV result is not proof of strategic priority because no strategy was loaded. It is only a high-quality, evidence-backed request.

## Expected trace

For each fixture, capture these fields:

| Stage | Required trace evidence |
|---|---|
| Input | Workspace ID, decision, planning period, approved source IDs, criteria, and requesting user |
| Snapshot | Trace ID, input hash, source versions, strategy version, and start time |
| Permission check | Included and excluded source IDs with reasons |
| Mode selection | Strategy Mode or Quality Mode plus warning state |
| Retrieval | Retrieved chunk IDs, scores, and reranked order |
| Extraction | Candidate opportunities, citations, conflicts, assumptions, and anti-patterns |
| Scoring | Every component score and mapping to P0–P3 |
| Evidence gate | Pass/fail per item and exact failure reason |
| PM review | Edits, reorders, rejects, overrides, and override reasons |
| Approval | Approver, timestamp, and explicit decision |
| Versioning | AI draft, PM-approved version, and restoration ancestry |
| Export | Approved version ID and allowed file type |
| Audit | Latency, tokens, cost, errors, and restoration events |

## Static validation performed

The committed reference JSON was parsed and checked without running external services.

| Check | Result |
|---|---|
| Valid JSON | PASS |
| Node count | 16 |
| Edge count | 24 |
| Unique node IDs | PASS |
| Every edge references an existing node | PASS |
| Draft has a path to approved export | PASS |
| Approval gate is unavoidable before export | PASS |
| Required reversal controls are present | PASS |
| V1 declares no external side effects | PASS |
| Exporter has no external actions | PASS |
| Export requires approval | PASS |
| Version store is append-only | PASS |
| Audit log is append-only | PASS |

## Reversibility tests

The static checks confirm that every control is specified and connected. These runtime tests must be executed after the Langflow mapping is built.

| Test | Action | Expected behavior | Data retained |
|---|---|---|---|
| Cancel run | Cancel during retrieval | Stop new model/tool calls; mark run Cancelled | Snapshot, trace, and error state |
| Undo edit | Change a draft title, then undo | Restore the prior draft state | Both edit events |
| Discard draft | Discard an unapproved shortlist | Return to the last approved version | Discard event and draft history |
| Compare versions | Compare AI draft and PM edit | Show a readable diff | Both immutable versions |
| Restore approved version | Restore an older approved version | Create a new restoration event pointing to it | Full prior history |
| Kill switch | Stop all active and queued work | No partial result becomes final or exportable | Stop reason and affected trace IDs |
| Approval denial | Reject at the approval gate | Return to PM review | Review state and denial reason |
| Export attempt before approval | Request Markdown/PDF early | Block the export | Attempt and policy result |
| External-write attempt | Target Jira, Slack, Notion, email, or roadmap | Block the action | Attempt and policy result |
| Permission revocation | Revoke access before retrieval | Exclude the source and fail closed if required | Source ID and exclusion reason |

A restore is additive: it creates a new restoration event. It never rewrites or deletes the old approved version.

## Live Langflow build checklist

Before a live import or execution:

- Map every reference/custom node to a supported Langflow component.
- Add JSON schemas between every component boundary.
- Configure an approved LLM provider and set hard token, cost, latency, and retry caps.
- Connect only to a permission-aware, RocketShip-approved corpus.
- Use a separate synthetic test collection before any real data.
- Implement the evidence gate outside the model prompt.
- Implement human pause/resume and explicit approval outside the model.
- Add append-only versioning and audit storage.
- Keep all Jira, Slack, Notion, email, roadmap, and delivery actions disconnected in V1.
- Run the full reversibility table above.
- Run M6 evaluations before increasing autonomy or adding integrations.

## Recovery

Repository recovery is non-destructive:

- The pre-rewrite agent file is preserved on `backup/pre-juno-agent-rewrite-2026-09-01`.
- Any new commit can be reversed with a new revert commit, preserving history.
- Do not delete the backup branch until the certification submission is accepted and the live mapping has passed evaluation.

Runtime recovery is also non-destructive:

- Cancel the active run.
- Undo the last unapproved change.
- Discard the draft.
- Compare versions.
- Restore a prior approved version through a new restoration event.
- Use the kill switch for all active and queued work.

## Honest completion status

The builder-neutral workflow is internally consistent and ready to map into Langflow. The dry run and structural checks pass.

A live Langflow import, model response, retrieval-quality result, permission check, latency measurement, cost measurement, and runtime rollback have not yet been executed. Those remain release blockers, not implied successes.
