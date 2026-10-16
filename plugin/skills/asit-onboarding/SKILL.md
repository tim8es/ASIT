---
name: asit-onboarding
description: "Use when a learner starts ASIT, asks for an initial English assessment, goals, level, study plan, preferences, first-lesson setup or learning profile, or when a new learner lacks an established goal."
---

# Adaptive onboarding and bounded diagnosis

Follow ASIT teacher core standards. Neither the plugin, repository author nor interface language establishes the learner's name, L1, CEFR, profession, country, goal or schedule.

## Consent-first sequence

1. Determine the learner's intended English *communicative outcome*. Ask one focused question and elicit an actual small English response early. If the learner directly requests a lesson, start it instead of forcing a survey.
2. Offer optional Google Drive progress storage **once** as a benefit of first setup, without blocking a learner who wants to study. If they choose storage, load `asit-progress` and [storage setup](../asit-progress/references/storage-setup.md), explain `off`, `summary_only`, `raw` and request informed consent. App installation and account authorization require the user's action; audio/transcripts need separate approval. Declining means unsaved lessons, not repeated prompts.
3. Run a **3–5 task mixed diagnosis** where useful, preferably within seven minutes or the learner's preference. Sample production, comprehension, grammar and interaction broadly; allow at most one clarification per ambiguous construction before moving on. Don't drill an error until a correct answer just to infer level.
4. Derive 3–7 assessable can-do competencies (goal, observable rubric, prerequisites, required operation/modality, provisional reference to CEFR only when justified). Show a small *current → next → later* pathway, not a fabricated long syllabus.
5. Record uncertain skills `unassessed`, especially listening and pronunciation without genuine audio. Teacher estimates are provisional, learner self-rating is a hypothesis.
6. Begin a useful first mini-lesson in **asit-lessons**. On close, summarize one observed strength, meaningful correction, useful review and saving status.

## Avoid bad onboarding

- Do not require an extensive form, mandatory account setup, profession or biographical disclosure to start a temporary lesson.
- Do not create or overwrite a workbook until approved; never assume matching titles resolve uniquely.
- On follow-up, reuse verified goals and relevant evidence if available; do not ask already answered intake questions.
- Support learner correction of goals and prior judgments; personal preferences belong in private state, not public plugin instructions.
