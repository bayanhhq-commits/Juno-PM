# One-Page PRD — Juno Product Manager Agent

**Status:** Final-project baseline  
**Owner:** Bayan  
**Decision:** Validate a local-first, human-controlled agent that completes PM workflow preparation from evidence to launch.

## Problem

PMs spend substantial time finding context, reconciling inconsistent inputs, explaining prioritization, and recreating the same decision across roadmaps, PRDs, stories, test plans, and launch materials. Generic AI speeds up writing but may lose provenance, overstate weak evidence, and create outputs that look finished before a human has made a decision.

## User and job

For a Product Manager preparing an investment or delivery decision, Juno should turn approved context into an inspectable, connected product pack so the PM can decide faster without losing evidence, control, or accountability.

## Product promise

Juno reads the product context once, recommends a lifecycle path, and carries the approved decision through every downstream artifact. It shows sources and uncertainty, saves versions, and blocks external action until explicit approval.

## In scope

- TXT, Markdown, CSV, JSON, and saved HTML ingestion.
- Usage-signal analysis and opportunity extraction.
- Evidence and strategy-aware prioritization.
- Explore, POC, development, MVP, beta, launch, and iterate paths.
- 13 generated product outputs.
- Ollama and OpenAI model adapters.
- Draft, approve, reject, cancel, kill, compare, undo, and restore.
- Append-only local run history and no automatic external writes.

## Out of scope for this release

- Native PDF/DOCX parsing.
- Live Jira, Linear, Slack, email, analytics, or LMS connectors.
- Automatic publishing, ticket creation, or stakeholder messaging.
- Claims that synthetic demo data represents real research.

## Success measures

| Metric | Target |
|---|---:|
| PM preparation time for a complete review pack | 50% reduction in controlled usability test |
| Recommendations with usable source references | ≥90% |
| Consequential actions requiring explicit approval | 100% |
| Silent external writes | 0 |
| Human rubric score across usefulness, grounding, and trust | ≥80/100 |
| Critical UAT scenarios passing before beta | 100% |

## Primary risks and mitigations

| Risk | Mitigation |
|---|---|
| Unsupported recommendation | Evidence gate, citations, missing-evidence state |
| False confidence | Show assumptions, uncertainty, and validation needs |
| One-size-fits-all delivery | Lifecycle path selected from uncertainty and risk |
| Accidental action | Draft-first contract and separate approval/export |
| Data exposure | Local-first execution, approved inputs, no stored API key |
| Irreversible change | Append-only runs, undo/restore, kill switch, backup branch |

## Acceptance statement

The MVP is acceptable when a PM can ingest a mixed sample corpus, receive a source-grounded roadmap recommendation, generate the full product pack, reject or approve the draft, restore an earlier run, and complete all critical UAT cases without any external system being changed.
