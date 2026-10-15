# ASIT — install in an ordinary ChatGPT Project

**Use a short Project Router plus two source files (pedagogy and optional storage).**

1. Download [ASIT-ENGINE.md](ASIT-ENGINE.md) and [ASIT-STORAGE.md](ASIT-STORAGE.md) and attach both to **ChatGPT Project → Files / Knowledge**. The Engine contains universal pedagogy; the Storage adapter is loaded on demand for persistence.
2. Copy the contents of the short [PROJECT-ROUTER.md](PROJECT-ROUTER.md) to **ChatGPT Project → Instructions**. This is about 1,800 characters.
3. Open a new regular chat inside the Project and say: **"Start my English program."**
4. If you want your progress saved across chats, connect Google Drive and approve the privacy mode before the first persistent write. You do not manually create the tracking Sheet.
5. Open another chat in the same Project and ask ASIT to continue; it must actually read the Project source and private learner state.

The default is **Project file + short router**, with no GitHub connector needed at runtime. The source stays in GitHub for version control, while the learner's sensitive data stays in their own private storage.

### Why not just give ChatGPT a GitHub link?

This repository is private and a regular ChatGPT chat cannot assume it has permission to fetch its contents. A Project Files attachment is a simpler, controlled source. The router must report a missing file instead of pretending to have loaded it. Updating the GitHub source **does not automatically update** an attachment; reattach a newer release deliberately.

### Without Google Drive

Practice still works as a temporary, clearly **not saved** session. Native interactive controls also depend on the ChatGPT client; equivalent text-based exercises are acceptable.

For the complete testing checklist, see [MLP acceptance](../docs/MLP-ACCEPTANCE.md).
