# ASIT plugin development and release

`plugin/skills/` is the sole production specification. Python files in `plugin/scripts/` package/validate the skill source offline and DO NOT execute as part of the installed ChatGPT tutor. Source is proposed v0.2.11; installed plugin was v0.2.10 at the time of this migration.

```sh
python3 -m unittest discover -s plugin/tests -p 'test_*.py'
python3 plugin/scripts/package.py --check
python3 plugin/scripts/package.py --output dist/ASIT_Skills_Plugin.zip
```

Package the ZIP only after the source contract tests and manual QA: a 4–5-task multimodal-capability-sensitive lesson, deterministic UI correctness without answer leaks, ELLLO audible source, original Activity preregistration and readback, answer Save Gate, cross-chat recovery, stop/pause and duplicate submission. None is proven by static tests alone. Publication through Plugin Creator requires a separate versioned update and explicit verification. Never include `plugin/tests`, raw learner state, GitHub history or `plugin/scripts` in the installed runtime archive.
