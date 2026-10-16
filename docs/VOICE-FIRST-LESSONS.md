# Native Voice-first lessons — ASIT v0.1 (ordinary ChatGPT)

**Status:** documented, testable lesson handoff and reference checks, NOT an embedded audio player/microphone widget. Use ChatGPT's built-in Voice in the **same conversation** when the user's client has it. Native Voice can speak/listen conversationally while showing text; there is no supported control in the ordinary ASIT lesson form that can force Voice to start, record arbitrary learner audio, or guarantee hiding transcripts. User must tap the platform Voice button and allow the microphone.

## The minimal real learner path

1. The learner selects "listening", "conversation/speaking", or "listen & repeat" (no large survey needed). The teacher gives a **short explicit voice handoff** for the **current chat**, not a pretend clickable Play button.
2. On mobile: tap the **Voice icon** in the message bar, grant mic permission when prompted, and say, "Start the ASIT audio lesson." Web has a Voice icon in the prompt box. In Settings → Voice, available modes can include Live, Advanced and Standard; user features vary.
3. The teacher confirms the audio has actually been heard and whether the student relied on written text. A text transcript of Voice is **not necessarily exact**; do not treat it as raw recording.
4. For **listening**: speak 1–3 original short sentences **aloud** in English at an appropriate level, not showing a pre-disclosed answer script as a graded unseen listening test. Ask an oral gist question, then a concrete detail question; wait for each genuine response. Offer a repeat on the learner's request; only then offer transcript/text reveal as support. Score heard comprehension only when actual source speech occurred AND the learner confirms they listened; if text was displayed/read, label `audio_plus_text_supported` or `reading`, not independent listening.
5. For **spoken response**: set a real-world situation, ask learner to reply aloud, respond to its content in the current live conversation, ask a follow-up question and elicit another response. Unless original learner audio is accessible **to the evaluating teacher**, grade only textual content and communicative appropriateness, **not** segmental pronunciation, phonetics, prosody or fluency metrics. Do not infer audible performance from a transcript.
6. For **listen & repeat/shadowing**: pronounce a short phrase aloud and request a spoken repetition. If the teacher can genuinely hear accessible learner audio, give cautious qualitative feedback; otherwise treat it as **oral rehearsal only**, with pronunciation `not_assessed`, and optionally ask for a text comprehension check.
7. End with a short, non-numeric recap: what evidence is real, what was supported by text, and what remains unassessed. Consent is required before any learner state is written. Only connector write + readback is saved; never upload private raw audio to GitHub.

## Why not put Play and Record into the previous text widget?

ASIT's in-chat controls can render buttons and fields, but these **cannot activate the platform's Voice mode**. A graphical speaker/microphone icon or animated waveform is not proof of an actual sound source. Only display Play/Record when **a real audio source and working capture path have actually been tested in the client**. A model-authored HTML/JS widget cannot assume access to the browser microphone, Web Speech API, host audio bridge, or persistent raw media. Never send the user to an invented audio URL.

The same ChatGPT Voice conversation can work as a **companion to the visual lesson**, but response text may be visible alongside speech (especially Live). If hidden-unseen listening is important, ask the user not to look at the transcript, then mark that listening purity **self-reported**. Stronger standalone A/B listening, slow speed, waveform, repeat-segment and exportable recording need a supported genuine player/capture capability or externally provided legitimate recordings, with the learner's approval for any connection.

## Minimal QA protocol

- **Voice unavailable:** return an honest spoken/listening unavailable state. Offer text reading or typed dialogue **with a changed modality label**; no fake score.
- **Voice available but not opened:** `requires_manual_voice_activation`, not `voice_running`.
- **Voice active, model speech not audibly played:** `listening` unassessed.
- **Actual audible teacher speech, learner relied on transcript:** mark audio+text supported or reading, not independent heard comprehension.
- **Actual audible speech, learner confirms heard it:** audio comprehension can be evaluated provisionally against their response; source and confirmation remain unverified client-side evidence.
- **Learner spoken reply appears only as transcript:** written/semantic content may be assessed; pronunciation and prosody unassessed.
- **Teacher actually accesses original learner audio:** qualitative speaking/pronunciation evaluation is possible but only on observed sound. Avoid exact phoneme scoring when capability does not support it.
- **Interruption or mode switch:** keep chat context and preserve unsaved session state; if audio evidence cannot be recovered label it unavailable, never invent a recording.
- **Privacy:** Voice platform recording/transcript policies are governed by ChatGPT settings; ask separately before moving any transcripts/raw audio into the user's learner workbook.

## Ready-to-speak manual start script

"ASIT, start a three-minute English audio lesson. Read two short original sentences in English aloud, ask me one gist question and one detail question, then role-play a short conversation about the same situation. Wait for my spoken answers. Give a short feedback summary, and do not claim to grade pronunciation unless you can actually hear my original voice."

**This document and the pure JS reference planner do not install Voice, generate speech files, or modify ChatGPT client UI.** Official current Voice description: https://help.openai.com/en/articles/20001274/
