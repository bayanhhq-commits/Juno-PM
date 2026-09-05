# Juno Final Submission Guide

## Submission statement

Juno is an AI-native Product Management operating system and local agent. It connects the course labs into one governed workflow: evidence ingestion → opportunity framing → prioritization → lifecycle decision → product definition → validation → launch → post-launch learning.

The core product insight is that a useful PM agent should not merely generate documents. It must preserve evidence, make decision logic inspectable, choose different delivery paths based on uncertainty, and stop at explicit human approval gates.

## Links to submit

| Item | Link |
|---|---|
| Final GitHub repository | https://github.com/bayanhhq-commits/Juno-PM |
| Live final-project showcase | https://juno-pm-final-project.b-hasan.chatgpt.site |
| V2 interactive Product OS | https://juno-pm-final-project.b-hasan.chatgpt.site/v2/ |
| V1 control prototype | https://juno-pm-final-project.b-hasan.chatgpt.site/v1/ |
| V3 working agent code | https://github.com/bayanhhq-commits/Juno-PM/tree/main/agent |
| Windows V3 download | https://github.com/bayanhhq-commits/Juno-PM/raw/main/downloads/juno-agent-v3-windows.zip |

## The product problem

Product teams often hold useful context across modules, feedback, support, analytics, strategy, and previous documents. The work then fragments into separate prioritization exercises, roadmaps, PRDs, tickets, test plans, and launch checklists. AI can speed up each artifact, but an ungoverned generator also creates new risks: unsupported claims, lost source context, false confidence, one-size-fits-all roadmaps, and silent action without human approval.

Juno addresses the full system rather than one document.

## Target user

Primary user: a Product Manager who owns prioritization and product-delivery quality but must work across incomplete evidence and multiple stakeholders.

Secondary reviewers: product leaders, design, engineering, data, marketing, support, legal/security, and course instructors.

## Core workflow

1. The PM creates a workspace and selects only approved sources.
2. Juno parses product material and module usage, preserving source IDs and timestamps.
3. It identifies opportunities and flags missing or weak evidence.
4. It scores opportunities transparently and recommends Now / Next / Later.
5. It chooses a lifecycle path based on risk and uncertainty: explore, POC, development, MVP, beta, launch, or iterate.
6. It creates a traceable product pack with 13 outputs.
7. The PM compares, edits, approves, rejects, cancels, or restores. External publishing remains blocked.

## Five-minute demonstration

### 0:00–0:45 — Frame the problem

Open the live showcase. Explain that Juno is designed to do PM work, not just answer a chat prompt. Point to the three guarantees: human approval, source traceability, and reversible history.

### 0:45–2:15 — Show V2 Product OS

Open the V2 prototype and use these screens:

1. **Knowledge & Usage:** inspect the approved corpus and module-usage signals.
2. **Opportunities:** recalculate priorities and show why weak evidence is blocked.
3. **Roadmap Studio:** compare lifecycle paths rather than forcing every item through the same process.
4. **Product Pack:** show connected artifacts from PRD through UAT and launch.
5. **Control & Audit:** show approval, kill switch, version comparison, undo, and restore.

### 2:15–3:20 — Explain evolution

Use the version cards on the showcase:

- V1 proved the safety and control model.
- V2 proved the end-to-end product experience.
- V3 proved the agent could read local material, call an LLM, create the pack, and retain run history.

### 3:20–4:20 — Show the working agent

Open the `agent/` folder or run the Windows package. Add the included sample usage CSV and one Markdown source, select Ollama or OpenAI, then run Juno. Show that outputs are Draft and that approval is a separate action.

### 4:20–5:00 — Close with validation

Open `LAB-MAPPING.md` and the tests. State the honest limitation: V3 currently parses text-based formats and saved HTML directly; native PDF/DOCX parsing is the next ingestion milestone.

## Evidence of course learning

- **Prompting:** a stable system contract, mode selection, structured outputs, and boundaries.
- **Strategy:** a decision matrix and product strategy one-pager.
- **RAG:** approved-corpus ingestion, source IDs, chunking, evidence gates, and citations.
- **PRD:** one-page and full requirements artifacts with outcomes and non-goals.
- **AI UX:** visible uncertainty, progressive disclosure, approval, undo, restore, and kill switch.
- **Agentic workflow:** staged orchestration, control plane, agent JSON, Langflow mapping, and real adapters.
- **Evaluation:** automated tests plus a human rubric.

## What is real vs simulated

| Layer | Status |
|---|---|
| V1 browser control experiment | Working, deterministic, browser-local |
| V2 Product OS | Working interactive prototype, browser-local sample state |
| V3 ingestion and orchestration | Working local Node application |
| V3 LLM calls | Working with Ollama or OpenAI configuration |
| V3 run history and decisions | Working append-only local storage |
| External system writes | Intentionally not implemented |
| Demo research and usage | Synthetic; clearly labelled |

## Final acceptance checklist

- [x] Repository is public and organized by module.
- [x] Live showcase and interactive prototype links are included.
- [x] M3, M4, and M5 lab outputs are mapped explicitly.
- [x] Full delivery pack covers roadmap through post-launch review.
- [x] Agent source and Windows package are included.
- [x] Automated verification is included and passing.
- [x] Privacy, human control, reversibility, and limitations are documented.
- [x] Evolution is visible in both Git history and `HISTORY.md`.
