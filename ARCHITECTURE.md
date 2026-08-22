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

## Deferred components

The real Grade-Level assessment includes listening in ELA, writing prompts in Grades 4 and 8 ELA, constructed response in Science, and performance events in Mathematics that may contain written responses. V1 deliberately defers audio and human-scored prose. The registry records those components explicitly; the application must never imply that an auto-scorable-only practice form is a complete operational simulation.

Machine-scorable parts of performance events can still be practiced.

## Supported zero-cost interactions

The core schema supports multiple choice, multi-select, EBSR, dropdown, matching, drag/drop ordering or placement, hot text, keypad/numeric input, number line, coordinate point/line, line plot, bar graph, clock input, and angle input. Renderers may approximate DRC INSIGHT interaction mechanics while preserving the tested response semantics.

## Future combined product

A combined application should consume registries through the same conceptual interface:

```text
Shared practice shell
  ├─ AP registry
  ├─ ACT registry
  └─ MAP registry
```

No MAP core primitive should require a MAP-only global unless the behavior is inherently MAP-specific.
