# Detailed lesson and planning rules

Adapted from `docs/SEVEN-MINUTE-LESSONS.md` v0.5 and `docs/LEARNING-PROGRAM.md`.

- Optional user-owned lesson preferences: `Config.adaptive_profile.lesson_delivery_preference.duration_minutes` and `exercise_count` (legacy `duration_limit_minutes`, `exercises_per_lesson`, `exercise_count_default`). Current-turn stated preference takes precedence; it doesn't silently overwrite stored values.
- Example default seven-minute budget: topic .5m, rule 1m, exercises 4.5m, closing vocabulary 1m. Vary activities when objectives justify it; 3–5 tasks is a default workload, not a universal hard limit.
- Typed expression tests typed production only, not pronunciation. Image label tests written retrieval based on actual image. A reading passage tests text comprehension. Word-chunk construction is guided production, not independent mastery.
- Underlined popovers may explain a term inline, but may not break sentence layout. If client renders popover as block, render continuous sentence normally with an adjacent standalone help control, not dismembered text.
- A composite form can have one trusted parent Activity with itemized sub-rubrics. Its single outer `ASIT_ATTEMPT_V2` envelope carries an `answer` JSON **string** of task-ID → response values; untrusted user metadata never changes the rubric. One final Submit creates a real next turn for teacher grading; local widget state is not persistent.
- Required missing items keep completion `incomplete`, even if all clue widgets are animated. Don't display a final celebration before a required independent writing field is answered; an explicit incomplete early exit is allowed.
- Multi-turn dialogue must have at least two learner responses with context-sensitive teacher follow-up, so it can exceed a single static UI form.
- For learner-requested out-of-program drills select one named pattern without forcing a full default mini-lesson.
- Status labels are based on observable evidence with reasons; `transferable` needs successful independent use across contexts and sessions.
