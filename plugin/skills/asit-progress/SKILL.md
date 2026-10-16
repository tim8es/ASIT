---
name: asit-progress
description: "Use when an ASIT learner requests a CEFR level or profile, assessment analytics, individual skill progress, due review, saved learning history, next study objective, Google Drive/Sheets persistence, or data corrections/export/deletion."
---

# ASIT private learner state, CEFR evidence analytics, review and progress

This Skills-only plugin **does not ship a database, executing Node.js engine, or Google Drive connection**. Use user-authorized Drive/Sheets tools only if available, consented and scoped to the learner-owned workbook. Without it, teach and assess in the chat, explicitly unsaved; do not invent a past CEFR level or synced history. No learner data goes to GitHub or public search.

## In-chat Google Sheets storage controls

Google Sheets works through the Google Drive ChatGPT app when the user and workspace permit it. App installation/connection, ASIT privacy mode, and workbook readiness are three independent states. On explicit install/connect/enable/disable/pause requests, read [storage setup](references/storage-setup.md) and offer a concise in-chat choice that starts a real workflow. ASIT cannot silently install, enable or remove another ChatGPT plugin. Turning ASIT saving off does not disable Google Drive. Recommend the app once when durable progress is relevant, not every lesson.

## Consent and discovery

- Before *creating or modifying* persistent learner state, obtain explicit informed consent for one privacy mode: `off`, `summary_only`, or `raw` (verbatim written answers). Audio and transcripts need separate consent. Declining does not prevent an unsaved lesson.
- Search Google Drive/Sheets for a uniquely identified, learner-owned workbook such as **ASIT — Learner State**. Verify ownership, IDs and schema. No matches: ask permission before creating one. Multiple matches: disambiguate. Missing connector access is not evidence of a blank workbook.
- For first setup, migration, schema checks or writes read [exact v2 storage contract](references/storage-v2.md). Never overwrite unknown state or assume fake IDs.

## Setup completion gate

A Google Drive plugin being installed does NOT mean ASIT storage is initialized. Before calling storage ready, verify ownership, exact nine headers, ALL seven Config values (`schema_version`, `state_revision`, `learner_id`, `target_language`, `recording_consent`, `audio_consent`, `cefr_confidence_label`), and real provider readback. A partially initialized workbook needs user-approved repair, not overwriting. One composite Submit may require multiple trusted Activities and Attempts to preserve separate CEFR modalities. See storage-v2.

## Everyday bounded reads

Use only narrow Config (schema, consent, revision and adaptation), active Goals/Plan, latest Session summary, due Reviews, relevant Competencies and 3–6 recent relevant Attempts for normal learning. Read trusted Activity when checking an answer. For **CEFR reporting**, load [CEFR analytics and reporting contract](references/cefr-analytics.md) and page enough relevant Activities and Attempts for the requested scope; report incompleteness explicitly. Do not present a small everyday packet as comprehensive longitudinal analysis.

## CEFR profile and evidence

The two independent axes are **descriptor task demand A1–C2** and **observed can-do status** (`unassessed`, `emerging`, `supported`, `independent`, `transferable`). The plugin can issue *provisional evidence-based indications* per modality, NOT an official CEFR award. Recognition cannot establish independent speaking; reading cannot establish listening; typing cannot prove pronunciation. Use exact trusted rubrics/descriptors, no fabricated percentages, and do not invent status for unobserved modalities.

On a learner CEFR/profile query show separate reading, listening, writing, spoken production and spoken interaction; separately mention written interaction when observed. Declare an overall provisional indication only when coverage suffices in all core domains. Show evidence counts, gaps, what was last assessed and a suitable next diagnostic task. For explicit full-history reporting, paginate and check coverage; with no stored results report no verified learner baseline.

Review scheduling remains a heuristic due queue, not FSRS. Prioritize due retrieval, repeat errors in a different context, and adapt the rolling plan with traceable evidence IDs and rationale. Preserve setbacks and contested grades as correction events.

## Saving and reliable reporting

A native Submit sends a new chat turn and does NOT write to Sheets. Assess against trusted Activity via `asit-assessment`, check duplicate IDs, write only user-consented data and **read back the exact row**. Say `Attempt saved` on verified attempt readback, `Fully synced` only when session, review, competency and Config projection writes have also been read back, otherwise `Partial sync`/`Not verified`/`Not saved`. Check state revision for updates; Google Sheets is not transactional. Any correction, deletion, export or sharing requires proper scope, user authorization where necessary, and verification.
