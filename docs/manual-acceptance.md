# Human acceptance tests — regular ChatGPT

Use a fresh ChatGPT Project, a connected Drive account and **fictional test-only learner identity**. Never use a real learner's data in public screenshots or issue comments.

1. **New installation:** begin with no matching workbook. The agent detects a missing private store, explains what will be saved, obtains consent and creates a Sheet with v2 headers. Verify no default profession, native language, CEFR level, answer or goal.
2. **Declined storage:** withhold permission. Complete a 3-turn text lesson; confirm "not saved" status and no cloud mutations.
3. **Native UI:** start interactive exercise. Change input twice; click Submit. Verify only final answer arrives in a new ChatGPT turn with an activity ID and skill ID.
4. **Evidence:** make a deliberately incomplete fictional response. Check feedback is helpful and confidence doesn't rise to mastered. Confirm one exact attempt in the private workbook.
5. **Replay:** resubmit same `attempt_id`. The writer must detect it and not duplicate. Change content under same ID: conflict must be rejected.
6. **Fresh chat:** start new normal chat in same configured ChatGPT Project. Confirm agent reads latest plan and exact attempt ID without a new onboarding.
7. **Adaptive lesson:** perform one guided and one independent task, then a new context. Check priority/rationale and review schedule. No invented reaction-time metrics.
8. **Interrupted store:** disconnect Drive mid-lesson. The assistant must state saving failed; no success claim or lost data silently ignored.
9. **Multiple Sheets:** create two same-titled test workbooks. Agent must ask to identify the correct one, not merge them.
10. **Modality mismatch:** request listening with no accessible audio. Agent must not present text reading as a measured listening score.
11. **Private/public boundary:** test local source scan and manually inspect **all reachable Git history** before changing repo visibility.
12. **Device check:** repeat widgets on web and mobile where available, documenting fallbacks rather than assuming equal feature support.

Record test cases, dates, client and redacted result in private QA notes. Do not publish personal answers. Mark whole-product completion only after **all mandatory acceptance gates** pass.

## Catalog v0.5 — 18 pattern regression walkthrough

13. Verify all 18 catalog types have distinct meaningful intended learner operations (17 practice, one `progress_explorer`). In the normal 7-minute lesson only a pedagogically selected subset is displayed.
14. Test `reading_comprehension` with a continuous actual passage, one gist item and one evidence-detail item. Confirm no listening score.
15. Test `timeline_ordering` on desktop, mobile and keyboard-only. Shuffle events, Undo, Reset and check correct/try-again only when source chronology is unambiguous.
16. Test `image_hotspot` with *real pointer and keyboard selectable regions*. If unsupported, verify the agent clearly replaces it with image choice or text recognition, NOT a fake hotspot or click score.
17. Compare `sentence_builder` semantic chunks against `card_ordering` individual word cards. Verify their independent-transfer follow-up and sensible hints.
18. Test a genuine dialogue with at least two learner messages and a context-aware assistant follow-up. A single input must not be marked multi-turn.
19. Test a scenario with required choice **and** reason; a partial answer must remain incomplete. Test partially matched triples and partially ordered cards.
20. Give a wrong first response, revise and use a hint. Verify first response/revision/support metadata is not misreported as unaided accuracy or mastery.
21. Without playable source audio or accessible learner recording, verify listening and speaking remain unassessed. On an enabled client, obtain consent as needed and test *actual* audio source, playback/capture and feedback.
22. Test long storyline paragraph with popover help on mobile; if the inline trigger breaks sentence flow, verify the tappable explanation appears *after* the uninterrupted sentence.
23. Test final required writing blank. Ensure 4/5 is labeled incomplete, positive finale stays locked and explicit incomplete early exit does not fabricate writing evidence.

Complete and date these actual-device cases before reporting the whole interactive product as validated. GitHub CI alone verifies contracts and pure reference helpers, not the native UI.

## Same-chat Voice handoff (real mobile user test)

24. On a device with the platform Voice icon available, begin in an ASIT Project chat, select Voice **manually**, allow microphone access and request a three-minute audio lesson. Verify a genuine audible teacher sentence and one listener reply before attributing any listening evidence. The chat's native Voice settings may vary.
25. Try the same session with the text transcript visible or read during response. Verify **audio + text supported**, not pure independent listening, is the recorded modality.
26. Request a spoken reply and continue for at least two responsive learner turns. If only a transcript is available to the evaluating teacher, verify pronunciation stays **not_assessed** even though textual appropriateness can be reviewed.
27. If Voice is not shown or cannot be activated, verify no fake Play/Record button, no sound-score claim and a valid text lesson fallback. Check that the plan/record did not claim to start Voice programmatically.
28. Confirm the teacher does not save private voice content to Drive without specific consent and a write+readback receipt; no audio or transcripts reach GitHub.

## Listen → Answer MP3 card acceptance

29. Open a **real offline MP3** in the standalone self-contained demo on iOS, Android and desktop browser. Press Play and confirm actual audible words, not an animated icon. Confirm working 0.8× and Replay.
30. Before playback completes, questions remain disabled/hidden. On audio error the learner sees an honest failure and no listening score. Test offline/self-contained operation with network disconnected.
31. After audible playback, answer wrong and right gist/detail items; confirm one Submit, itemized feedback and no answer-key leakage before attempt. Short answer supports acceptable time variants.
32. Leave a required detail blank: cannot submit normally; check explicit incomplete early finish if provided. Try transcript reveal only after first attempt.
33. If learner reads transcript before answering or reports not listening, evidence is text-supported/unassessed, not independent auditory comprehension. Player ended event alone must not automatically certify hearing.
34. Distinguish native **in-chat** playback from opening a downloaded MP3/standalone HTML in an external browser. Passing standalone browser checks alone is **not** native ChatGPT mobile audio-card acceptance; keep that UI capability labelled unverified until directly tested.
