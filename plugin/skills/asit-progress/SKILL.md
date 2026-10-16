---
name: asit-progress
description: "Use for ASIT consented Save Gate execution on every submitted graded answer, verified Google Sheets persistence, CEFR evidence reporting, progress, due reviews, learner history, and storage controls."
---

# ASIT private learner state and persistence (v0.2.6)

This is a **Skills-only** plugin. It has no running JS service, built-in database, Google Drive OAuth or guaranteed native event hook. Execute Google Sheets operations only through actually available authorized connector tools and on a user-owned verified store. Never claim success from a UI Submit or unverified write.

## Fast save path (invoked by `asit-assessment` in SAME turn)

**Do not wait for an explicit save request** when the workbook's current `recording_consent` is already `summary_only` or `raw`. The assessor is the only Submit coordinator; this skill implements its storage path. Load [storage v2 exact contract](references/storage-v2.md) on actual save/resume/setup operations, not on quick English explanations.

1. Check the unique learner-owned ASIT workbook, authorized connector, schema version, exact nine headers and seven Config keys. Prefer bounded metadata/Config reads, avoid full-sheet hydration. A known approved store permits reuse of its verified identity, but the current consent and revision must be checked for the save. With `off`, absent permission or invalid workbook, stop safely with `Not saved` and a reason.
2. **Prerequisite:** confirm the original trusted, per-subtask Activities were saved and read back **before** the exercise was displayed. If absent, no silent retroactive Activity creation or synthetic CEFR evidence; grade in chat, report `Not saved` and explain recovery requires separate user-approved reconciliation.
3. Derive the same stable per-subtask Attempt IDs from the trusted parent Attempt ID and fixed task IDs on retries. Exact-ID lookup before append; duplicate equivalent event ⇒ skip, conflicting ID/ambiguous summary-only replay ⇒ stop. In `summary_only`, persist a *non-verbatim* summary, rubric rationale and verified modality/operation, not user sentences, transcripts or first-answer text. Treat UI first-try metadata as unverified.
4. Batch write only safe, absent Attempts; then **read back exact IDs and all identity, assessment, privacy, modality and operation fields**. Unknown provider response: look up those IDs before any retry. Google Sheets read-then-write isn't atomic across concurrent clients; avoid claiming exactly-once delivery.
5. Only verified Attempts can affect necessary Session, Competency, Review and Config state_revision projections. Guard revision conflicts; read back every changed projection. No fabricated Reviews or unsupported CEFR status. If projections partially fail, retain Attempt receipt and report `Attempt saved / Partial sync`, not `Fully synced`.
6. Return exactly one evidenced state to `asit-assessment`: `Fully synced` (all required readbacks), `Attempt saved / Partial sync` (Attempt verified only), `Not verified` (ambiguous provider outcome), or `Not saved` (no successful write). Feedback is independent of storage. On next authorized session, reconcile pending projections from verified original IDs only; never blind replay.

## Setup, privacy and discovery

App connection, ASIT save preference and workbook readiness are separate states. Google Drive app isn't automatically installed or enabled by ASIT. For explicit connect/enable/pause/resume/delete/export requests consult [storage setup](references/storage-setup.md). New persistent state requires informed privacy choice `off`, `summary_only`, `raw`; audio/transcripts require separately affirmative consent. Once mode consent is verified, don't nag every lesson. Discovery uses identifiable user-owned workbook such as `ASIT — Private Learner State`; disambiguate multiple matches. A partially migrated older workbook needs user-approved append-only repair, not a destructive overwrite. Validate owner, schema, headers and Config; do not infer missing privacy modes or orphan relationships.

## Bounded continuation and CEFR

Daily continuation reads only Config, active Goals/Plans, latest Session, due Reviews, pertinent Competencies and 3–6 recent relevant Attempts. Verify learner-specific preferences before defaulting to 4 questions. CEFR reporting requires [CEFR analytics](references/cefr-analytics.md), appropriate evidence coverage and verified source descriptors. Report reading, listening, writing, spoken production and interaction separately; typing cannot establish speaking and reading cannot establish listening. Status `unassessed|emerging|supported|independent|transferable` is observed evidence, not an official CEFR award. Read enough relevant history for explicit longitudinal reports, label gaps. Respect corrections and preserve contradictory evidence.

No private learner data goes to public searches or GitHub; user-authorized edits only; do not invent saved histories or workbook IDs.
