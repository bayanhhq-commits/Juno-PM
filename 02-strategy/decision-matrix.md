# AI Solution Decision Matrix · Juno

> Module 2 · Lab 1 · Deliverable for final project

## Layer 1 · User Workflow

RocketShip PMs manually reconcile conflicting signals across interview transcripts, support tickets, customer feedback, executive emails, Slack, Notion, and Jira. Because the evidence is fragmented and difficult to trace, prioritization reviews spend more time debating which signals are credible than deciding which customer problems matter most. The concrete pain point is that **a loud executive request can be prioritized above a recurring customer problem because PMs cannot quickly compare the strength and source of the evidence**.

## Layer 2 · Technical AI Solution + Autonomy

- **AI capability:** Grounded Knowledge (RAG)
- **Autonomy:** Semi-autonomous · Copilot

Juno retrieves evidence only from RocketShip's approved product corpus, groups related signals, and generates a ranked opportunity shortlist with citations. It recommends priorities, explains the evidence, and flags conflicts or weak support. The PM can adjust the prioritization criteria and must approve the final order.

This is the minimum capability that solves the problem: a base LLM alone cannot reliably provide source-of-truth visibility, while an agent is unnecessary and too risky for a strategic roadmap decision. Because the cost of a wrong priority is high, Juno supports the decision but does not own it.

## Layer 3 · Business Outcome

Within the first 30 days of the pilot, **reduce the median time from raw product inputs to a PM-approved, evidence-backed prioritized shortlist by 50% versus the pre-pilot baseline**.

## The decision

We are deciding whether RocketShip should **build its own model, buy a general-purpose LLM through an API, or fine-tune a model** for Juno's Automated Prioritization capability. The decision is needed now so the team can launch a fast, evidence-grounded V1 without overinvesting before it has enough PM-approved ranking data. Scores use a 1–5 scale, where 5 is better for the PM: lower cost, faster delivery, greater control, stronger moat, and lower risk.

## Options scored

| Option | Cost | Speed | Control | Moat | Risk | Score |
|---|---:|---:|---:|---:|---:|---:|
| Build | 2 | 2 | 5 | 5 | 3 | **17/25 · 3.4** |
| Buy / API | 4 | 5 | 4 | 3 | 4 | **20/25 · 4.0** |
| Fine-tune | 2 | 2 | 4 | 4 | 2 | **14/25 · 2.8** |

## Recommendation

Choose **Buy / API** for the underlying model because it provides the best balance of cost, speed, control, and delivery risk for V1. RocketShip should build the differentiating layers in-house: the approved-corpus RAG, prioritization logic, evidence trail, and PM approval experience. This gets Juno to users quickly while keeping the defensible product context and workflow under RocketShip's control. Reassess fine-tuning only after a meaningful set of PM-approved rankings proves that prompting plus RAG cannot meet the required quality.
