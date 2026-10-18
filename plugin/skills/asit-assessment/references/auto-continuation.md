# ASIT automatic post-submit continuation — v0.3.7

A graded ASIT answer follows validate → grade → consented save/readback → select next goal → preflight next Activity records → render. This happens in the current reply, not as a background job. When the learner stops, pauses, requests only grading, or has reached a stated total duration, grade and report the previous Attempt without a new lesson.

## Mandatory next-lesson interface

Use the authoritative [native UI contract](../../asit-exercises/references/ui-contract.md), [vetted family selection](../../asit-exercises/references/ui-families.md) and [rich default](../../asit-lessons/references/rich-default-lesson.md). Choose visual discovery only when the can-do is genuinely visual/spatial. Reading and professional writing can use rich, functional text-based interaction without a gratuitous SVG. Listening requires source-verified actual audio, aligned questions and learner hearing confirmation. Voice and true dialogue require real spoken/multi-turn interaction.

## One-turn flow

1. Assess each original, trusted graded subtask against its original rubric. Missing answers are not_assessed. Separate recognition, guided construction, free writing, genuinely heard listening and actual speaking. Show up to two useful corrections and one truthful status (Fully synced, Attempt saved / Partial sync, Not verified or Not saved).
2. Respect stop/pause/grade-only and session-duration limits. Do not auto-continue in those cases.
3. Otherwise choose exactly one new can-do from explicit goals, verified recent independent errors, due reviews and preferences. Change mechanics after repeated errors; no more than two narrow remediation cycles without learner request to drill. No invented CEFR level from one choice or unobserved modality.
4. Check next-lesson rubric, source evidence and cross-task answer integrity before trusted Activity registration. Define immutable per-task IDs and exact modalities. When consented, preregister/read back separate Activities and current Config before rendering; otherwise render explicitly UNSAVED practice. The previous saved status does not establish next readiness.
5. Render one **complete** lesson now in the same response, with learner-relevant task count/duration, appropriate native controls, task-specific feedback, Cards/All preserved state for multiple tasks, accessible early Submit confirmation and exactly one final Submit. Never merely announce or schedule the next lesson.
6. On an identical replay, preserve the existing successor and dedupe Attempts/Activities by trusted IDs. No second invisible lesson generation or background listener.

The client Submit is a chat turn rather than a backend transaction. Real provider writes require verification. No fake image, audio control, stopwatch, animation or in-browser running plugin module. Developer source tests cannot prove mobile UI or actual ELLLO playback.
