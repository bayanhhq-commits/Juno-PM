# Human Evaluation Rubric — Juno

## Review task

A grader receives the approved source manifest, Juno’s opportunity and roadmap recommendation, the generated product pack, and the audit/decision record. The grader must not infer missing evidence from outside the supplied workspace.

Score each dimension from 1–5. Multiply by the listed weight to calculate a 100-point total.

| Dimension | Weight | 1 — Fail | 3 — Acceptable | 5 — Excellent |
|---|---:|---|---|---|
| Factual grounding | 15 | Material claims are unsupported or sources are wrong | Main claims have usable sources; minor gaps exist | Every material claim is traceable and accurately scoped |
| Problem clarity | 10 | Solution-first, vague, or wrong user | User and problem are understandable | Job, segment, evidence, and boundary are precise |
| Prioritization logic | 10 | Rank is unexplained or contradicts evidence | Factors and tradeoffs are mostly clear | Decision is transparent, reproducible, and flags weak evidence |
| Lifecycle-path fit | 10 | Path ignores the largest risk | Path is plausible | Path, risk, exit evidence, and next decision are tightly aligned |
| Strategic coherence | 10 | Conflicts with supplied strategy | Mostly aligned | Explicitly connects outcomes, constraints, and tradeoffs |
| Artifact consistency | 10 | PRD, stories, UAT, or launch materials contradict | Core artifacts agree | All artifacts share scope, metrics, sources, and lifecycle decision |
| Actionability | 10 | Generic prose with no next action | Team can begin with clarification | Owners, acceptance criteria, tests, and decisions are execution-ready |
| Uncertainty honesty | 10 | Assumptions are presented as facts | Important gaps are labelled | Confidence, assumptions, missing evidence, and validation are specific |
| Human control | 10 | Approval state or external effects are unclear | Draft and approval are visible | Boundaries, permissions, decision record, and export state are unmistakable |
| Recovery and auditability | 5 | History can be lost or overwritten | Earlier versions remain available | Restore lineage and control events are clear and complete |

## Scoring

For each row: `(score ÷ 5) × weight`. Sum all rows.

- **90–100:** excellent; beta/launch candidate if operational gates also pass.
- **80–89:** pass; small revisions allowed.
- **70–79:** conditional; rerun or edit before approval.
- **Below 70:** fail.

Any score of 1 in factual grounding, uncertainty honesty, human control, or recovery is an automatic fail regardless of total.

## Calibration

1. Two graders independently score three worked examples: strong, borderline, and fail.
2. Discuss disagreements larger than one point and update the evidence examples, not the score after the fact.
3. Double-grade at least 20% of POC and beta samples.
4. Target weighted Cohen’s κ ≥0.60; pause high-stakes evaluation if agreement is lower.
5. Keep grader notes attached to the workspace and rubric version.

## Required grader note

Every review ends with:

- strongest evidence-backed part;
- most important unsupported or unclear claim;
- artifact with the largest edit burden;
- approve, revise, reject, or collect more evidence;
- one concrete next action.
