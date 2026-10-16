# Complete configurable mini-lessons — ASIT contract v0.5

This universal contract defines the planned **mini-lesson**. Personal goals, vocabulary needs and exercise preferences remain in private Learner State, not in GitHub.

## In one response, one complete lesson

Every planned lesson contains, **in this order**:

1. **Topic:** title, real communicative scenario, can-do outcome and estimated time.
2. **Grammar / language rules:** explicitly name one or two relevant constructions, show natural usage and meaning. For reading/listening/vocabulary-led lessons, use a relevant language strategy instead of unrelated grammar.
3. **One practice form:** learner-configurable connected exercises; in the default seven-minute lesson recommend four (up to five). Each exercise has an observable target, trusted rubric, correct modality and estimated effort. Mix complementary types without adding unrelated tasks.
4. **Vocabulary at the end:** 3–6 useful words or natural chunks with meaning and context. Do not reveal assessed answers or exact cloze solutions before submission.
5. **One Submit**, followed by consolidated feedback in the *next* assistant turn: what worked, one or two high-impact corrections, review and the next lesson. Objective subparts may show **immediate provisional right/wrong feedback** after learner interaction, but this does not add extra Submit actions.

**Seven minutes and up to five exercises are defaults, not hard system limits.** Read the learner's private `Config.adaptive_profile.lesson_delivery_preference.duration_minutes` (legacy: `duration_limit_minutes`) and `exercise_count` (or the legacy names `exercises_per_lesson`, `exercise_count_default`), or equivalent approved profile settings. An explicit current-turn preference overrides stored settings for that lesson without overwriting them. Absent preferences use **seven minutes** and **four exercises** (five is the recommended short-session maximum). Learners may choose longer/shorter lessons and different task counts. Validate a realistic lesson workload against the **selected** duration; reduce tasks or split the topic rather than exceed that budget. Example seven-minute allocation: topic 0.5 min, rule 1 min, four tasks 4.5 min, vocabulary 1 min.

## Adaptive variety and real evidence

Before selecting controls, route the learner's action (remember, recognize, build, explain, apply, interact) through the [compact UI Orchestrator](../ui/UI-ORCHESTRATOR.md). Choose pedagogical fit and observed modality **before** avoiding repeats. For 3+ tasks, use at least two complementary formats when appropriate: cloze, recognition choices, matching, sentence builder, error repair, word/card ordering, reading comprehension, grounded image selection, realistic dialogue, independent written response, or genuine spoken/listening work.

Do not pretend native drag, images or audio are available. Drag tasks require real interaction and a keyboard/numbered/select alternative. Image choices require a real relevant image and accessible description. If no audio is actually accessible, mark speaking, pronunciation and listening **unassessed**; text role-play can only assess written interaction. Normal chat is preferable to an unnecessary form for free conversation or a brief question.

A picture-word task (`image_label`) shows a **real grounded image directly above a native input** and checks a trusted short-answer alias set when unambiguous. Missing pictures become explicitly text-cued exercises, not imagined visual evidence. Underlined words may open inline popover hints, not a guaranteed parallel chat. Track first responses, retries, hint use and local checks as untrusted answer metadata; do not pretend local checks are stored assessments. Free text is deferred.

**Completion and storyline gate:** count every configured required task, not just solved clues. If a final writing answer is blank, show `4/5 answered — lesson incomplete`, mark written production `not_assessed` (not wrong), and lock the celebratory final scene. Offer a way to continue, or a deliberately chosen incomplete early exit using the same single Submit. An optional task can be skipped without blocking completion but must still be identified as unassessed. On Submit, recompute from the trusted Activity and learner's actual answers rather than treating animation state as proof. Keep narrative sentences continuous even when vocabulary words have popover explanations; move the popover control after the sentence if inline widgets create unintended line breaks.

A multi-item form may be represented by **one trusted composite Activity** with subtask rubrics. Keep the established `ASIT_ATTEMPT_V2` outer fields, with a bounded JSON **string** in `answer` containing subtask values. Score subparts by operation and modality before writing an accurate privacy-safe aggregate Attempts row. Do not turn recognition into independent production, or typed responses into spoken evidence. Store nothing without consent; claim Saved only after exact readback.

## Diagnostic mode is separate

A diagnostic is **one bounded mixed packet**, preferably 3–5 short tasks within the configured duration (seven minutes by default), covering diverse available abilities: independent production, comprehension, grammar and interaction. Its goal is **breadth of evidence**, not correcting every mistake. Allow **at most one brief clarification/retry per ambiguous construction**, otherwise record the weakness and proceed. After useful initial coverage, mark untested skills unassessed, present a provisional profile and start the learning plan. Do not repeat one structure until it becomes correct merely to determine CEFR.

## Render quality gate

Do not call it a completed mini-lesson unless it has topic, outcome, relevant language rule, configured task count, justified formats, accessible functioning inputs, real use, end vocabulary, a working single Submit, estimate within the learner-selected duration and trustworthy assessment/storage plan.

## Choosing from the expanded catalog (v0.5)

For learner-requested out-of-program practice, ASIT may select **one** named type from the 18-type registry (17 exercise formats, one evidence viewer) with the same target/rubric/privacy constraints. Choosing a type never proves a client supports its controls. Read the selected spec and check capability. Default planned 7-minute lessons still contain ~4 suitable varied tasks, not all catalog entries.

`reading_comprehension` uses a real short coherent passage and distinct gist/detail prompts. `timeline_ordering` orders sourced before/after events and invites an independent explanation. `image_hotspot` requires genuine accessible image region controls and truthful fallback; without them choose an actual image choice or text prompt and change the evidence label.

A sentence builder composes semantic chunks; separate word-card ordering sorts individual tokens. Open dialogue must proceed across real responses and teacher follow-ups, at least two to call it sustained interaction; a static text-entry role-play alone does not. Listening requires actual playable audio, speaking requires accessible learner audio, and typed simulations are not evidence of these modalities. Review first try, retries, hint exposure and required composite fields against trusted rubrics. A completed visual mission does not imply independent writing or mastery.

See [dogfood report and manual gates](UX-DOGFOOD-2026-10-16.md).

## One-step audio comprehension with real sound

For a focused seven-minute `listening` lesson, select a genuine prerecorded/synthesized MP3 asset with verified access and a **Listen → Answer** card (not a decorative audio button). A short clip and 2–3 gist/detail questions can fit the normal lesson budget. Replay and optional 0.8× speech are purposeful supports. Do not show answer-revealing transcript before first attempt; if learner chooses to reveal it early, change observed evidence to audio + text supported. Objective item feedback occurs after one final Submit (or explicitly provisional without revealing unseen questions), written explanations are teacher-reviewed. A lesson is incomplete for listening if no actual playback occurred, even when all answers were entered. For clients lacking playable audio, use a real attachment/link fallback or explicitly changed reading exercise; no invented listening score. See [Listen → Answer contract](LISTEN-ANSWER-AUDIO-CARDS.md).
