# ASIT complete native interactive lesson — **copy-adapt** DIL blueprint (v0.3.4 candidate)

**Use when rendering a complete default five-task ASIT lesson.** This is a tested-for-shape instructional reference, NOT a plugin executor, standalone HTML, automatically verified UI, or an immutable graded Activity. Teacher must replace the example scenario, IDs, trusted rubric, source visuals and answer criteria to match a real learner, **preregister/read back all five real Activities** before showing any scored task when consent is on. Do not display code fences to the learner: render native components.

## Working UI principles

- All hooks in a **single top-level unconditional `{@body ...}` block** before UI. Never call hooks from `{#if}` branches.
- `button`, `radio-group`, `select`, `input`, `textarea`, `segmented-control` are interactive; `svg` primitives are display-only. Attach clicks to real `button`, not an SVG shape. Do not claim continuous motion for an SVG coordinate change.
- Use `DIL.useState` for every input. `Cards/All` toggling must not reset any answer.
- Provisional feedback only after the learner acts; never display the answer to later tasks before their attempt. Original free text is semantically reviewed **after Submit**.
- One actual Submit button, which requires second confirmation for blanks and uses `GenUI.issueNewTurn` from the click callback. No fake saved checkmark.
- Example has SVG **diagram**, not verified photograph. Diagram modality is `visual_symbols` (or combined visual-symbol/text where appropriate), not `image_choice`, `image_label` or listening.
- Update `session_id`, `lesson_id`, five Activity IDs, `competency_id`, rubric, and answer keys from **actual immutable registered Activity**; never reuse example IDs between live lessons. For heterogeneous graded items the per-task competency/modality is drawn from the trusted registered Activity on the teacher side, not from the top-level envelope's placeholder.

## Full illustrative UI

Below is an executable-style DIL template with **fictional IDs**. It is a *format reference*, not a lesson to send verbatim to a learner.

