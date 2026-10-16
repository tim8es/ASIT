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

1. Search user-owned Sheets first, including an earlier `ASIT — Private Learner State` title; do not assume an exact newer title. Confirm unique identity and metadata. Only create a private workbook when no verified existing store exists and user has approved creation. Verify tabs and header readback. Do not attempt blank-sheet bootstrap against an imported populated workbook.
2. Seed and verify ALL seven initial Config JSON values: `schema_version=2`, `state_revision=0`, opaque `learner_id` (not name/email), `target_language="English"`, explicitly consented `recording_consent`, `audio_consent=false`, and `cefr_confidence_label="unassessed"`. Never claim a workbook is initialized if any are missing. Record an actual UTC timestamp when available. Other values stay unknown until observed/approved.
3. One form may send a parent `ASIT_ATTEMPT_V2` composite string, but each graded SUBTASK must have its own trusted Activity with its own competency, modality, operation, and rubric saved and read back before the lesson. The parent is only a submission envelope. Store one Attempt per graded subtask; missing/unheard tasks are `not_assessed` and cannot be claimed as CEFR evidence.

## Session reads and attempt writes

- Minimal read: targeted Config, active Goals/Plans, most recent Sessions, due Reviews, target Competencies, **recent 3–6 relevant Attempts**. Don't fetch every tab, all raw answers and old history in a normal lesson. Dedicated audits can paginate.
- Validate untrusted attempt envelope/IDs against Activity in user-owned store. Read for exact existing attempt ID; equivalent duplicate skip, conflict stop, summary-only ambiguous replay `duplicate_unverified`.
- Evaluate externally to Sheets against trusted rubric and modality; append consented answer-or-summary row; read back exact attempt ID, answer/summary, grade, competency, privacy and operation. **Only after matching readback** report `Saved`.
- When useful, store privacy-safe non-verbatim first-try outcome, revision count, hint exposure and learner hearing report in `Events` as `attempt_provenance` with `ui_provenance=self_report_unverified`. Do not persist first-answer text in summary_only mode or present UI metadata as trusted telemetry.
- After verified Attempt readback, update review/session/competency summaries and Config revision conservatively with separate readback. Report `Attempt saved` separately from `Fully synced`; incomplete projection updates must be labelled `Partial sync`. Concurrent writers may race; Google Sheets is not transactional.
- Everyday continuation reads only bounded Config, plan, latest Session, due Reviews and 3–6 relevant Attempts; full `hydrateWorkbook` source is for offline full audits, not required on every lesson.
- For consent withdrawal, deletion, export or migrations, follow explicit user intent and safety checks. Never overwrite unknown data or publish workbook identifiers in a repository.
