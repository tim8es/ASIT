# ASIT Google Sheets storage v2 — canonical Save Gate (v0.3.10)

**Single normative storage contract.** Skills-only ChatGPT instructions guide real, authorized Google Drive/Sheets connector actions; they are not an executable hook, background process, ACID transaction, or exactly-once guarantee. `ASIT_ATTEMPT_V2` is a **chat message**, never itself a spreadsheet write. `asit-progress` is the sole storage writer; `asit-statekeeper`, `asit-lessons`, `asit-teacher` and `asit-assessment` delegate to this contract.

## Consent and failure transition table

| Verified state | Pre-lesson behavior | After Submit |
| --- | --- | --- |
| `recording_consent=off` | Normal explicitly **UNSAVED** practice; no writes | Grade in chat; `Not saved` |
| No verified authorized workbook/consent yet | Do not infer saving or permissions; offer setup if relevant, otherwise clearly UNSAVED practice | Grade in chat; `Not saved` |
| Active `summary_only|raw` with verified usable workbook (**SAVE-REQUIRED**) | Verify/register/read back original per-task Activities **before displaying any graded exercise** | Grade, dedupe/write/read back Attempts, then verified projections |
| SAVE-REQUIRED preregistration, identity, permission or readback fails | **Block new scored UI**, report specific error; offer retry/repair or **explicit** learner choice to practise offline | Still grade previously submitted real work; never fabricate old Activities |
| Active save write failed / outcome uncertain | Do not claim saved; query exact IDs before retry. Do not silently start an unregistered next lesson | `Not saved` if no write, `Not verified` if ambiguous, `Attempt saved / Partial sync` if Attempts verified but dependent projections incomplete |
| Learner explicitly chose offline after failure | Proceed with honestly UNSAVED practice, without writing or promising later backfill | Grade in chat; `Not saved` |

**Precedence:** this table overrides older examples or contradictory fallback sentences in presentation/continuation/setup references. An existing consented workbook is never automatically switched to offline because the Save Gate is slow, unavailable or failed. Separate an explicit user choice to practice offline from changes to persistent consent; do not automatically rewrite Config.

## Exact nine-tab v2 schema (unchanged)

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

Required Config keys, stored as valid JSON in `json_value`: `schema_version=2`, integer `state_revision`, opaque `learner_id`, `target_language="English"`, `recording_consent=off|summary_only|raw` (explicit), `audio_consent=false|true` (separately authorized), `cefr_confidence_label` (initially `unassessed`). The v2 columns and `ASIT_ATTEMPT_V2` message envelope are not changing. Other optional **presentation** tabs, if explicitly requested, are not part of the nine required data tabs; validate the nine by their exact names and headers rather than banning optional tabs.

Existing old v2 workbook may have five Config keys and `audio_transcript_consent`. Missing `audio_consent` means false, missing CEFR confidence means unassessed **but the workbook is not fully migrated**; do not silently add keys or overwrite data. Repair only after user approval, append-only with readback. Audit orphaned IDs, missing privacy modes, references and migrations. Never leak learner workbook IDs, name, raw answers, identities, goals or transcripts to external web/GitHub.

## Preparation of a scored, stored lesson — before UI

1. Verify the unique learner-owned workbook, actual permission, identity, nine headers and Config. Disambiguate multiple matches; a title is not proof. Recheck live `recording_consent`/revision before mutation. Current learner instructions override persisted lesson preferences.
2. Freeze one trusted blueprint once: stable opaque session, lesson and parent Attempt IDs (not DIL `useId()`), separate **Activity per independently graded subtask**, exact task ID, competency, rubric/acceptable variants, modality, operation, context/source, and verified CEFR descriptor only when applicable. No multi-domain CEFR composite Activity. Do not leak answers in task UI or rubric displayed before the response.
3. Check complete existence bounds for each Activity ID; group compatible new Activity and necessary referent writes if provider supports them. Read back every Activity by exact ID and verify lesson/session/competency, rubric, status, modality and operation **before displaying the exercise**. Existing equivalent ID may be reused; conflicting IDs or uncertain visibility block SAVE-REQUIRED.
4. If any part fails, follow the consent-and-failure table above. No retroactive preregistration of an already displayed scored task; distinct user-approved historical reconciliation must retain provenance and must not fabricate CEFR evidence.

