# AI Strategy One-Pager - Juno Automated Prioritization

## 1. Problem & Workflow

RocketShip PMs manually reconcile conflicting signals scattered across interview transcripts, support tickets, customer feedback, executive emails, Slack, Notion, and Jira. Because the evidence is difficult to trace, prioritization reviews debate which signals are credible instead of which customer problems matter most. Juno explicitly prevents one bad decision: **prioritizing a roadmap opportunity because the loudest or most senior request outweighs stronger customer evidence**. It turns approved product inputs into a ranked, evidence-backed opportunity shortlist for PM review.

## 2. Target Metrics

The 30-day pilot succeeds if Juno **reduces the median time from raw product inputs to a PM-approved, evidence-backed prioritized shortlist by 50% versus the pre-pilot baseline**. The leadership-level proof is adoption without loss of confidence: at least **80% of pilot shortlists are approved with only minor edits**, while **100% of ranked opportunities retain a valid citation to their source evidence**.

## 3. Autonomy Level

Juno will operate as a **Copilot**. It recommends priority, explains the supporting evidence, flags conflicting or weak signals, and allows the PM to adjust criteria before approving the final order. We would **not choose Agent autonomy** because roadmap prioritization involves strategic trade-offs, organizational context, and accountability that must remain with the PM; Juno must not independently commit roadmap changes or trigger delivery work.

## 4. Data & Model Approach

Use **Buy + Ground**: buy access to a capable general-purpose LLM through an API, then build RocketShip-owned RAG, prioritization logic, evidence traceability, and the PM approval experience. RAG will retrieve only from the approved product corpus and ground every recommendation in identifiable source evidence. The shortcut we are **not** taking is fine-tuning at V1: RocketShip does not yet have enough high-quality, PM-approved ranking examples to justify it, and fine-tuning too early could encode inconsistent historical decisions. Reassess only after prompting and RAG show repeatable gaps across a meaningful set of approved rankings.

## 5. Risks & Mitigations

The one-way-door risk is that Juno presents a weak or fabricated signal as credible evidence, causes the team to prioritize the wrong opportunity, and permanently damages trust in the product. The guardrail is an **evidence gate**: every ranked opportunity must include a source citation and viewable evidence excerpt; if retrieval confidence or evidence coverage is below the defined threshold, Juno must label the item **Insufficient Evidence** and exclude it from the recommended ranking until a PM reviews it. No shortlist becomes final without explicit PM approval.

## 6. V1 Scope

**IN:** ingest approved interviews, support tickets, customer feedback, and executive emails; retrieve and group related evidence; generate a ranked opportunity shortlist; show citations, conflicts, and evidence-strength indicators; let the PM adjust criteria and approve or reject the ranking.

**OUT:**

- Juno will not automatically edit the product roadmap, create Jira delivery work, or commit resources.
- Juno will not ingest unapproved company-wide sources or make recommendations without traceable evidence.
- Juno will not fine-tune a custom model in V1.
