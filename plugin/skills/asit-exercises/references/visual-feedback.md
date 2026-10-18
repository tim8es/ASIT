# Responsive visual lesson contract (lazy-loaded for structured exercise UI)

Load this file only when actually authoring an interactive exercise or complete lesson. Not for entrypoint routing, one-word explanations, progress summaries or general chat. This is a **rendering policy**, not a running JS module or a licensed asset library.

## Render selection and visual budget

- For a full mini-lesson, normally use a concise meaningful cover/scene or explanatory visual: picture vocabulary, relevant context illustration, event timeline or a distinct reading scene. The cover is **optional** if unavailable, requested text-only, accessibility/bandwidth constrained, or unjustified by the lesson. Never make a public media search solely for decoration; available native image lookup/rendering is preferable when genuinely suitable.
- For an image-labelled response put the actual image **immediately above** the editable answer and do not expose the assessed word in caption/visible label. Use accessible alt and useful text fallback; mark visual evidence unavailable if image fails.
- For four tasks prefer three distinct learner operations (notice, repair/build, independent communication); do not count a different picture or control as a new operation when the cognitive action is unchanged. Avoid a third consecutive translation unless the user requested that drill. Use at least two complementary input patterns for 3+ related tasks, only if pedagogically useful. Preserve continuous reading text, compact responsive sizing and scan-friendly spacing. Cover/illustration does **not** count as one of the exercise tasks.
- Motion may indicate selection, event order or completion only with real client support. Never insert simulated audio/video/play/record animations, inert buttons, stock-waveform decorations or fake image-hotspot regions. Do not block teaching on art generation.

## Deterministic provisional feedback

For a finite-answer choice, unequivocal form cloze or fully specified word-order task:

1. Keep controlled answer state, a separate **first nonblank attempt**, and provisional revision/hint markers where native state permits. Changing an answer must not silently replace the first try.
2. Before input: show no correctness/key. After incorrect input: visibly show **Incorrect — Try again** but do not reveal a directional clue, the key, or eliminate a named untried option. After correct input: visibly show **Correct**; give a short reason only if it cannot expose an unanswered task's key. Full rationale can follow final Submit.
3. The learner can retry. Show actual selected state, keyboard-accessible interaction and Undo/Reset for ordering. Reset does not erase first-attempt history.
4. Ambiguous vocabulary aliases, open explanations or real-life writing: show **Review after Submit** (or nothing until submission), not a false exact-string verdict.
5. Local feedback is **provisional**, NOT an ASIT assessment, CEFR award, actual analytics event or saved Drive record. Include first answer/revisions/hint level in the single Submit envelope only if actually captured; don't invent telemetry. Teacher grades from trusted rubric next turn.

If a native local-feedback UI cannot work on the current client, say the check will occur after Submit, use a functioning text/select fallback and **never promise** instantaneous checking.

## Media routing and latency

- Choose reading, writing, listening or speaking from the real can-do target **before** searching; never force ELLLO into a writing lesson or search images/audio on every turn.
- For requested/justified listening: load `asit-media`, select one real original audio/video source with verified exact recording and length, build grounded gist/detail questions, and confirm the learner actually heard it. Otherwise switch explicitly to reading or mark listening `not_assessed`.
- A static lesson should render in one message with one functioning final Submit; a genuine dialogue must span real turns. Preflight locally: answer state reacts, right/wrong rationale is correct, keys are hidden until attempted, all required fields block ordinary completion, missing questions remain `not_assessed`, media is not fictional, and optional store remains consent-gated.
