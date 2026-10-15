# ADR-001 — Native Intelligent UI + Google Sheets

Decision: Run the learning experience entirely in an ordinary ChatGPT chat and use Google Sheets as the pilot durable store. Do not build a separate frontend, custom MCP UI or backend.

Benefits: few dependencies, no LLM API key, existing connector, transparent learner state, easy install.

Costs: widget state is transient; actions must become chat turns; exact component support varies; long-term durability depends on the external connector; lookup-then-append is not concurrency-atomic.

Revisit after evidence demonstrates a need for true atomic upserts, native limitations that prevent a core lesson, unsupported audio pathways, or automation that cannot use the connected state.
