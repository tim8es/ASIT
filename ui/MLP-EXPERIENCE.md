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

**Lesson header:** communicative target, task index, short contextual hint, optional expected effort (as a plan, not measured time). No artificial XP, decorative badges, simulated completion bars or unverified proficiency percentages.

**Task surface:** one primary prompt. Optional passage/context appears only when it is necessary. Give input controls with accessible labels. When choice options have ambiguous correct answers, rewrite the question.

**Support:** a hint is not a hidden answer; record its use. Hints progress from minimal cue → sentence frame → model, but model use makes that attempt guided rather than independent.

**Feedback:** show what communicated successfully, one high-leverage correction with a natural phrase, and one active next attempt. Avoid exhaustive red-pen marking.

**Session recap:** observed can-do evidence, one recurrent weakness, review cue and rationale for the next lesson. Surface `Saved`, `Not saved` or `Write verification pending` accurately.

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
