# ASIT MLP — manual user acceptance

Use a **fresh ChatGPT Project**: attach [ASIT-ENGINE.md](../install/ASIT-ENGINE.md) and [ASIT-STORAGE.md](../install/ASIT-STORAGE.md) to Project Files and paste only [PROJECT-ROUTER.md](../install/PROJECT-ROUTER.md) into Project Instructions. Test as a learner inside ordinary ChatGPT, not in a separate application. Report only redacted issues: never publish real learner answers, private URLs, connected file IDs or identifying screenshots.

## 0. Source initialization

In a new chat, verify ASIT actually reads the attached engine file before teaching. Without the attached engine, the router must report the missing source, not fabricate its contents. A private GitHub link alone is not a reliable substitute.

## A. First contact

Start a new chat: **"Start my English program."** ASIT should promptly discover one real-world goal, ask only essential questions, and get the learner using English. It should not presume native language, profession, CEFR level, target B2 or session length. It should propose a concrete, achievable can-do objective and explain why it matters.

**Failure:** long forced intake; invented profile; verified CEFR claim based on one answer.

## B. Consent and installation

If Google Drive is connected, ASIT should explain storing private learning state and offer **summary-only**, **verbatim answers** or **no storage** before any write. After consent, it should create a private Sheet with nine exact v2 tabs, provider-assigned tab IDs and correct headers, verify readback, and leave untested skills unassessed. No spreadsheet work should be required from the user.

**Failure:** writes before consent, guesses among multiple same-named workbooks, or claims saved before verification.

## C. Meaningful native lesson

Request **"A 5-minute interactive lesson on my goal."** Look for a compact target, purposeful editable controls and a functioning Submit that sends the actual input into the conversation. If unsupported, ordinary text practice must work. Deliberately give a partial answer; verify specific consolidated feedback, then try a subsequent **complete remediation lesson** with a different independent-use situation. A choice task should not upgrade spontaneous speaking.

**Failure:** decorative UI, leaked answers, inability to submit, fabricated pronunciation rating or fake progress.

## D. Separate-chat recovery

In **another chat in the same configured Project**, say: **"Continue my English program. What did I practise last time and what's next?"** ASIT must re-read relevant private state, recognize the previous goal/attempt and continue without repeating onboarding. It must not fabricate recall from previous-chat text or present a saved summary as an exact quote.

**Failure:** wrong plan, invented result, repeating all onboarding, or confidently saying "saved" while Drive is unavailable.

## E. Robustness and agency

Change the goal, dispute a grade, request review of a weak skill, refuse storage, replay an attempt ID, or interrupt a lesson. Check that previous evidence survives changes, retries don't create duplicates, incomplete sessions aren't "complete", a failed write is not reported as saved, and there is a usable text fallback. For listening, demand real accessible audio rather than text passed off as audio testing.

## G. Full-lesson remediation regression

Configure five exercises in seven minutes. Complete one regular lesson with a deliberately partial written answer. The next structured remediation must present **five related exercises together** in one interactive form, with varied operations and one working Submit, then a single consolidated assessment. It must not ask one question at a time or require finishing a correction before seeing other tasks. Run the same check for a due review. Confirm recognition-only correctness does not inflate independent-production evidence.

Repeat after explicitly asking for **one quick question**: the short exception should work without mutating the stored exercise-count preference. A learner profile without any individual correction-format setting should still get the full remedial lesson; this is a universal requirement, not stored user preference.

**Failure:** serial one-item remediation after a partial submission, unexplained reduced task count, multiple Submit turns for one planned lesson, or learner-state mutation of baseline UX behavior.

## Reporting

For A–E record pass/fail, ChatGPT client type, whether native controls appeared, whether Drive works, and brief redacted observations. Only after critical cases pass should the project be described as a *human-accepted MLP*. Unit tests and connector smoke tests alone are not that evidence.

## F. Speed, context and UX acceptance

In a new chat confirm that the Engine is retrieved once, not on every attempt. On normal returning sessions verify that the learner's entire historical Attempts/Activities tabs are **not** loaded. Ask a short word meaning and confirm it needs no unnecessary Drive traversal. Complete a 5-minute lesson and note the elapsed wall-clock time for cold-start-to-first-task and answer-to-feedback; these are human observations, not values measured by CI. Confirm that learner-specific challenge and hints adapt across sessions without ever editing Project Instructions or Engine source. If the client cannot reveal connector/tool activity, mark the read-count check **unverified**, not passed.
