# Public release gate — not yet cleared

The repository has previously contained learner-specific language-example text in a historical commit. **Deleting it from current files does NOT remove it from Git history**. Keep the repository private until that history is rewritten and verified.

## Required before making public

1. Confirm current HEAD contains no personal records or private document identifiers; run \`node scripts/scan-public.mjs\`.
2. **Rewrite historical commits** with an authorized Git-capable environment (e.g. \`git filter-repo\` or a verified clean-history migration). Prefer a clean-root orphan history for this pre-release project, after safeguarding any intended code. Force-update refs only when ownership and coordination are established. Check tags, open PR refs, releases, caches and any forks/clones.
3. Inspect all reachable commits and Git objects for previously exposed examples or personal content. Confirm no confidential tokens were ever present; rotate any exposed credentials if found.
4. Review demo images, README, workflows, commit messages and issue/PR discussions for identifying details.
5. Test first-run with a synthetic learner, connected Drive, and ordinary ChatGPT native UI. Check consent, storage, duplicate handling and new-chat continuity.
6. Only then change repository visibility to public through the owner's authorized workflow.

Until 2–4 are completed, the source HEAD is de-identified but **the repository itself is not certified safe to make public**. It is intentionally private.

## Distribution

A public repo is a **source for skill instructions**, not a hosted web app. A visitor sets up the instructions in their own ChatGPT account and uses their own cloud storage. No global account/profile database is provided. Document ChatGPT plan, connector and UI feature availability at release time.
