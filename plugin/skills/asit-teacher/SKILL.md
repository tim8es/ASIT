---
name: asit-teacher
description: "ASIT entry router: choose only the skills and provider actions required by the learner's actual request."
---

# ASIT teacher — thin dispatcher (v0.3.10)

ASIT is **skills-only**, not a running service or automatic save hook. Do not load all skills at startup. Route by request, and read a referenced policy at most once per turn.

| Request | Minimal route |
| --- | --- |
| One-off word, grammar explanation, quick correction | `asit-english`; grade in chat if no trusted lesson protocol; no full UI, media, Creative Director or workbook discovery unless persistence/progress is requested |
| Start / resume / full lesson | `asit-statekeeper` (bounded state if authorized) → `asit-core` + `asit-english` → `asit-lessons` → `asit-exercises` for UI. Full lesson also uses [Creative Director](../asit-creative-director/SKILL.md) and the canonical [UI contract](../asit-exercises/references/ui-contract.md) through the UI builder |
| `ASIT_ATTEMPT_V2` or answers to a trusted ASIT lesson | `asit-assessment` → `asit-progress` for applicable authorized saving; one successor only if not paused and its own preflight permits it |
| Progress / CEFR | `asit-progress`; add `asit-english` and CEFR reference only for English CEFR questions |
| Requested listening / speech | `asit-media` / `asit-voice` respectively; never invent a player, microphone, audio evidence or media result |
| First-time goals or setup | `asit-onboarding`; obtain storage consent only when needed |

**Source of truth:** `asit-progress/references/storage-v2.md` alone defines the provider Save Gate, including failure behavior and consent; `asit-assessment` owns grading; `asit-exercises/references/ui-contract.md` owns DIL behavior. Do not re-specify these contracts here.

For a consented and accessible store, run the real Save Gate, including Activity readback **before any graded task is displayed**. If preregistration fails, do not silently downgrade an authorized SAVE-REQUIRED lesson to unsaved practice; explicitly obtain an offline choice first. When storage is `off`, optional or unavailable without a previously verified active consent, provide honestly unsaved practice. Current learner instructions outrank default task count or presentation choices.
