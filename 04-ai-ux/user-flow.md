# AI-Native User Flow · Juno

> Module 4 · AI-Native UX. The end-to-end flow for Juno's evidence-backed Automated Prioritization experience.

## Entry point

A RocketShip Product Manager opens Juno before a weekly prioritization review, roadmap planning session, or when a new batch of interviews, support tickets, customer feedback, and executive requests must be assessed.

The PM reaches for Juno because the evidence is fragmented and difficult to compare. The desired outcome is a PM-approved opportunity shortlist in which every priority can be explained and traced to its source.

## The flow

1. **Start a prioritization workspace**  
   The PM creates a new analysis, names the decision, and selects the planning period. Juno shows an empty-state checklist: strategy, evidence, processing, review, and approval.

2. **Load strategic context — optional**  
   The PM pastes or uploads the active strategy document. Juno shows the document name, version, word count, and a **Strategy loaded** badge. The PM can preview or remove it. If no strategy is supplied, Juno explains that processing will use Quality Mode rather than strategic alignment.

3. **Add approved product evidence**  
   The PM pastes or uploads interview transcripts, support tickets, customer feedback, and executive emails. Juno confirms source count, source types, dates, permissions, and any rejected or unreadable files before analysis begins.

4. **Confirm analysis settings**  
   The PM reviews the selected mode and may adjust transparent criteria such as user impact, evidence strength, urgency, and strategic relevance. Default values are visible and resettable; Juno does not hide weighting behind a single unexplained score.

5. **Process and retrieve evidence**  
   Juno searches the approved corpus, retrieves relevant excerpts, groups related signals, identifies duplicates and conflicts, and generates candidate opportunities. The interface shows progress stages rather than a generic spinner and lets the PM cancel safely.

6. **Review the ranked opportunity shortlist**  
   Juno presents P0–P3 cards with the user problem, affected users, evidence strength, sentiment, frequency, strategic pillar or Quality Score, and a concise rationale. Items with weak support appear separately as **Insufficient Evidence**; requests with multiple anti-patterns may appear as **Not Recommended**.

7. **Inspect the evidence behind each recommendation**  
   The PM opens an evidence drawer to see exact source excerpts, metadata, conflicting signals, and the strategy clause used. Citations link the recommendation to the original evidence. Juno never hides disagreement inside a blended summary.

8. **Challenge and refine the result**  
   The PM edits an opportunity, changes a criterion, reorders items, rejects an unsupported request, or asks Juno to explain a score. Juno previews the effect before applying it, records the reason for manual overrides, and provides undo.

9. **Approve or return for more evidence**  
   The PM explicitly approves the shortlist or sends selected items back for additional research. Approval locks the reviewed version while preserving a comparison with the original AI proposal.

10. **Create the handoff**  
    Juno generates an editable Opportunity Brief containing the approved order, supporting evidence, assumptions, open questions, and non-goals. The PM may download it as Markdown or PDF. Juno does not change the roadmap or create delivery tickets automatically.

## AI moments

| Moment | What Juno does | What the user sees | User control |
|---|---|---|---|
| Strategy ingestion | Extracts pillars, goals, non-goals, and decision rules | Active strategy version and extracted structure | Preview, correct, replace, or remove |
| Evidence retrieval | Finds relevant excerpts across approved sources | Source count, retrieval progress, and exact citations | Open sources, exclude irrelevant evidence, retry |
| Signal synthesis | Groups duplicates and preserves conflicts | Themes, frequency, sentiment, impact, and disagreements | Split or merge themes and edit labels |
| Prioritization | Applies strategy or quality criteria to produce P0–P3 recommendations | Score components and plain-language rationale | Adjust criteria, reorder, reject, request explanation |
| Evidence gating | Detects missing or weak support | **Insufficient Evidence** status and missing-input prompt | Supply evidence, override with a recorded reason, or exclude |
| Brief generation | Converts the approved shortlist into an Opportunity Brief | Editable draft with citations and assumptions | Edit, undo, approve, or download |

## Key interaction states

- **Empty:** Shows the minimum inputs and an example without presenting fake completed results.
- **Processing:** Displays retrieval and analysis stages, elapsed time, cancel, and safe retry.
- **Needs review:** Highlights conflicts, stale evidence, low confidence, and PM decisions still required.
- **Approved:** Shows approver, timestamp, version, changes from the AI proposal, and export options.
- **Failed safely:** Preserves inputs and previous approved versions; no incomplete ranking is treated as final.

## Fallbacks

- **No strategy document:** Continue in Quality Mode with a persistent warning that scores reflect request quality, not strategic alignment.
- **Insufficient evidence:** Do not recommend the item. Show the missing evidence and suggested research question.
- **Conflicting evidence:** Present both sides, lower confidence, and require PM review instead of forcing consensus.
- **Stale strategy or evidence:** Display the dates prominently and ask the PM to confirm or replace the source.
- **Permission mismatch:** Exclude restricted content, explain that some sources could not be used, and never reveal their contents.
- **Retrieval failure:** Preserve inputs, show which source failed, and allow retry or removal of that source.
- **Model or schema failure:** Return no partial final ranking. Show a clear reason, keep the workspace intact, and offer retry.
- **Juno is wrong:** The PM can edit, reject, override with a reason, compare versions, and undo.
- **Service unavailable or offline:** Allow the PM to continue reviewing the most recent approved version and clearly label it as cached.
- **Sensitive or high-risk decision:** Stop recommendation generation and route the item to the appropriate human expert.

## Completion criteria

The flow is complete only when every recommended opportunity has viewable evidence, unresolved conflicts are visible, all overrides are recorded, and a PM explicitly approves the final shortlist.
