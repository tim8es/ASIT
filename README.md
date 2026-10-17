# ASIT — ChatGPT English Tutor

**Architecture:** Skills-only ChatGPT plugin. The only supported runtime specification lives in [`plugin/`](plugin/). No GitHub-first Project router, Node.js engine, MCP server or automatically running JavaScript is part of ASIT.

- Eight skills route lessons, adaptive exercises, media, voice, assessment, CEFR evidence and verified Google Sheets progress.
- Persistent learner state is optional and requires a user-connected Google Drive/Sheets app, explicit consent, schema validation and verified write/readback; `ASIT_ATTEMPT_V2` is a chat message, not a database hook.
- The plugin is independent of this GitHub repository at lesson runtime. A source update must be packaged and explicitly released via Plugin Creator to reach the installed plugin.
- The current repository source is **v0.2.11 candidate**, based on installed v0.2.10. A PR/commit is not proof of publication or successful on-device QA.

See [architecture](docs/ARCHITECTURE.md), [migration audit](docs/LEGACY-MIGRATION.md), [plugin development](plugin/DEVELOPMENT.md), and [acceptance](plugin/ACCEPTANCE.md).

## Development
Requires only Python 3 (standard library), not Node.js:

```sh
python3 -m unittest discover -s plugin/tests -p 'test_*.py'
python3 plugin/scripts/package.py --check
python3 plugin/scripts/package.py --output dist/ASIT_Skills_Plugin.zip
```

Tests validate static contracts and package integrity, NOT live ChatGPT native UI, a user's audio, lesson adaptability or real Sheets persistence. Never commit private workbook IDs, raw learner answers, personal data, or credentials.
