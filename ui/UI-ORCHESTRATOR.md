# UI Orchestrator — compact selection policy v0.1

**Role:** universal interface selector for ordinary ChatGPT learning, separate from curriculum planning and assessment. It chooses the form, hint, feedback and retry presentation based on what learners must **do**, not on decoration. The orchestrator is not a hosted app; [`src/ui-orchestrator.mjs`](../src/ui-orchestrator.mjs) is an optional testable reference, not something ChatGPT automatically executes.

## Small bounded decision process

1. Identify intended learner action: `remember`, `recognize`, `build`, `explain`, `apply` or `interact`; identify the target competency, operation and actual modality.
2. Decide **UI or no UI**. Free conversation, direct questions, open-ended discussion or simple word clarification normally use plain chat; planned lessons use one combined form.
3. For a planned lesson, enforce the [seven-minute lesson contract](../docs/SEVEN-MINUTE-LESSONS.md): topic → rule → configured **1–5** related tasks (four default) → end vocabulary → **one Submit**.
4. Select controls first by learning operation and assessment validity; then accessibility/platform capabilities; only then novelty. Rotate among equally sound patterns within and across lessons, using recent type history. If 3+ tasks and suitable alternatives exist, use 2+ complementary patterns.
5. Check **real capability**: audio playback for listening, access to learner audio for spoken assessment, actual relevant images for image tasks, actual drag mechanics and keyboard fallback for drag. Otherwise fall back to accessible text/select/numbered ordering with accurate modality labels. Never represent a static mockup as working interactivity.
6. Choose concise task instructions, appropriate hint, trusted rubric, one response control per subtask and genuine Submit. Assess subparts after the learner submits, then present consolidated feedback and optional delayed review. Limit single-construct diagnostic retries.
7. Do not conflate recognition, writing, dialogue typing, speaking, pronunciation or listening in evidence.

## Operations → patterns

| Operation | Candidate controls | Primary evidence |
| --- | --- | --- |
| remember | contextual cloze; brief retrieval | recall |
| recognize | meaning choice; matching; genuine image choice | recognition |
| build | word-order builder; accessible card ordering; error repair | guided construction |
| explain | short justification; written explanation | explanation in observed modality |
| apply | realistic independent response; scenario | independent application if unprompted |
| interact | live dialogue where feasible; ordinary chat | interaction in observed modality |

## Lazy pattern loading

Keep this core policy small. [`patterns.json`](patterns.json) is an index, not a mandatory full spec. **Only when a pattern is chosen**, read its family: [recognition](patterns/recognition.md), [construction](patterns/construction.md) or [interaction/media](patterns/media-interaction.md). Do not consume context by loading all detailed patterns every turn. If only the installed Engine is accessible, use its compact core routing and accessible fallbacks without pretending GitHub is installed.
