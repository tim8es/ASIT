# ASIT architecture — subject-neutral Core + English adapter

```text
Learner ↔ ChatGPT native UI ↔ asit-teacher (thin router)
                              ├─ asit-statekeeper → asit-progress (verified state)
                              ├─ asit-core + asit-english (adaptation and rubric)
                              ├─ asit-lessons → asit-creative-director
                              │                → asit-exercises → asit-media/voice
                              ├─ asit-assessment (sole Submit coordinator)
                              └─ asit-onboarding (explicit setup/consent)
```

**Responsibilities:** The 12 instruction skills are routed lazily, not installed services. Statekeeper supplies a bounded verified state snapshot; Creative Director reviews a lesson before rendering. Core chooses observable goal, pacing, scaffolding, independent transfer and review from verified evidence. A subject adapter supplies task-specific correct answers, accepted variants, modality, instructional materials and subject proficiency criteria. English is the first adapter. Teacher is a thin lazy dispatcher. The assessor alone grades final submitted tasks using trusted rubrics and applies the Save Gate; progress alone writes with consent and readback. ChatGPT renders actual supported UI.

**Compatibility:** Existing `ASIT_ATTEMPT_V2`, per-subtask Activity registration, grade and confidence vocabularies, Save Gate statuses, storage consent and nine Google Sheets v2 data tabs are unchanged. Neither Core nor the English adapter creates new storage fields or a dashboard. CEFR is not a universal learning scale and stays in English-specific policy. Written evidence does not establish speaking/listening.

**Optimized critical path:** reuse one validated rubric/lesson blueprint, make bounded exact-ID reads, append absent Attempts in compatible batches, verify all Attempt fields, then batch and read back only necessary dependent projections. Refresh consent/revision and preregister successor Activities separately. A pause skips only successor work, not prior grading or authorized saving. The protocol reduces potential round trips without claiming cross-sheet atomicity; see `plugin/PERFORMANCE-ACCEPTANCE.md` for live comparison.

**Limitations:** Skills are instructions, not executable JS, autonomous memory, MCP, server or automatic chat Submit hook. Source edits and static tests do not update the installed plugin or prove UI/audio/Sheets end-to-end operation. This repository contains the **v0.3.11** source candidate; publishing and dogfooding are separate steps.
