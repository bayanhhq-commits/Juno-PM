# Rollout Readiness Checklist

## Product and evidence

- [x] Problem, target user, promise, non-goals, and success metrics are documented.
- [x] M3–M5 course labs are mapped to visible and executable proof.
- [x] Synthetic demo inputs are labelled.
- [x] Current limitations are visible.
- [ ] POC evidence from consenting external PMs is collected.

## Experience

- [x] First action is visible in V1, V2, and V3.
- [x] Draft, processing, success, blocked, cancelled, killed, approved, and rejected states are defined.
- [x] Approval is separate from generation.
- [x] Undo, restore, and kill controls are available.
- [ ] Native PDF/DOCX error and recovery states are added.

## Quality and evaluation

- [x] Six automated checks pass.
- [x] Human evaluation rubric exists.
- [x] Critical UAT scenarios are defined.
- [ ] Five moderated POC sessions meet the usability threshold.
- [ ] Citation precision reaches ≥90% on the POC evaluation set.

## Privacy and security

- [x] API keys are excluded from Git and disk storage.
- [x] Runtime history is ignored by Git.
- [x] OpenAI requests disable provider-side storage in the adapter.
- [x] Ollama local execution is supported.
- [x] External writes are not implemented.
- [ ] Threat model and retention settings are reviewed before team beta.

## Operations

- [x] Windows start script and setup guide are packaged.
- [x] Local run history survives restart.
- [x] Backup branch preserves the pre-submission state.
- [ ] Support owner and response targets are named before beta.
- [ ] Telemetry and incident playbook are approved before GA.

## Go / no-go gates

| Stage | Required gate |
|---|---|
| Final-project release | Repository, showcase, prototypes, mapping, pack, tests, and rollback proof complete |
| Private POC | Data-handling consent, de-identification, all critical UAT cases pass |
| Beta | POC quality threshold, citation precision, operational owner, support plan |
| GA | Reliability SLO, security review, adoption evidence, rollback rehearsal, executive go/no-go |
