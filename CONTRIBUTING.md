# Contributing to ASIT

Thanks for considering a contribution. ASIT is a **skills-only adaptive learning project**, not an executable tutoring backend. Contributions should improve observable learner outcomes while preserving privacy and truthful assessment.

## Good first contributions

- Fix a broken documentation link or clarify installation limitations.
- Add a **synthetic** regression scenario to `plugin/tests/`.
- Improve the clarity or accessibility of an exercise instruction without leaking answers.
- Document a reproducible UI, media or Google Sheets Save Gate issue, distinguishing expected from observed behavior.
- Add missing English/Russian documentation cross-links.

Before starting a large feature, [open a proposal](https://github.com/tim8es/ASIT/issues/new/choose) describing the problem, expected learner outcome and verification plan.

## Development workflow

1. Fork the repository (once public) or work on a dedicated feature branch.
2. Read [architecture](docs/ARCHITECTURE.md), [plugin development](plugin/DEVELOPMENT.md) and the relevant lazy skill reference.
3. Change the smallest relevant skill and reference. `plugin/skills` is the maintained source of truth; keep the teacher router small and do not eagerly load every reference into model context.
4. Add or adjust synthetic contract tests plus a manual acceptance scenario.
5. Run:

   ```bash
   python3 -m unittest discover -s plugin/tests -p 'test_*.py'
   python3 plugin/scripts/package.py --check
   ```

6. Open a pull request with the motivation, before/after behavior, risks, exact tests and any still-unverified live behavior. Use the PR template.

## Engineering and pedagogical invariants

- Do not reintroduce the former Node.js runtime, GitHub-first Project router, or claims that repository scripts execute inside a ChatGPT lesson.
- Preserve first-answer integrity, truthful modality evidence, consent, Activity pre-registration, the assessment Save Gate and verified Google Sheets readback.
- Do not equate recognition with independent production, or text reading with demonstrated listening.
- Preserve the existing nine-tab Google Sheets v2 schema unless a separately reviewed migration is approved.
- **CI green is not a proof of live correctness.** Verify rendered UX, audio, authorization and readbacks in ChatGPT before a plugin release. Plugin Creator publication is a separate gated step.

## Privacy and security

Never commit real learner history, personal spreadsheets, API keys, secrets, tokens, private workbook URLs or identifiable screenshots. Use invented test data. Do not include sensitive details in public issues. Follow [SECURITY.md](SECURITY.md).

Deleting sensitive information in a normal commit does **not** remove it from Git history; exposures require a reviewed history cleanup and credential rotation where appropriate.

## Community

Keep reviews actionable and respectful. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Small focused PRs and reproducible evidence are preferred over broad speculative refactors.
