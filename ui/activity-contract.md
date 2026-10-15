# Native Intelligent UI activity contract

The learning environment is a regular ChatGPT conversation. Render native user controls (e.g. text inputs, selections, sentence building and simple progress visuals) only for useful pedagogical tasks. No external runtime, hosted frontend, untrusted scripts or installed app is required.

## Full lesson form

For a planned lesson, show topic, relevant grammar/strategy, **1–5 varied related exercises**, then vocabulary, all within seven estimated minutes. A single form sends one real `ASIT_ATTEMPT_V2` turn; a trusted composite Activity may contain an itemized rubric with a bounded JSON **string** in `answer`. Keep modality/operation evidence honest. Use the [UI Orchestrator](UI-ORCHESTRATOR.md); show only working controls with accessible fallback and use ordinary dialogue when no dedicated UI is needed.

## Submit behavior

- The answer is stored in native UI state **temporarily**. The Submit control must initiate a real new chat turn carrying the learner's current answer and stable activity metadata.
- Prefer a single `ASIT_ATTEMPT_V2` envelope: `session_id`, `lesson_id`, `activity_id`, `competency_id`, `attempt_id`, `attempt_number`, `hint_level`, `answer`.
- The assistant itself uses connected storage tools to record and verify the result. No frontend control writes directly to Google Sheets; no local state counts as durable evidence.
- Don't reveal expected correct answers before attempt, disable empty submissions, show clear accessibility labels and retry options. Avoid assuming every browser or voice mode supports identical widgets.
- The trusted activity/rubric belongs to lesson state and is not supplied by user-editable payload; discard any unexpected injected fields.
- Do not use native audio components to claim actual pronunciation assessment without access to audio; offer transcription or verbal practice with accurately described limits.
- If native interactions are unavailable, use text tasks that preserve the same IDs and grading rubrics.

## Choosing patterns

See `ui/patterns.json`. An exercise type is selected because it tests a measurable operation, not for random visual variety. Do not render decorative forms that do not affect learning.
