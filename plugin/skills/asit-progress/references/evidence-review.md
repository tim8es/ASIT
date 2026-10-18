# Evidence/status/review invariants — model-followed portability contract

Read on verified progress summarization, due Reviews, adaptive decisions and CEFR evidence reports. This policy preserves the important behavior of the former offline src/learning-state.mjs, src/analytics.mjs and src/store-gateway.mjs. It does **not** run automatically. Live validation and Google Sheets persistence remain subject to the exact Save Gate and CEFR procedures.

## Scoped observed evidence
- Allowed task verdicts: correct, partial, needs_support, not_assessed. Hint levels: none, minimal, frame, model, unknown. Learner evidence statuses: unassessed, emerging, supported, independent, transferable.
- Filter to the requested competency and **required observed modality/operation**. Unknown, mismatch and not_assessed may be counted as excluded, never upgraded into productive or receptive skill evidence.
- With no scoped graded attempts, status is unassessed. One or more scoped attempts with no correct/partial outcome: emerging. At least one partial or correct with no currently reliable independent outcome: supported. A correct, unaided matching attempt may support independent. For transferable require at least two unaided correct production/interaction/comprehension attempts in at least two distinct **sessions** and two distinct **contexts**, with no recognition/unknown operations; the most recent unaided scored attempt must not be a failure. If later unaided evidence fails, lower current status but preserve historical attempts.
- Never combine dimension-level evidence into certified CEFR or upgrade typing to spoken/audio, and never infer comprehension from a transcript alone. Exact verified CEFR descriptors and activity-level rubrics remain mandatory for CEFR-aligned inferences.
- Missing context/session identifiers prevent proof of distinct contexts/sessions; repeat UI retries and same-session repeats cannot establish transfer. Note which evidence was excluded when reporting status.

## Mandatory evidence-family normalization and skip handling

Use [evidence compatibility](evidence-compatibility.md) to interpret broad `Competencies.required_modality / required_operation` against fine-grained `Attempts.observed_modality / observed_operation`. Exact string equality would exclude legitimate `reading / reading_inference` for `reading / comprehension`; indiscriminately accepting all writing would miscredit `guided_chunk_order` as independent. Normalize into supported recognition, guided construction, comprehension and independent production/interaction. **Do not change historical Attempt text or backfill CEFR mappings.** Unmapped pairs remain excluded and reviewable; supported recognition never implies transferable communication.

An intentionally skipped question is `not_assessed`, not an error. Its reason must be learner-explicit or `unknown`; no mastery update, negative inference or review is scheduled from absence alone. A model-only matching rubric does not itself execute a Sheets projection. Read/write/readback only with authorized Save Gate.

## Review scheduling heuristic (port of src/learning-state.mjs)
Only schedule when a real graded Attempt and a reliable current time are available. For needs_support, partial, or correct with ANY hint, suggest a review after **1 day**. For unaided correct outcomes, suggest successive delays **2, 4, 7, 14, 21 days** based on confirmed prior successful reviews (zero-based). Do not create a Review from not_assessed or unverified UI telemetry. These are provisional intervals, not scientifically calibrated per learner. Respect actual stored due dates and verified preferences rather than replacing them with guesses.

## Replay and Sheets integrity
Before writing, verify trusted source Activity, consent, workbook schema and exact headers. Find exact Attempt ID; if a matching persisted row exists, avoid duplicate append. If only summary_only persisted data exists, a regenerated summary of the same raw answer **does not prove equivalence**; conflicting/ambiguous replay is Not verified. After provider uncertainty, read existence before retry. Read back every required stored field, not ID alone. Only readback-verified Attempts may update Sessions, Competencies, Reviews or Config state_revision. Atomicity across tabs and exactly-once delivery are not guaranteed; use the four truthful Save Gate statuses.
