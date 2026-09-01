# Agent Control Panel · Juno

> Module 5 · Agentic Workflows. The operator control surface for Juno's evidence-backed Automated Prioritization workflow.

**Operator:** RocketShip Product Manager  
**Workflow:** Evidence-backed prioritization  
**Current environment:** V1 supervised pilot  
**Final decision owner:** Product Manager

## Autonomy level

Juno operates at the **Supervised** level.

After a PM explicitly starts a run, Juno may validate approved inputs, retrieve evidence, group signals, recommend P0–P3 priorities, validate citations, and prepare a draft Opportunity Brief. It must stop for human review when evidence is weak, conflicting, stale, restricted, or high risk.

Juno cannot approve priorities, publish a final shortlist, update the roadmap, create delivery work, send messages, or commit resources. Every final output requires explicit PM approval.

We are not using bounded-autonomous or autonomous operation because prioritization contains strategic trade-offs and organizational context for which a Product Manager remains accountable.

## Operator status panel

The control panel must always show:

| Signal | Values shown |
|---|---|
| Agent state | Idle, validating, retrieving, analysing, waiting for review, approved, cancelled, failed safely |
| Autonomy | Supervised |
| Current mode | Strategy Mode or Quality Mode |
| Active strategy | Document name, version, planning period, and last updated date |
| Run identity | Workspace, trace ID, requesting PM, start time, and input version |
| Evidence | Source count, retrieved chunks, evidence coverage, conflicts, and stale sources |
| Approval | Draft, needs PM review, approved, rejected, or restored |
| Usage | Model calls, tokens, elapsed time, estimated cost, retries, and remaining limits |
| External actions | None in V1 |

## Controls

### Kill switch

The global **Stop Juno** control:

1. Stops all active and queued model and retrieval calls.
2. Prevents partial output from becoming approved or exportable.
3. Preserves the immutable input snapshot and audit log.
4. Marks the run **Cancelled by operator**.
5. Returns the workspace to the last approved version.
6. Requires a PM to review and explicitly restart; it never resumes automatically.

The kill switch is available during validation, retrieval, analysis, draft generation, and human review.

### Pause, cancel, and retry

- **Pause:** Stops before the next workflow step and preserves the current draft state.
- **Cancel run:** Ends the run, discards unapproved output, and returns to the last approved version.
- **Retry failed step:** Retries only the failed step using the same immutable inputs and records the attempt.
- **Restart from inputs:** Creates a new trace ID and new run; it does not overwrite the previous run.

### Reversible editing

The PM can:

- Undo the latest unapproved edit.
- Discard the entire current draft.
- Compare the AI proposal, PM-edited draft, approved version, and any restored version.
- Restore a previous approved version.
- Reject an item or override a recommendation with a recorded reason.

Restoring a version never deletes history. It creates a new immutable restoration event pointing to the selected approved version.

### Rate and cost caps

Initial pilot ceilings:

| Limit | V1 ceiling | When reached |
|---|---:|---|
| Evidence sources per run | 25 | Pause and ask the PM to narrow or split the batch |
| Retrieved candidates | Top 10 | Rerank and use only the five most relevant chunks |
| Model calls per run | 4 | Stop before another call and escalate |
| Automatic retries | 1 per failed step | Escalate after the retry fails |
| Input context per model call | 30,000 tokens | Reduce retrieved context without dropping required citations, or escalate |
| Output per model call | 2,500 tokens | Stop generation and request a narrower scope |
| Estimated cost per run | USD 0.50 | Pause before exceeding the cap and request PM approval |
| Runs per workspace per day | 50 | Block additional runs until the next daily window or operator override |
| End-to-end processing time | 60 seconds | Mark the run stuck and hand control to the PM |

These are conservative pilot defaults. M6 evaluation results may lower or raise them. Juno never silently changes models, drops citations, reduces safety checks, or exceeds a cap to finish a run.

### Escalate-on-stuck

Juno stops and returns control to the PM when:

- A permission or source-validation check fails.
- Evidence coverage is below 70%.
- A citation is missing, invalid, or does not support its claim.
- A P0–P1 recommendation lacks direct product evidence.
- The strategy is expired, superseded, ambiguous, or missing during a claimed Strategy Mode run.
- Sources materially conflict.
- Sensitive or restricted information is detected.
- A request involves legal, privacy, security, compliance, or financial risk.
- Structured output fails after one retry.
- Processing exceeds 60 seconds.
- Any rate, token, or cost ceiling would be exceeded.
- The operator activates pause, cancel, restore, or the kill switch.

