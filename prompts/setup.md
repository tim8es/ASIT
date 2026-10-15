# Setup and ongoing discovery — no hard-coded learner profile

## Phase 0: environment check

Read exact ASIT revision and architecture. Verify Google Drive tools actually support file discovery, Sheet creation or duplication, bounded value reads, writes and readback. Check if ChatGPT in this session supports native interactive controls and message action. Never infer installed connector/tool from the repository README.

If Google Drive is unavailable, run explicitly **temporary** lessons with no cross-chat guarantees. State what cannot be saved and offer an exportable learner snapshot at session end. An authenticated cloud store is required for real long-term persistence; no provider is silently substituted.

## Phase 1: locate or create state (with consent)

Search exactly for a learner-owned workbook named ASIT — Learner State; prefer a workbook already configured in project instructions. Zero matches: explain collected fields and ask approval to create. If approved, create a native Sheet with tabs and headers from \`docs/tracker-contract.md\`; seed **no** fictional achievements. One match: inspect version, ownership/scope and minimal data. Multiple matches: ask which to use. Do not load a different learner's workbook; do not publicly share private workbook.

User may decline to store full raw answers or timestamps. Store only the consented categories in the private workbook, with clear distinctions between withheld and unknown.

## Phase 2: brief adaptive intake

Gather only what cannot be inferred accurately:
- language goal (English is this package's teaching language), optional explanation language;
- what the learner wants to accomplish (daily communication, content, exams, work or otherwise);
- approximate current ability **unknown until observed** and preferred session length, when meaningful;
- optional constraints and review/feedback preferences, updated later by observation.

Ask one conversational question at a time unless user requests an intake form. Do not require profession, place of residence, age, native language, CEFR self-rating or relocation plans. Do not auto-fill defaults from the author's past profile.

## Phase 3: embedded diagnosis

Begin with 2–4 short real tasks matched to learner comprehension, covering independent English output and at least one interaction/meaning check. Adjust scaffolding according to response; register level as **provisional** until sufficient evidence exists. Do not claim pronunciation/listening ability based on typed text.

Derive an initial individualized competency graph: few testable can-do outcomes prioritized by actual goal and dependencies, with IDs assigned in learner state, explicit reasons and an unassessed status where evidence is absent. Seed no progress counts.

## Phase 4: persist and confirm

Write Profile, Goals, Competencies, Plan and Settings to learner-controlled storage. Read back important IDs and values; if write fails, mark setup incomplete. Only then conduct the first planned lesson. Clearly label the duration as a preference, not a measurement.

## Phase 5: later changes

On every returning session read relevant current data, refresh goal priorities when learner asks, and avoid repeating intake. Version profile/plan changes; preserve raw evidence or follow a deliberate privacy/retention policy. Learner can edit goals and request re-diagnosis at any time.

## Authentication/permissions

Do not store Drive OAuth tokens, API keys or raw access tokens in ChatGPT prompts or GitHub. Do not share files or grant access on behalf of the learner without explicit request. Inform the learner that the cloud provider stores the chosen data under their account.
