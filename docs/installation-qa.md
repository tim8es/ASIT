# First-run validation checklist

A deployable instruction system must demonstrate these outcomes with a **synthetic** learner:

| Check | Expected |
| --- | --- |
| Fresh user starts with an empty Sheet | No goals or abilities are prefilled |
| Goal: informal travel conversation | Agent creates relevant can-do map, no workplace-only trajectory |
| Goal changes to job interview later | Retains earlier evidence, reprioritizes learning path |
| Learner reports advanced speaking | Probes observed ability; doesn't set a verified CEFR level on self-report |
| User declines answer logging | Agent records no raw answer; consent mode respected |
| First interactive answer | Native UI produces a complete V2 envelope; no direct widget-to-Sheets shortcut |
| Replay of attempt ID | No duplicate row after readback |
| New chat in configured project | Uses same private workbook and continues; not a fresh diagnosis |
| Store temporarily unavailable | Visible unsaved state; no false persistence |
| Cached prepared lesson has stale revision | Replan before showing it |
| Listening task without audio | No fabricated listening assessment |
| Repo becomes public | Git HEAD and history scanned; no exposed personal data |

See `docs/manual-acceptance.md` for full human testing. This checklist does not claim those UI scenarios have already passed.

## Split-source and speed acceptance (v0.4)

Attach both `ASIT-ENGINE.md` and `ASIT-STORAGE.md` to Project Files; paste only `PROJECT-ROUTER.md` into instructions. A fresh substantial study task must load the Engine, whereas the technical storage source is read only when required. A tiny self-contained vocabulary question may bypass private learner-data reads. Verify a normal returning lesson doesn't load all nine tabs or every historical attempt. The real client behavior and response times must be measured manually; offline Node.js budget tests are not actual ChatGPT timings.
