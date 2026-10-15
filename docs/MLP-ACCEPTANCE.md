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

Request **"A 5-minute interactive lesson on my goal."** Look for a compact target, purposeful editable controls and a functioning Submit that sends the actual input into the conversation. If unsupported, ordinary text practice must work. Deliberately give a partial answer; verify specific feedback, then retry independently in a different situation. A choice task should not upgrade spontaneous speaking.

**Failure:** decorative UI, leaked answers, inability to submit, fabricated pronunciation rating or fake progress.

## D. Separate-chat recovery

In **another chat in the same configured Project**, say: **"Continue my English program. What did I practise last time and what's next?"** ASIT must re-read relevant private state, recognize the previous goal/attempt and continue without repeating onboarding. It must not fabricate recall from previous-chat text or present a saved summary as an exact quote.

**Failure:** wrong plan, invented result, repeating all onboarding, or confidently saying "saved" while Drive is unavailable.

## E. Robustness and agency

Change the goal, dispute a grade, request review of a weak skill, refuse storage, replay an attempt ID, or interrupt a lesson. Check that previous evidence survives changes, retries don't create duplicates, incomplete sessions aren't "complete", a failed write is not reported as saved, and there is a usable text fallback. For listening, demand real accessible audio rather than text passed off as audio testing.

## G. Seven-minute lesson and varied format acceptance

In a fresh lesson, request a 7-minute mini-lesson and check that **one assistant message** contains, in order: (1) named topic and can-do goal, (2) short grammar/language-rule explanation with a non-answer model, (3) **up to five** related exercises with varied purposeful formats, (4) vocabulary recap at the end, and (5) **one functional Submit** for all form inputs. Default settings are a seven-minute lesson with up to five exercises. Verify that a learner-saved preference (e.g., 12 minutes and seven exercises) changes the next lesson while leaving other learner data intact; a one-time override must not persist. Fewer demanding tasks remain valid. Complete the lesson with a real timer: if default lessons commonly exceed seven minutes, mark the default time budget as failed and reduce content. For configured durations, compare against the saved target.

Fictional example: a learner practicing clarifications receives a cloze, an ordering control with text fallback, a meaning choice and a real conversational message. Next lesson should not blindly repeat the same dominant widget type. Keyboard-only and mobile-like fallback should work. A missing native drag UI must never masquerade as a functioning drag exercise; an absent image or audio source must not create fictitious image/speech evidence.

During initial placement, present a **bounded mixed diagnostic**, not consecutive rounds until a grammar sentence becomes correct. Require at most one remedial retry per structure before moving to another modality/operation. Confirm completed submission receives consolidated feedback and a private state write is only marked saved after readback.

**Failure:** one question per assistant response masquerading as a full lesson; absent topic/rule/vocabulary; six or more exercises; nonfunctional drag; audio proficiency from typing; an unresolved diagnostic loop.

## Reporting

For A–E record pass/fail, ChatGPT client type, whether native controls appeared, whether Drive works, and brief redacted observations. Only after critical cases pass should the project be described as a *human-accepted MLP*. Unit tests and connector smoke tests alone are not that evidence.

## F. Speed, context and UX acceptance

In a new chat confirm that the Engine is retrieved once, not on every attempt. On normal returning sessions verify that the learner's entire historical Attempts/Activities tabs are **not** loaded. Ask a short word meaning and confirm it needs no unnecessary Drive traversal. Complete a 5-minute lesson and note the elapsed wall-clock time for cold-start-to-first-task and answer-to-feedback; these are human observations, not values measured by CI. Confirm that learner-specific challenge and hints adapt across sessions without ever editing Project Instructions or Engine source. If the client cannot reveal connector/tool activity, mark the read-count check **unverified**, not passed.
