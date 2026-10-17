---
name: asit-english
description: "Use when ASIT plans, grades or reports English learning: communicative objectives, language-specific rubrics, CEFR evidence, ELLLO listening and valid observed modalities."
---

# ASIT English — subject adapter (v0.3.0 candidate)

Load for English-specific pedagogy and evaluation, **not** for generic routing, database writes or another discipline. `asit-core` owns the general learning cycle; `asit-lessons` owns rendering, `asit-assessment` owns Submit/grading coordination, `asit-progress` owns consented persistence.

## English task contract

- Select a communicative, observable `can-do` outcome and learner-relevant scenario. [Illustrative can-do starters](references/can-do-starters.md) are examples only, not a certified syllabus or observed learner history.
- Supply grammar/lexical/pragmatic focus, task-specific trusted rubric and plausible accepted variants **before** presentation; separate guided recognition, construction, independent writing, genuine listening, speech and interaction. A copied model sentence is not independent transfer.
- Follow answer-integrity preflight: avoid giving independent answers through narrative, captions, vocabulary or earlier questions. Use a fresh context for unassisted communication; respond with focused explanation and corrective feedback.
- Actual ELLLO / Sound Grammar media must be accessible and verified with `asit-media`; no inferred listening from transcript or text. Speaking requires genuine supported `asit-voice` interaction, not a text box.
- For CEFR-aligned evaluations/reports, use [CEFR evidence rules](../asit-progress/references/cefr-analytics.md) with verified official descriptors, operation/modality and longitudinal evidence. Task grade and confidence are not an official CEFR level. Reading, listening, writing, spoken production and interaction must be assessed independently; missing dimensions remain `unassessed`.

This adapter adds **no new workbook tabs**, CEFR fields, learner state or mandatory storage. Other subjects must supply their own validity rules; never recycle English CEFR as a universal scale.
