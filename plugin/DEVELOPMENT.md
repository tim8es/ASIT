# ASIT plugin development

The sole production specification is `plugin/skills/`. The `asit-core` and `asit-english` additions are **lazy instruction modules**, not separate running services. The teacher routes; assessment owns the Submit and Save Gate; progress owns optional Google Sheets writes.

Repository source candidate: **v0.3.11**. The installed ChatGPT plugin is a separate deployment; this repository and its CI do not verify or update it.

```sh
python3 -m unittest discover -s plugin/tests -p 'test_*.py'
python3 plugin/scripts/package.py --check
python3 plugin/scripts/package.py --output dist/ASIT_Skills_Plugin.zip
```

Before publishing test real 5-task default English UI (or the learner's requested task count), correctness without key leaks, actual audio, per-subtask Activity pre-registration, graded response Save Gate and readback, replay, cross-chat continuation and pause. Follow [performance and feature-preservation acceptance](PERFORMANCE-ACCEPTANCE.md) for before/after live-session latency, provider-call and lesson-quality checks. Passing static contracts does not prove a speedup.

Neither static tests nor packaged zip verify ChatGPT runtime or provider writes. Never bundle scripts/tests or private learner data.
