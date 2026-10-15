# Public release gate — NOT CLEARED

## Current verified state

- **Current source tree** was audited with `node scripts/scan-public.mjs`; CI passed.
- `main` now points to a **clean root commit** with zero parents. The current branch history does not include the initial experimental personalized commits.
- **Critical residual risk:** GitHub still serves at least one previously rewritten/force-disconnected historical commit through a direct commit SHA URL. A force push does **not** guarantee historical objects, caches, hidden refs or pull request artifacts are immediately purged.
- The repository remains **PRIVATE**. **Do not change visibility to public** until the old personal-source commits have been made inaccessible (e.g., repository owner coordinating an appropriate GitHub Support purge of cached/unreachable sensitive objects, or an authorized clean repository migration) and verified.

## Remaining owner actions before public release

1. Contact GitHub Support about removing inaccessible-but-still-addressable former commits and other cached objects containing personal learning material; never include the material itself in a public issue.
2. Recheck direct links to old commit SHAs and any refs, tags, PRs, branches, workflow artifacts, forks and releases.
3. Consider a new, clean destination repository if complete purge from this existing repository cannot be verified. Import **only the current verified root tree**; never mirror all historical objects.
4. Run current HEAD source scan and inspect all reachable history, links and fictional examples. No real learner IDs, email, answer text, audio or secrets in any file.
5. Pass the real clean-install, storage-consent, native UI, fresh-chat and privacy acceptance scenarios with synthetic credentials and data.
6. Owner changes GitHub visibility to public **only after these checks pass**.

## What a clean branch does and does not do

A root history rewrite reduces **reachable branch history**. It cannot guarantee GitHub's internal object retention is gone, and it cannot retroactively revoke data fetched into external clones.

## Distribution boundaries

The public repo will contain code, agent instructions and generic templates. Learner state belongs in their own private connected cloud workbook. Native ChatGPT is the frontend; GitHub Pages or a second web app is not required.
