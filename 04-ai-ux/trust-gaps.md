# Trust-Gap Mitigations · Juno

> Module 4 · AI-Native UX. Trust gaps and mitigations for Juno's evidence-backed Automated Prioritization experience.

## Trust gaps

| Gap | Where it shows up | User cost | Mitigation |
|---|---|---|---|
| Hallucinated or mismatched evidence | An opportunity card cites a source that does not support the claim | The PM may prioritize the wrong problem and lose trust in Juno | Validate every citation against the retrieved excerpt; block uncited recommendations; open citations in a source drawer. |
| Opacity — no clear “why” | Juno displays P0–P3 without exposing criteria or source support | The ranking feels arbitrary and is difficult to defend in review meetings | Show score components, evidence strength, strategy clause, and a plain-language rationale on every item. |
| Automation bias | A polished ordered list appears more authoritative than the underlying evidence | The PM may accept weak recommendations without challenge | Label results as recommendations, separate weak items, require evidence review, and require explicit PM approval. |
| No meaningful user control | The PM cannot correct a theme, change criteria, or reject a result | Juno becomes another rigid workflow and wrong outputs persist | Allow edit, reorder, reject, merge, split, override with reason, compare versions, and undo. |
| False certainty | Alignment and confidence scores look precise even when evidence is weak | Users interpret a numerical score as objective truth | Pair scores with evidence-strength labels, show uncertainty and missing inputs, and avoid unsupported decimal precision. |
| Missing or minority evidence | Frequent requests dominate a severe but less common problem | Important users or high-impact failures disappear from the summary | Show frequency and impact separately; preserve outliers and conflicts; let PMs filter by segment and source. |
| Stale strategy or product evidence | Juno ranks against an expired strategy or outdated customer input | The recommendation may be correct for the past but wrong now | Display source dates and active strategy version; flag evidence older than 90 days; require confirmation of stale sources. |
| Strategy leakage into customer truth | Juno treats a strategy statement as proof that users have a problem | The team may build strategy-aligned features without real user evidence | Use strategy only for alignment; require direct product evidence for P0–P1 recommendations. |
| Privacy or permission leakage | Retrieved excerpts expose restricted customer or employee information | Confidentiality, legal, and reputational harm | Apply source permissions during retrieval, minimize personal data, exclude revoked sources, and log access. |
| Inconsistent reruns | The same inputs produce a materially different order without explanation | PMs cannot reproduce or defend the decision | Version inputs and prompts, keep model settings controlled, store run history, and highlight changes between runs. |
| Failure hidden behind a plausible result | Retrieval or structured generation fails but the UI still shows partial output | The PM may act on incomplete analysis | Fail closed: preserve inputs, show the failing stage and reason, return no partial final ranking, and offer retry. |
| Unclear mode | The PM processes without strategy but assumes the result is strategically aligned | Quality scores are mistaken for roadmap priorities | Display **Quality Mode** persistently and state that strategy alignment is unavailable until a strategy document is loaded. |

## Highest-priority fix

The first gap to close is **hallucinated or unsupported evidence**.

Juno's core promise is not merely to generate a convincing ranking; it is to produce a ranking that a Product Manager can verify and defend. A polished P0 recommendation with false evidence can cause the wrong roadmap investment and permanently damage trust in the product.

The highest-priority mitigation is therefore an **evidence gate**:

1. Every ranked opportunity must contain at least one validated, viewable source citation.
2. In Strategy Mode, every P0–P1 item must include direct product evidence and a cited strategy clause.
3. If citation validation fails or evidence is insufficient, the item is removed from the recommended order and labelled **Insufficient Evidence**.
4. The UI tells the PM what evidence is missing and supports a safe retry.
5. No shortlist becomes final without explicit PM approval.

## Trust-focused release gates

- **100% citation coverage** across ranked opportunities.
- **0 unsupported P0–P1 recommendations** in the evaluation set.
- **100% explicit PM approval** for final shortlists.
- **100% visibility of mode:** Strategy Mode or Quality Mode.
- Restricted or revoked content is retrieved **0 times**.
- Retrieval or generation failures produce **0 plausible partial final rankings**.

## Design principle

Juno should make uncertainty visible, evidence inspectable, and every consequential action reversible. The interface must help the PM challenge the AI, not simply agree with it.
