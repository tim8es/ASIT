# ASIT plugin development

The sole production specification is `plugin/skills/`. The `asit-core` and `asit-english` additions are **lazy instruction modules**, not separate running services. The teacher routes; assessment owns the Submit and Save Gate; progress owns optional Google Sheets writes.

Repository candidate: **v0.3.0**. The installed plugin was v0.2.12 when this refactor was prepared; the source PR does not publish it.

```sh
python3 -m unittest discover -s plugin/tests -p 'test_*.py'
python3 plugin/scripts/package.py --check
python3 plugin/scripts/package.py --output dist/ASIT_Skills_Plugin.zip
```

Before publishing test real 4–5-task English UI, correctness without key leaks, actual audio, per-subtask Activity pre-registration, graded response Save Gate and readback, replay, cross-chat continuation and pause. Neither static tests nor packaged zip verify ChatGPT runtime or provider writes. Never bundle scripts/tests or private learner data.
