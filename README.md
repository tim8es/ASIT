# ASIT — adaptive learning through ChatGPT

One skills-only plugin: **ASIT Core** (subject-neutral learning cycle) + **English adapter** (communicative methodology, rubrics, CEFR) + ChatGPT interactive teacher. The architecture prepares future subject modules without adding a backend or rewriting the existing nine-tab Google Sheets v2 storage.

Ten lazily routed skills cover the core, English, teacher, lessons, interactive exercises, assessment, progress, media, voice and onboarding. The current GitHub source is **v0.3.0 candidate**, not an installed release. A GitHub commit does not update the installed plugin; publication through Plugin Creator and live ChatGPT dogfooding are separate.

No executing JavaScript, MCP, automatic Submit hook or custom database is included. Saving learner state is optional and requires a connected authorized Drive app, consent, trusted Activity pre-registration and verified readbacks.

See [architecture](docs/ARCHITECTURE.md), [plugin developer guide](plugin/DEVELOPMENT.md), and [acceptance](plugin/ACCEPTANCE.md).

## Developer checks

```sh
python3 -m unittest discover -s plugin/tests -p 'test_*.py'
python3 plugin/scripts/package.py --check
python3 plugin/scripts/package.py --output dist/ASIT_Skills_Plugin.zip
```
