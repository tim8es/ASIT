# ASIT English Tutor — v0.3.11 (skills-only)

An adaptive English tutor using ChatGPT-native UI, trusted rubrics and optional consented Google Sheets v2 progress. No MCP, bundled executor, automatic save hook or guaranteed native audio player.

## Minimal runtime route

- Quick correction: English feedback without loading full-lesson UI, media or workbook.
- Full lesson: verify bounded learner state when available, select one can-do, plan, run educational/creative gates, register/read back consented Activities, then render task-appropriate UI.
- Trusted Submit: validate/grade once, execute the canonical provider Save Gate, read back, and render **one** successor if appropriate and its own preregistration permits it.
- Enabled storage failure: report the blocker and request retry or explicit offline choice. Never silently downgrade enabled storage to UNSAVED.

Redistributed ZIP archives must include the exact root MIT LICENSE; `plugin/tests/test_package_archive.py` verifies license inclusion and reproducibility.

The sole persistence contract is `skills/asit-progress/references/storage-v2.md`; the UI contract is `skills/asit-exercises/references/ui-contract.md`. Large complete-lesson exemplars are optional and must not be loaded for a casual correction or an unrelated lesson family.

Provider and host performance require live measurements: offline structural tests alone do not verify audio, UI rendering, Google Sheets writes or latency. The learner privacy model, `ASIT_ATTEMPT_V2` and original nine-tab v2 schema are unchanged.