Escalation preserves all inputs and explains the failing stage, reason, affected items, and available recovery actions.

## Approval gates

| Gate | Required condition | Failure behavior |
|---|---|---|
| Input gate | Approved source, complete metadata, and valid permission | Exclude the source or pause the run |
| Mode gate | Strategy version valid, or Quality Mode warning displayed | Block false strategic-alignment claims |
| Evidence gate | 100% citation coverage and evidence coverage at least 70% | Label **Insufficient Evidence** and exclude from recommended order |
| P0–P1 gate | Direct product evidence; plus strategy support in Strategy Mode | Downgrade, exclude, or send to PM review |
| Risk gate | No unresolved privacy, security, legal, compliance, or financial issue | Escalate to the responsible expert |
| Final gate | Explicit PM approval | Keep the result as an editable draft |

## Monitoring

### Operational dashboard

The operator monitors:

- Active, queued, paused, cancelled, and failed runs
- Processing stage and time spent per step
- Model-call count, retries, token usage, and cost
- Retrieval latency and top-chunk relevance
- Permission failures and excluded sources
- Error type, failing component, and recovery status

### Quality and trust dashboard

The operator monitors:

- Citation coverage
- Invalid or mismatched citation rate
- Unsupported P0–P1 count
- Evidence coverage and retrieval relevance
- **Insufficient Evidence** and **Not Recommended** rates
- Conflict and stale-source detection
- Strategy Mode versus Quality Mode usage
- PM override, rejection, and undo rates
- Shortlists approved with minor edits
- Change between the AI draft and PM-approved order

### Alert thresholds

| Signal | Threshold | Response |
|---|---:|---|
| Citation coverage | Below 100% | Block finalization |
| Unsupported P0–P1 | Above 0 | Block finalization and review the evidence gate |
| Restricted-source retrieval | Above 0 | Activate kill switch and begin access review |
| Plausible partial result after failure | Above 0 | Block release and investigate |
| PM approval | Missing | Keep output as draft |
| Evidence coverage | Below 70% | Escalate for more evidence |
| Approval with minor edits | Below 80% during pilot | Review prompt, retrieval, and scoring quality |
| PM override rate | Above 30% | Review criteria and model behavior |
| P95 processing time | Above 60 seconds | Investigate latency and reduce batch size |
| Cost per run | Above USD 0.50 | Pause and investigate before continuing |

## Permissions

| Action | Juno may do automatically after PM trigger | PM approval required | Prohibited in V1 |
|---|:---:|:---:|:---:|
| Read selected approved sources | Yes |  |  |
| Validate metadata and permissions | Yes |  |  |
| Retrieve, cluster, and summarize evidence | Yes |  |  |
| Recommend P0–P3 priorities | Yes, as draft |  |  |
| Flag conflicts, anti-patterns, and weak evidence | Yes |  |  |
| Generate an Opportunity Brief | Yes, as draft |  |  |
| Edit or override the ranking |  | Yes |  |
| Approve the final shortlist |  | Yes |  |
| Restore a previous approved version |  | Yes |  |
| Export approved Markdown or PDF |  | Yes |  |
| Access unapproved or unauthorized sources |  |  | Yes |
| Update the roadmap or Jira |  |  | Yes |
| Send Slack, Notion, email, or executive communications |  |  | Yes |
| Commit resources or delivery dates |  |  | Yes |
| Delete prior versions or audit history |  |  | Yes |
| Make legal, privacy, security, compliance, or financial decisions |  |  | Yes |

## Change management

Juno may move beyond Supervised autonomy only when M6 evaluation demonstrates:

- 100% citation coverage across the golden set
- 0 unsupported P0–P1 recommendations
- 0 permission leaks
- 0 plausible partial final rankings after failure
- At least 80% of outputs approved with only minor edits
- Stable costs and latency within the control-panel caps

Any autonomy increase requires documented PM, engineering, security, and governance approval. A release may always be rolled back to the prior approved workflow and agent configuration.

## Recovery and rollback

Repository recovery:

- The pre-rewrite agent configuration is preserved on `backup/pre-juno-agent-rewrite-2026-09-01`.
- Git history retains every M5 file revision.
- Reverting a commit or restoring the file from the backup branch recovers the earlier configuration.

Runtime recovery:

- Cancel the run.
- Undo the latest draft edit.
- Discard the current draft.
- Compare versions.
- Restore any approved version.
- Activate the kill switch.
- Resume only after explicit PM review.

The system never deletes evidence, audit history, or approved versions during rollback.
