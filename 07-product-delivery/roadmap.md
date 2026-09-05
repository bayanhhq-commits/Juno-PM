# Outcome Roadmap and Lifecycle Paths

## Roadmap principle

Juno does not force every opportunity through POC → MVP → beta → launch. The path is selected by the largest unresolved risk.

| Path | Use when | Exit evidence | Typical next step |
|---|---|---|---|
| Explore | Problem or user is unclear | Repeated problem pattern and target segment | POC or stop |
| POC | Technical feasibility is uncertain | Feasibility threshold met with bounded data | MVP or stop |
| Development | Problem and solution are understood | Implementation and quality checks pass | Beta or launch |
| MVP | Value hypothesis is unproven | Target users complete the core job and show intent | Beta, iterate, or stop |
| Beta | Scale, operations, or trust need controlled exposure | Reliability, support, and adoption thresholds met | GA or rollback |
| Launch / GA | Value and operability are proven | Readiness review approved | Monitor and iterate |
| Iterate / retire | Outcome misses or context changes | Post-launch evidence supports next decision | Improve, reposition, or retire |

## Juno roadmap

### Now — Final-project baseline

- Stabilize local file ingestion for supported text formats.
- Generate the complete 13-artifact pack from one approved opportunity.
- Make draft, approve, reject, cancel, kill, and restore observable.
- Pass provider, pipeline, server, and workflow-mapping tests.
- Publish the instructor-facing showcase and lab traceability map.

**Exit:** all critical UAT cases pass, tests pass, and the final-project review can be completed from public links plus the local package.

### Next — Private POC with real PM material

- Add native PDF and DOCX parsing.
- Add paragraph-level citation display and source preview.
- Test with 5–8 consenting PMs using de-identified workspaces.
- Measure preparation time, edit distance, citation correctness, and trust.
- Calibrate confidence and block unsupported conclusions.

**Exit:** ≥90% citation precision on the test set, ≥80/100 human rubric, no critical data-handling defect, and evidence of meaningful time saved.

### Later — Controlled beta

- Add optional read-only connectors for approved systems.
- Add team review comments and approval roles.
- Add artifact templates by product stage and organization.
- Add evaluation datasets and regression dashboards.
- Pilot preview-first write integrations with granular approval.

**Exit:** operational readiness, support playbook, connector permission review, and beta adoption threshold.

### Future — GA and learning loop

- Release governed write integrations only after independent approval testing.
- Add policy packs, audit export, organization-level quality thresholds, and retention controls.
- Recommend iteration or retirement from post-launch evidence.

## Prioritization model

`Priority = Impact × 0.30 + Evidence × 0.25 + Strategy × 0.20 + Urgency × 0.15 − Effort × 0.05 − Risk × 0.05`

The formula supports comparison; it does not override the evidence gate. An item without direct approved evidence is blocked and returned with a validation plan.
