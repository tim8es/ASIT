# ADR-003 — Collect only consented learning evidence

Decision: the learner chooses whether to persist exact text answers. The simpler privacy default for the reference storage codec is \`summary_only\`, but the UI should **ask for consent before any persistence**. For opt-out, use \`off\` and do not write.

Stored derived summaries must not secretly reproduce raw answers verbatim or contain unexpectedly sensitive content. Raw evidence is more pedagogically auditable, but also more invasive; offer it as an explicit choice.

The assistant must preserve assessment limitations when summaries are stored. Learners can request correction, export or deletion of their records. No third-party analytics is included.
