# Architecture

MAP Exam Practice uses the same exam-family-neutral boundary established in the ACT project so AP, ACT, and MAP can later be mounted behind one catalog rather than merged as three divergent applications.

```text
Assessment
  ├─ metadata / jurisdiction / administration basis
  ├─ grade / subject
  ├─ scoring policy
  └─ sessions[]
       ├─ order
       ├─ timing policy
       ├─ calculator policy
       ├─ point target / blueprint
       ├─ item-type constraints
       ├─ deferred official components
       └─ form / result behavior
```

`js/config.js` contains the assessment registry. `js/core/` contains reusable assessment primitives. `data/` contains MAP-specific original practice content only.

## MAP timing

MAP Grade-Level sessions are **not countdown-timed**. DESE timing ranges are planning guidelines. The engine therefore models MAP timing as `guideline`, never `countdown`.

## Session locking

Students may move within an active practice session. Once a session is submitted, it is locked and cannot be re-entered, matching the operational MAP session boundary.

## Deferred components and manual scoring

The real Grade-Level assessment includes listening in ELA, writing prompts in Grades 4 and 8 ELA, constructed response in Science, and performance events in Mathematics that may contain written responses.

V1 distinguishes **response capture** from **human scoring**:

- listening/audio playback remains deferred;
- long-form ELA writing is not yet represented as release content;
- Science constructed-response text can be captured and persisted, with an explicit point-matched rubric and no automatic answer key;
- written portions of Math performance events remain a fidelity limitation;
- any response that requires human judgment contributes zero points to the automatic earned/possible denominator until a human score exists.

The registry records unsupported or human-scored components explicitly. The application must never imply that an auto-scorable-only subset is a complete operational simulation, and it must never use extra selected-response content as a substitute for an official written component.

Current Science development banks include manual-response practice in both sessions and across Physical, Life, and Earth/Space Science. The generic Science practice drawer surfaces at least one eligible constructed response when CR content exists, but it deliberately does not encode a guessed summative CR quota.

Machine-scorable parts of Mathematics performance events can still be practiced.

## Calculator policy

Calculator access is an administration/session behavior, separate from optional expectation-level authoring metadata. Under the current 2025–2026 administration basis:

- Grades 3–5 Mathematics: calculator unavailable in ordinary administration;
- Grades 6–8 Mathematics: calculator available throughout all three sessions;
- Grade 5 Science: four-function calculator available;
- Grade 8 Science: scientific calculator available.

Where an item specification contains expectation-level Calculator Designation metadata, it may be recorded for fidelity, but it does not override the current session-level access policy.

## Supported zero-cost interactions

The core schema supports multiple choice, multi-select, EBSR, dropdown, matching, drag/drop ordering or placement, hot text/hotspot, keypad/numeric input, number line, coordinate point/line, line plot, bar graph, clock input, angle input, and manual constructed-response text capture. Renderers may approximate DRC INSIGHT interaction mechanics while preserving the tested response semantics.

## Future combined product

A combined application should consume registries through the same conceptual interface:

```text
Shared practice shell
  ├─ AP registry
  ├─ ACT registry
  └─ MAP registry
```

No MAP core primitive should require a MAP-only global unless the behavior is inherently MAP-specific.
