# User Acceptance Test Plan

## Objective

Verify that Juno produces useful, grounded PM outputs while keeping human control, data boundaries, and recovery intact.

## Entry criteria

- Automated tests pass.
- Sample corpus contains approved evidence, one opinion-only request, one vague request, and module-usage data.
- No production credentials or confidential data are used.
- Ollama or the mocked provider path is available.

## Critical scenarios

| ID | Scenario | Expected result | Severity |
|---|---|---|---|
| UAT-01 | Import valid MD, CSV, JSON, and saved HTML | Files are accepted, identified, and included in the source snapshot | Critical |
| UAT-02 | Import an unsupported file | Run is blocked with a clear supported-format message | High |
| UAT-03 | Prioritize a well-evidenced reliability problem | Recommendation includes score, reasons, source IDs, and a suitable path | Critical |
| UAT-04 | Prioritize an executive request without user evidence | Item is blocked or marked insufficient evidence | Critical |
| UAT-05 | Generate the product pack | 13 named artifacts are present and internally consistent | Critical |
| UAT-06 | Attempt export before approval | Export is blocked and the approval requirement is visible | Critical |
| UAT-07 | Approve a run | Separate decision record is added; approved state is visible | Critical |
| UAT-08 | Reject a run with a note | Rejection is recorded and no external change occurs | High |
| UAT-09 | Cancel an active run | Current processing stops; prior history remains | Critical |
| UAT-10 | Activate kill switch | Active/queued work stops and new runs are blocked | Critical |
| UAT-11 | Restore an earlier run | A new restoration record references the earlier run; nothing is overwritten | Critical |
| UAT-12 | Restart the local app | Existing run folders remain available | High |
| UAT-13 | Use OpenAI provider | Key is not written to disk and request storage is disabled | Critical |
| UAT-14 | Use Ollama provider | Request is sent only to the configured local Ollama endpoint | High |

## Quality review

Score each approved output from 1–5 on:

1. Problem clarity.
2. Source grounding.
3. Strategic coherence.
4. Prioritization transparency.
5. Lifecycle-path fit.
6. Internal consistency across artifacts.
7. Actionability.
8. Uncertainty disclosure.
9. Human control.
10. Recovery and auditability.

Pass threshold: no score below 3 and total ≥40/50 for a beta candidate.

## Exit criteria

- 100% of critical scenarios pass.
- No secret, confidential sample, or runtime history is present in Git.
- No unsupported claim is presented as verified fact.
- PM reviewer signs off on the generated pack or records a documented exception.
