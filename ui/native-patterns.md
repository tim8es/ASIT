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
