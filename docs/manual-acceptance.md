# Human acceptance tests — regular ChatGPT

Use a fresh ChatGPT Project, a connected Drive account and **fictional test-only learner identity**. Never use a real learner's data in public screenshots or issue comments.

1. **New installation:** begin with no matching workbook. The agent detects a missing private store, explains what will be saved, obtains consent and creates a Sheet with v2 headers. Verify no default profession, native language, CEFR level, answer or goal.
2. **Declined storage:** withhold permission. Complete a 3-turn text lesson; confirm "not saved" status and no cloud mutations.
3. **Native UI:** start interactive exercise. Change input twice; click Submit. Verify only final answer arrives in a new ChatGPT turn with an activity ID and skill ID.
4. **Evidence:** make a deliberately incomplete fictional response. Check feedback is helpful and confidence doesn't rise to mastered. Confirm one exact attempt in the private workbook.
5. **Replay:** resubmit same \`attempt_id\`. The writer must detect it and not duplicate. Change content under same ID: conflict must be rejected.
6. **Fresh chat:** start new normal chat in same configured ChatGPT Project. Confirm agent reads latest plan and exact attempt ID without a new onboarding.
7. **Adaptive lesson:** perform one guided and one independent task, then a new context. Check priority/rationale and review schedule. No invented reaction-time metrics.
8. **Interrupted store:** disconnect Drive mid-lesson. The assistant must state saving failed; no success claim or lost data silently ignored.
9. **Multiple Sheets:** create two same-titled test workbooks. Agent must ask to identify the correct one, not merge them.
10. **Modality mismatch:** request listening with no accessible audio. Agent must not present text reading as a measured listening score.
11. **Private/public boundary:** test local source scan and manually inspect **all reachable Git history** before changing repo visibility.
12. **Device check:** repeat widgets on web and mobile where available, documenting fallbacks rather than assuming equal feature support.

Record test cases, dates, client and redacted result in private QA notes. Do not publish personal answers. Mark whole-product completion only after **all mandatory acceptance gates** pass.
