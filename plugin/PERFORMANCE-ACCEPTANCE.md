# ASIT performance and functional acceptance (v0.3.0 candidate)

This is a **live-session A/B benchmark plan**, not proof of a speedup. Static tests cannot measure ChatGPT UI latency, native interaction, tool call counts or Google Sheets persistence.

## Repeatable scenarios

Run the same subject target, 4–5-task preference, enabled tools, client and consent with installed 0.2.12 and candidate 0.3.0. For each scenario record the time from learner Submit to full response, count of provider reads/writes, loaded skill/reference count, Save Gate receipt, quality pass/fail, version and device. Repeat at least **five** comparable times before reporting a median, range or percentage improvement. Never publish private learner responses, workbook IDs or transcripts.

| Case | Must still work |
| --- | --- |
| Quick correction | Useful English explanation without loading full-lesson/media/CEFR catalogs |
| Visual 4–5-task lesson | Communicative goal, 3 cognitive operations, meaningful image-dependent tasks where appropriate, one working Submit, accessible fallbacks |
| Wrong finite choice | Immediate Incorrect — Try again, no directional clue; immediate Correct after success; free text deferred to semantic grading |
| Consented multi-task Submit | One trusted preregistered Activity per graded subtask, separate stable IDs, full Attempt readbacks, required verified projections and one truthful sync state |
| Automatic successor | New complete lesson with correct task count in same answer, but separately verified Activity preflight |
| Replay/timeout | No duplicate Attempts or successor; unknown write outcome checked by exact ID before retry |
| Consent off / no connection | Useful explicitly unsaved learning, no unauthorized writes and no invented registration |
| Revision conflict / projection failure | No false Fully synced; recoverable partial sync / reconcile |
| Listening / Voice | Genuine verified media or supported Voice; no fabricated audio evidence |
| Progress and CEFR | Verified scoped evidence; modality-separated profile; no fabricated CEFR certification |
| Pause / grade only | Grade/save current answer if authorized, do not create another lesson or media |
| Cross-chat resume | Re-check consent/revision and identity; do not rely on speculative cache |

## Invariants

- Google Sheets **nine-tab v2 schema**, recording consent, independent audio consent, summary_only handling and Save Gate statuses remain unchanged.
- Three dependent phases stay ordered: trusted Activities **before** display; deduped Attempts after real Submit; verified projections **only after Attempt readbacks**. All required fields are read back even with batch calls.
- Preserve all interactive exercise patterns, ELLLO/media, Voice, no-hints/copy-resistant independent writing, immediate provisional correctness, 7-minute/personal task count preferences, adaptation and CEFR evidence boundaries.
- Maintain honest no-connection fallback. Optimizing provider calls never justifies dropping a safety or quality check.

Only measured live sessions establish actual performance improvement; CI verifies source consistency, not model execution.
