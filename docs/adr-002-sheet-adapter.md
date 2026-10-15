# ADR-002 — Google Sheets as optional private learner store

Decision for v0.2: use only the user's existing ChatGPT + Google Drive connection for durable learning state. Do not make Supabase, Firebase, Redis, Linear, hosted MCP, Vercel or a separate UI mandatory.

Reasons: existing connector tools, familiar account model, transparent corrections, simple copying/export, minimum infrastructure.

Boundaries:
- The repository publishes schema and adapter instructions, not connection credentials.
- Google Sheets cannot enforce atomic \`attempt_id\` uniqueness or multi-table transactions.
- Unexpected schema changes, cross-learner access and connector failures are fail-closed, not silently ignored.
- If such correctness requirements become mandatory for multiple writers, evaluate a transactional store with proper scoped credentials and a migration plan before adding it.

Consequence: new users can start through a short ChatGPT setup prompt without npm or servers, while developers can run deterministic offline evaluations.
