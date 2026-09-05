# Prototype Brief

## Hypothesis

PMs will trust and use an AI product agent when it exposes evidence, reasoning, uncertainty, approval boundaries, and recovery—not merely when the generated documents sound polished.

## Prototype sequence

| Version | What it tests | Primary evidence |
|---|---|---|
| V1 — Control prototype | Are evidence gates and safety controls understandable? | Run, approve, export lock, compare, undo, restore, kill switch |
| V2 — Product OS | Does one coherent workspace cover the full PM lifecycle? | Knowledge, usage, opportunities, paths, product pack, launch, audit |
| V3 — Working agent | Can the system execute the workflow on local files? | Node backend, model adapters, 13 outputs, persisted runs, automated tests |

## V2 walkthrough task

“Prepare the September Product Investment Review. Use the approved evidence and module usage to decide whether CSV export reliability, AI recommendations, and dark mode belong in Now, Next, or Later. Select the correct delivery path for each. Create the product pack for the top item, inspect the evidence, and approve only if the recommendation is justified.”

## Behaviors to observe

- Can the PM distinguish evidence from stakeholder opinion?
- Can the PM explain why an item is prioritized or blocked?
- Does the PM understand which lifecycle path Juno recommends and why?
- Does the approval state feel separate from generation?
- Can the PM recover after a poor run without fear of losing history?
- Which artifact requires the most editing before it becomes usable?

## Prototype success criteria

- 5/5 participants find the source trail without assistance.
- 4/5 correctly explain why weak-evidence items are blocked.
- 4/5 complete approve or reject and restore an earlier version.
- Median System Usability Scale is ≥75.
- No participant believes a draft has been published externally.

## Test constraints

Use synthetic or de-identified inputs. Do not upload confidential product materials to the hosted browser prototype. The V2 website simulates the workflow locally; use V3 for executable model-backed tests.
