# ASIT checked native five-task lesson exemplar — v0.3.7

**Implementation reference for one complete visual_discovery lesson**, not a mandatory lesson theme or running plugin executor. The [UI contract](ui-contract.md) is authoritative. For communication, reading and audio choose their appropriate [family](ui-families.md); do NOT copy this parcel story into every lesson. This JSX-like DIL template is **copy-adapt**, not a literal task with valid learner IDs. Replace IDs, answer rubrics, content and source-specific scene **before preregistering Activities**. If consent active, preregister/readback *all five* trusted separate Activities before display; otherwise label the lesson UNSAVED. Keep real IDs outside the UI trusted model and verify them on grading.

## Preflight invariant

`prediction` values = `{nearer, farther, same}`, and its key is **`nearer`**. The q3 `position` values = `{on_shelf, in_box, under_shelf}`, and its key is **`in_box`**. Never compare one field against another's option domain. Local feedback is provisional and reveals nothing before learner action; q2 lexical and q5 original responses are semantically assessed only after Submit. The illustrated scene is an SVG **visual symbol**, not photo recognition, and is tested only as structural DIL guidance. The displayed intro and alternative text must not name the lexical answer for q2.

## Native DIL example

```jsx
{@body
  const ids = ["example_q1", "example_q2", "example_q3", "example_q4", "example_q5"];
  const [mode, setMode] = DIL.useState("cards");
  const [page, setPage] = DIL.useState(0);
  const [prediction, setPrediction] = DIL.useState("");
  const [firstPrediction, setFirstPrediction] = DIL.useState("");
  const [revisedPrediction, setRevisedPrediction] = DIL.useState(0);
  const [stage, setStage] = DIL.useState(0);
  const [objectName, setObjectName] = DIL.useState("");
  const [position, setPosition] = DIL.useState("");
  const [firstPosition, setFirstPosition] = DIL.useState("");
  const [chunks, setChunks] = DIL.useState([]);
  const [message, setMessage] = DIL.useState("");
  const [confirmSkip, setConfirmSkip] = DIL.useState(false);
  const [isSending, setIsSending] = DIL.useState(false);
  const tokens = ["please?", "on the desk", "Could you", "put the parcel"];
  const expected = "Could you put the parcel on the desk please?";
  const assembled = chunks.map(i => tokens[i]).join(" ");
  const answers = {
    example_q1: prediction,
    example_q2: objectName.trim(),
    example_q3: stage === 1 ? position : "",
    example_q4: chunks.length === 4 ? assembled : "",
    example_q5: message.trim()
  };
  const missing = ids.filter(id => !answers[id]);
  const count = ids.length - missing.length;
  const show = n => mode === "all" || page === n;
  const changePrediction = v => {
    if (!firstPrediction) setFirstPrediction(v);
    if (prediction && prediction !== v) setRevisedPrediction(n => n + 1);
    setPrediction(v);
    setConfirmSkip(false);
  };
  const changePosition = v => {
    if (!firstPosition) setFirstPosition(v);
    setPosition(v);
    setConfirmSkip(false);
  };
  const send = () => {
    if (isSending) return;
    setIsSending(true);
    const envelope = {
      session_id: "REPLACE_WITH_TRUSTED_SESSION_ID",
      lesson_id: "REPLACE_WITH_TRUSTED_LESSON_ID",
      activity_id: ids[0],
      competency_id: "REPLACE_WITH_TRUSTED_COMPETENCY_ID",
      attempt_id: "REPLACE_WITH_IMMUTABLE_PARENT_ATTEMPT_ID",
      attempt_number: 1,
      hint_level: "none",
      answer: JSON.stringify(Object.fromEntries(Object.entries(answers).filter(([k,v]) => !!v))),
      skipped_task_ids: missing,
      first_answer: null,
      ui_provenance: "unverified"
    };
    GenUI.issueNewTurn("ASIT_ATTEMPT_V2\n" + JSON.stringify(envelope));
  };
  const submit = () => {
    if (isSending) return;
    if (missing.length) setConfirmSkip(true);
    else send();
  };
}
<box gap={3}>
  <title size="lg">Room delivery</title>
  Help a courier place a parcel and then send a request in English.
  <text size="sm" color="secondary">About 7 minutes · 5 tasks · Goal: describe positions and make requests · Symbolic diagram</text>
  <row justify="between" align="center">
    <text weight="medium">Answered {count}/5</text>
    <segmented-control size="sm" value={mode} onChange={setMode}
      options={[{label:"Cards",value:"cards"},{label:"All",value:"all"}]}/>
  </row>
  <box border radius="lg" padding={3} gap={2}>
    <text weight="medium">Room diagram</text>
    <svg viewBox="0 0 360 220" width="100%" height="200px">
      <rect x="0" y="0" width="360" height="220" rx="10" fill="#edf2f5"/>
      <path d="M0 200 H360" stroke="#8797a5" strokeWidth="2"/>
      <rect x="30" y="100" width="145" height="12" rx="2" fill="#927049"/>
      <rect x="40" y="112" width="9" height="88" fill="#927049"/>
      <rect x="160" y="112" width="9" height="88" fill="#927049"/>
      <path d="M235 150 V200 H320 V150" fill="#f1c88e" stroke="#906a43" strokeWidth="5"/>
      <circle cx="325" cy="185" r="10" fill="#c84845"/>
      <rect x={stage === 1 ? 257 : 93} y={stage === 1 ? 160 : 72}
        width="28" height="28" rx="3" fill="#dba43c" stroke="#9c642b" strokeWidth="2"/>
    </svg>
    <text color="secondary" size="xs">The square parcel begins on the shelf. Compare it with the round object beside the box.</text>
    <row gap={2} wrap="wrap">
      <button size="sm" disabled={!prediction || stage === 1}
        onClick={()=>{setStage(1);setConfirmSkip(false);}}>Move parcel</button>
      <button size="sm" variant="outline" disabled={stage === 0}
        onClick={()=>{setStage(0);setPosition("");setConfirmSkip(false);}}>Replay scene</button>
    </row>
    {#if stage === 1}
      <text size="sm">The parcel has moved. Compare the objects and answer Task 3.</text>
    {/if}
  </box>
  {#if show(0)}
    <box border radius="lg" padding={3} gap={2}>
      **1 · Predict**
      Will moving the parcel into the open container bring it nearer to or farther from the round object?
      <radio-group value={prediction} onChange={changePrediction} direction="col">
        <radio value="nearer">Nearer</radio>
        <radio value="farther">Farther</radio>
        <radio value="same">Same distance</radio>
      </radio-group>
      {#if stage === 1 && prediction}
        <text color={prediction === "nearer" ? "success" : "danger"}>
          {prediction === "nearer" ? "Correct" : "Incorrect — Try again"}
        </text>
      {/if}
    </box>
  {/if}
  {#if show(1)}
    <box border radius="lg" padding={3} gap={2}>
      **2 · Name the object**
      What could you call the small round red object in English? Write a single word.
      <input value={objectName} placeholder="One English word" onChange={v=>{setObjectName(v);setConfirmSkip(false);}}/>
      <text color="secondary" size="sm">Review after Submit (reasonable alternatives accepted).</text>
    </box>
  {/if}
  {#if show(2)}
    <box border radius="lg" padding={3} gap={2}>
      **3 · Observe**
      Move the parcel. Where is it now?
      <select block value={position} disabled={stage !== 1}
        placeholder="Choose a location"
        options={[{label:"On the shelf",value:"on_shelf"},{label:"In the box",value:"in_box"},{label:"Under the shelf",value:"under_shelf"}]}
        onChange={changePosition}/>
      {#if stage === 1 && position}
        <text color={position === "in_box" ? "success" : "danger"}>
          {position === "in_box" ? "Correct" : "Incorrect — Try again"}
        </text>
      {/if}
    </box>
  {/if}
  {#if show(3)}
    <box border radius="lg" padding={3} gap={2}>
      **4 · Build a request**
      Tap the chunks in the right order to ask someone to place an item on the desk.
      <text weight="medium">{assembled || "Your request will appear here"}</text>
      <row wrap="wrap" gap={2}>
        {#each tokens as token,i}
          <button size="sm" variant="outline" disabled={chunks.includes(i)}
            onClick={()=>{setChunks([...chunks,i]);setConfirmSkip(false);}}>{token}</button>
        {/each}
      </row>
      <row gap={2}>
        <button size="sm" variant="outline" disabled={chunks.length===0}
          onClick={()=>{setChunks(chunks.slice(0,-1));setConfirmSkip(false);}}>Undo</button>
        <button size="sm" variant="outline" disabled={chunks.length===0}
          onClick={()=>{setChunks([]);setConfirmSkip(false);}}>Reset</button>
      </row>
      {#if chunks.length === 4}
        <text color={assembled === expected ? "success" : "danger"}>
          {assembled === expected ? "Correct" : "Incorrect — Try again"}
        </text>
      {/if}
    </box>
  {/if}
  {#if show(4)}
    <box border radius="lg" padding={3} gap={2}>
      **5 · Your own message**
      In a DIFFERENT situation, ask a colleague where the office keys are. Write your own short English question.
      <textarea rows={2} value={message} placeholder="Your own question"
        onChange={v=>{setMessage(v);setConfirmSkip(false);}}/>
      <text color="secondary" size="sm">Optional independent task · Review after Submit · Blank means not assessed.</text>
    </box>
  {/if}
  {#if mode === "cards"}
    <row justify="between" align="center">
      <button size="sm" variant="outline" disabled={page === 0} onClick={()=>setPage(Math.max(0,page-1))}>Previous</button>
      <text size="sm">Task {page+1} / 5</text>
      <button size="sm" variant="outline" disabled={page === 4} onClick={()=>setPage(Math.min(4,page+1))}>Next</button>
    </row>
  {/if}
  {#if confirmSkip && missing.length}
    <box border radius="md" padding={3} gap={2}>
      <text>Submit {count} answered task(s)? {missing.length} unanswered task(s) will be marked not assessed.</text>
      <row wrap="wrap" gap={2}>
        <button disabled={isSending} onClick={send}>Send {count} answers</button>
        <button variant="outline" onClick={()=>setConfirmSkip(false)}>Continue lesson</button>
      </row>
    </box>
  {:else}
    <button block disabled={isSending} onClick={submit}>Submit lesson</button>
  {/if}
</box>
```

