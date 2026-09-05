# Launch Pack — GTM Plan and Release Notes

## GTM one-pager

### Audience

Product Managers and product leaders who repeatedly convert fragmented context into prioritization, planning, and launch artifacts and need AI assistance without giving up evidence or control.

### Positioning

For PMs who need decisions they can defend, Juno is a human-controlled Product Management agent that reads approved context once and turns it into a traceable roadmap and complete delivery pack. Unlike a generic AI writer, Juno preserves source links, chooses a lifecycle path based on risk, and blocks external action until approval.

### Primary use case

Prepare an evidence-backed product investment or delivery review with connected follow-through from roadmap to post-launch learning.

### Launch motion

1. **Final-project showcase:** demonstrate the end-to-end product and course integration.
2. **Private POC:** recruit 5–8 consenting PMs with de-identified material.
3. **Design-partner beta:** expand to 2–3 product teams after citation and UAT thresholds pass.
4. **GA decision:** use adoption, quality, reliability, support, and security evidence.

### Acquisition and education

- Five-minute interactive walkthrough.
- One-page “real vs simulated” transparency note.
- Sample project pack and before/after workflow.
- Office-hours onboarding for POC participants.
- Trust guide covering sources, approvals, and restore.

### Activation event

A PM imports at least two approved sources plus usage data, generates a roadmap recommendation, inspects its citations, and approves or rejects the first draft.

### Launch metrics

- Showcase-to-prototype open rate.
- Prototype completion rate.
- Time to first grounded recommendation.
- Percentage of recommendations approved without major factual correction.
- Citation coverage and citation precision.
- Weekly active PMs and product packs completed.
- Safety-control use and successful recovery rate.

## Release notes — Juno V3.0

### New

- Working local Node agent with Ollama and OpenAI adapters.
- Ingestion for TXT, Markdown, CSV, JSON, and HTML.
- Three-stage pipeline: analyze evidence, prioritize and plan, generate 13 outputs.
- Lifecycle recommendations for Explore, POC, Development, MVP, Beta, Launch, and Iterate.
- Append-only run history with approve, reject, cancel, kill, and restore actions.
- Windows launch and local-model setup scripts.
- Six automated tests across pipeline, providers, server, and UI mapping.

### Improved

- Product OS now connects module usage to prioritization and delivery-path selection.
- Product artifacts share one approved opportunity and decision context.
- Instructor-facing lab mapping and evolution history are included.

### Known limitations

- Native PDF and DOCX parsing are not included in V3.0.
- The hosted V2 prototype uses browser-local synthetic data and does not call an AI provider.
- Juno does not publish or update external tools.

### Upgrade / rollback

V3 is isolated in the `agent/` folder. Existing V1 and V2 prototypes remain available. Runtime runs are append-only and can be restored from the UI. The pre-submission Git state is preserved on the documented backup branch.
