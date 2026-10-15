# ASIT MLP — native chat experience specification

ASIT is an educational experience, **not** a spreadsheet administration interface. The learning interaction stays in a normal ChatGPT chat. This document describes *intent* and observable behavior, not a custom frontend.

## First five minutes

1. **Value before paperwork:** Ask one real-world goal question if it is unknown. Let the user speak in English almost immediately through one short diagnostic prompt; explanations adapt to comprehension.
2. **Clear private saving:** Only if cross-chat tracking is desired, offer summary-only (recommended for data minimization), full answers, or no saving. Do not force a large form or account setup.
3. **Show a concrete destination:** After observing an initial answer, state a small can-do objective and 1–2 reasons; do not extrapolate a verified global CEFR level.
4. **Deliver interaction:** The user sees a purposeful short challenge, responds, receives precise feedback and tries the corrected pattern in a new situation.
5. **Finish with agency:** Recap one tangible outcome, current next step and the verified saving state.

## Native screen grammar

Prefer the smallest hierarchy that makes content clear; keep the learner's next action visually primary.

**Lesson header:** clearly named topic, observable communicative target, relevant modality, and estimated duration, **up to seven minutes by default** or the learner's explicitly configured value (not measured time). No artificial XP, decorative badges, simulated completion bars or unverified proficiency percentages.

**Practice form:** all related exercises in one assistant response, grouped under one clear form and one Submit. Keep each task's prompt distinct and short, label each control, and show only context needed for its assessment. When choice options have ambiguous answers, rewrite them. Prefer 3–5 exercises when the seven-minute budget allows (configurable 1–5); reduce the count for speech or demanding comprehension.

**Support:** a hint is not a hidden answer; record its use. Hints progress from minimal cue → sentence frame → model, but model use makes that attempt guided rather than independent.

**Feedback:** show what communicated successfully, one high-leverage correction with a natural phrase, and one active next attempt. Avoid exhaustive red-pen marking.

**Session recap:** observed can-do evidence, one recurrent weakness, review cue and rationale for the next lesson. Surface `Saved`, `Not saved` or `Write verification pending` accurately.

## Required seven-minute lesson layout

A structured lesson must display these blocks in order, with a total planned effort of **no more than seven minutes**:

1. **Topic / can-do objective:** what this lesson is about, and where this English is useful.
2. **Grammar / language rule:** the specific target pattern with one simple, natural worked example distinct from the exercise answers. For vocabulary, reading or pronunciation goals, use the corresponding meaning/use/phonetic rule without inventing a grammar requirement.
3. **Varied exercises:** choose count from the learner's private preference, range 1–5, recommended 3–5; default four only if the content fits. Mix meaningful controls (e.g. gap completion, short choice, sentence building/order, realistic free production). Make at least one item a contextually meaningful response when suitable. Vary dominant task type from lesson to lesson based on the skill and recent task history, not at random.
4. **Vocabulary recap:** **at the end of the lesson**, typically 4–8 high-utility items/chunks with simple meanings or examples. This recap must not function as a visible answer key.
5. **One Submit:** capture the answers in one combined form; after submission the assistant reviews the whole lesson and records only the consented observations.

Avoid a one-question-per-message loop, especially during diagnosis. Diagnosis uses a short broad sampling of accessible modalities and moves on after at most one clarification per difficult construction.

**Format availability:** a sortable card/drag surface requires a working accessible keyboard/touch/selectable ordering alternative. A picture-identification task requires a real relevant picture; do not show a decorative image and pretend it tested comprehension. Audio and speaking only count when actual relevant audio/voice is available. A text-response fallback must be labelled text evidence, never speaking/pronunciation/listening evidence.

## Meaningful activity types

| Learning operation | Native treatment | Evidence recorded |
| --- | --- | --- |
| Retrieval of a useful chunk | Short text answer | Recall accuracy, prompts used |
| Grammar meaning contrast | 2–4 well-defined options + "why" when useful | Recognition; not speech |
| Sentence construction | Word-order builder or controlled text fallback | Guided structural use |
| Authentic expression | Free response in a real situation | Independent typed production |
| Conversation / role-play | Natural back-and-forth chat | Text interaction, repair strategies |
| Reading comprehension | Real passage + evidence-based questions | Text comprehension |
| Listening comprehension | Actual accessible audio + questions | Audio comprehension only when audio exists |
| Pronunciation | Accessible real recorded speech, only with suitable tooling | No pronunciation claim from typed text |

Vary activity type *to test a distinct skill*, not to make screens arbitrarily different. A free conversation can be entirely text chat and still be valid.

## Interface failure cases

- **No native widget:** use a natural text prompt with stable activity reference; do not block learning.
- **No Drive connection:** allow temporary practice, explicitly marking all attempts unsaved.
- **Invalid or stale lesson:** read private Activities and current plan again, then regenerate; don't blindly accept the user's JSON.
- **Interrupted exercise:** keep an understandable continuation prompt and do not claim an unsubmitted activity was assessed.
- **User requests raw answer deletion:** do not add that text to public documentation, tests or repository issues.
- **Screen reader / phone:** avoid drag-only mechanics and controls dependent on hover; offer an equivalent typed response.

## Acceptance examples (fictional)

- A beginner choosing casual communication gets small comprehensible steps, not a preloaded professional B2 syllabus.
- A proficient learner requesting interviews gets challenging follow-ups, not a mandatory five-question placement quiz.
- A user whose last response was partial sees a corrected model and a **different** independent situation for retry.
- A user changing goals sees a revised plan that preserves their prior evidence without claiming "mastery".
- Reopening a new chat from the same configured project should load the precise private state or explicitly say it cannot.
