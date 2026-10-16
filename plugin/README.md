# ASIT — English Tutor / Skills-only private plugin v0.2.0

This is a standalone ChatGPT skills plugin adapted from tim8es/ASIT, commit 01bf2516c3466c01221124bce50b53627a779ccb (2026-10-16). It contains instructions and supporting references, NOT the repo's executable `.mjs` modules, a crawler, media files, an MCP server, a GitHub credential, or a private learner workbook.

## Skills in this package

| Skill | Responsibility |
|---|---|
| asit-teacher | General entrypoint, task routing and coherent lesson behavior |
| asit-onboarding | Consent-first intake and bounded multi-skill diagnosis |
| asit-lessons | Seven-minute lesson contract, can-do plan and adaptive scaffolding |
| asit-exercises | All 17 learner exercise types plus read-only progress viewer; native UI design |
| asit-media | ELLLO original-site One Minute English / Sound Grammar and honest external listening |
| asit-voice | Voice handoff, multi-turn dialogue, real speaking evidence |
| asit-assessment | Trusted rubrics, formative feedback and ASIT_ATTEMPT_V2 validation |
| asit-progress | Optional user-owned Google Drive/Sheets state, consent, readback and due review |

The plugin uses currently available ChatGPT tools only; it cannot provide tools not present in the host. It may optionally use public web search and a user-connected Google Drive/Sheets plugin when available. It should never imply that installing ASIT connects ELLLO as an API or connects Drive automatically.

## Visual and responsiveness update (v0.2.0)

For full structured lessons, choose a purposeful cover/visual when feasible, and give local explanatory Correct/Try again feedback on deterministic answers. A tiny lazily-loaded `asit-exercises/references/visual-feedback.md` contains rendering detail; the teacher entrypoint remains brief. No always-on crawler or image/audio fetch is introduced. First tries and hints are only provisional until a real Submit and trusted review. Video/audio/Voice follow existing honest playback gates and consented Drive readback.

## Verification tiers

1. **Package checks**: manifest and frontmatter syntactically valid, reference files present, routing coverage mapped, no mcp.json or private data.
2. **Chat manual acceptance**: run a lesson without Project Instructions, test a new skill route, a genuine media link and playback failure, a real multi-turn dialogue, one Submit, review, and state handling with/without consent.
3. **Do not claim** host/mobile media playback, cross-chat saved progress, or measured latency until separately verified in actual host/provider tests.

## Source and version

Based on ASIT Engine v0.6, seven-minute lessons contract v0.5, ELLLO automatic source workflow v1, UI pattern registry v0.6, storage adapter v0.4. GitHub remains developer source; plugin release is an independent copy. Future GitHub updates require a new plugin release. This package contains no repository API authentication or private learner data.
