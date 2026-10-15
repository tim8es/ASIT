# UI Orchestrator — compact selection policy v0.2

**Role:** universal interface selector for ordinary ChatGPT learning, separate from curriculum planning and assessment. It chooses the form, hint, feedback and retry presentation based on what learners must **do**, not on decoration. The orchestrator is not a hosted app; [`src/ui-orchestrator.mjs`](../src/ui-orchestrator.mjs) is an optional testable reference, not something ChatGPT automatically executes.

## Small bounded decision process

1. Identify intended learner action: `remember`, `recognize`, `build`, `explain`, `apply` or `interact`; identify the target competency, operation and actual modality.
2. Decide **UI or no UI**. Free conversation, direct questions, open-ended discussion or simple word clarification normally use plain chat; planned lessons use one combined form.
3. For a planned lesson, use the [configurable lesson contract](../docs/SEVEN-MINUTE-LESSONS.md): read learner-owned duration and exercise-count settings (defaults seven minutes and four tasks; up to five recommended for default sessions), then topic → rule → configured related tasks → vocabulary → **one Submit**. Defaults are not hard limits.
4. Select controls first by learning operation and assessment validity; then accessibility/platform capabilities; only then novelty. Rotate among equally sound patterns within and across lessons, using recent type history. If 3+ tasks and suitable alternatives exist, use 2+ complementary patterns.
5. Check **real capability**: playback for listening, accessible learner audio for speaking, relevant images for visual tasks. For supplied-word ordering prefer **native tap-to-order word cards** with Undo/Reset, accessible labels and a visible ordered answer; drag is optional. If not supported, use functional numbered/select ordering. Never pretend an image or static mockup is interactive.
6. Choose concise task instructions, appropriate hint, trusted rubric, one response control per subtask and genuine Submit. Assess subparts after the learner submits, then present consolidated feedback and optional delayed review. Limit single-construct diagnostic retries.
7. Do not conflate recognition, writing, dialogue typing, speaking, pronunciation or listening in evidence.

## Operations → patterns

| Operation | Candidate controls | Primary evidence |
| --- | --- | --- |
| remember | contextual cloze; brief retrieval | recall |
| recognize | meaning choice; matching; genuine image choice | recognition |
| build | tap-to-order cards with Undo/Reset; accessible ordering fallback; error repair | guided construction, not independent writing |
| explain | short justification; written explanation | explanation in observed modality |
| apply | realistic independent response; scenario | independent application if unprompted |
| interact | live dialogue where feasible; ordinary chat | interaction in observed modality |

## Lazy pattern loading

Keep this core policy small. [`patterns.json`](patterns.json) is an index, not a mandatory full spec. **Only when a pattern is chosen**, read its family: [recognition](patterns/recognition.md), [construction](patterns/construction.md) or [interaction/media](patterns/media-interaction.md). Do not consume context by loading all detailed patterns every turn. If only the installed Engine is accessible, use its compact core routing and accessible fallbacks without pretending GitHub is installed.
