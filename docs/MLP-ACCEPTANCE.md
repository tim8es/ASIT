# ASIT MLP — manual user acceptance

Use a **fresh ChatGPT Project**: attach [ASIT-ENGINE.md](../install/ASIT-ENGINE.md) to Project Files and paste only [PROJECT-ROUTER.md](../install/PROJECT-ROUTER.md) into Project Instructions. Test as a learner inside ordinary ChatGPT, not in a separate application. Report only redacted issues: never publish real learner answers, private URLs, connected file IDs or identifying screenshots.

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

## Reporting

For A–E record pass/fail, ChatGPT client type, whether native controls appeared, whether Drive works, and brief redacted observations. Only after critical cases pass should the project be described as a *human-accepted MLP*. Unit tests and connector smoke tests alone are not that evidence.
