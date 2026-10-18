# Getting started with ASIT

This guide covers two different activities: **using an installed tutor** and **developing the source package**. They are not the same.

## For learners

ASIT currently ships as a skills-only ChatGPT plugin **candidate**. This repository does not host a web app or provide a verified public one-click installation endpoint.

1. Obtain access to an ASIT plugin installation through a supported ChatGPT/Plugin Creator distribution workflow. An accessible source repository alone is not an installation.
2. In a conversation with the installed ASIT plugin, ask: **"Start my English learning programme with a short interactive lesson."**
3. Practise with the ChatGPT-rendered tasks and request a summary of your **observed** strengths and next competency.
4. If you want progress between chats, explicitly opt in to Google Sheets storage and authorize the supported Google Drive connection. You can also practise without this storage.
5. Treat speaking, listening and CEFR evidence as provisional until the corresponding modality has actually been tested.

**What not to expect:** automatic JavaScript execution, background learning, built-in audio hosting, an MCP server, or guaranteed persistence without a verified connector write.

## For contributors and maintainers

### Prerequisites

- Git and Python 3.
- Access to this repository.
- A supported Plugin Creator/ChatGPT environment only if you plan to install or dogfood the package.

### Clone, check and package

```bash
git clone https://github.com/tim8es/ASIT.git
cd ASIT
python3 -m unittest discover -s plugin/tests -p 'test_*.py'
python3 plugin/scripts/package.py --check
python3 plugin/scripts/package.py --output dist/ASIT_Skills_Plugin.zip
```

The script produces a candidate archive. Run the manual [plugin acceptance checklist](../plugin/ACCEPTANCE.md) and [performance checks](../plugin/PERFORMANCE-ACCEPTANCE.md) against a separately installed candidate before publishing. A passing CI workflow is necessary but insufficient.

### Repository map

| Location | Purpose |
| --- | --- |
| `plugin/skills/` | Twelve lazily selected instructional skills and references |
| `plugin/plugin.json` | Plugin manifest |
| `plugin/scripts/package.py` | Python package checks and build |
| `plugin/tests/` | Synthetic/static regression contracts |
| `plugin/ACCEPTANCE.md` | Live usage and behavior checks |
| `docs/ARCHITECTURE.md` | Core/adapter boundaries and storage guarantees |
| `docs/PUBLISHING.md` | Existing-public-repo security and plugin release gates |

## Help and feedback

Use GitHub [issues](https://github.com/tim8es/ASIT/issues/new/choose) for reproducible defects and feature proposals. For vulnerabilities or private learner data, follow [SECURITY.md](../SECURITY.md) instead of creating a public issue.
