# Juno — AI Product Manager Agent

**Product School AI Product Manager Certificate · Final Project · Bayan**

Juno is a human-controlled product agent that turns approved product evidence and module-usage data into a prioritized roadmap and a complete product-delivery pack. It reads first, shows its reasoning and citations, keeps all outputs as drafts, and waits for explicit PM approval before export.

## Final submission links

- **Live project showcase:** https://juno-pm-final-project.b-hasan.chatgpt.site
- **Interactive Product OS prototype (V2):** https://juno-pm-final-project.b-hasan.chatgpt.site/v2/
- **Early control prototype (V1):** https://juno-pm-final-project.b-hasan.chatgpt.site/v1/
- **Working local agent (V3):** [`agent/`](./agent/)
- **Instructor submission guide:** [`FINAL-SUBMISSION.md`](./FINAL-SUBMISSION.md)
- **Evolution and decision history:** [`HISTORY.md`](./HISTORY.md)
- **Product School lab mapping:** [`LAB-MAPPING.md`](./LAB-MAPPING.md)
- **Verification report:** [`TEST-REPORT.md`](./TEST-REPORT.md)
- **Complete product-delivery pack:** [`07-product-delivery/`](./07-product-delivery/)

## What Juno does

1. Reads approved product context: course modules, research, feedback, existing PRDs, strategy, and usage CSV/JSON.
2. Checks source quality, permissions, freshness, and evidence coverage.
3. Extracts opportunities and separates user evidence from opinions or arbitrary requests.
4. Prioritizes transparently using impact, evidence, strategy, urgency, effort, and risk.
5. Recommends the right path for each item: explore, POC, development, MVP, beta, launch, or iterate.
6. Creates 13 linked outputs: opportunity brief, one-page PRD, full PRD, prototype brief, epic, stories, analytics, UAT, GTM, rollout, release notes, user manual, and post-launch review.
7. Stops at approval gates. It never silently publishes, sends messages, or edits an external system.

## Repository map

| Area | Evidence |
|---|---|
| M1 — Prompting | [`01-prompting/`](./01-prompting/) |
| M2 — Strategy | [`02-strategy/`](./02-strategy/) |
| M3 — RAG + PRD | [`03-rag-prd/`](./03-rag-prd/) |
| M4 — AI UX + trust | [`04-ai-ux/`](./04-ai-ux/) |
| M5 — Agentic workflows | [`05-agentic-workflows/`](./05-agentic-workflows/) |
| M6 — Evaluation | [`06-evals/`](./06-evals/) |
| Final delivery pack | [`07-product-delivery/`](./07-product-delivery/) |
| Working agent | [`agent/`](./agent/) |
| Versioned prototypes | [`docs/`](./docs/) |
| Downloadable releases | [`downloads/`](./downloads/) |

## Run the working agent locally

Requirements: Node.js 20+ and either Ollama for local inference or an OpenAI API key.

### Windows

1. Download [`juno-agent-v3-windows.zip`](./downloads/juno-agent-v3-windows.zip).
2. Unzip it.
3. Double-click `START_JUNO.bat`.
4. Open the local address shown in the terminal.

### macOS or Linux

```bash
cd agent
npm start
```

Then open `http://localhost:4173`.

The OpenAI key is held only in process memory, requests use `store: false`, and runtime history is excluded from Git. Ollama keeps the model path local.

## Verification

```bash
cd agent
npm test
npm run build
```

Six automated tests cover the core pipeline, oversized multi-batch ingestion, mocked OpenAI and Ollama adapters, server health/UI delivery, and mapping an agent run into the Product OS workflow.

## Human control and reversibility

- Draft by default; approval is explicit.
- Source references remain attached to recommendations.
- Every agent run is written to a new append-only folder.
- Approve, reject, cancel, kill, undo, and restore are visible controls.
- `.env`, API keys, and `data/runs/` are excluded from the repository.
- The pre-submission repository state is preserved on [`backup/pre-final-submission-2026-09-05`](https://github.com/bayanhhq-commits/Juno-PM/tree/backup/pre-final-submission-2026-09-05).

See [`HISTORY.md`](./HISTORY.md) for the complete evolution and rollback path.

## Current limitations

- V3 directly ingests TXT, Markdown, CSV, JSON, and HTML. Protected LMS pages must be saved as HTML or copied into text/Markdown first.
- PDF and DOCX parsing are documented next steps.
- V2 is the shareable browser walkthrough; V3 requires local execution because its server and model adapters cannot run safely inside a static page.
- Demo evidence is synthetic and is never represented as real customer research.

## Recommended instructor review path

Open the live showcase, run V2, review `LAB-MAPPING.md`, inspect one complete delivery path in `07-product-delivery/`, then run or inspect V3 and its tests. A five-minute script is included in [`FINAL-SUBMISSION.md`](./FINAL-SUBMISSION.md).
