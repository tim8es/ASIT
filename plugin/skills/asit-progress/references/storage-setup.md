# ASIT Google Sheets setup and in-chat storage control

Load only when setting up persistence or when explicitly asked to install/connect/enable/pause/disable progress storage. In this ChatGPT integration, Google Sheets is exposed via the Google Drive app/plugin, not a separately required Google Sheets app.

## Three independent switches
1. ChatGPT app state: Google Drive availability, installation, account authorization, and workspace policy. Skills-only ASIT CANNOT install, authorize, enable, disable or uninstall another ChatGPT plugin automatically.
2. ASIT privacy/save mode: off (do not write), summary_only (progress and corrections as structured summaries), raw (verbatim written responses in workbook). Explicit user choice is required before writing; no raw audio without separate consent.
3. Learner-owned workbook: an identifiable ASIT — Learner State sheet with verified owner, v2 schema, Drive/Sheets access, and exact write readback. An installed app is not a ready workbook.

## In-chat action picker (real actions only)
For an explicit setup request, show a compact accessible picker or conversational choices, with real Submit/new chat turn if controls exist:
- Continue without saving: off, no writes.
- Enable progress summaries in my Google Sheets: summary_only, explain data and obtain explicit approval.
- Enable full written-answer history: raw, disclose verbatim storage and obtain explicit approval. Audio/transcripts need separate consent.
- Check Google Drive connection: inspect available plugin/tool state. If not installed and plugin discovery/suggestion is supported, offer the actual install suggestion. Otherwise direct user to Settings > Plugins > Google Drive; the user must complete install/connect/authorization.
For previously enabled storage: Pause ASIT saving (off) and Resume (fresh confirmation). These are ASIT data-flow choices, NOT app installation toggles. Do not visually claim connected/saved based on button selection alone.

**READBACK gate:** provider writes are incomplete until the exact affected row has been read and checked; the UI must not display a success badge before verification.

## Execution
A. Determine current Google Drive plugin/tool availability if it is relevant. An installed app may still require account consent. Do not invent plugin IDs, deep links, permissions, workbook IDs, or installation success.
B. Ask informed mode consent first. If off, keep teaching unsaved. If summary_only/raw, find one learner-owned native spreadsheet through Drive search; disambiguate duplicates and ask before creating a missing workbook. The Google Sheets plugin uses its supported creation route (Spreadsheets capability may create a local .xlsx template for import); a native one-tab blank workbook may instead use the two-phase bootstrap only after verified creation and empty-grid checks. Imported workbooks with nine tabs must NOT be sent through the one-tab bootstrap. Follow storage-v2.md.
C. For NEW workbooks validate all seven Config keys. For EXISTING v2 workbooks first validate original five core keys and treat absent `audio_consent` as false and absent `cefr_confidence_label` as unassessed; do not rewrite the workbook. Offer user-approved append-only repair and exact readback before marking it fully ready. Audit orphan Activities/Attempts and missing per-attempt `privacy_mode` without guessing missing values. After safe repair, validate exact nine-tab headers and all seven Config values, including private learner ID, language and the separate audio_consent setting. On a saved lesson, verify trusted Activities per subtask BEFORE showing prompts, then assess each subtask, prevent duplicate IDs, save consented Attempts and optionally privacy-safe Events, and READ BACK exact rows. Report verified Attempt separately from verified Sessions/Reviews/Competencies/Config projections. No silent backfill.
D. When off is chosen, stop ASIT writes immediately. If a Config preference update is separately approved and writable, persist and read back the mode. If not, off is known only in this chat; disclose cross-chat limits. Pausing never deletes history and does not disable Google Drive.
E. For explicit request to disable the actual Google Drive app, use supported ChatGPT Settings > Plugins controls or authenticated app-management tools only if available and authorized; never impersonate a user confirmation or use a fake install button.

## Safety and product boundary
- Plugin installation always requires explicit user action and provider/workspace authorization. Do not require a backend, separate MCP or extra API key merely for an already-connected Google Drive Sheets workflow.
- Never nag during every lesson; recommend storage once when useful or whenever user asks. If unavailable, continue with honest unsaved lessons.
- Never call an in-chat ASIT saving switch a ChatGPT plugin toggle. Keep terms distinct.
