# Practical native lesson patterns

The rendering is handled by ChatGPT's built-in interface system, not by this repository. These are **instructions for the teaching agent**, not a distributable React library.

## Guided text production

Show a short relevant real-world prompt, an editable input and Submit. Keep the submitted raw input in UI state only until the user clicks Submit. Build `ASIT_ATTEMPT_V2` with current IDs, attempt number and hint use; then initiate a new turn. Disable blank submission. If the student needs a cue, record `hint_level` accordingly. Evaluate and persist only in the subsequent chat turn.

## Choice and explanation

Use a radio/segmented control for two or three meaningful options, then a short optional rationale field. Treat answer as a structured JSON string if needed; the evaluation distinguishes whether the learner selected a correct choice or justified it. Do not infer productive speaking from multiple choice.

## Sentence construction

If drag-and-drop is unsupported, use click-to-order or a controlled input. Keep the next task unaided to verify independent application. Never make a flashy widget the only accessibility path.

## Conversational role-play

Use multiple natural chat turns, preserve flow and defer corrections, then summarize observed communicative evidence. Keep transient dialogue private within the lesson. Distinguish text interaction from pronunciation assessment.

## Review and progress

Progress Explorer visualizes reported evidence and confidence labels, not fake percentage mastery or uncalibrated predictions. Only display data actually retrieved from the private workbook.

## Failure handling

If interface cannot display, offer equivalent text exercise in the next ChatGPT turn. If native UI submit fails, preserve the learner's draft and provide text reply instructions; never state cloud persistence succeeded before verified connector write/readback.

## Instant objective feedback and image-word retrieval

For clear right/wrong tasks (choice, fixed past form, completed ordered word cards, finite image labels), use controlled native input state to display `Correct` or `Try again` immediately after interaction. Remember the *first* answer, later changes and whether a cue was exposed. Still use one Submit and re-evaluate against the persisted trusted rubric. Do not auto-grade unrestricted writing, plausible synonyms or open dialogue by string comparison. Never save from the widget.

For image vocabulary, render a **real image directly above an input field**; typing the word assesses visually prompted written recall, not spontaneous speaking or writing. Render a textual fallback if the actual image is unavailable and distinguish that evidence. Underlined words can open **inline popovers** with explanations; they cannot independently open a parallel ChatGPT chat.

## Continuous story text and popover fallback

Do not split one grammatical sentence across block-level text/popover layouts. The sentence `The guard left a security log before disappearing from the station.` must display as one normal paragraph. Prefer a genuinely inline native popover; if it causes hard line breaks, render the full sentence as plain text and provide a separate underlined tappable `security log` explanation *after* the sentence. No broken sentence fragments, even on mobile.

## Missing required answer and completion gating

Treat each trusted subtask independently. Blank final independent writing is `not_assessed`, never `correct` or `incorrect`. Show an explicit `4/5 tasks answered — incomplete` status if only four of five were submitted, even if all four objective clues were correct. Keep the winning/mission-complete scene locked until **all required responses are present**. A learner may opt to finish early: after an explicit skip/incomplete acknowledgement send the **same one Submit**, preserve answers, mark incomplete, and offer resume later. The rubric, not widget-local status, decides the actual assessment.
