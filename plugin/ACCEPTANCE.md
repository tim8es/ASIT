# ASIT v0.2.3 private plugin — manual acceptance scenarios

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
| 19 | I keep forgetting is/are | After two independent errors, switch operation; do not issue another near-identical translation |
| 20 | Four-task picture-based apartment lesson | Story with one communicative mission, at least 3 operations, image supplies actual task evidence |
| 21 | ELLLO listening lesson about articles | Verified exact source and duration, in-lesson comprehension questions, hearing-mode self-report, one Submit |
| 22 | Enable Google Sheets progress saving | Google Drive availability/authorization check, explicit summary_only/raw choice, verified workbook readback |
| 23 | Pause ASIT progress saving | Stop ASIT writes; no Google Drive app uninstall; no claim of cross-chat pause without verified Config |
| 24 | Install or disable Google Drive plugin | User guided through ChatGPT plugin installation/settings or real suggestion; no fake automation or claimed success |

## v0.2 responsiveness and speed checks

- [ ] A normal full structured lesson displays a relevant visual when supported (or explicitly sensible text-only fallback); cover does not replace a graded task.
- [ ] Each unambiguous native choice displays provisional Correct + why or Try again + non-spoiler clue immediately after selection, **not** before interaction.
- [ ] Changing a choice retains the first try, revisions and hint exposure where capture works; Reset must not count as an independent first success.
- [ ] Free writing and plausible synonyms do not receive false string-matching grades; one real Submit performs trusted assessment.
- [ ] Text-only or quick grammar explanations do not load UI/media references, scan GitHub, search audio or read full learner history.
- [ ] Image unavailable: the task has an accessible fallback, visual evidence is not claimed.
- [ ] Audio not heard: listening stays not_assessed, even with a completed question form.
- [ ] Unanswered required free writing keeps the lesson incomplete; saved state is reported only after provider readback.

## Dogfooding regression acceptance (2026-10-16)

- [ ] A learner repeatedly omitting is/are receives at least one NEW operation, e.g. error detection or image-grounded repair, within the next attempt; no unbounded translation loop.
- [ ] Native lesson supports a real-world mission, meaningful scene and independent final communication; an illustrative cover is not scored as image comprehension.
- [ ] Source-specific ELLLO questions follow a verified individual audio track, not a generic page link. Unknown duration/audio playback is not_assessed.
- [ ] First response versus corrected/assisted answer remains distinct. A correct after-feedback option is not independent CEFR evidence.
- [ ] When Google Drive is installed but account authentication or workbook is missing, no false saved/connected claim is displayed.
- [ ] Off/summary_only/raw in-chat ASIT settings are separate from actual ChatGPT plugin installation and provider authorization.
- [ ] Accessibility, button behavior, audio on mobile and true provider readback require manual web/mobile validation.

## QA tiers

- **Package validation**: syntax, paths, 18-pattern registry, schema/consent markers and no MCP configuration.
- **Host QA**: implicit skill routing, native single Submit, source playback on learner's actual device, Drive connection/permission, real readback and cross-chat continuation. These are not established by ZIP/package tests.
- **Upgrade QA**: compare outputs and behavior against ASIT Project + GitHub baseline before replacing that working setup. Source repo remains untouched by the plugin build; this plugin is a separate version.

## v0.2.4 persistent-state regression checks
- [ ] Existing five-key Config remains readable with legacy `audio_transcript_consent=false`; new audio consent defaults off and CEFR confidence unassessed until permitted repair.
- [ ] Read-only integrity scanner identifies orphan activity/attempt references and unknown attempt privacy without guessing IDs or exposing answer text.
- [ ] Repair plan appends only missing keys; no automatic writes or destructive migration for a previously populated workbook.
- [ ] On first setup, Config contains schema_version, state_revision, learner_id, target_language, recording_consent, audio_consent=false, cefr_confidence_label=unassessed, all valid JSON, and exact verified readback.
- [ ] No identity or consent => no user workbook writes; malformed existing workbook => inspection/permissioned repair, never destructive overwrite.
- [ ] One Submit with recognition, writing, and listening produces distinct trusted Activities/Attempts; unheard audio remains not_assessed.
- [ ] Summary-only mode never writes verbatim answers or first-response text to Events; first-try metadata is explicitly unverified.
- [ ] Attempt readback succeeds but Sessions/Reviews update fails => Partial sync, not fully saved.
- [ ] Google Drive account connected but missing writable workbook => not initialized; install state is separate from learner storage.
- [ ] Brand-new chat can restore active goal, focus, review queue and privacy mode through bounded live reads; no memory-based fiction.
- [ ] Pausing ASIT saving prevents new writes without disabling/uninstalling Google Drive or deleting history.
- [ ] Test actual provider readback and web/mobile UI outside CI; offline source tests alone do not establish these outcomes.
