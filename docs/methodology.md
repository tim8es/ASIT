# Pedagogical architecture — evidence-informed, not pseudo-scientific

ASIT builds an individual curriculum from **learner-specific communicative goals** rather than a global fixed topic sequence.

## Source-informed principles

1. **CEFR Companion Volume (Council of Europe, 2020)**: use communicative can-do outcomes, not merely textbook completion. [Official CEFR descriptor collection](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors).
2. **Task-based practice**: make the learner achieve a communicative result in a realistic scenario, then address the language needed to do so.
3. **Retrieval and spaced revisiting**: prefer meaningful recall and later reuse of valuable chunks to repeated passive exposure. Early version uses an intentionally simple review interval heuristic; it is **not FSRS** and does not claim an experimentally calibrated forgetting probability.
4. **Corrective feedback + retry**: focus on a small set of observed errors, allow another attempt, and look for unaided transfer in a new context.
5. **Formative assessment**: record prompt, hints, response, context and rationale; never infer a full CEFR proficiency from a few attempts.

Literature-backed recommendations may vary by population and task. The first ASIT release does not claim experimental educational superiority.

## Curriculum layers

\`\`\`text
Learner goal
  → communicating can-do competency (+ dependencies)
    → prioritized unit in learning path
      → lesson blueprint
        → activity with rubric
          → observed attempt
            → revised evidence and review schedule
\`\`\`

The model chooses content and UI based on observed level, personal needs and requested conversation, not random widget variety.

## Skill-state labels

\`unassessed\`, \`emerging\`, \`supported\`, \`independent\`, \`transferable\` are working qualitative labels. The code demonstrates a conservative evidence requirement for transfer (two independent contexts across sessions). This is **not official certification or a calibrated mastery score**.

## Adaptive practice

- Fewer than 7 minutes: a short retrieval prompt, one communicative task, feedback and retry.
- Normal session: recall, short check, model, controlled, guided and independent production, selective feedback and retry.
- When struggling: minimal cue → frame → partial model → full model; log support used.
- When fluent: reduce hints, vary contexts, increase length/complexity, then probe spontaneous communication.
- A free conversation is not automatically transformed into a sequence of quizzes.
- Listening and pronunciation need accessible genuine audio; text can't establish these modalities.

## Future validation

Run blinded fictional scenario comparisons and then consented longitudinal learner outcome evaluations. Report progress with uncertainty. External teaching claims should not be asserted solely from unit tests.
