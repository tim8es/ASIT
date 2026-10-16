# ASIT Skills-only plugin: source and release process

This directory is the **tracked source** of the private ASIT Skills Plugin v0.2.3. The existing GitHub-first ASIT Project remains a separate supported runtime; nothing here changes its Engine or Google Drive storage contract.

## Contents
- `plugin.json`: sanitized source manifest (do not commit account-generated owner metadata or credentials).
- `skills/*/SKILL.md`: 8 auto-invocable teaching, onboarding, lessons, exercises, media, voice, assessment and progress skills.
- `skills/*/references/*`: conditional details, including the 18-pattern catalogue (17 drills + read-only progress).
- `README.md`, `ACCEPTANCE.md`: end-user documentation and 18 **manual**, not-yet-verified host QA scenarios.
- `scripts/package.py`: standard-library validation and reproducible ZIP packaging.

No `mcp.json`, hosted service, player, crawler, private learner workbook or secrets are included. No repository `src/*.mjs` runs automatically in ChatGPT merely because it exists in GitHub. Original ELLLO media stays on ELLLO.

## Runtime and context budget

Keep `asit-teacher` an always-small router; place rendering detail only in focused references. Do not fetch the repo or media on every turn. `visual-feedback.md` loads only when a structured interactive exercise is actually rendered. Automated package checks cover reference links and feedback contract; actual client playback, responsive UI and cross-chat writes still require manual acceptance.

## Validate
```sh
python3 plugin/scripts/package.py --check
```
Checks skill names, manifests, local links, mandatory routing/consent markers and absence of MCP configuration.

## Build archive
```sh
python3 plugin/scripts/package.py --output dist/ASIT_Skills_Plugin_v0.2.3.zip
```
The archive has one enclosing `asit-english-tutor/` directory with the portable skills and references; development scripts are not included. CI runs the same checks and rebuild.

## Publishing and updates
The current personal plugin was separately created as version 0.1.0: https://chatgpt.com/plugins/plugins_6ad22241a690819181b13026483c78cb . This commit **does not update that installed release**. To publish a later version, edit tracked source, increment `plugin.json` version, validate, rebuild and deliberately update the existing plugin with its expected release ID. Never create an accidental duplicate. Verify actual native UI, media playback and optional Drive permissions in ChatGPT after installing; package tests do not prove runtime behavior.

Source basis: ASIT repo commit `01bf2516c3466c01221124bce50b53627a779ccb`.
