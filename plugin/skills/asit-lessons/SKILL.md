---
name: asit-lessons
description: "Plan complete ASIT lessons from verified goals, with task-specific rubrics and gated persistence; delegates native UI."
---

# ASIT lessons — lean planner (v0.3.10)

Use for a **complete lesson**, not every short correction. Start with `asit-statekeeper`'s verified bounded preferences/evidence when available; `asit-core` selects can-do and pacing, `asit-english` provides trusted task-specific language rubrics. Use [rich default](references/rich-default-lesson.md), [answer integrity](references/answer-integrity.md) and [lesson quality gate](references/lesson-quality-gate.md) for the full lesson. Consult [Creative Director](../asit-creative-director/SKILL.md) and its quality gate; task-relevant imagery, not decorative quotas.

1. Plan one coherent communicative scenario. Default ~7 minutes and five graded tasks **only if** the learner did not choose duration/count; aim for at least three cognitive operations, at most two pure MCQs, and a fresh-context application. Explicit drill requests may be shorter.
2. Select actual modality and supported [UI family](../asit-exercises/references/ui-families.md). Validate sourced media and no answer leakage. Freeze task IDs, rubric/variants, competency, modality, operation and parent Attempt ID **once** before writes or presentation.
3. For active authorized `summary_only|raw` consent, call the canonical [Save Gate](../asit-progress/references/storage-v2.md) for exact per-subtask Activity registration and readback **before UI**. If blocked, do not show an unregistered graded lesson without an explicit offline choice. With `off` or explicitly offline, label practice as unsaved.
4. Delegate native lesson rendering to `asit-exercises`, whose [UI contract](../asit-exercises/references/ui-contract.md) is authoritative. The large `complete-native-lesson.md` exemplar is **optional** and only for a genuinely matching complex visual multi-card UI, not a default mandatory load. Keep one final `ASIT_ATTEMPT_V2` Submit; grade in `asit-assessment`.

Do not change registered rubrics retrospectively, infer client image/audio rendering or introduce a second saving implementation.
