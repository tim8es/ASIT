---
name: asit-progress
description: "Use when an ASIT learner asks to save lessons, connect Google Drive or Sheets, continue across chats using stored history, check progress, see reviews/due skills, inspect a learning plan, update goals, export/correct/delete learner records, or set private storage preferences."
---

# ASIT private learner state, review and progress

This Skills-only plugin **does not ship a database or Google Drive connection**. Use a user-connected, authorized Drive/Sheets tool **only if actually available**, consented and scoped to the learner-owned workbook. Without it, teach unsaved and do not fabricate progress, CEFR ratings or a synced history. No learner records are sent to GitHub or public ELLLO queries.

## Consent and discovery

- Before *creating or modifying* persistent learner state, obtain explicit informed consent for one privacy mode: `off`, `summary_only`, or `raw` (verbatim written answers). Ask separately for audio or transcripts; `raw` does not implicitly authorize them. If learner declines or connector unavailable, continue temporary practice and mark `Not saved`.
- Search user-owned Google Drive/Sheets for configured workbook such as **ASIT — Learner State**, verify ownership, existing IDs and schema. No matches: ask permission to create an empty workbook. Multiple matches: disambiguate; never pick arbitrarily. Missing connector or permission is not a blank workbook.
- **First setup, migration, schema checks and writes:** read [exact v2 workbook contract](references/storage-v2.md), perform provider-backed operations, read real assigned Sheet/tab IDs and verify headers. Never overwrite existing unknown file, migrate without authorization/backup, or present generated IDs as provider receipts.

## Everyday bounded state

For a returning learner, read only: Config (schema version, consent, state revision, current adaptation), active Goals/Plan, latest Session summary, due Reviews, target Competencies and **3–6 relevant recent Attempts**. For a tiny unrelated vocabulary question, no deep read is needed. Read a trusted Activity only for replay/submission. Treat a cached `active_focus` view as a hint, confirm meaningful claims against authoritative rows and revision. For requested historical analytics, paginate relevant history and disclose truncation.

## Progress reporting

Show what the learner actually did, with **evidence and modality** for each can-do competency. Useful statuses: `unassessed`, `emerging`, `supported`, `independent`, `transferable`; transfer requires repeated unaided use across situations/sessions. Don't manufacture official CEFR certification, learning percentages, completion times or pronunciation/listening metrics from text-only attempts.

Review scheduling is a **heuristic** due queue keyed to meaningful language patterns, not an FSRS memory model. Prioritize due retrieval, repeat errors in a new context, and periodically adjust the rolling plan with rationale/evidence IDs. Preserve setbacks and learner-initiated edits rather than rewriting history.

## Saving and reliable reporting

A native `Submit` sends a new chat turn; it does not write to Drive. Evaluate against the trusted rubric via `asit-assessment`, apply duplicate detection, write only consented fields, and **read back the exact record**. Report `Saved` only on verified provider data. Read-check-update `state_revision`; Google Sheets is nontransactional, so never promise atomicity or exactly-once replay under parallel writes. If state unknown or partial, report `Not verified`. Learner requests for corrections, deletion, export or sharing require correct scoping and explicit confirmation where needed, followed by verified result; do not assume permissions or destinations.
