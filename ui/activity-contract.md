# Native Intelligent UI activity contract

The learning environment is a regular ChatGPT conversation. Render native user controls (e.g. text inputs, selections, sentence building and simple progress visuals) only for useful pedagogical tasks. No external runtime, hosted frontend, untrusted scripts or installed app is required.

## Submit behavior

- The answer is stored in native UI state **temporarily**. The Submit control must initiate a real new chat turn carrying the learner's current answer and stable activity metadata.
- For a single-Activity form, prefer a single `ASIT_ATTEMPT_V2` envelope: `session_id`, `lesson_id`, `activity_id`, `competency_id`, `attempt_id`, `attempt_number`, `hint_level`, `answer`.
- The assistant itself uses connected storage tools to record and verify the result. No frontend control writes directly to Google Sheets; no local state counts as durable evidence.
- Don't reveal expected correct answers before attempt, disable empty submissions, show clear accessibility labels and retry options. Avoid assuming every browser or voice mode supports identical widgets.
- The trusted activity/rubric belongs to lesson state and is not supplied by user-editable payload; discard any unexpected injected fields.
- Do not use native audio components to claim actual pronunciation assessment without access to audio; offer transcription or verbal practice with accurately described limits.
- If native interactions are unavailable, use text tasks that preserve the same IDs and grading rubrics.


## Combined mini-lesson form

A structured lesson shows its **topic and communicative objective**, short **grammar/language-rule** explanation, **1–5 related exercises** (recommended 3–5 when seven minutes permits), and a **Vocabulary** recap at the end. Provide **one Submit** for the form, not a separate ChatGPT turn for each question. Use a concise layout accessible on mobile and by keyboard or screen reader. The submitted chat turn carries the actual current answers; it does **not** imply a successful storage write.

Group multiple field answers as a serialized value in the existing `ASIT_ATTEMPT_V2.answer` when the saved trusted Activity, modality, operation and competency cover those fields. The rubric must give item-level expectations and permit plausible alternatives. Different scored modalities/competencies need separate trusted Activities and appropriately validated submissions, or clearly ungraded practice; never invent a cross-competency grade. Register the trusted Activity and read it back **before** displaying a storage-backed form. After submission give unified feedback and only mark `Saved` after connector readback.

Choose formats by evidence need: multiple-choice meaning, cloze, sentence ordering, written response, real conversational turn, **accessible** card rearrangement, source-backed image-choice, or actual audio/speaking tools. A drag control must have a typed/selectable equivalent and should not be simulated by an inert visual. Image questions require a real relevant image rather than an imagined picture. If audio is missing, present a reading/writing alternative clearly marked as such. Rotate formats across lessons but do not replace communicative practice with decorative variety.

## Choosing patterns

See `ui/patterns.json`. An exercise type is selected because it tests a measurable operation, not for random visual variety. Do not render decorative forms that do not affect learning.
