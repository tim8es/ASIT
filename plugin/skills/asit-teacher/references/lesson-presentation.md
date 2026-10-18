# ASIT full lesson presentation — v0.3.7

Read for planned full multi-task lessons, including post-Submit continuation. **One authoritative UI contract:** [native UI contract](../../asit-exercises/references/ui-contract.md) with [fixed families](../../asit-exercises/references/ui-families.md). This file defines compact presentation/pacing, not compulsory SVG or photographs for every can-do.

## Opening / pacing

- Brief title, one real communication goal, concrete situation/recipient, honest estimated duration/task count; 1–3 directly relevant grammar/communication strategies; a short nonspoiling vocabulary set (4–6 expressions only when useful). More revealing words/examples after Submit. Transcripts for listening must not give away the audio task before first heard attempt.
- No explicit task-count preference: **~7 minutes / 5 graded tasks** for full mini-lesson. Explicit learner count and pacing override defaults. E.g. a request for 15 minutes is not automatically 15 tasks; 15 **one-minute** tasks apply when the learner specifically chose one activity per minute. No fake timer, auto-pacing or stacked duplicate clozes to fill minutes.
- Task relevance controls media: a scene is useful for spatial concepts; a continuous authentic text is sufficient for serious reading/writing. A missing photo only triggers a diagram if the actual can-do requires visual evidence. A cover is never graded visual evidence and irrelevant imagery is not mandatory.

## One multi-task UI, two optional views

- Every complete 2+ task lesson should offer an actual controlled segmented choice: **Cards/По одному** (default when no verified preference), showing one task with Previous/Next and honest progress, versus **All/Все сразу** scrolling all task cards. This is one logical lesson and *one answer state per immutable graded Activity*; switching must not reset answers, first-try provisional values, selected state, current page or produce more Submit events.
- All visible buttons must be supported real callbacks; lexical aliases and open writing remain `Review after Submit`, finite answers receive `Correct`/`Incorrect — Try again` only after a response, with no spoiler or eliminated option.
- A single canonical `ASIT_ATTEMPT_V2` Submit exists in both modes. Keep trusted immutable session/lesson/parent attempt ID and JSON-string answer map keyed by preregistered task IDs. Client first-try counts are unverified, not server or CEFR proof.

## Early finish from any page

- Submit remains visible even with blanks and in Cards mode. Missing answers trigger a live accessible confirmation: `X answered / Y skipped`, with working `Send X answers` and `Continue lesson` controls. Explicit zero-answer finish is valid, with no knowledge awarded.
- Empty/omitted task IDs are `not_assessed`, not fabricated `Skip` text or incorrect answers. If all answered, Submit directly; one logical send path with client repeat guard and trusted storage-side dedupe. A confirmation state is **not** a second chat Submit.
- When saving is active, all per-task rubrics/Activities must be preregistered and read back BEFORE presentation; the form doesn't itself save. No claim of persistence without write and readback.

## Manual release checks

Open lesson → fill two answers → Cards⇄All⇄Cards → verify exact input retention → Undo/Replay without erasing unrelated answers → immediately correct and wrong finite verdicts after input → submit with blanks, cancel, confirm → single envelope with correct IDs → desktop/mobile keyboard and tap testing. Hearing/playback requires actual user report; image tool source does not prove client display.
