# AI PRD · Juno

> Module 3 · RAG / AI PRD. The AI product requirements document for Juno's evidence-backed Automated Prioritization capability.

**Product:** Juno Automated Prioritization  
**User:** RocketShip Product Managers  
**Autonomy:** Copilot — Juno recommends; the PM decides  
**V1 status:** 30-day pilot

## Problem & user

RocketShip Product Managers must manually reconcile product signals scattered across interview transcripts, support tickets, customer feedback, and executive emails. Repeated requests, conflicting opinions, missing context, and untraceable evidence make prioritization slow and vulnerable to the loudest or most senior stakeholder.

The primary user is a Product Manager preparing a roadmap or prioritization review. Secondary users are product leaders, researchers, and support teams who need to understand why an opportunity was ranked and which evidence supports it.

The job to be done is:

> When I receive messy and conflicting product inputs, help me turn them into a defensible opportunity shortlist so I can make a faster prioritization decision without losing evidence or strategic context.

## Solution overview

Juno is an AI prioritization copilot. The PM supplies approved product evidence and may add the current strategy document. Juno retrieves relevant evidence, groups related signals, detects conflicts and weak support, and produces a P0–P3 opportunity shortlist with evidence strength, source citations, strategic rationale, and an editable Opportunity Brief.

Juno supports two modes:

- **Strategy Mode:** When a strategy document is provided, Juno uses it as the source of truth for strategic alignment. Every priority explains which strategy pillar or decision rule it supports.
- **Quality Mode:** When no strategy document is provided, Juno scores request quality using problem clarity, evidence quality, requirement specificity, and anti-pattern checks. The interface clearly warns that the result reflects request quality, not strategic alignment.

Juno never finalizes a roadmap decision or creates delivery work. The PM must review, edit, approve, or reject the result.

## Retrieval requirements (RAG)

- **Sources:** Approved interview transcripts, support tickets, customer-feedback records, executive emails, and the active strategy document. Each item must retain source ID, source type, date, author or user role, customer or account where permitted, access permissions, and document version.
- **Chunking / indexing:** Split product evidence into source-aware chunks of approximately 300–500 tokens with 10–15% overlap. Preserve whole customer statements and ticket descriptions whenever possible. Split strategy documents by headings, pillars, goals, non-goals, and decision rules. Use hybrid semantic and keyword retrieval with metadata filters, retrieve the top 10 candidates, and rerank the five most relevant chunks.
- **Grounding rule:** No opportunity may appear in the recommended ranking without at least one viewable evidence citation. In Strategy Mode, every P0–P1 recommendation must cite both direct product evidence and the relevant strategy clause. Unsupported items are labelled **Insufficient Evidence** and excluded from the recommended order until reviewed by a PM.
- **Freshness:** New or updated approved inputs must be searchable within 15 minutes. Juno must display the active strategy version and last-indexed time. Evidence older than 90 days is visibly marked as potentially stale; it remains available for context but cannot silently outweigh newer evidence.
- **Permissions:** Retrieval must respect the requesting user's source permissions. Deleted, revoked, or unapproved content must not be retrieved or displayed.
- **Conflict handling:** Juno must preserve material disagreements, minority opinions, and contradictory evidence instead of averaging them into one false consensus.

## Requirements

| # | Requirement | Priority | Acceptance criteria |
|---:|---|---|---|
| 1 | Ingest approved product inputs | Must | A PM can paste or upload interviews, tickets, feedback, and executive emails; every item receives a source ID and metadata record. |
| 2 | Accept an optional strategy document | Must | The PM can paste or upload a TXT or Markdown strategy document, see its word count and active version, replace it, or continue without it. |
| 3 | Support Strategy Mode and Quality Mode | Must | Processing with strategy produces strategic alignment; processing without strategy produces a visible Quality Mode warning and never claims strategic alignment. |
| 4 | Retrieve and group related evidence | Must | Juno clusters semantically related signals while preserving source links, conflicting evidence, and minority opinions. |
| 5 | Generate an evidence-backed P0–P3 shortlist | Must | Every ranked opportunity includes title, problem, priority, evidence strength, supporting sources, and rationale. |
| 6 | Provide source-level traceability | Must | Selecting a citation opens the exact source excerpt and metadata; citation coverage across ranked opportunities is 100%. |
| 7 | Apply an evidence gate | Must | An item without sufficient support is labelled **Insufficient Evidence**, excluded from the recommended order, and paired with a request for missing evidence. |
| 8 | Explain strategic alignment | Must | In Strategy Mode, every item shows the extracted strategy pillar, an alignment score from 0–100, the cited strategy clause, and a plain-language rationale. |
| 9 | Flag anti-patterns | Must | Competitor copying, vanity requests, vague problems, arbitrary deadlines, and executive opinions without user evidence are visibly flagged and may be marked **Not Recommended**. |
| 10 | Keep the PM in control | Must | The PM can inspect evidence, edit titles and rationale, adjust criteria, reorder items, reject an item, undo changes, and approve the final shortlist. |
| 11 | Preserve an audit trail | Must | Juno records source versions, retrieved chunks, model output, PM edits, overrides, approval status, processing time, and errors for each run. |
| 12 | Handle failures safely | Must | Retrieval, parsing, or model failures show a clear error, preserve all user inputs, create no partial final ranking, and offer retry or manual review. |
| 13 | Protect confidential data | Must | Juno filters retrieval by permission, does not expose restricted personal data, and logs access without copying unnecessary sensitive content into the output. |
| 14 | Meet pilot performance targets | Should | For a typical pilot batch, the first ranked result appears within 15 seconds and the complete shortlist within 30 seconds. |
| 15 | Export an approved brief | Could | After explicit PM approval, the user can download the shortlist and Opportunity Brief as Markdown or PDF; no external system is changed automatically. |

## Success metrics

The 30-day pilot succeeds when:

- Median time from raw inputs to a PM-approved shortlist decreases by **50%** from the pre-pilot baseline.
- At least **80%** of pilot shortlists are approved with only minor edits.
- **100%** of ranked opportunities include a valid, viewable source citation.
- At least **90%** of retrieved evidence in the evaluation set is judged relevant by PM reviewers.
- **0** unsupported P0–P1 recommendations pass the evidence gate.
- **100%** of final shortlists receive explicit PM approval.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| A fabricated or mismatched citation creates false confidence | Validate citation IDs against retrieved chunks and block uncited recommendations. |
| An outdated strategy produces the wrong priority | Display the active version and date; warn on expired or superseded strategy documents. |
| Frequent feedback overwhelms severe minority problems | Show frequency and impact separately and preserve outlier evidence. |
| Users accept the ranking without reviewing it | Require evidence review and explicit approval before a shortlist becomes final. |
| Sensitive information leaks across teams | Enforce source permissions during retrieval and minimize personal data in generated outputs. |

## Out of scope

- Automatically editing the roadmap, creating Jira delivery work, or committing resources.
- Ingesting unapproved company-wide data sources.
- Making legal, privacy, security, compliance, or financial decisions.
- Fine-tuning a custom model in V1.
- Fully autonomous prioritization without PM review.
- Treating Quality Mode as proof of strategic alignment.
- Real-time Slack, Notion, Jira, or CRM integrations during the initial pilot.
