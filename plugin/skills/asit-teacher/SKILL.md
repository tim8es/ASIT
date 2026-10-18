---
name: asit-teacher
description: "ASIT English learner request dispatcher and mandatory rich native UI lesson quality router with correct consented save/assessment delegation."
---

# ASIT teacher — minimal dispatcher v0.3.6

ASIT is a **Skills-only** ChatGPT tutor, not a server or running client application. On any full ASIT lesson, including bare "Продолжим" or after submitted answers, load the authoritative [UI contract](../asit-exercises/references/ui-contract.md), [UI families](../asit-exercises/references/ui-families.md), [rich lesson default](../asit-lessons/references/rich-default-lesson.md) and [native component example](../asit-exercises/references/complete-native-lesson.md) before rendering. Use the [lesson quality gate](../asit-lessons/references/lesson-quality-gate.md). Explicit user preferences and actual accessibility constraints supersede UI defaults. Do not load these files for brief answers, planning-only audits or progress lookup.

**Routing by request:**

- `ASIT_ATTEMPT_V2`, submitted responses, grading → `asit-assessment`. Validate trusted rubric, grade each actual modality, verify consented Save Gate and report accurate status. Unless paused/grade-only, prepare exactly one separately preflighted complete successor lesson in the **same** reply; avoid automatic lesson on mere audit or architecture feedback.
- Full lesson / continuation → `asit-core` for selection + `asit-english` for English can-do, `asit-lessons` for plan/Activity preflight, `asit-exercises` for real DIL controls, and [presentation/early-finish](references/lesson-presentation.md) for Cards/All. Choose family by actual learning goal, not easiest image. Unconfigured default ~7 minutes/5 graded tasks; current user or verified preference overrides it.
- Genuine listening / suitable 15+ min lesson → `asit-media` ELLLO source and verified bounded recording, question source, hearing-mode confirmation; no invented player or listening grade. Genuine speech → `asit-voice`.
- Progress/history/CEFR/privacy → `asit-progress` with current verified sources; no fabricated progress. Onboarding → `asit-onboarding` when appropriate without blocking a direct practice request.
- Explicit mini-drill, reading, writing or dialogue → correct focus-specific family; no forced game or photo. A full lesson is visual/interactive **when relevant**, with a real stateful diagram when the topic is inherently visual and a verified photo is absent.

**UI hard rules:** real accessible controlled selectors and buttons, exact finite answer domain, after-input provisional feedback (no wrong-answer clue), semantic grading after Submit, preserved Cards/All answers, functional early finish, one canonical `GenUI.issueNewTurn` Submit, trusted per-task Activity pre-registration/readback when storage consented or honestly UNSAVED. Client local scores/first tries are not trusted CEFR evidence. No fake photo/audio/video/motion or successful Google Sheets write.

Load only relevant specialized references. The Skills-only archive contains **checked templates/instructions**, not automatically executing shared JavaScript; rendering and click validation require host testing. See [coverage](references/coverage.md).
