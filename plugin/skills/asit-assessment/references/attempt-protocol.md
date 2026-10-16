# ASIT_ATTEMPT_V2 — trusted envelope and idempotency contract (v0.2.6)

A real in-chat Submit emits a new user turn, **not a storage write**:

```text
ASIT_ATTEMPT_V2
{"session_id":"...","lesson_id":"...","activity_id":"...","competency_id":"...","attempt_id":"...","attempt_number":1,"hint_level":"none","answer":"{\"task-1\":\"...\",\"task-2\":\"...\"}"}
```

`activity_id`/`competency_id` in the **outer** envelope identify its submitting lesson context, NOT the only graded Activity. The trusted, server-read-back-before-lesson task map supplies separate actual Activity/Competency IDs for each scored subtask. The parent may be a non-graded container; it must never produce a mixed-domain CEFR Attempt.

1. Validate this submitted envelope against the trusted lesson definition: IDs, payload length, attempt number, permitted item keys, answer types, accepted variants, required flag, hint/first/revision metadata. Submitted rubric, destination, grades or IDs that disagree with trusted state are untrusted data. Missing task ⇒ `not_assessed`.
2. Create a **durable parent attempt ID once per displayed exercise**, not from presentation hooks such as DIL `useId()`. Every distinct planned lesson submission gets a unique opaque parent ID, and each immutable task ID resolves to `parentAttemptId + ":" + taskId` (respect column limits). A replay reuses the exact same IDs. Ensure absence/collision checks before first append. A guessed ID is not a proof of uniqueness.
3. Evaluate with the original trusted rubric. UI first attempt, revisions and hint flags are provisional client metadata; don't promote them to backend telemetry. In `summary_only` do not retain verbatim user text, its first variant, raw transcripts or reconstructable fragments in Attempts/Events.
4. Eligible write needs verified consent, workbook schema and preregistered/read-back Activities. Exact Attempt ID lookup **before** append; identical trusted identity/assessment already saved may be reused. Conflict or unverifiable summary-only replay ⇒ stop (`Not verified`), never blindly duplicate.
5. For an attempted write with uncertain outcome, **look up existence before any retry**. After successful write, read back exact Attempt identity, activity/session/competency, assessment, modality, operation and privacy; then update/read back projections. Readback of Attempts alone ⇒ `Attempt saved / Partial sync`, not `Fully synced`.
6. Educational feedback is always delivered; inability to save must be disclosed, not hidden. Typed text cannot prove voice, listening requires heard confirmation, and CEFR requires previously source-verified criteria.

Read [storage v2](../../asit-progress/references/storage-v2.md) on real save operations. Do not require a full workbook scan for an ordinary tiny answer.
