# ASIT — install in an ordinary ChatGPT Project

**Use a short GitHub-first Project Router; older attached Engine/Storage files become optional offline fallback snapshots.**

1. Connect GitHub to the private `tim8es/ASIT` repository. The router must fetch the actual current `install/ASIT-ENGINE.md` on `main` each new substantive chat, with related instructions retrieved only when needed.
2. Copy the new short [PROJECT-ROUTER.md](PROJECT-ROUTER.md) **once** to **ChatGPT Project → Instructions**. This one-time manual step replaces the older file-first router. A GitHub commit cannot update already-installed Project Instructions automatically. Optionally keep [ASIT-ENGINE.md](ASIT-ENGINE.md) and [ASIT-STORAGE.md](ASIT-STORAGE.md) in Project Files only as explicit fallback snapshots.
3. Open a new regular chat inside the Project and say: **"Start my English program."**
4. If you want your progress saved across chats, connect Google Drive and approve the privacy mode before the first persistent write. You do not manually create the tracking Sheet.
5. Open another chat in the same Project and ask ASIT to continue; it must actually fetch the current GitHub Engine and read the relevant private learner state. New Engine changes on `main` require no attachment re-upload.

The default is **GitHub-connected source + short router**. Versioned instructions stay in GitHub; private learner state remains in the learner's own storage. Without the GitHub connector, an existing attached file is only a fallback snapshot, not a live update mechanism.

### Why a link alone is not enough

Private GitHub needs an authorized connected GitHub action, not just a URL. The router must confirm that the source was actually fetched. If GitHub becomes unavailable, clearly identify a Project file as an older fallback snapshot.

### Rollback

Revert the merged GitHub commit (or restore a known good source commit) and start a new chat to reload the older Engine. For a full installation rollback, paste the previous Project Router back into Project Instructions.

### Without Google Drive

Practice still works as a temporary, clearly **not saved** session. Native interactive controls also depend on the ChatGPT client; equivalent text-based exercises are acceptable.

For the complete testing checklist, see [MLP acceptance](../docs/MLP-ACCEPTANCE.md).
