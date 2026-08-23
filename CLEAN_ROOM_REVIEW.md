# Clean-room review — project procedure

This project uses the same practical blinded-review method used by the related AP/ACT exam-practice projects. **Do not build a new agent service, paid model workflow, GitHub Action, local LLM runner, or other infrastructure merely to obtain a clean-room review.** Those are optional conveniences only.

## What clean-room means here

The essential requirement is **answer blindness during the independent judgment phase**, not a particular model, process, vendor, or runtime.

A reviewer pass is valid when the reviewer:

1. starts from a freshly generated **browser-effective answerless worksheet/manifest** for one assessment;
2. treats prior authoring conclusions, remembered answers, tests, PR descriptions, earlier audits, and repository claims as **non-evidence**;
3. does not inspect or consult repository scoring objects, answer keys, rationales, or constructed-response rubrics while doing the blind pass;
4. independently solves every item and records correctness, ambiguity, grade fit, and standard/alignment judgments from the visible item plus current governing Missouri sources/answerless expectation definitions;
5. commits/freezes the complete blind judgments before keyed reconciliation;
6. only after the blind phase is frozen, exposes manual CR rubrics and then auto-scored keys/rationales for reconciliation; and
7. restarts the assessment from item 1 after any substantive browser-effective repair.

The reviewer may be a fresh human, a separate agent/subagent, or the same capable reasoning model operating in a deliberately blinded reviewer pass. A separate agent is useful when readily available, but **is not required by this project's release gate**. Prior involvement in authoring is not itself disqualifying provided the reviewer follows the answer-blind procedure above and prior knowledge is explicitly ignored rather than used as evidence.

## Normal / easy workflow

Work one assessment at a time.

### 1. Generate the fresh blind worksheet

```bash
npm run audit:review-template -- --assessment=g5-science > g5-science-review.json
```

The worksheet is generated from the exact browser-effective bank and contains its SHA-256 fingerprint, but no `scoring`, rationale, answer key, or manual rubric.

### 2. Enter reviewer mode

Use this instruction, or its equivalent:

> Act as the blinded clean-room reviewer for this assessment. Ignore all prior authoring conclusions, remembered keys, tests, previous audit claims, and repository assertions. Use only the fresh answerless worksheet and current governing Missouri sources/answerless standard definitions. Independently solve and judge every item. Do not inspect any answer key, scoring object, rationale, or CR rubric until every blind answer and verdict is recorded.

Then complete every `review` object in the worksheet. For constructed responses, record the elements a fully correct response should contain without viewing the bank rubric.

### 3. Freeze/seal before looking at keys

Preferred:

```bash
npm run audit:seal -- g5-science-review.json > g5-science-sealed-review.json
```

If the working environment makes it awkward to persist the full worksheet directly, an evidence receipt may additionally record the assessment fingerprint plus SHA-256 of the completed blind worksheet. The full completed worksheet remains the primary evidence whenever practical.

### 4. Review manual rubrics after sealing

Only after the blind phase is sealed, review the exposed constructed-response rubrics against the response elements already committed by the reviewer. Auto-scored keys/rationales remain hidden at this point.

### 5. Reconcile

```bash
npm run audit:reconcile -- g5-science-sealed-review.json
```

A mismatch or reviewer finding is a real audit finding. Investigate it; do not lower gates to make reconciliation pass.

### 6. Repair means restart

Any substantive browser-effective change to the assessment—prompt, stimulus, options, scoring, rationale, alignment metadata, or other content that changes the fingerprint—invalidates that assessment's review. Generate a new worksheet and repeat from item 1.

## What not to do

- Do **not** expose keys and then try to call the resulting check clean-room.
- Do **not** mechanically copy repository keys into the reviewer fields.
- Do **not** trust existing tests, prior audits, PR descriptions, or author notes as proof of correctness.
- Do **not** create external agent infrastructure merely because the word “independent” appears in the gate.
- Do **not** require a paid API, Copilot quota, GitHub Models, or a local open-weight model when the normal blinded reviewer pass can be performed directly.
- Do **not** preserve certification after a substantive repair; restart that assessment.

## Optional stricter execution

If a genuinely separate reviewer/subagent is readily available, it can consume the same answerless worksheet and follow the identical sequence. This strengthens process separation but does not change the substantive gate or justify different thresholds.

The release evidence should state **how the reviewer was blinded**, the exact assessment fingerprint/SHA reviewed, findings and repairs, and whether a post-repair restart was completed. It should not claim stronger independence than the procedure actually provided.
