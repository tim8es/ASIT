---
name: asit-lessons
description: "Plans and renders learner-preference-aware ASIT lessons with verified media, rubric integrity, vetted native UI families and consented Save Gate preflight."
---

# ASIT lessons — pedagogical planner v0.3.6

Every **full** lesson, including unprompted "Продолжим" and post-Submit continuation, must load [rich default](references/rich-default-lesson.md), [lesson-quality gate](references/lesson-quality-gate.md), [answer integrity](references/answer-integrity.md) and [one authoritative UI contract](../asit-exercises/references/ui-contract.md). Use [UI families](../asit-exercises/references/ui-families.md) to select a realistic native format, rather than copying the same SVG game to every lesson. Task-relevant interactive visual experience is the default **when appropriate**. Explicit text-only/low-bandwidth/accessibility overrides remain respected.

1. Decide just one observable can-do, learner's actual duration/count preferences, genuine modality and accessible client affordances. Default ~7 minutes/5 scored tasks only if unconfigured. Respect verified learning history; no invented skill level.
2. Make one coherent story/outcome and distinct operation inventory. Five-task default: ≥3 distinct cognitive operations, ≤2 pure MCQ, one fresh independent communication item (short/optional after deliberate skips). For text comprehension/editing, use reading_reasoning or communication_mission rather than irrelevant image/SVG. When spatial/visual, the scene supplies evidence and responds meaningfully.
3. Before any Activity write, validate source images per [media provenance](references/media-provenance.md), suitable listening via `asit-media` for explicit/appropriate 15+ minute sessions, and answer leak check. Missing authentic media requires changed task + rubric + modality **before** preregistration, not fabricated refs or faux Play.
4. Freeze distinct stable Activity IDs/rubrics for all graded tasks; if storage consented, check Google Sheets identity/schema/Config, pre-register/readback all Activities **before** UI; if unavailable clearly show UNSAVED practice, never fake sync.
5. Render functional full UI per `asit-exercises`: goal, brief RU strategy and nonspoiler vocabulary, native controls, Cards/All shared state, correct local finite feedback, single canonical Submit with working early finish. Semantic original writing is reviewed only after Submit. No screenshots or external HTML prototype treated as executable.
6. On submitted answer, `asit-assessment` owns validation, grading, consented Save Gate and optional one full successor lesson in the same turn. Re-evaluate separate next-lesson Activity preflight. Limit narrow remediation to two cycles; rotate operation/family.

**Acceptance:** [lesson quality gate](references/lesson-quality-gate.md) before registration AND before rendering. No actual source = no photographic evidence. No actual sound/hearing = no listening evidence. No client-side state change = no claimed dynamic interaction. Developer tests are offline and do not execute within the Skills-only tutor.
