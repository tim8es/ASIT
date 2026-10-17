# ASIT Google Sheets storage v2 — Save Gate v3 execution contract (plugin v0.2.6)

This is a model-operated, **best-effort** contract, NOT a running hook or script. Exact provider-write/readback evidence is required; never claim a transaction across all sheets or guaranteed exactly-once behavior. Only authorized Google Drive/Sheets tools may access the learner's verified private workbook. `ASIT_ATTEMPT_V2` sends a CHAT message only.

## Consent and schema are prerequisites

Persistent consent modes: `off`, `summary_only` (graded non-verbatim descriptions), `raw` (verbatim typed answers). Audio/transcripts separately consented (`audio_consent`, default false). Never share workbook IDs, raw answers, identity or goals with external searches/GitHub. An installed Drive app is not sufficient evidence of authorization or workbook readiness.

Nine exact tab headers (in order):

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

Seven required Config keys: `schema_version=2`, integer `state_revision`, opaque `learner_id` (no name/email), `target_language="English"`, `recording_consent` explicitly `off|summary_only|raw`, `audio_consent=false|true` with separate authorization, and `cefr_confidence_label` (initially `unassessed`). Use valid JSON in `json_value`. Verify actual provider values/identity and owner, don't assume by filename.

A previously populated v2 workbook may have five original Config keys and a legacy `audio_transcript_consent`; missing `audio_consent` means false and missing `cefr_confidence_label` means unassessed, but the workbook is **not fully migrated**. Read conservatively. Only an expressly authorized append-only repair may add missing keys with exact readback, never overwrite unknown settings. Audit orphan Activity/Attempt IDs, privacy modes and session/competency references before claiming longitudinal completeness; quarantine malformed rows, do not invent history. No destructive bootstrap on existing populated workbook.

## Lesson preflight (before rendering scored tasks)

1. Search the learner-owned unique workbook (including `ASIT — Private Learner State`), verify owner, exact nine headers, Config and permission. If `off` or unavailable, render lesson honestly UNSAVED, without speculative writes. Current user direction overrides private learner lesson preferences; otherwise read bounded Config preference before choosing four versus five tasks.
2. If consent active and schema verified, mint stable opaque session/lesson/parent Attempt identifiers that remain stable on replay and do not depend solely on UI `useId()`. Make **one trusted Activity per separately graded subtask**, with fixed task ID, specific competency, real modality/operation, allowed variants/rubric and source-verified CEFR descriptor only when applicable. A parent composite envelope is not itself a scored multi-domain Activity.
3. Register all required Activities (and any necessary trusted competency/session referents) in the authorized workbook using supported provider calls. Check existence first, avoid collisions; preserve already existing equivalent IDs. **Read back exact pre-registered Activity IDs, task metadata and criteria before presenting lesson**. If registration fails/ambiguous, do not claim `save-ready`; present unsaved or defer the scored activity, clearly state limitation. Do not later silently fabricate missing registration.

## Same-turn submission: assessment → dedupe → persist → verify → projections

1. `asit-assessment` independently validates and grades the actual submitted `ASIT_ATTEMPT_V2` against the trusted per-subtask map. Missing item = `not_assessed`; recognition, typed writing, listening and speaking evidence are separated. Use provisional client metadata cautiously.
2. Immediately check active permission, unique workbook/schema/consent/revision and original Activity readbacks. Consent already present means no repeat prompt. Missing store, off, unregistered Activity or forbidden modality ⇒ `Not saved` (or `Not verified` for ambiguous outcome), while still giving useful feedback. Never fabricate pre-registration or backfill historical evidence silently.
3. Derive each subtask Attempt ID **deterministically from the trusted already-minted parent Attempt ID and stable task ID**. Replay must resolve to same ID. Query each exact ID before writing. Confirm duplicate event identity/outcome; equivalent ⇒ don't append, mismatch or ambiguous `summary_only` replay ⇒ stop without duplicate append. An actual collision cannot be solved by suffixing on replay.
4. For eligible absent items, prepare **one bounded batch** of Attempts where supported; do not include unrelated modifications. Store only a non-verbatim summary in `summary_only`, respecting actual graded answer and exact operation/modality; raw original/first answers and transcripts must not leak into Events, Activity prompts, review notes or metadata. Audio consent is independently verified. Optionally store privacy-safe first-try/revision counts as `attempt_provenance` Events marked `ui_provenance=self_report_unverified`.
5. The provider's write acknowledgement is NOT a sync receipt. Read back each exact Attempt ID and validate parent/session/lesson/activity/competency IDs, grade, attempt number, privacy, operation, modality and summary/answer. If write result is unknown or times out, query exact existence **before any retry**; never blindly append. Google Sheets read-before-write is non-atomic for concurrent clients; do not claim exactly-once or distributed transactions.
6. Only verified Attempts may update necessary Sessions, Competencies, Reviews and `Config.state_revision`, guarding observed revision against conflict. Batch compatible projection edits only where safe. Read back **each** required projection. Preserve contradictions and historical errors, avoid fabricated review rows or retroactive CEFR mapping. If projection write fails after Attempts verify, leave a recoverable partial state.
7. Report only: `Fully synced` after every required Attempt and projection readback; `Attempt saved / Partial sync` if Attempts verified but projection(s) incomplete; `Not verified` if provider result/duplicate/conflict cannot be resolved; `Not saved` if no write took place. State a short reason, return educational feedback regardless. Never show successful-save badge before the evidence.

