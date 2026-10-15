# Generic acceptance checklist — v0.2

These are **implementation gates**, not a learner's private test log.

| Gate | Status | How to verify |
| --- | --- | --- |
| Open-source skills, schema and starter documentation | Implemented | Inspect tracked repository tree |
| Native-first UI protocol | Specified / manual test needed | Submit controlled exercise in ChatGPT |
| Deterministic state model and planning | Implemented | Node tests in CI |
| Local public-data scanning | Implemented | \`node scripts/scan-public.mjs\` |
| Private Drive Sheets read-write adapter | Experimental | Test with consenting learner-owned workbook, exact row readback |
| Safe first-run bootstrap with no preset biography | Guided workflow | Test fresh user with empty private storage |
| Fresh-chat personalized continuity | Not yet verified | Start in separate chat; independently read private state |
| Multi-activity adaptive lesson | Not yet verified | Run complete lesson, retries and delayed review |
| Voice-based ability evidence | Not verified | Only test where genuine audio is accessible |
| Exactly-once writes during parallel sessions | Not supported by Sheets | Requires transactional storage if necessary |
| Public Git history and accessibility | Blocked pending history scrub + access checks | See publication checklist |

**Important:** a successful automated test checks code invariants, not educational learning outcomes. Don't copy answers, names, actual workbook IDs or timestamps from personal pilot tests into this document.