```jsx
{@body
  const taskIds = [
    "example_q1", "example_q2", "example_q3", "example_q4", "example_q5"
  ];
  const [mode, setMode] = DIL.useState("cards");
  const [cardIndex, setCardIndex] = DIL.useState(0);
  const [prediction, setPrediction] = DIL.useState("");
  const [objectWord, setObjectWord] = DIL.useState("");
  const [moved, setMoved] = DIL.useState(false);
  const [position, setPosition] = DIL.useState("");
  const [order, setOrder] = DIL.useState([]);
  const [message, setMessage] = DIL.useState("");
  const [confirmSkip, setConfirmSkip] = DIL.useState(false);
  const chunks = ["please?", "on the desk", "Could you", "put the parcel"];
  const expectedChunks = ["Could you", "put the parcel", "on the desk", "please?"];
  const composed = order.map(i => chunks[i]).join(" ");
  const answers = {
    example_q1: prediction,
    example_q2: objectWord.trim(),
    example_q3: position,
    example_q4: order.length === 4 ? composed : "",
    example_q5: message.trim()
  };
  const missing = taskIds.filter(id => !answers[id]);
  const answeredCount = 5 - missing.length;
  const show = n => mode === "all" || cardIndex === n;
  const resetConfirm = () => setConfirmSkip(false);
  const submit = () => {
    if (missing.length && !confirmSkip) {
      setConfirmSkip(true);
      return;
    }
    const envelope = {
      session_id: "example_session_replace_before_render",
      lesson_id: "example_lesson_replace_before_render",
      activity_id: taskIds[0],
      competency_id: "example_competency_replace",
      attempt_id: "example_attempt_replace",
      attempt_number: 1,
      hint_level: "none",
      answer: JSON.stringify(answers),
      skipped_task_ids: missing,
      first_answer: null,
      ui_provenance: "unverified"
    };
    GenUI.issueNewTurn("ASIT_ATTEMPT_V2\n" + JSON.stringify(envelope));
  };
}
<box gap={3}>
  <title size="lg">The Missing Parcel</title>
  A courier must leave a parcel in the correct location. Predict the move, check the room, then send a short request.
  <text color="secondary" size="sm">7 minutes · 5 tasks · Goal: describe and request object locations</text>
  <row justify="between" align="center">
    <text weight="medium">Completed {answeredCount}/5</text>
    <segmented-control value={mode} onChange={setMode} size="md"
      options={[{label:"Cards",value:"cards"},{label:"All",value:"all"}]}/>
  </row>
  <box border radius="xl" padding={3} gap={2}>
    <text weight="medium">Interactive room diagram</text>
    <text size="sm" color="secondary">The yellow parcel starts on the shelf. A round red object is on the floor near the open box.</text>
    <svg viewBox="0 0 360 220" width="100%" height="200px">
      <rect x="0" y="0" width="360" height="220" rx="12" fill="#edf2f5"/>
      <path d="M0 199 H360" stroke="#8797a5" strokeWidth="2"/>
      <rect x="30" y="100" width="145" height="12" rx="2" fill="#927049"/>
      <rect x="40" y="112" width="9" height="88" fill="#927049"/>
      <rect x="160" y="112" width="9" height="88" fill="#927049"/>
      <path d="M235 150 V200 H320 V150" fill="#f1c88e" stroke="#906a43" strokeWidth="5"/>
      <circle cx="325" cy="185" r="10" fill="#c84845"/>
      <rect x={moved?258:93} y={moved?159:72} width="28" height="28"
        rx="2" fill="#dba43c" stroke="#9c642b" strokeWidth="2"/>
      <path d={moved?"M272 159 V187":"M107 72 V100"} stroke="#f6e3b9" strokeWidth="4"/>
    </svg>
    <row gap={2} wrap="wrap">
      <button size="sm" onClick={()=>{setMoved(true);resetConfirm();}}
        disabled={!prediction||moved}>Move parcel</button>
      <button size="sm" variant="outline" onClick={()=>{
        setMoved(false);setPosition("");setPrediction("");resetConfirm();
      }}>Replay scene</button>
    </row>
    {#if moved}
      <text size="sm">The parcel moved. Describe its position in Task 3.</text>
    {/if}
  </box>
  {#if show(0)}
    <box border radius="lg" padding={3} gap={2}>
      **Task 1 · Predict the distance**
      The courier will move the parcel toward the container on the right. Will the parcel be nearer or farther from the red round object?
      <radio-group direction="col" value={prediction} onChange={v=>{setPrediction(v);resetConfirm();}}>
        <radio value="nearer">Closer to the red round object</radio>
        <radio value="farther">Farther from the red round object</radio>
        <radio value="same">At the same distance</radio>
      </radio-group>
      {#if moved && prediction}
        <text color={prediction==="nearer"?"success":"danger"}>
          {prediction==="in_box"?"Correct":"Incorrect — Try again"}
        </text>
      {/if}
    </box>
  {/if}
  {#if show(1)}
    <box border radius="lg" padding={3} gap={2}>
      **Task 2 · Name the object**
      Look at the small round red object near the box. What is its English name?
      <input value={objectWord} placeholder="One word" onChange={v=>{setObjectWord(v);resetConfirm();}}/>
      <text color="secondary" size="sm">Reviewed after Submit; reasonable synonyms accepted.</text>
    </box>
  {/if}
  {#if show(2)}
    <box border radius="lg" padding={3} gap={2}>
      **Task 3 · Observe**
      Move the parcel, then choose its new location.
      <select block value={position} placeholder="Choose the location" disabled={!moved}
        options={[{label:"On the shelf",value:"on_shelf"},
                  {label:"In the box",value:"in_box"},
                  {label:"Under the shelf",value:"under_shelf"}]}
        onChange={v=>{setPosition(v);resetConfirm();}}/>
      {#if moved && position}
        <text color={position==="in_box"?"success":"danger"}>
          {position==="in_box"?"Correct":"Incorrect — Try again"}
        </text>
      {/if}
    </box>
  {/if}
  {#if show(3)}
    <box border radius="lg" padding={3} gap={2}>
      **Task 4 · Build the request**
      Ask the courier to put a different parcel on the desk. Tap all four chunks.
      <text weight="medium">{composed || "Your request appears here."}</text>
      <row wrap="wrap" gap={2}>
        {#each chunks as chunk, i}
          <button size="sm" variant="outline" disabled={order.includes(i)}
            onClick={()=>{setOrder([...order,i]);resetConfirm();}}>{chunk}</button>
        {/each}
      </row>
      <row gap={2}>
        <button variant="outline" size="sm" disabled={!order.length}
          onClick={()=>{setOrder(order.slice(0,-1));resetConfirm();}}>Undo</button>
        <button variant="outline" size="sm" disabled={!order.length}
          onClick={()=>{setOrder([]);resetConfirm();}}>Reset</button>
      </row>
      {#if order.length===4}
        <text color={expectedChunks.join(" ")===composed?"success":"danger"}>
          {expectedChunks.join(" ")===composed?"Correct":"Incorrect — Try again"}
        </text>
      {/if}
    </box>
  {/if}
  {#if show(4)}
    <box border radius="lg" padding={3} gap={2}>
      **Task 5 · Your message**
      In a new situation, ask a colleague where your keys are. Write one short English question (3–8 words).
      <textarea rows={2} value={message} placeholder="Write your own question"
        onChange={v=>{setMessage(v);resetConfirm();}}/>
      <text size="sm" color="secondary">Optional independent practice. If skipped, it is not assessed.</text>
    </box>
  {/if}
  {#if mode==="cards"}
    <row justify="between" align="center">
      <button size="sm" variant="outline" disabled={cardIndex===0}
        onClick={()=>setCardIndex(Math.max(0,cardIndex-1))}>Previous</button>
      <text size="sm">{cardIndex+1}/5</text>
      <button size="sm" variant="outline" disabled={cardIndex===4}
        onClick={()=>setCardIndex(Math.min(4,cardIndex+1))}>Next</button>
    </row>
  {/if}
  {#if confirmSkip && missing.length}
    <text color="secondary">You're leaving {missing.length} task(s) unanswered. They will be marked not assessed. Submit again to finish.</text>
  {/if}
  <button block onClick={submit}>
    {confirmSkip&&missing.length?"Confirm incomplete Submit":"Submit lesson"}
  </button>
</box>
```

