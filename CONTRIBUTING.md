# Contributing to ASIT

The supported source of truth is `plugin/skills`, with a Python-only packaging and static contract-test toolchain. Never reintroduce Node.js engines, GitHub-first Project instructions or claims that repository scripts execute during ChatGPT lessons.

1. Change the smallest relevant skill and lazy reference; avoid eagerly loading all references into model context.
2. Preserve truthful modality evidence, answer integrity, trusted Activity pre-registration, consent/privacy and exact readback.
3. Add or adjust synthetic static tests and a manual acceptance scenario.
4. Run `python3 -m unittest discover -s plugin/tests -p 'test_*.py'` and `python3 plugin/scripts/package.py --check`.
5. Test actual rendered UX in ChatGPT separately. CI green is not live correctness, audio playback or Google Sheets proof.

Private learner state must never appear in Git commits, tests, screenshots, prompts or public searches. Deleting files in a commit does not remove prior Git history; historical exposure requires a separate reviewed purge and credential rotation if applicable.

Plugin Creator publication is a separate manual gated step; merging a PR does not update the installed release.
