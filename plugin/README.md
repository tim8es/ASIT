# ASIT Skills-only v0.2.3 — dogfooding improvements

## Changed
- Story-led mini-lessons with meaningful scenes, varied recognition/repair/construction/independent communication, and bounded remediation. Repeating a mistake does not trigger an endless succession of near-identical translations.
- ELLLO audio practice needs a verified standalone source, bounded actual clip duration, transcript-aligned original questions and learner-reported hearing. Link-only homework is NOT a listening lesson.
- In-chat Google Sheets save preference: `off`, `summary_only` or `raw`, with explicit privacy consent and ownership/schema/write/readback checks. Google Sheets is accessed through a user-connected Google Drive app in ChatGPT.

## What the storage control cannot do
An ASIT teaching skill cannot silently install or enable/disable the Google Drive plugin or authorize an external Google account. Users complete installation/connection from Settings > Plugins (or through a real ChatGPT plugin suggestion). An in-chat ASIT toggle controls whether ASIT attempts to write learner records, not Google Drive app availability. Without a reachable writable workbook, ASIT teaches unsaved.

## Validation and release
Run `python3 plugin/scripts/package.py --check`, then build the release ZIP. Manual QA in a separate installed-plugin chat remains necessary for real image/media playback, cross-chat state, permissions and full native UI; tests do not establish those claims. The plugin is Skills-only: no MCP, app server, or executed repository Node scripts. GitHub source changes DO NOT update the installed personal plugin automatically. Read ACCEPTANCE.md before publishing.

## v0.2.4 — persistent state correctness
New-workbook Config initialization now requires seven values with verified identity, separate audio consent and honest unassessed CEFR status. A one-Submit lesson produces independently scoped trusted subtask evidence instead of one mixed CEFR result. Privacy-safe attempt provenance can be stored in Events; raw first answers are excluded from Events. State projections are independently verified and may be partially synchronized.
App connection, workbook creation and reading/writing on a real account still need a separate authorized device/provider acceptance test. Repository JS utilities are offline reference code, not executed inside this Skills-only plugin. Google Drive is optional.
