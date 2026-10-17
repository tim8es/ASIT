# Public release and discoverability checklist

**This is a gated checklist, not evidence that ASIT is safe to publish.** The repository was private at the time this document was created. The source history and GitHub Actions history have not been certified free of secrets or personal learner data.

## 1. Security and privacy — required before changing visibility

- [ ] Review **all Git history** (including removed legacy files), branches, tags, PR patches, issues, comments and attachments for secrets, keys, tokens, private workbook identifiers, learner data and proprietary assets.
- [ ] Review existing GitHub Actions history, logs and downloadable artifacts: making a private repository public may expose past runs.
- [ ] Use suitable secret-scanning tooling and manual review. Consider history rewriting and credential rotation for any exposure; deleting a current file is insufficient.
- [ ] Verify ownership/redistribution rights for images, media, transcripts, code and third-party content.
- [ ] Validate that MIT licensing is intended for everything being published, not only the new docs.
- [ ] Confirm that the installed plugin and private Google Sheets data are independent of public repo files.

## 2. GitHub presentation

**Suggested repository About description** (paste in the repository's About editor):

> Open-source adaptive learning framework for ChatGPT. Skills-first AI tutor for English, interactive lessons, CEFR evidence and optional Google Sheets progress.

**Suggested topics** (use only accurate ones; GitHub allows up to 20):

`asit`, `adaptive-learning`, `ai-tutor`, `chatgpt`, `education`, `english-learning`, `language-learning`, `cefr`, `personalized-learning`, `chatgpt-plugin`, `edtech`, `google-sheets`

- [ ] Set About description and topics through the GitHub repository settings (not by editing README alone).
- [ ] Check README, README.ru, architecture links, status/CI badges and mobile readability.
- [ ] Add an appropriate **social preview image** using Repository Settings → Social preview; do not imply a preview file alone configures GitHub metadata.
- [ ] Confirm issue templates, contribution policy, security reporting and license are coherent.
- [ ] Optionally enable Discussions only if there is a plan to moderate/respond.

## 3. Release readiness

- [ ] Merge the documentation PR only after review.
- [ ] Confirm static tests and packaging on the target branch.
- [ ] Manually test a candidate installed in ChatGPT: visual UI, feedback integrity, audio, consent and verified Sheets readbacks.
- [ ] Publish and tag an accurately scoped plugin release only **after** the manual release gate; a candidate source version is not a shipped release.
- [ ] Ensure installation steps and publicly accessible example media are verified.

## 4. Make publicly visible — owner action

After the security audit, in GitHub go to **Settings → General → Danger Zone → Change repository visibility → Public** and confirm the consequences. GitHub warns that code, Actions history and logs become visible and anyone may fork. Do not change visibility solely to gain search traffic.

## 5. Indexing and launch

- [ ] Verify the anonymous (signed-out) repository URL works.
- [ ] Test GitHub repository search by distinctive project title and topics; allow for index delays.
- [ ] Share useful documentation and a working demo with developer/educator communities; avoid spam or manufactured stars.
- [ ] If you create a real public documentation site, submit its sitemap to search engines and use appropriate canonical URLs. GitHub README does **not** expose a configurable SEO metadata or sitemap control.
- [ ] Track organic repository views, forks, issues and useful contributions; do not claim search ranking is guaranteed.

## References

- [GitHub repository visibility](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility)
- [GitHub topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics)
- [GitHub repository search](https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories)