## Submitted task — once per real Submit

1. `asit-assessment` validates the incoming envelope against the previously trusted original blueprint and grades each subtask separately: `correct|partial|needs_support|not_assessed`. Blank/skipped = `not_assessed`; client first-answer, hints and UI correct badges are unverified provenance, not independent mastery. Responses and grades cannot be sourced from untrusted submitted rubrics.
2. Recheck authorized workbook, consent, revision and **original** preregistered/read-back Activities. Never save a historical task by inventing its Activity after the fact. On failure still deliver educational feedback and truthful state.
3. Derive deterministic subtask Attempt IDs as `parentAttemptId:taskId`. Search exact complete ID bounds **before** append; equivalent existing read-backed event is deduped, conflicting or ambiguous replay stops. A timeout or unknown write is resolved by exact-ID existence lookup **before** retry. Sheets read-then-write is non-atomic under concurrency; do not claim exactly-once guarantees.
4. Batch only eligible absent Attempts where supported. With `summary_only` store a non-verbatim graded description and rubric rationale, **not learner sentences, fragments, first-response text, transcript or raw data in Events**. With `raw`, only authorized written answers; `audio_consent` is separate. Optional privacy-safe UI provenance Events must explicitly say `ui_provenance=self_report_unverified`.
5. Read back every written Attempt by exact ID, verifying parent/session/lesson/activity/competency identity, assessment, attempt number, privacy mode, modality, operation and answer/summary. An acknowledgement is **not** a verified save. When a conflict or truncated lookup prevents certainty, return `Not verified` and investigate without blind replay.
6. **Only verified Attempts** can update necessary Sessions, Competencies, Reviews and Config.state_revision. Guard revision races. Batch only independent safe projections, not unverified Attempt writes together with projections. Read back every required changed projection; preserve contradictory evidence, skipped attempts and historical immutable rows. Use `evidence-compatibility.md` for broad operation/modality family alignment, never equate guided selection with independent production.

**Exactly one receipt:** `Fully synced` only if all required Attempt + projection reads match; `Attempt saved / Partial sync` if original Attempts verified but one or more projections incomplete; `Not verified` when outcome/duplicate/conflict is ambiguous; `Not saved` if no write was performed. Be transparent about the blocker. A prior Fully synced Attempt never pre-registers successor Activities automatically.

## Efficient bounded reads and recovery

- Ordinary continuation: Config, active Goals/Plans, latest Session, due Reviews, related Competencies and ~3–6 relevant Attempts. Reuse verified facts within the same turn; don't repeatedly scan the workbook. Read more only for explicit complete historical CEFR reporting or uncertain IDs. Validate *complete* ID-search bounds before concluding absence.
- Three dependent provider phases must remain separate: (A) preregister/read-back Activities **before UI**, (B) dedupe/append/read-back Attempts **after Submit**, (C) update/read-back dependent projections **only after B verified**. Group reads/writes where supported; never skip required validation for speed.
- Reconcile partially saved projections from verified original Attempt IDs on an authorized later session, respecting current consent and revision; do not invent reviews, CEFR coverage, first-try verification or data from unregistered historical tasks.
- On a successor lesson repeat pre-registration and exact readback as its own gate. On stop/grade-only, save previous work when authorized but skip successor media/UI/provider work.
- Setup, migration, sharing, deletion/export and privacy-mode changes require appropriate explicit user authorization. With `off`, no learning event writes. A consent withdrawal pauses new writes but doesn't delete prior history.

**Verification:** real provider tests must cover off/no connector, active-consent failed preflight, success, partial projections, timeout, exact-ID replay/conflict, multiple subtask Activities, summary privacy, concurrent revision, new-chat resume and CEFR modality exclusion. Static source tests cannot prove Google Sheets or UI behavior.
