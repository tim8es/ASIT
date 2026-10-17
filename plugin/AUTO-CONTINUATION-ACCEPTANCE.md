# ASIT v0.2.8 — automatic lesson continuation acceptance

Static tests verify contract text only. Manual end-to-end checks are mandatory in a newly started normal ChatGPT chat with ASIT enabled.

1. Submit a valid five-task `ASIT_ATTEMPT_V2`: same assistant turn contains trusted feedback, one evidenced Save Gate status, and the COMPLETE next five-task seven-minute lesson with one functional Submit. No 'shall we continue?' prompt, no extra next-lesson launch link.
2. With a verified consented Google Sheet, the next five independently graded Activities and any necessary Session are pre-registered and exact-read-back BEFORE the new lesson appears. The prior session's `Fully synced` is not treated as the next session's status.
3. Resend the identical prior `attempt_id`: no duplicate Attempts and no duplicate next lesson registration. Re-render/reuse a verified active successor, or explain the actual blocker.
4. Simulate partial projection failure after Attempts readback: preserve `Attempt saved / Partial sync`; continue only under a distinct verified next preflight, otherwise label next lesson unsaved.
5. Set recording consent `off`: still render the next lesson automatically, **without writing** and with `Not saved` for the graded previous Attempt.
6. User says `stop`, `grade only`, `pause`, or `пока хватит`: grade and report status only, without forcing another lesson.
7. Repeated `the` and `their` errors: switch operation, never more than two focused remediation cycles; continue on the active learning plan after that rather than recursively drilling the same phrase.
8. Confirm learner-specific preference (five items / seven minutes), cover + genuine visual use where suitable, feedback, genuine one final Submit, keyboard/mobile interaction, privacy and no fake audio.

Host routing, Google provider readbacks, listening, UI/mobile and repeated-submit behavior are not established by ZIP static validation. This plugin does NOT run between messages or create a scheduled background task.
