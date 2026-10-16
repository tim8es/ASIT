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

## ChatGPT-native Voice handoff (usable immediately, no fake widget)

For user requests for audio lessons, prefer the **real same-chat Voice feature** over depicting nonfunctional Play or Record buttons. Read [Native Voice-first lessons](../../docs/VOICE-FIRST-LESSONS.md) on demand. User selects the platform Voice icon manually, grants microphone access and asks the assistant to start. The teacher performs a live audio prompt → learner listens/replies → context-sensitive follow-up → recap. The native chat form **cannot open Voice or hide automatic subtitles programmatically**.

Treat the spoken Voice path as different from a bespoke audio-card player: standard in-chat widgets still do not offer guaranteed arbitrary source playback, repeat-segment, slow speed or independent original-voice storage. The voice transcript may be nonverbatim, and text can be visible during voice; explicitly ask whether the learner heard speech and/or read its transcript. Evaluate only actually witnessed auditory evidence and grade pronunciation only if the assessing teacher really has access to original learner audio. No raw learner audio in GitHub. Without available and active Voice, offer a text alternative labelled reading/written interaction, not a "recording."

## Self-paced real MP3 listening cards (Listen → Answer)

When the user wants to **tap Play and answer listening questions** (not a voice conversation), load [Listen → Answer card spec](../../docs/LISTEN-ANSWER-AUDIO-CARDS.md) rather than routing to Voice. A playable verified MP3 or supported source is mandatory; a native form alone cannot synthesize or host audio. Use a tested embedded `audio` player if the client genuinely supports it, or an actual attached MP3 download **clearly labelled as external playback**, with no claim of inline playback.

The card shows Play/Replay and optional slower speed, waits for playback, asks gist and detail questions, allows one Submit, then reveals feedback and optional transcript. Playback event + learner confirmation are provisional evidence, not telemetric proof they heard; transcript read before responding means audio+text support. If the source cannot be played, mark listening `not_assessed`, even when user guesses the text answer. Core reference plan and checks: `src/listen-answer-card.mjs`; no automatic API calls or uploads.

## Intelligent UI FIRST: in-chat Listen → Answer (v0.2)

**Do not default to standalone HTML pages for audio lessons.** The in-chat stage uses native DIL `radio-group`, `input`, `textarea`, `checkbox`, and one final Submit. A minimal embedded media-only adapter can play a real licensed sound clip if that client supports it; the entire card must NOT be an HTML app. Do not expose inert native "Play" buttons pretending to control audio. If inline playback unavailable, provide direct genuine playable audio attachment/link plus the native in-chat question form and label the mode accurately. Require editorial voice quality review; the former 22.05kHz/32kbps synthetic sample is unacceptable as a showcase. Source: [Listen → Answer inline contract](../../docs/LISTEN-ANSWER-AUDIO-CARDS.md).


## Confirmed mobile audio card rendering-but-not-playing case

A mobile learner reported that ASIT's inline audio surface rendered but audio was silent for a real Wikimedia OGG source. Therefore rendering alone is never capability evidence. If `audio/ogg` support isn't specifically verified, decline inline playback and seek a genuine mobile-compatible MP3/AAC source. If the host has no supported inline media, keep native DIL gist/detail question controls and use a real MP3 attachment/link after a learner-heard confirmation; never re-label a silent player as listening practice. The `external_audio_handoff` reference plan explicitly records the weaker self-reported listening provenance. See [dedicated contract](../../docs/LISTEN-ANSWER-AUDIO-CARDS.md).


## Duration contract for Listen → Answer

The actual file must be a bounded standalone short asset (**normally 15–35s**, optional coherent 5–14s microclip); do not send a 10-minute recording with a manual "listen to first 90 seconds" instruction. `src/listen-answer-card.mjs` requires verified `duration_seconds` and rejects unverified durations and >35s default. Extended up to 90s requires explicit learner request. Two or three questions must be answerable from **within that exact audio clip**. Keep learner controls native and use a genuine verified recording rather than low-quality synthetic placeholder.
