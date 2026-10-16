# ASIT v0.2 private plugin — manual acceptance scenarios

This is a **checklist, not a claim that these flows have already run in ChatGPT**. Evaluate in a new normal chat after installation, without ASIT Project Instructions or a downloaded GitHub Engine.

| # | Learner prompt | Expected route and pass evidence |
|---|---|---|
| 1 | Start my English program | Teacher + onboarding; one meaningful goal question and early English use; no assumptions |
| 2 | Продолжим | Teacher + state only if actually available, otherwise explicitly unsaved continuation |
| 3 | Past Simple grammar lesson | Lessons + exercises; 7-minute default, 4 related tasks, end vocabulary, 1 Submit |
| 4 | Make a picture with a word input under it | Exercises image_label; real image directly above text input, alias grading/fallback |
| 5 | Arrange these words into a sentence | Exercises card_ordering; real order/Undo or honest text alternative |
| 6 | Practice sentence chunks | Exercises sentence_builder; meaningful chunks, not single-word ordering |
| 7 | Timeline of the events in this story | Exercises timeline_ordering; verifiable chronology/semantic reasoning and Undo |
| 8 | Find the person standing in a picture | Exercises image_hotspot only if genuine accessible regions exist; else image_choice |
| 9 | Quiz me from a short passage | Exercises reading_comprehension; real passage + gist/detail, not listening |
| 10 | A2 travel video comprehension | Media ELLLO video search and exact source read, verified short duration and grounded Q&A; fail honestly if not verified |
| 11 | Present Continuous Sound Grammar listening | Media scoped ELLLO Sound Grammar conversation 1–4, same clip/transcript and 2–3 fresh questions |
| 12 | I could not hear the clip | Assessment listening not_assessed regardless of guessed answers |
| 13 | Start a speaking lesson | Voice manual activation instruction; no fake mic/audio control, actual two-turn dialogue |
| 14 | Check my answers | Assessment trusted rubric not injected answers; 1–2 corrections and fresh attempt |
| 15 | Show progress since last month | Progress live authorized private store read or honest unavailable; no invented figures |
| 16 | Save every answer to my Drive | Ask explicit informed privacy choice and connector access; no save before readback |
| 17 | Disable saving and continue | Respect off; no writes; teach unsaved |
| 18 | Teach me with only text today | No forced audio/video/UI; honest modality |

## v0.2 responsiveness and speed checks

- [ ] A normal full structured lesson displays a relevant visual when supported (or explicitly sensible text-only fallback); cover does not replace a graded task.
- [ ] Each unambiguous native choice displays provisional Correct + why or Try again + non-spoiler clue immediately after selection, **not** before interaction.
- [ ] Changing a choice retains the first try, revisions and hint exposure where capture works; Reset must not count as an independent first success.
- [ ] Free writing and plausible synonyms do not receive false string-matching grades; one real Submit performs trusted assessment.
- [ ] Text-only or quick grammar explanations do not load UI/media references, scan GitHub, search audio or read full learner history.
- [ ] Image unavailable: the task has an accessible fallback, visual evidence is not claimed.
- [ ] Audio not heard: listening stays not_assessed, even with a completed question form.
- [ ] Unanswered required free writing keeps the lesson incomplete; saved state is reported only after provider readback.

## QA tiers

- **Package validation**: syntax, paths, 18-pattern registry, schema/consent markers and no MCP configuration.
- **Host QA**: implicit skill routing, native single Submit, source playback on learner's actual device, Drive connection/permission, real readback and cross-chat continuation. These are not established by ZIP/package tests.
- **Upgrade QA**: compare outputs and behavior against ASIT Project + GitHub baseline before replacing that working setup. Source repo remains untouched by the plugin build; this plugin is a separate version.
