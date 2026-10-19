# ASIT v0.3.15 — Save Gate acceptance

Authority: `skills/asit-progress/references/storage-v2.md`. Implementation recovery: `skills/asit-progress/references/save-recovery.md` (subordinate to canonical policy). This file is a test matrix, not a competing storage policy.

| Case | Expected result |
|---|---|
| `recording_consent=off` | Zero writes, `Not saved`, learner can study normally. |
| Unknown/unauthorized workbook | No invented receipt, optional unsaved practice only without verified active consent. |
| Active saving before scored UI | Exact separate Activities registered and read back; failures block new scored UI until recovery or explicit offline choice. |
| Five-task Submit | Distinct trusted per-task Attempts and stable full IDs; no duplicate on replay. |
| Original per-task ID found | Read full row, compare immutable fields; equivalent row reused, conflicting row => `Not verified`. |
| Unknown write outcome / timeout | Search all relevant exact IDs before retry; partial result writes only verified-absent IDs; uncertain state => `Not verified`. |
| Retryable Google Sheets error | At most **one same-turn retry** of the same originally authorized operation after proof that target ID(s) remain absent; followed by readback. |
| Permanent auth, permission, schema or revision error | Zero automatic write retries; explain remediation, no forced offline transition. |
| Platform safety refusal | **Zero automatic write retries. Never rephrase, split or shorten a denied payload to bypass safety enforcement.** Safe read-only reconciliation if allowed. |
| Consent `summary_only` | No raw answer, transcript or reconstructable fragment in Attempts/Events; no leaked private workbook data. |
| Attempts verified; projections failed | `Attempt saved / Partial sync`, retry only missing projections after revision/consent verification. |
| All required Attempt/projection reads verified | `Fully synced` and no exactly-once guarantee. |
| Already fully synced replay | No duplicate rows, no double increment in Competencies or Config. |
| Successor after save | Own new Activity registration/readback, even when predecessor fully synced. |
| Existing old Config | Safe defaults; no silent schema mutation. |
| Concurrent revision conflict | Do not overwrite; truthful `Not verified` until resolved. |
| CEFR | No listening/Voice inferred from text, no independent CEFR evidence from guided selection or UI-only first answer. |

Static scripts verify only written invariants. Real provider, client, latency, actual retry and host safety behavior require independent tests on an authorized **test** workbook. Nine tabs, `ASIT_ATTEMPT_V2`, consent model and skills-only architecture remain unchanged.
