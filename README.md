![ASIT adaptive learning framework — concept illustration](docs/assets/asit-hero.svg)

# ASIT — Adaptive Learning Framework for ChatGPT

**An open-source, skills-first framework for adaptive learning in ChatGPT.** Start with English tutoring, build evidence-based learning paths, practise through interactive lessons and review progress without running your own AI backend.

[![ASIT contract tests](https://github.com/tim8es/ASIT/actions/workflows/tests.yml/badge.svg)](https://github.com/tim8es/ASIT/actions/workflows/tests.yml)
[![Plugin package](https://github.com/tim8es/ASIT/actions/workflows/plugin-package.yml/badge.svg)](https://github.com/tim8es/ASIT/actions/workflows/plugin-package.yml)
[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Release status](https://img.shields.io/badge/release-v0.3.11%20source--candidate-informational)

**English** · [Русская версия](README.ru.md) · [Architecture](docs/ARCHITECTURE.md) · [Getting started](docs/GETTING-STARTED.md) · [Roadmap](docs/ROADMAP.md) · [Changelog](CHANGELOG.md) · [Contributing](CONTRIBUTING.md)

> **Status — source candidate, not a verified public release.** The repository contains a proposed **v0.3.11** skills-only plugin. The installed ChatGPT plugin is a separate deployment. GitHub CI validates static contracts and packaging; it does **not** establish that the live plugin, audio playback or Google Sheets saving work on every device.

## What is ASIT?

ASIT separates a **subject-neutral adaptive learning loop** from a **subject-specific teaching adapter**. The first adapter teaches English, using communicative tasks, evidence-oriented feedback and CEFR-referenced skill analysis where supported by actual learner performance.

- **Adaptive lessons:** select a concrete competency, change the practice method when errors repeat, and check independent application.
- **Interactive practice:** visual exercises, guided reconstruction, choices and writing activities delivered through ChatGPT's supported interface.
- **Evidence-aware assessment:** distinguish first responses, retries, hints and independent transfer. Do not treat a click as proof of speaking or listening.
- **English-specific learning:** grammar, communication, optional ELLLO-based listening tasks and carefully qualified CEFR profiles.
- **Optional progress storage:** consent-based Google Sheets v2 recording with trusted activity IDs and verified write/readback. Learning can continue without storage.
- **Modular and lightweight:** skills and lazy reference files; no required MCP server, Node.js runtime or custom database.

## Who is this for?

| Learners | Educators and learning designers | Developers |
| --- | --- | --- |
| Practise English with feedback that responds to errors. | Explore instruction-led adaptive lesson design, assessments and progress evidence. | Study and extend a subject-neutral ChatGPT skills architecture. |

### How it works

![ASIT four-stage adaptive learning cycle: select, practise, assess, adapt](docs/assets/asit-learning-loop.svg)

*Conceptual architecture illustration, not a screenshot of the installed plugin.*

The **12** lazy-routed skills live in [`plugin/skills/`](plugin/skills). For ownership, boundaries and data flow, see [the architecture](docs/ARCHITECTURE.md).

## Getting started

**Want to learn English?** ASIT must first be installed/published in your ChatGPT workspace using a supported plugin workflow. Source files on GitHub are **not** an automatically installed tutor. Once installed, try:

> Start an ASIT English lesson. Give me interactive exercises and assess my independent answers.

**Want to inspect or develop the plugin?** Clone this repository and run the existing Python-only checks:

```bash
git clone https://github.com/tim8es/ASIT.git
cd ASIT
python3 -m unittest discover -s plugin/tests -p 'test_*.py'
python3 plugin/scripts/package.py --check
python3 plugin/scripts/package.py --output dist/ASIT_Skills_Plugin.zip
```

The archive is a **candidate artifact for a separately gated installation/release**, not a production deployment. See [Getting started](docs/GETTING-STARTED.md) and [plugin development](plugin/DEVELOPMENT.md) for full instructions.

## Capabilities and current limits

| Area | In the source repository | Not guaranteed by the repository |
| --- | --- | --- |
| Learning policy | Modular Core + English adaptation and routing | Deterministic runtime execution of instruction files |
| Interactive lessons | Instruction contracts and static regression tests | Identical rendering or interaction across ChatGPT clients |
| Assessment | Explicit answer-integrity and Save Gate rules | Automatic server-side Submit hooks |
| Listening and voice | Media/voice instructions; ELLLO selection rules | Bundled audio player or independently verified playback |
| CEFR progress | Evidence rules for English proficiency analysis | Certified CEFR testing or proficiency from unobserved skills |
| Storage | Optional consented Google Sheets v2 protocol | Saves without a connected and authorized Drive app or verified readback |

**Privacy:** Never submit real learner data, credentials or private workbooks to issues or pull requests. Progress storage is opt-in; see the [security policy](SECURITY.md).

## Documentation

- [Getting started](docs/GETTING-STARTED.md) — learner setup, package build and expectations.
- [Architecture](docs/ARCHITECTURE.md) — responsibilities and design constraints.
- [Roadmap](docs/ROADMAP.md) — verified goals and current priorities.
- [Changelog](CHANGELOG.md) — source candidate history and unshipped changes.
- [Plugin acceptance checklist](plugin/ACCEPTANCE.md) — manual and static checks.
- [Performance acceptance](plugin/PERFORMANCE-ACCEPTANCE.md) — how to evaluate the learning flow.
- [Public release checklist](docs/PUBLISHING.md) — security and quality gates before an official plugin release; repository source is already public.
- [Contributing](CONTRIBUTING.md) — development, tests and pull requests.

## Contribute

Bug reports, reproducible UX feedback, documentation improvements and subject-adapter proposals are welcome. Start with [Good First Issue suggestions](CONTRIBUTING.md#good-first-contributions) or [open an issue](https://github.com/tim8es/ASIT/issues/new/choose). Changes that affect learner data or correctness require explicit acceptance checks.

ASIT is released under the [MIT License](LICENSE). The current repository documentation is in English with a [Russian overview](README.ru.md).

**Keywords:** adaptive learning, AI tutor, ChatGPT education, English language learning, CEFR, interactive exercises, skills-based agents, personalized learning, Google Sheets learning analytics.
