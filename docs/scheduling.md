# Scheduling and lesson preparation

ASIT should use ChatGPT's built-in Scheduled Tasks **only when available and enabled by the learner**; there is no bundled cron server. A reminder does not require any external infrastructure.

## Honest capability boundaries

Scheduled Tasks can support recurring reminders. Access to connected apps and project files varies by feature, account and task. Official guidance warns that a scheduled task created in a ChatGPT Project cannot access that Project's uploaded/files-in-project content; do not assume private learner storage is available in a scheduled invocation.

Source: [OpenAI — Scheduled tasks in ChatGPT](https://help.openai.com/en/articles/10291617-scheduled-tasks-in-chatgpt).

## Progressive behavior

Level 0 (works without permission): propose an appropriate next lesson when the learner opens a normal chat. Track due reviews in the private Sheet only.

Level 1 (optional native automation): the learner asks to receive a reminder or study invitation at a chosen cadence. Create a supported ChatGPT Scheduled Task after consent. Do not include private learner data in publicly shareable task instructions.

Level 2 (only after capability test): a task with verified permission may read private state, prepare a draft lesson with state_revision, write draft to private storage and notify. On lesson start, reject or adapt a draft if state revision has changed. **Until that capability test passes, do not promise automatic prereading or personalized background preparation.**

No external scheduler is mandatory for local setup, and no unsupported voice tasks are promised.
