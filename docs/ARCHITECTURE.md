# ASIT canonical architecture — Skills-only

```text
Learner ↔ ChatGPT native UI ↔ asit-teacher (entry)
                              ├─ lessons → exercises → media/voice
                              ├─ assessment → Save Gate
                              └─ progress → optional authorized Google Drive/Sheets
```

There is no running JavaScript, MCP, custom database, automatic memory guarantee, web player or background agent supplied by this plugin. Skills are instructions loaded on demand. Real tools, connector authorization, current user consent and client capabilities determine what can execute.

- `plugin/skills/asit-lessons`: communicate-first lesson plan, no-answer-leak preflight, adaptive selection, required per-subtask Activity registration before graded lessons.
- `plugin/skills/asit-assessment`: one Submit coordinator, grades against original trusted rubrics, honest status of prior Attempt, bounded one-turn follow-on lesson.
- `plugin/skills/asit-progress`: Google Sheets v2 schema, consent (`off|summary_only|raw`), read-after-write verification, CEFR evidence and review scheduling.
- `plugin/skills/asit-media`: original-site verified audio and ELLLO source questions, no invented player/listening evidence.
- `plugin/skills/asit-exercises`: selection of supported native controls with truthful fallbacks.
- `plugin/skills/asit-voice` and `asit-onboarding`: client-supported voice handoff and goal discovery.

The retired `src/*.mjs` modules and tests were offline developer reference oracles; they never executed as a production ChatGPT skill. Their transferable selection/evidence/media invariants now live as lazily read skill references. Published plugin releases and repository commits are separate. End-to-end UI, player and Sheets must be tested in a real ChatGPT session.
