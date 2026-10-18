# ASIT Google Sheets setup — scoped privacy and authorization (v0.3.10)

Load only for explicit storage setup, connection, enable/pause/resume, export/delete, or migration—not for routine grading. The **canonical behavior**, including active-consent failures, is [storage-v2](storage-v2.md).

## Independent states

1. ChatGPT Google Drive app installed/authorized and permitted by workspace. Skills-only ASIT cannot independently install or authorize another app.
2. ASIT `recording_consent`: `off` (no save), `summary_only` (non-verbatim progress), or `raw` (verbatim authorized written answers). Raw audio/transcripts need separate affirmative `audio_consent`.
3. Unique verified learner-owned workbook, nine exact v2 data tabs, valid Config and real provider write/readback. App installation or workbook title does **not** prove this.

## User actions

- New setup: briefly explain the three privacy modes, obtain informed approval before a write, find and verify one workbook. Ask before creating a missing workbook. Multiple matches require disambiguation. New workbook creation and old-workbook repair are separate, explicitly authorized actions.
- Existing workbook: validate original schema, owner/permissions and Config. For missing legacy keys use the safe defaults only in reading; mark migration incomplete and offer append-only user-approved repair with exact readback. Never destructively rewrite populated sheets.
- Pause: stop new writes immediately. Update/read back persisted Config only with separate appropriate authorization; if not persisted, tell the learner that the choice is limited to this chat. Pausing is not deletion and doesn't uninstall Google Drive.
- Resume: verify current permission and obtain appropriate consent for the renewed mode. Do not assume that app connection equals privacy consent.
- Connected + consented SAVE-REQUIRED write failure: **do not** switch to UNSAVED automatically; offer retry/repair or an explicit offline-practice choice. When consent is `off` or no verified consent/workbook exists, ordinary unsaved practice remains available.

No extra server, MCP, API key or installed plugin-specific JS required for the connected Google Sheets workflow. A write is saved only after the relevant exact row was read back and checked.
