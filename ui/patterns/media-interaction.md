# Lazy UI patterns — dialogue, images and actual audio

- **open conversation:** normal ChatGPT chat, not a forced form; selectively correct after an exchange.
- **role-play:** bounded scenario with free typed input or actual speech where available. Typed output is written interaction only.
- **spoken audio:** assess speaking/pronunciation only with genuine accessible learner audio, never by scoring typed transcriptions.
- **listening:** assess only with actual audio playback and comprehension evidence; any text-only adaptation is a reading exercise.
- **images:** meaningful real images with accurate alt text; if unavailable replace with an equivalent textual task, do not pretend visual evidence.
- **drag/card mechanics:** optional actual interaction with accessible keyboard fallback; otherwise use selects/numbered ordering. Every visible control must work.

Any absent capability must lead to honest fallback or an unassessed modality.

- **inline term help:** useful underlined word or phrase can be tapped to open a small native popover with a contextual meaning and example. It does not change learner answers. A new parallel ChatGPT conversation cannot be forced by available native controls; use the platform's optional side-chat controls manually if present.


## Real multi-turn dialogue, not one reply

A `dialogue` measures exchange across **at least two genuinely responsive ChatGPT turns**: character question → learner response → context-sensitive character reaction/follow-up → learner response. The teacher responds using what the learner actually said, not a canned reaction pretending an LLM was called from a local control. A single textarea answer is `dialogue_preparation`, **not** a completed dialogue. For a seven-minute lesson, schedule a short conversation segment in ordinary chat and consolidate at a checkpoint; it may span more than one assistant response, so do not silently claim it was completed inside one static Submit form. Grade clarity, relevant response, repair/clarification and independently produced language; type remains written interaction unless real speech is accessible. Track the real prompts and learner turns (with consent only).

## Actual listening and speech: capability and evidence gate

`listening`: provide genuine audio with playable source **currently accessible to the learner**, a visible play/replay control and 1–2 gist/detail checks. Speed changes optional, transcript reveal tracked as support and shown only after first attempt if it discloses answers. Generic platform audio support without a real track is insufficient. Text-only substitutes are `reading_comprehension`, never listening evidence.

`spoken_response`: real learner microphone/audio input that the teacher can access, a user-controlled recording/re-recording/playback path, clear permission and privacy handling, then pronunciation/clarity feedback based **only** on actually accessible audio. A typed transcript does not prove spoken fluency or pronunciation; mark spoken evidence `unassessed` if source audio is unavailable.

`pronunciation_shadowing` is a **proposed extension** to spoken response, not part of the core catalog: only offer it with both playable reference audio and actual accessible learner audio. No simulated waveform, fabricated recording button or confidence score. The current Node reference oracle is not an audio player/recorder.
