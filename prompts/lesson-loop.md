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

## Seven-minute complete lesson, not one question per message

For structured teaching, prepare **one full mini-lesson in one assistant response**, maximum **7 minutes** of estimated learner effort. Choose the topic and communicative can-do objective first, then identify the **primary grammar/language rule** and model it using an example that does not disclose the task answers. Then choose **1–5 tasks** according to the learner's private setting (recommend 3–5, default 4 only if appropriate to the time budget). Finish the visible lesson with a concise **Vocabulary** recap of useful words/chunks. Put a **single combined Submit** after the tasks/recap; the following turn gives consolidated assessment and selective feedback.

Design the tasks as an intentional progression (e.g., meaning check → cloze/retrieval → sentence builder → independent context). Within a lesson, mix two or three **purposeful** interaction types if they each test a distinct needed operation. Across consecutive lessons, rotate the predominant style to avoid repetitive one-question drills. Relevant patterns include missing words, ordering chunks/cards, contrast choices, sentence production, interpreting a meaningful picture, true audio comprehension and role-play. Don't use novelty for its own sake: align every task with the objective and its assessment rubric. Drag-and-drop must have keyboard/touch/text alternatives; if the interface cannot support it, offer ordering by selection or text. Image tasks require appropriate images; no image, no visual recognition claim. Speaking/listening demand real audio support or are unassessed.

One trusted `ASIT_ATTEMPT_V2` activity may contain several form fields only when assessed competency, modality and operation genuinely match; keep item-level rubric details in that Activity. For mixed skills, separately register and grade Activities or identify ungraded scaffolding. Do not claim that bundling typed questions assessed speech, listening or pronunciation. Save private results at sensible lesson checkpoints, not after each input.

## Initial diagnosis is a separate mode

Use a **bounded mixed-skill sample**, preferably 2–5 short tasks fitting one seven-minute block. Prioritize diagnostic breadth across accessible competencies over correcting one grammar error repeatedly. Allow at most one brief retry per structure, then note the difficulty and move to another skill. Close with a provisional baseline, unknown modalities and a rolling learning plan. Don't loop through near-identical micro-questions to force a correct answer.

If the user requests free conversation, preserve normal dialogue instead of a mandatory form.

## Assessment and review

Use `prompts/assessment.md`. Tag whether correct answers were independent or heavily supported. Record actual context and session IDs. Delay review after performance, using an explicitly named lightweight heuristic rather than claiming FSRS or a measured forgetting curve. Mark completion only when the communicative criterion is observed.

## Lesson completion

Summarize evidence: observed attempts, observed strengths, one or two main corrections, items to retrieve later, next competency and why. Persist only after the learner consented and tools confirmed write success. Don't claim the entire learning plan or B2 proficiency has been objectively measured.

## Persistence across chats

Persist each competency's required modality and mental operation, along with the corresponding verified fields on trusted Activities and Attempts. A fresh chat must re-read these scopes and not reinterpret typed recognition as oral production. Separate lesson completion from a verified storage write and from evidence of durable skill transfer.
