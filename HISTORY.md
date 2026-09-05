# Juno Evolution and Decision History

Juno evolved through deliberate product questions rather than feature accumulation. Each version tested a larger claim while preserving the controls proved by the previous stage.

## Timeline

| Stage | Product question | What was added | Decision / learning |
|---|---|---|---|
| M1 — Prompting | What contract should guide the assistant? | Role, evidence rules, modes, output schema, safety boundaries | The agent must separate evidence from opinion and never hide uncertainty. |
| M2 — Strategy | Which user and problem are worth solving? | Decision matrix and strategy one-pager | Build for PM decision quality, not generic document generation. |
| M3 — RAG + PRD | Can recommendations stay grounded? | Approved-source retrieval model, citations, evidence gates, PRD | Retrieval quality and source provenance must be product features, not backend details. |
| M4 — AI UX | Can a PM understand and control the AI? | User flow, trust-gap analysis, approval, undo, restore, kill switch | Trust comes from inspectability and recovery, not confident wording. |
| M5 — Workflow spec | Can the behavior be orchestrated predictably? | Agent workflow spec, control panel, Langflow mapping, agent JSON | Separate the work plane from the control plane; block export until approval. |
| V1 — Control prototype | Do the safety controls make sense in use? | Browser-local shortlist, audit events, compare, undo, restore | Proved the control loop without accounts, APIs, or external writes. |
| V2 — Product OS | Can Juno support the whole product lifecycle? | Knowledge, usage, prioritization, roadmap paths, product pack, launch center | A strong agent chooses the right process per opportunity instead of one fixed roadmap. |
| V3 — Working agent | Can Juno actually read inputs and produce the work? | Node server, ingestion, Ollama/OpenAI adapters, 13 artifacts, append-only runs, tests | The prototype became an executable agent while retaining draft-first behavior. |
| Final submission | Can an instructor verify the whole story quickly? | Live showcase, explicit lab mapping, delivery pack, demo script, downloads | Evidence is now reviewable as one coherent system and as individual course artifacts. |

## Evolution of autonomy

| Capability | V1 | V2 | V3 |
|---|---:|---:|---:|
| Read local evidence | Pasted text | Text + local TXT/MD/CSV/JSON | Server-side TXT/MD/CSV/JSON/HTML |
| Analyze module usage | No | Browser-local sample/import | Agent input and generation context |
| Prioritize opportunities | Deterministic rules | Weighted interactive model | LLM workflow with structured output |
| Choose lifecycle path | No | Interactive path selection | Agent recommendation |
| Generate complete product pack | No | UI simulation | 13 written artifacts |
| Call an AI model | No | No | Ollama or OpenAI |
| Persist run history | Browser session | Browser local storage | Append-only folders on disk |
| External publishing | Blocked | Blocked | Blocked by design |

## Major product decisions

### 1. Draft first

All AI output is a draft. Approval and export are separate events. This prevents a persuasive response from being mistaken for a decision.

### 2. Evidence before scoring

An item without direct approved evidence is blocked even when a scoring formula would otherwise rank it highly. Citations are part of the output contract.

### 3. Multiple roadmap paths

Juno recommends different work based on uncertainty and risk:

- **Explore** for unclear problems.
- **POC** for technical feasibility questions.
- **Development** for understood execution work.
- **MVP** for validating a value hypothesis with the smallest usable release.
- **Beta** for controlled exposure and operational learning.
- **Launch / GA** for proven, supportable capability.
- **Iterate / retire** based on post-launch outcomes.

### 4. Local-first execution

V3 runs on the PM's machine. Ollama supports fully local inference; OpenAI is optional. Keys are not written to disk, and runtime history is excluded from Git.

### 5. No hidden integrations

Juno creates artifacts but does not send messages, publish releases, or edit Jira/Linear/GitHub. A later integration must remain preview-first and approval-gated.

## Reversibility and rollback

The repository state immediately before the final submission is preserved on:

[`backup/pre-final-submission-2026-09-05`](https://github.com/bayanhhq-commits/Juno-PM/tree/backup/pre-final-submission-2026-09-05)

The final submission is applied as one commit on `main`. To undo the submission while preserving history:

```bash
git log --oneline --max-count=5
git revert <final-submission-commit-sha>
```

To inspect the earlier repository without changing `main`, open the backup branch. To restore an earlier agent run, use Juno's Restore action; it creates a new restoration event instead of deleting history.

No secrets or runtime data are part of this evolution record.
