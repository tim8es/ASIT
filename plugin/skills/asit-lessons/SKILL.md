---
name: asit-lessons
description: "Use when ASIT should teach or continue an English mini-lesson, build an adaptive English study plan, drill grammar in context, practice a named language skill, or choose the next lesson from observed performance."
---

# ASIT lesson planner and teaching loop

Use **one** current communicative `can-do` target grounded in learner intent and actual evidence. When the learner asks for a particular format/topic outside the program, honor it without overwriting their plan. Consult `asit-progress` only for verified accessible state; otherwise teach unsaved. For the exercise UI load `asit-exercises`, for authentic media `asit-media`, for dialogue/Voice `asit-voice`, and after Submit `asit-assessment`.

## Planned mini-lesson contract

Default **seven minutes**, **four related exercises** (up to five recommended for the default session), configurable by the learner's explicit request or private available preference. Respect the chosen budget, not a hard-coded cap. Present in **one response**:

1. Topic, real situation, concrete outcome and estimated duration.
2. One/two relevant grammar or language rules with natural use; for reading/listening focus substitute a **relevant comprehension strategy**, not unrelated grammar.
3. One practice form with configured tasks (each target, operation, modality, trusted answer criterion, required flag). For 3+ tasks vary at least two meaningful patterns when pedagogically useful; keep the exercise set coherent.
4. **Vocabulary last**: 3–6 useful words or chunks with context; do not expose test answers.
5. **One final Submit**, consolidated feedback in the next ChatGPT assistant turn. For deterministic native choices/builders, show immediate provisional `Correct` / `Try again` feedback with an explanation or non-spoiler clue when controls support it; defer free writing and ambiguous answers. Feedback is not a saved grade.

If a real conversational segment spans multiple turns, use natural dialogue and do not pretend it was completed as a static single form. If a required blank remains, keep lesson incomplete; skipped tasks `not_assessed`. The form's actual response must be sent as a real new chat turn, never an inert button.

## Adaptive progression

- Retrieve an earlier useful pattern briefly, introduce natural language only where needed, scaffold with cue → frame → model if struggling, then fade cues after unassisted success.
- Mix recognition, guided construction and independent use; final independent response should use language in a **new realistic context**.
- Compare first attempt, revised answer, help level and rubric outcome; do not infer mastery from animation, a successful multiple choice, or teacher demonstration.
- After a lesson, choose a small due-review queue tied to meaningful patterns and a sensible next can-do outcome. Review intervals are heuristics, not scientifically calibrated retention predictions.
- For diagnostics follow `asit-onboarding`'s breadth-first packet; avoid premature precise CEFR and no default occupational scenario.

## Lesson rendering quality gate

A full structured lesson should normally include a relevant visual cover or pedagogically useful visual (e.g. event timeline or picture prompt) when it can be rendered reliably without an unnecessary external search. Make the visual serve the task; never delay, substitute or fabricate audio to decorate a writing lesson. Don't force media into a requested text-only or short drill.

Before sending, verify topic and goal are clear; target rule/strategy matches exercises; each control is functional and accessible with text fallback; deterministic controls respond with meaningful local feedback, first tries can be distinguished from retries, required tasks are trackable; answer keys hidden until attempted; chosen duration realistic; vocabulary at end; one meaningful Submit; actual modality and storage status honest.

For nuanced rules see [planning details](references/lesson-rules.md).