## Adaptation notes (compulsory)

1. The whole example is **one self-contained widget**, not five replies. No activity may be sent to Google Sheets until all five **real** Activity records exist and have been read back under valid consent.
2. The fixed diagram appears before the graded prompts so learners see it even in Cards mode. **If your actual UI cannot show that scene, never grade Q1/2/3 as visual-symbol recognition.** Choose a properly re-registered nonvisual exercise or mark those broken items not assessed.
3. A DIL `<svg>` shape, even with changed coordinates, is a diagram-state interaction. It is not a photograph, image-search result, genuine video or smooth animation. A real independently verified photo slot can supplement the scene, but requires an exact tool-returned ref; a generated photo must not disclose answer labels in alt/caption.
4. Chunk composition is `guided_construction`, Q1/Q3 are `recognition`, Q2 is lexical `visual_symbolic` retrieval, Q5 is independent **writing** only when actually submitted and semantically reviewed. No spoken/listening CEFR.
5. **First try is unverified** in a generated client UI; do not award independent status from this template's local provisional correctness. No fake score progress, only answered count.
6. Cards mode conditionally hides the other prompts, but keeps values in state. Unlike a bare static quiz, Move and Replay change a shared scene displayed outside the card list.
7. A real lesson with more suitable content may replace every example text while preserving the **underlying invariants** and deliberate privacy. Do not copy this exact courier scenario into every lesson or reuse the example identifiers.

## Visual sourcing substitution

If a real photograph is successfully retrieved before freezing the blueprint, a grounded photo question can be rendered using the exact ref as `<AsyncImage ref="ACTUAL_RETURNED_REF" alt="Non-spoiling scene description"/>` beside the relevant input. `ACTUAL_RETURNED_REF` here is **illustrative text only**, NOT a valid ref or working rendered component; never emit it to the user. If the tool failed, keep diagram evidence and the correctly labelled `visual_symbols` rubrics above. Do not call a diagram an image-asset success.
