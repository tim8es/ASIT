# Public source and plugin release gate

**Repository status:** `tim8es/ASIT` was already public on 2026-10-18. This checklist is for safeguarding the existing public source and deciding whether a **separate public plugin release** is ready. Do not assume that making a PR, passing CI or uploading a candidate ZIP deploys the plugin.

## P0 — protect existing public information

- [ ] Close or explicitly disposition [historical detached Git-object exposure #1](https://github.com/tim8es/ASIT/issues/1). Prior history rewrites are not proof that historical commits and cached objects are inaccessible.
- [ ] Audit **all** Git objects still reachable by commit SHA, remaining branches and tags, pull-request refs/patches, Issues and comments, GitHub Actions logs/artifacts, and attached files for learner records, workbook IDs, credentials, private media and proprietary assets. Retain only sanitized findings in public.
- [ ] Rotate any exposed credentials and remove access to historical sensitive objects with GitHub Support or a carefully approved clean-tree repository migration when required. Reverting a current file or switching visibility to private cannot undo an existing disclosure.
- [ ] Confirm copyright and redistribution rights for every bundled file, and permission to link to rather than mirror third-party audio. Review SVGs and any new assets.
- [ ] Enable GitHub private vulnerability reporting and a private maintainer contact route. Follow [SECURITY.md](../SECURITY.md).
- [ ] Enforce main-branch protections/rulesets: PR-based changes, passing `test` and `package` jobs, and appropriate review. Configure via repository Settings; a green but optional check is not a merge gate.

A scan of the current tree is **not** a substitute for a historical data audit. This checklist does not certify privacy or declare security incident resolution.

## P0 — verify the candidate artifact

- [ ] Run `python3 -m unittest discover -s plugin/tests -p 'test_*.py'`.
- [ ] Run `python3 plugin/scripts/package.py --check` and build with `--output dist/ASIT_Skills_Plugin.zip`.
- [ ] Verify ZIP contains both manifests, 12 skill directories, required references and the exact root MIT `LICENSE`; no private files or outdated executable engine.
- [ ] Verify README, Russian README, Changelog, Roadmap, installation guidance and manifest versions agree. Use a fixed source commit SHA and verify the ZIP checksum.
- [ ] Ensure an official GitHub Release/tag is created only once all gates pass. GitHub Actions' ephemeral candidate artifact is **not** an official release.

## P0 — live installed plugin acceptance

- [ ] Confirm a supported installation/distribution route from a clean account, using [Getting started](GETTING-STARTED.md). Test permissions honestly; do not publish an unverified one-click link.
- [ ] Use a *fictional learner* in fresh desktop and mobile chats. Test the exact rendered controls, immediate provisional feedback, Cards/All state, accessibility, deliberate skips and one final Submit.
- [ ] Reproduce visual-media failures, missing assets, unavailable playback, repeated errors, task variety and independent transfer. No bogus player, image ref or modality evidence.
- [ ] Verify a genuine ELLLO source/track, appropriate duration, learner playback and a real comprehension task; distinguish transcript-supported work from self-reported listening.
- [ ] With explicit permission and a **synthetic** workbook, verify the nine-tab v2 schema; Activity registration/readback before scored UI; graded Attempt dedupe/readback; projections; replay, partial failure and cross-chat recovery. Exercise `off`, `summary_only`, `raw` and audio consent boundaries.
- [ ] Verify CEFR reports reflect observed skills only. Compare host outcomes against [manual acceptance](../plugin/ACCEPTANCE.md), [creative](../plugin/CREATIVE-ACCEPTANCE.md), [multimodal](../plugin/MULTIMODAL-ACCEPTANCE.md) and [performance](../plugin/PERFORMANCE-ACCEPTANCE.md) checks.
- [ ] Publish *sanitized* acceptance notes: installed plugin version, device/client, scenario, expected and observed behavior, timestamp and unresolved failures.

## P1 — discoverability after launch

- [ ] Add an accurate GitHub About description, topics and social preview in repository Settings; no fake app screenshots.
- [ ] Announce only functions demonstrated by the installed version. Link to real installation instructions, limitations, source commit, release notes and security process.
- [ ] Re-check public repo links while signed out. Accept that search engine indexing is asynchronous; do not promise traffic or ranking.

**Release decision:** until P0 history/security and live acceptance are signed off, keep the plugin labeled **source candidate / unverified public install**, even though GitHub source is already public.