## Mandatory adaptation/checks

1. The shown Activity and Attempt IDs are fictional. Never register them, send them, or reuse them in a real learner session. Replace with stable verified IDs; no raw identifiable private data in public searches. The UI can carry only unverified provisional first-choice metadata. `GenUI.issueNewTurn` makes a new chat turn, not a Google Sheets write.
2. `nearer` is the **only** right answer for q1; `in_box` only for q3. Inspect and test every new set of option values and correct-state conditions. A correct q1 must never be tested against `in_box`. Q2 is intentionally open-ended; do not hardcode lexical aliases as local `Correct`.
3. Replay resets the diagram stage and dependent q3 current answer, but preserves q1 selection, other task answers, and initial selections. Cards ⇄ All preserves all states. The UI disables repeated Submit where client state permits; assessment must still dedupe.
4. This SVG visual-symbol scene demonstrates relations. It is not real photo recognition or motion; label operation/modality accordingly. For a reading or writing objective choose a **different** family, not a cosmetic rewrite of this diagram.
5. Stage selection must occur before showing prediction verdict; incorrect local feedback cannot identify the correct answer; free responses only teacher-reviewed after Submit. Any broken image or missing diagram evidence is not assessed for that modality.
6. Test rendering, keyboard, viewport, clicking and external sound on the actual ChatGPT host separately. Developer tests only cover contract and example logic.
