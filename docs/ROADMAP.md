# ASIT roadmap

This document separates **available source instructions** from **verified public product behavior**. Items are priorities rather than delivery promises.

## Current baseline — v0.3.0 source candidate

- Subject-neutral ASIT Core and an English adapter, lazily routed through the teacher skill.
- Lesson, exercise, assessment, media, voice, onboarding and progress policies.
- Evidence-oriented grading and English CEFR policy; optional Google Sheets v2 protocol.
- Python static contract tests and plugin packaging workflows.

**Qualification:** existing source and CI do not prove actual cross-client UI responsiveness, ELLLO playback, learner persistence or public installability.

## Next priorities

1. **Live end-to-end quality:** test the installed candidate on desktop and mobile, including feedback timing, navigation and independent responses.
2. **Adaptive variety:** limit repeated mechanics, combine tasks into meaningful scenarios and test fresh knowledge transfer.
3. **Listening and voice:** verify accessible authentic media, playback and comprehension without inferring audio evidence from text.
4. **Trustworthy learner progress:** verify consent, Activity pre-registration, Google Sheets append/readback and cross-chat continuation.
5. **Clear public onboarding:** document verified installation and provide a reproducible first lesson before announcing a release.

## Later opportunities (not committed features)

- More subject adapters built on ASIT Core.
- Better human-readable progress views and documentation for learner data.
- A public example gallery with **synthetic**, privacy-safe learning scenarios.
- More systematic accessibility testing and experimental evidence on learning efficacy.

## How to contribute

Pick a specific learner or developer problem, open an [issue](https://github.com/tim8es/ASIT/issues/new/choose), attach a reproducible scenario and propose an acceptance test. Avoid promising performance gains or CEFR certification without evidence.

See [CONTRIBUTING](../CONTRIBUTING.md) and [plugin acceptance](../plugin/ACCEPTANCE.md).
