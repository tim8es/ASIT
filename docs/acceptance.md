# Generic acceptance checklist — v0.2

These are **implementation gates**, not a learner's private test log.

| Gate | Status | How to verify |
| --- | --- | --- |
| Generalized teaching prompts, schemas, setup docs | Implemented | Review current repository tree |
| Deterministic state, planning, review, lesson blueprint and trend utilities | Tested | Node.js tests and GitHub Actions |
| Source HEAD privacy scanner | Tested | `node scripts/scan-public.mjs` succeeds |
| New Git root with no parent commits | Verified | Main branch commit metadata |
| Residual old Git objects no longer retrievable | **FAIL — old SHA addressable** | GitHub direct commit lookup |
| Native interactive submission protocol | Specified / partial private pilot | Human UX test needed in clean v2 |
| Cloud storage v2 bootstrap from empty user profile | Not yet end-to-end verified | Synthetic ChatGPT + Drive test |
| Privacy-conscious consent and summary-only code | Implemented/tested in pure codec | Real consent workflow still requires manual test |
| New-chat continuity with private state | Not yet verified | Fresh configured conversation test |
| Full multi-activity adaptive lesson | Not yet verified | Complete manual lesson test |
| Voice/pronunciation evidence | Not verified | Requires access to actual audio |
| Atomic exactly-once writes | Unsupported by Google Sheets | Transactional backend needed if required |
| Public release | **BLOCKED** | Fix residual history exposure and remaining release checks |

Never report current unit tests as proof of language-learning outcomes or full product readiness. Do not publish real learner data in QA documentation.
