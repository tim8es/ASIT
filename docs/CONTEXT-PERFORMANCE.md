# ASIT v0.4 — context and UX performance audit

This is a **reproducible engineering cost model**, not a measured ChatGPT token count or a service-latency benchmark. Actual model tokenization and ChatGPT connector response times cannot be inferred from text length alone.

## Source costs (measured as JS string characters)

| Source | Previous MLP | Split engine v0.4 |
| --- | ---: | ---: |
| Project Router | 1,757 | about 1,757 (unchanged) |
| Universal Engine | 9,402 | about 6,762 |
| Initial always-needed instructions | **11,159** | **about 8,519** |
| Storage contract | embedded above | about 5,741, **read only when needed** |

The source start set is approximately **24% smaller** than before. Approximate prompt-token proxies can be obtained using `ceil(characters/3)`; this is a conservative **character heuristic**, *not* a GPT tokenizer, an actual context-window accounting or a promise of proportional speedup. The cold start with **both** engine and storage contract is larger than the old one-file source; the optimization is selective retrieval, not always smaller first-run setup.

To reproduce measured character counts and synthetic packet costs run `node scripts/context-audit.mjs`; it also runs in CI. This script uses fabricated learner records only.

## Why context grows without a bound

- Source text can be 10k+ characters before any lesson takes place.
- Every historic attempt, old activity rubric, review and transcript accumulates independently. Serializing an entire private workbook into a new chat grows linearly and could bury the current learning objective.
- Every native interface, prompt, quoted answer and tool response also occupies context. Long discussions can grow even if learner state is stored externally.
- Fetching the Project Engine and storage schema on *every learner message*, or writing several sheets after each small text reply, adds needless latency.

## Runtime loading policy

| Intent | Initial source | Private records | On-demand extra |
| --- | --- | --- | --- |
| One-word meaning / tiny standalone answer | Direct answer if history irrelevant | None | None |
| Normal new learning chat | Router + Engine once | Config keys, active plan/goals, last Session, due Reviews, relevant skills and **max 3–6 recent scoped attempts** | Storage adapter only when doing connector operation |
| Current exercise / feedback | Source already in chat | Current activity/rubric and current answer only | Exact attempt ID lookup + verification if saving |
| New learner / consented bootstrap | Router + Engine | Only records legitimately collected | Load Storage adapter once, create/check nine tabs |
| Requested long-term analytics | Router + Engine | Explicit bounded paginated history | Additional focused reads, completeness disclosure |

Never interpret an incomplete daily packet as full diagnostic evidence. Stored competence evidence counts or statuses remain qualified provenance, not independently recalculated from a few attempts. **Raw answers must not be copied into a routine planning context**, even if user consented to storing them. For a direct review request, retrieve exactly the needed consented raw record.

When the cached `state_revision` changes, revalidate the relevant plan and affected rows. Do not restart from an empty curriculum or reread the entire learner history. `src/hydrate-state.mjs` is a comprehensive strict restoration/reference verifier; **ordinary agent startup uses the bounded context policy** (`src/context-packet.mjs`) rather than loading nine full tabs.

## Context caps for ordinary lessons

Reference packet caps, validated on synthetic history:
- Up to 5 relevant competencies and 3 active goals.
- Up to 3 due review cues and the last session summary.
- Up to 6 relevant recent attempts, including a **brief consented summary** and assessment metadata; no verbatim answers.
- Up to 2 recent adaptation decision rationales and evidence IDs.
- **6,000 serialized characters** for the whole selected lesson packet by default. Over-budget behavior drops optional older evidence first; never truncates away the trusted active rubric or fabricates missing observations. If essential data are too large, request a narrower slice.
- These are **default fast-path limits**, not limits on learner-owned storage or on explicit progress analysis.

The reference packet construction operates on synthetic in-memory objects. In live ChatGPT, the agent must translate this into **targeted connector reads**; fetching everything then trimming it does **not** save connector time, tokens or bandwidth.

## Interactive UX and latency policies

1. Start with a learner-facing next step, not a long infrastructure report.
2. Ask only one essential onboarding question at a time; keep practice moving even if Google Drive is offline, marking it unsaved.
3. For structured lessons render **the complete current lesson** (seven minutes and up to five tasks by default, or learner-configured duration/count; one Submit), not a whole future syllabus or large answer key. In free chat render no unnecessary form. Keep hints optional and short.
4. Within one chat, keep the retrieved Engine, small state slice and current trusted activity. Avoid re-fetching unchanged source/plan after each answer.
5. Batch logically related read or write operations when the connector supports it and preserving readback guarantees permits it. Verify important writes before claiming success; don't sacrifice safety for speed.
6. Prefer a **session checkpoint** for noncritical summary updates rather than editing Goals, Plans, Reviews and Sessions for every conversational turn. Significant consented attempts still require their own exact-ID replay check and readback.
7. Start a new Project chat between substantial lesson segments when the conversation is becoming unwieldy; recover from the private tracker, not by copying the entire old transcript. No arbitrary "model can remember 100k tokens" guarantee.

## On-demand UI pattern loading

The UI Orchestrator uses compact generic action/modality/capability rules; it must not preload every rich lesson pattern. Load only `ui/UI-ORCHESTRATOR.md` when UI composition is needed and the selected pattern recipes from `ui/patterns/*.md`. Ordinary answers and free conversation require no UI recipe at all. A structured seven-minute mini-lesson is an **exception** to the legacy one-task-per-message guidance: show its coherent 1–5 tasks together with one Submit. This is an instruction-loading policy, not a measured token/latency reduction.

## What is and is not measured

**Measured / reproducible:** literal source lengths, constructed synthetic packet size with histories of 0, 50, 500 and 5,000 attempts, and local Node.js execution time for packet assembly. CI enforces a stable packet cap and does not store personal records.

**Not measured:** GPT-6 provider tokenizer, hidden system/context overhead, actual remaining ChatGPT context window, project-file retrieval tokenization, mobile rendering latency, tool/network time, real concurrent Sheets performance, perceived enjoyment or learning efficacy.

**To validate after installation:** record cold-start-to-first-question, user answer-to-feedback, number of connector calls, whether a new chat uses bounded reads, and perceived UI clarity. Use locally held or anonymized observations; never publish raw learner text.
