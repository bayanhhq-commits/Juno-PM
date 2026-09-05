# Epics, User Stories, and Acceptance Criteria

## Epic 1 — Governed knowledge ingestion

**Outcome:** The PM can build an approved, traceable corpus.

### Story 1.1 — Import product context

As a PM, I want to add modules, PRDs, feedback, strategy, and usage files so Juno can analyze the same context I use.

**Acceptance criteria**

- Supported formats are TXT, MD, CSV, JSON, and HTML.
- Each input receives a source ID, filename, type, and ingestion timestamp.
- Unsupported and oversized files fail with a clear recovery action.
- No input is sent to a provider until the PM starts a run.

### Story 1.2 — Inspect source readiness

As a PM, I want to see missing, stale, duplicate, or low-quality evidence before generation.

**Acceptance criteria**

- Readiness is visible before prioritization.
- Weak evidence cannot be silently treated as research.
- Juno names the missing validation needed to unblock an item.

## Epic 2 — Evidence-backed prioritization

**Outcome:** The PM receives a defensible decision, not a popularity list.

### Story 2.1 — Extract and score opportunities

As a PM, I want opportunities ranked against transparent factors so I can review the tradeoffs.

**Acceptance criteria**

- Output includes opportunity, score, recommended priority, reasons, and source IDs.
- User evidence and executive opinion remain distinguishable.
- Items without direct evidence are blocked regardless of weighted score.

### Story 2.2 — Recommend a lifecycle path

As a PM, I want Juno to recommend Explore, POC, Development, MVP, Beta, Launch, or Iterate so the roadmap matches uncertainty.

**Acceptance criteria**

- Recommendation includes the unresolved risk and an exit criterion.
- The PM can override the path and the override is logged.

## Epic 3 — Connected product-pack generation

**Outcome:** The approved decision flows into consistent downstream artifacts.

### Story 3.1 — Generate 13 artifacts

As a PM, I want one approved opportunity turned into a product pack so downstream planning stays aligned.

**Acceptance criteria**

- All 13 named outputs are created in one run folder.
- Every output shares the opportunity, target outcome, source context, and lifecycle path.
- Missing information is labelled as an assumption or open question.

### Story 3.2 — Revise without losing lineage

As a PM, I want to rerun or restore safely so I can improve the work without deleting the previous state.

**Acceptance criteria**

- Each run has a unique ID and immutable source snapshot.
- Restore creates a new event referencing the source run.
- A previous approved run remains inspectable.

## Epic 4 — Human control and audit

**Outcome:** Consequential changes remain accountable and reversible.

### Story 4.1 — Approve or reject a draft

As the accountable PM, I want generation and approval to be separate so the system cannot decide on my behalf.

**Acceptance criteria**

- Default output state is Draft.
- Approval or rejection records time, actor label, run ID, and note.
- Export stays blocked until approval.

### Story 4.2 — Stop unsafe work

As a PM, I want cancel and kill controls so I can stop current or queued work immediately.

**Acceptance criteria**

- Cancel stops the current run and preserves earlier runs.
- Kill blocks new runs and approvals until explicitly cleared.
- The audit trail records the control action.
