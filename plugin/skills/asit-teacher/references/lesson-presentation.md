# ASIT full-lesson presentation and early-finish contract — v0.3.1

Read this reference **for every full planned lesson**, including automatic post-submit lessons. Do not load it for small grammar explanations, answer feedback, and progress-only questions. This supplements—not replaces—`asit-lessons`, `asit-exercises`, `asit-media`, answer-integrity and Save Gate.

## Unprompted rich layout is mandatory

Normal full lessons follow [rich-default experience contract](../../asit-lessons/references/rich-default-lesson.md) and [complete native five-task reference](../../asit-exercises/references/complete-native-lesson.md) even when no visual/game request exists. Cards/All must switch **real stateful UI**, not Markdown subsections. A missing photograph triggers a **diagram fallback**, not a text-only lesson (unless expressly requested or host limitation confirmed).

## Visible introduction: goal, grammar, vocabulary

Before the first graded task, show a **substantive but concise** lesson introduction: short situation/mission, one observable communicative `can-do` outcome, realistic time budget, number of independently graded tasks, and 2–3 genuinely relevant grammar/usage points or comprehension strategies. Include a small vocabulary section (usually 4–6 expressions) **available to the learner at the start** and, where useful, a richer review afterward. Prefer natural chunks with a short translation or explanation. This is an instructional resource, not a separate graded task or padded prose. Audit it with the entire lesson for answer leakage: do **not** supply the exact word, sentence, answer position, or a near-paraphrase that solves any unsolved graded task, particularly image-label, cloze, ordering and independent production. If needed, choose non-answer-bearing vocabulary before tasks and introduce assessed answers only after submission. Do not expose a transcript for a genuine listening task before the learner's first attempt.

## Duration and pacing

An explicit learner request for **15 minutes means 15 individual ~one-minute activities**. More generally, when the learner requests a duration in minutes and has explicitly chosen one task per minute, use that many short activities (within a reasonable interface budget) rather than silently substituting 4 or 5 longer tasks. A task need not be force-timed or auto-advance after 60 seconds; do not invent stopwatch telemetry. Some open responses may take longer; identify pacing as an estimate. Introduction is compact and not counted as a graded activity. Blend genuine different operations, not 15 nearly identical clozes.

## Two switchable presentations — one lesson, one set of answers

Every complete lesson with 2+ tasks should offer a functional, **learner-controlled** display mode selector near the top:

* **Cards / По одному** (default, based on user's explicitly stated preference): one current task shown at a time, clear `N / total` progress, working Previous/Next controls, compact no-scroll task view as far as practical.
* **All blocks / Все сразу**: all tasks as separate blocks in one continuous vertically scrollable lesson.

Implement with native controlled `segmented-control` (or functional radio fallback) and shared local state per activity ID. Switching modes **must not clear answers, first-attempt metadata, feedback or which task is current** and must not create duplicate server Activity registrations or Submit events. Keep one logical lesson with **exactly one submission action**. Where possible, preserve selected mode as a preference only if authorized and accurately written/read back in existing learner `adaptive_profile.lesson_delivery_preference` metadata; do not add required Config keys, assume a new schema, or claim mode is permanently saved without evidence. A visible mode selector is useful even without durable saving. On next unconfigured lesson use Cards as default.

## Finish early / submit unanswered items

The previous all-or-nothing validation was a UX defect. Provide a **working, visible `Отправить результаты` / `Завершить досрочно` action even when some fields are empty**, including in Cards mode without having to navigate to task 15. On click if anything is missing, show an accessible local confirmation summary: `answered X of N, missing Y` with actual `Отправить X ответов` and `Продолжить урок` actions. If all tasks are answered, submit normally. If zero are answered, allow explicit early completion after confirmation and clearly say no knowledge was assessed. Never silently pretend blanks are correct. A separate end-of-lesson Submit button that posts twice is not allowed: confirmation only invokes the same one canonical Submit.

For the `ASIT_ATTEMPT_V2` envelope, keep the validated `session_id`, `lesson_id`, **one immutable parent `attempt_id`**, and `answer` as a JSON-string object keyed by the trusted registered subtask IDs. Include nonempty answers only; missing or explicitly skipped subtasks may be omitted (or represented as null if the protocol accepts it), and optional `skipped_task_ids` may list registered omitted IDs. Do **not** fill blanks with fake responses such as `Skip`, unselected options, placeholder text, or auto-generated words. The assessor grades each missing required subtask `not_assessed`, maintains the declared modalities/competencies and honestly saves nonverbatim summary-only observations when allowed. The user is allowed to revise earlier answers before final Submit; local correctness statuses do not constitute durable evidence. Record first tries only when actually observed in UI, tagged unverified.

## Interactive acceptance check

1. Opening the lesson shows goal, grammar strategy, useful non-spoiler vocabulary and task count/duration.
2. Toggle Cards → All blocks → Cards after answering two tasks. Original two answers, local feedback, first tries and current position remain unchanged.
3. In Cards mode, the user can submit after task 3 of 15. A confirmation reports `3 answered / 12 skipped` and sends one canonical envelope; the assessor records 12 `not_assessed` items, no fabricated learner text.
4. In All blocks mode, early Submit works too. Complete Submit still works, and two rapidly repeated taps cannot intentionally issue duplicate turns; deduplication is enforced by stable IDs on the trusted storage side.
5. Empty-form finish does not award progress; standalone external ELLLO links do not count as listening. Missing playback is `not_assessed`.
6. On small displays, control labels and clickable areas remain readable. If one UI mode is unsupported, say so honestly and provide the available functional alternative.
