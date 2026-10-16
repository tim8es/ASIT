# ASIT v0.2.6 Save Gate acceptance

## Before publication — static package tests

- [ ] Valid synchronized v0.2.6 manifests and existing plugin identity/onboarding.
- [ ] No executable MCP/server/hooks claimed, no artificial data store or fabricated Drive actions.
- [ ] Submit always routes into asit-assessment, with same-turn storage decision and verified status.
- [ ] Lesson preflight registers *each graded subtask* before presentation, or announces unsaved mode.
- [ ] No composite parent Activity offered as replacement for separate graded Activities.
- [ ] Stable replay ID defined; DIL useId prohibited as durable Attempt ID.
- [ ] `summary_only` bars verbatim, first answers and transcripts; consent off bars all writes.
- [ ] Readback confirms Attempt AND applicable Session, Competency, Review and Config before Fully synced.
- [ ] Current user lesson preferences override verified learner profile, which overrides fallback default.

## After publication — real-chat/provider dogfooding (not claimed by static tests)

| Scenario | Required observed proof |
|---|---|
| Normal 4/5-task lesson | Distinct Activity IDs registered and read back *before* UI; per-task Attempt IDs and readback after Submit |
| No Drive/consent off | Accurate feedback, `Not saved`, zero writes |
| Legacy/malformed workbook | No destructive repair, `Not saved` + specific blocker |
| Repeated exact Submit | No duplicate Attempt rows, previously verified ID reused |
| Conflicting replay | Stop, `Not verified`, preserve original row |
| Summary-only | Only non-verbatim result and operation persisted, no raw first answer |
| Timed-out write | Search exact ID before retry, never blind append |
| Attempts written, projection failed | `Attempt saved / Partial sync`, recover by original verified IDs |
| Concurrent submissions | Report unresolved race accurately, no claimed exactly-once guarantee |
| New chat resume | Bounded reads recover verified focus, attempts, due review and learner exercise-count preference |
| Multimodality task | Reading/listening/typed writing kept distinct; unheard audio unassessed |

For confidence, run 30 sequential real Submit tests with user-authorized test workbook, and separately inject error cases; count success only from provider readback. Do not use production learner records for stress tests. Do not claim this test was run unless it was.