## Fast path: grouped operations with full evidence

This is a **model-followed strategy** for authorized connector calls, not a background process, transaction, cache service or guaranteed call budget.

1. **Current-turn snapshot:** verify workbook owner/identity, required nine headers and Config on initial or uncertain access. Reuse within this turn only the provider-verified cells for current lesson preferences, original Activity rubrics, relevant goals and evidence. Re-read live consent and revision before later writes where authorization or optimistic assumptions could change. Never reuse consent/revision from a previous chat or unknown provider result; reconcile changed revisions.
2. **Preflight:** validate the entire lesson blueprint and task IDs once. Check all Activity IDs over complete confirmed bounds, group compatible writes of missing per-subtask Activities/necessary referents, then bounded-read every Activity's ID, lesson/session/competency, rubric, status, operation and modality. Any mismatch means NOT save-ready. No registration after a graded lesson is already displayed.
3. **Submit:** grade independently against the trusted blueprint. Inspect all deterministic Attempt IDs over a complete applicable ID search (page when needed). Group absent Attempt appends where supported; bounded-read and compare every original or new Attempt's identity, grade, privacy and observation fields. After unknown result query exact IDs before retry; paraphrased summary_only records do not automatically prove equivalent.
4. **Projections:** only when all eligible Attempts are verified, check expected live consent/revision, then batch compatible Sessions/Competencies/Reviews/Config edits. Read back **each required projection** including state_revision; a partial projection remains Attempt saved / Partial sync, never Fully synced. Do not batch dependency-producing Attempt writes together with projections or claim cross-sheet atomicity.
5. **Successor:** decide the next lesson from already verified scoped evidence, but re-check Config consent/revision before any separate successor preflight; independently check/register/read back its Activities. On explicit stop/pause/grade-only, grade/save the current submission without successor preflight or media work.

Aim for one provider batch write plus one grouped readback per applicable phase **where supported**; additional calls are mandatory for incomplete bounds, races, missing capabilities or ambiguous writes. This optimization does not change privacy, CEFR, media requirements, exact schema, full-field checks or the truthful Save Gate status vocabulary.

## Recovery and efficiency

- Everyday lesson reads a bounded Config, active Goals/Plan, latest Session, due Reviews, relevant Competencies and 3–6 recent relevant Attempts; don't scan entire workbook. For exact dedupe, search only ID column with bounded range inside confirmed sheet bounds; expand cautiously with pagination when necessary. If complete exact-ID absence isn't verifiable, stop rather than risk collision.
- On an authorized later turn, reconcile verified Attempt IDs to pending Session/Competency/Review/Config projections. If earlier work was unsaved because it had no trusted pre-registered Activities, request separate approval for historical reconstruction; don't mark it normal contemporary evidence or fabricate CEFR.
- First setup, schema migration, deletion, export, sharing and private storage changes require explicit user authorization. For consent withdrawal, pause ASIT writes; don't imply Drive app uninstall or history deletion. No additional authorization prompt is needed on each graded turn when current consent was previously verified.

## Acceptance scenarios (must be real provider verified to pass)

Single-task normal write/readback; four/five-subtask composite with separate Activities; stable-ID duplicate replay; conflicting duplicate; provider timeout and exact-ID existence check; no Drive; `off`; `summary_only` privacy; no preregistration; partial projection failure; parallel writers/revision conflict; new chat bounded resume; CEFR/multimodality separation. Unit/static checks never establish native ChatGPT routing, provider correctness or mobile behavior.
