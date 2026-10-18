# ASIT continuation after a trusted Submit (v0.3.10)

`asit-assessment` is the sole coordinator. Grade current submitted tasks from their *original* trusted rubrics, preserve corrections, and execute authorized current-attempt Save Gate before starting new graded work.

- **Stop conditions:** explicit pause/stop, grade-only request, stated session end, essential missing input or unresolved conflicting replay. No successor UI or media work; finish grading and applicable saving first.
- **Continue:** choose exactly one learner-relevant can-do from verified goals, recent evidence and due reviews; honor task count/time/preferences. Repeated independent errors change operation; at most two focused remediation cycles by default. Avoid near-identical exercises.
- **Prepare:** choose modality and suitable UI family, verify media/answer integrity, freeze trusted per-subtask IDs and rubrics. If `summary_only|raw` consent is active and workbook usable, newly register/read back *all successor Activities* through the canonical `asit-progress/references/storage-v2.md` Save Gate **before** rendering.
- **Failed active Save Gate:** **do not** automatically render an UNSAVED graded successor. Report current feedback and saving status, describe the blocker, offer exact retry or explicit offline practice choice. A prior successful attempt write never authorizes unregistered successor tasks.
- **Offline permitted:** `off` or user-chosen offline practice permits an honestly unsaved successor; never invent later automatic synchronization.
- **One Submit:** the resulting lesson has one canonical `ASIT_ATTEMPT_V2` chat event; client feedback is provisional. Don't create another successor for the same saved parent on replay.

This reference is a decision path, not a second storage policy or executable background agent. Load large visual exemplars/media instructions only if the chosen task actually requires them.
