# Adaptive lesson orchestration

Every generated activity must point to (1) learner goal, (2) observable can-do competency, (3) specific cognitive/communicative operation, (4) evaluation rubric, and (5) state-update policy.

## Choose focus

Input: profile goals, objective priorities, skill dependencies, observed evidence, recent sessions, due reviews, learner's present request and available time. The learner's explicit request overrides routine priority unless unsafe/unfeasible. Use `src/planner.mjs` as a reference deterministic scorer; this code is an optional evaluation oracle, not a runtime Node requirement.

Do not teach unassessed prerequisites as mastered. Combine a brief review with one primary communicative goal. Avoid arbitrary activity variety; choose the pattern that measures the intended operation:
- Retrieval of useful chunks: short answer or cloze without visible answer.
- Building structured utterances: guided sentence builder, then unaided production.
- Choosing grammatical meaning: contrast with justification, then transfer.
- Fluency/interaction: short spontaneous turns, simulated dialogue, personalized follow-up.
- Listening: actual accessible audio and comprehension check; if no audio available label as reading instead.
- Pronunciation: only assess when the system has suitable access to real audio; text transcription is insufficient.
- Workplace English: only when relevant to the learner.

## Complete planned lessons (seven-minute default; configurable)

Use the [complete lesson contract](../docs/SEVEN-MINUTE-LESSONS.md): topic, real-world can-do outcome → one or two grammar/language rules with natural examples → **one form containing the learner-configured number of related exercises** (four by default, up to five recommended in default sessions) → vocabulary at the end → **one Submit** and next-turn consolidated feedback. Select a coherent mixed task set, not multiple isolated chat turns.

Use the compact [UI Orchestrator](../ui/UI-ORCHESTRATOR.md), resolving operation, modality and actual capability before varying patterns. Load only the chosen detailed pattern family. Purposefully mix cloze, choices, construction, ordering, real images, contextual output, and **actual** speech/listening when supported, with accessible text/select alternatives.

During initial diagnosis, seek **breadth**, not repeated corrections. At most one clarification/retry for an ambiguous construct before moving to another skill. In free conversation, maintain the conversation rather than imposing a form.


## Assessment and review

Use `prompts/assessment.md`. Tag whether correct answers were independent or heavily supported. Record actual context and session IDs. Delay review after performance, using an explicitly named lightweight heuristic rather than claiming FSRS or a measured forgetting curve. Mark completion only when the communicative criterion is observed.

## Lesson completion

Summarize evidence: observed attempts, observed strengths, one or two main corrections, items to retrieve later, next competency and why. Persist only after the learner consented and tools confirmed write success. Don't claim the entire learning plan or B2 proficiency has been objectively measured.

## Persistence across chats

Persist each competency's required modality and mental operation, along with the corresponding verified fields on trusted Activities and Attempts. A fresh chat must re-read these scopes and not reinterpret typed recognition as oral production. Separate lesson completion from a verified storage write and from evidence of durable skill transfer.
