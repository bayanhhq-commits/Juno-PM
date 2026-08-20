# AI Solution Decision Matrix · Juno

## The decision

Decide how to deliver Juno's Automated Prioritization capability for the next pilot: build a model capability internally, use a commercial model API with a RocketShip-owned RAG and prioritization layer, or fine-tune a model. The decision is needed now so the team can validate user value quickly without weakening evidence traceability or committing to unnecessary model-development cost.

## Options scored

| Option | Cost | Speed | Control | Moat | Risk | Score |
|---|---|---|---|---|---|---|
| Build | 2 | 2 | 5 | 5 | 3 | 3.4 |
| Buy / API | 4 | 5 | 4 | 3 | 4 | 4.0 |
| Fine-tune | 2 | 2 | 4 | 4 | 2 | 2.8 |

## Recommendation

Choose Buy / API for the underlying model and build Juno's differentiating RAG, prioritization logic, evidence trail, and PM approval experience in-house. This option gets Automated Prioritization into users' hands fastest while keeping roadmap decisions grounded and human-controlled. Reassess fine-tuning only after the pilot produces a reliable set of PM-approved rankings and clear evidence that prompting plus RAG cannot meet the required quality.
