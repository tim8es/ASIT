# Private storage contract v2 (Google Sheets adapter)

New learners use one privately owned Google Sheet named **ASIT — Learner State**. The public repository contains its **empty tab specification**, not learner files.

The exact workbook tabs/headers are defined in `templates/tracker-v2.json`. The `Config` tab key names and allowed consent options are defined in `templates/config-v2.json`. Both templates contain schemas only and no real learner data.

## New setup

Require storage consent. Find a uniquely identified existing learner workbook or create an empty native Sheet. Do not auto-select among several same-named Sheets. Create nine tabs using exact headers from the template:
`Config, Goals, Competencies, Plans, Activities, Attempts, Reviews, Sessions, Events`.

Write `schema_version = 2` into Config with JSON value `2`, state_revision=0 and the user's explicitly chosen recording consent. Save learner preferences and goals only after the learner provides or approves them. All dates are actual ISO UTC values when known; otherwise empty. An empty competency row means **unassessed**, not "can't do"; do not initialize fake results or a B2 assumption.

### Record mapping

- `Config` stores profile preferences, ID and consent as key + serialized JSON values. Do not duplicate OAuth secrets or publicize private workbook IDs.
- `Goals` holds editable user intentions.
- `Competencies` contains individual, agent-built can-do skills, dependencies, priorities and qualified summaries.
- `Plans` retains learning plan revisions with reasons.
- `Activities` is the trusted registry of prompts/rubrics, stored before accepting a reply from an older chat context.
- `Attempts` captures actual evidence, respecting privacy choice.
- `Reviews` is a compact due set, not a synonym for mastery.
- `Sessions` summarizes sessions with attempt IDs.
- `Events` records migration, assessment corrections or state changes, minimizing metadata.

Stable IDs must be unique within a learner's private workbook. Check exact attempt ID before appending and **always read back**. Google Sheets doesn't enforce atomic uniqueness; concurrent writes may collide.

## Backwards compatibility

An early private pilot workbook used `Profile, Skills, Review Queue, Sessions, Attempts` and a separate Skill ID column. Do not modify, delete, export or publish legacy personal data. Before migrating: read schema, ask user, create backup, create versioned v2 store, map only real evidence, verify sample counts and records, then switch.

The pure mapping helper in `src/storage-contract.mjs` adapts old attempts without inventing timestamps or increasing mastery. A legacy workbook can continue to serve as private evidence until a user explicitly authorizes migration.

## Export and deletion

User controls their private workbook. Permit private export, correction of provisional model assessments and deletion after confirmation and verified readback. Removing data from the current Sheet may not remove external backups, cached chats, or previously exported files; explain scope of deletion.
