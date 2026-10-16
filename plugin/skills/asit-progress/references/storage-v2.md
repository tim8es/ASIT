# ASIT optional user-owned Google Sheet — exact v2 nine-tab contract

Adapted from `install/ASIT-STORAGE.md` v0.4 @ 2026-10-16. **Only use after genuine provider connection and informed consent.** Do not make up a file URL or sheet tab ID; read returned provider IDs. Do not blindly migrate existing state.

## Provider and privacy

Consent modes: `off`, `summary_only`, `raw`. Separate consent for audio/transcripts. Learner identity, goals, raw messages and progress stay in private user-owned store, never plugin source or GitHub. Consent doesn't grant connector access; permissions remain controlled by the user.

## Required tabs and header columns (in exact order)

```text
Config: key | json_value | updated_at_utc
Goals: goal_id | description | priority | status | created_at_utc | reason
Competencies: competency_id | can_do | cefr_reference | dependency_ids_json | priority | status | evidence_count | confidence_label | last_observed_at_utc | required_modality | required_operation
Plans: plan_id | revision | goal_ids_json | competency_ids_json | rationale | status | created_at_utc
Activities: activity_id | lesson_id | session_id | competency_id | activity_type | prompt | rubric_json | status | created_at_utc | observed_modality | observed_operation
Attempts: attempt_id | occurred_at_utc | session_id | lesson_id | activity_id | competency_id | activity_type | answer_or_summary | attempt_number | hint_level | assessment | rubric_rationale | review_action | context_id | privacy_mode | observed_modality | observed_operation
Reviews: review_id | competency_id | content_or_pattern | due_at_utc | success_count | last_outcome | status
Sessions: session_id | started_at_utc | ended_at_utc | goal_ids_json | attempt_ids_json | summary | next_step
Events: event_id | event_type | entity_id | revision | timestamp_utc | metadata_json
```

## First-time setup

1. Confirm Drive/Sheets tools and learner consent; verify no existing workbook ambiguities. Create a new private blank native Sheet, check provider-assigned IDs, build nine tabs, write exact headers, re-read cells and validate.
2. Seed `Config` JSON keys: `schema_version=2`, `state_revision=0`, `recording_consent` chosen consent mode, private `learner_id`, `target_language="English"`; leave unobserved learner properties unknown. `Config.adaptive_profile` can store learner-approved settings and evidence-linked observations, not invented defaults.
3. A planned lesson may create a trusted **parent Activity** with itemized rubric and one `ASIT_ATTEMPT_V2` composite answer string. Before showing a storage-backed task save trusted Activity and verify readback.

## Session reads and attempt writes

- Minimal read: targeted Config, active Goals/Plans, most recent Sessions, due Reviews, target Competencies, **recent 3–6 relevant Attempts**. Don't fetch every tab, all raw answers and old history in a normal lesson. Dedicated audits can paginate.
- Validate untrusted attempt envelope/IDs against Activity in user-owned store. Read for exact existing attempt ID; equivalent duplicate skip, conflict stop, summary-only ambiguous replay `duplicate_unverified`.
- Evaluate externally to Sheets against trusted rubric and modality; append consented answer-or-summary row; read back exact attempt ID, answer/summary, grade, competency, privacy and operation. **Only after matching readback** report `Saved`.
- Update review, session, competency summaries and Config revision conservatively with readback; concurrent changes require reload. Don't claim an atomic whole-workbook transaction.
- For consent withdrawal, deletion, export or migrations, follow explicit user intent and safety checks. Never overwrite unknown data or publish workbook identifiers in a repository.

## Mandatory save gate and recovery (v0.2.5)

For consented grading, register trusted per-subtask Activities before submission. On every assessed answer in the same turn, verify workbook/consent, check exact Attempt ID (identical replay: reuse; conflict: stop), append only if absent, then read back the exact Attempt and its linked IDs, grade, modality and privacy. Never store verbatim responses in `summary_only`. Unknown write outcome requires an existence read before any retry. After verified Attempt, update and read back all required Session, Competency, Review and Config projections. Report `Fully synced` only after complete provider verification, `Attempt saved / Partial sync` if projections are pending, `Not verified` for uncertain results, or `Not saved` when no write occurred. Continue teaching on provider outage; reconcile pending records by stable IDs on the next chat. Sheets has no atomic or guaranteed exactly-once write. Test duplicate/replay, outage, partial sync, privacy and cross-chat reads with real provider readback.
