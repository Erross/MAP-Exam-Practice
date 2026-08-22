# Missouri MAP Exam Practice

Unofficial Missouri Assessment Program (MAP) Grade-Level practice application for Grades 3–8.

The repository deliberately uses an exam-family-neutral assessment/session boundary so its registry and reusable engine can later be mounted alongside the related AP and ACT practice projects instead of merging three divergent applications.

## V1 scope

Configured Grade-Level assessments:

- English Language Arts: Grades 3–8
- Mathematics: Grades 3–8
- Science: Grades 5 and 8

The application models MAP as **untimed**, using DESE session times only as planning guidelines. It records official session boundaries, calculator policy, point targets, and deferred components in configuration.

Current zero-cost scope supports machine-scorable response semantics including multiple choice, multi-select, EBSR, dropdown, matching/matching tables, ordering/drag-drop semantics, hot text/hotspot, numeric/keypad input, number line, coordinate point/line, line plot, bar graph, clock input, and angle input.

Listening/audio and human-scored prose are intentionally deferred. The app does not replace those required MAP components with extra multiple-choice questions and pretend the resulting practice is operationally complete.

## Development status

The current foundation branch contains 78 original **development** items across Grade 5 and Grade 8 Math, ELA, and Science. They are not release-scale and are marked for clean-room review. Normal production UI does not launch draft banks. Append `?dev=1` locally/on a branch build to exercise development banks.

Current release blockers are measured rather than hidden: the small vertical-slice banks have 100% retake overlap and several authored option-position/answer-length distributions are not mature enough for release. Delivered selected-response order is randomized and persisted, but raw bank-quality gates still apply before release.

## Development

```bash
npm ci
npm run check
npm run build
```

`npm run check` runs structural/unit tests plus seeded form, retake-overlap, and answer-tell analysis. Draft-bank metrics are reported; released banks turn applicable thresholds into hard failures.

## Release standard

A bank is released only after current authoritative DESE verification, release-scale blueprint-constrained content, 5,000-form evidence, 5,000 retake-pair evidence, an independent clean-room review of the browser-effective bank, repair followed by a fresh audit from scratch when needed, a fresh naive-user review, exact prospective-production-tree validation, and public GitHub Pages smoke testing.

See `CONTENT_STANDARDS.md`, `MAP_RELEASE_CHECKLIST.md`, `DEVELOPMENT_WORKFLOW.md`, `OFFICIAL_MAP_SOURCES.md`, and `PLAN.md`.

`main` is reserved for reviewed, deployable work.
