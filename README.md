# Missouri MAP Exam Practice

Unofficial Missouri Assessment Program (MAP) Grade-Level practice application for Grades 3–8.

The repository deliberately uses an exam-family-neutral assessment/session boundary so its registry and reusable engine can later be mounted alongside the related AP and ACT practice projects instead of merging three divergent applications.

## V1 scope

Configured Grade-Level assessments:

- English Language Arts: Grades 3–8
- Mathematics: Grades 3–8
- Science: Grades 5 and 8

The application models MAP as **untimed**, using DESE session times only as planning guidelines. It records official session boundaries, calculator policy, point targets, and deferred components in configuration.

Current zero-cost scope supports machine-scorable response semantics including multiple choice, multi-select, EBSR, dropdown, matching/matching tables, ordering/drag-drop semantics, hot text/hotspot, numeric/keypad input, number line, coordinate point/line, line plot, bar graph, clock input, and angle input. Manual constructed responses can also be captured and preserved for human review; they are never automatically awarded points or included in the auto-scored percentage.

Listening/audio and human-scored prose are intentionally deferred from automatic scoring. The app does not replace those required MAP components with extra multiple-choice questions and pretend the resulting practice is operationally complete.

## Development status

The current foundation branch contains **1,248 original development items across all 14 Grade-Level banks**. All remain marked for clean-room review, and normal production UI does not launch draft banks. Append `?dev=1` locally/on a branch build to exercise development banks.

Math Grades 3–8 have release-scale development-bank diversity under the currently transcribed blueprint ranges. A development-only harness constructs 5,000 complete constrained forms plus 5,000 retake pairs per grade; all six grades are held to <=40% mean full-form overlap by both item and points. These results are diagnostic only because current-primary DESE category-range confirmation is still pending.

Science Grades 5 and 8 each have more than 90 development bank points and at least 30 points of capacity in Physical, Life, and Earth/Space Science. The Grade 8 bank is being tightened to exact Missouri expectation codes; Science remains non-executable as a complete operational form until the human-scored constructed-response share is authoritatively established.

ELA Grades 3–8 have mature practice-session diversity but remain the largest content-scale gap for supported-scope full forms. A development-only ELA form diagnostic is used to size reading/research/language expansion while writing prompts and listening remain visibly deferred.

## Development

```bash
npm ci
npm run check
npm run build
```

`npm run check` runs structural/unit tests, exact-standard and bank-capacity guards, Math/ELA form diagnostics, seeded practice-session retake analysis, stimulus-overlap analysis, and answer-tell analysis.

## Release standard

A bank is released only after current authoritative DESE verification, release-scale blueprint-constrained content, 5,000-form evidence, 5,000 retake-pair evidence, an independent clean-room review of the browser-effective bank, repair followed by a fresh audit from scratch when needed, a fresh naive-user review, exact prospective-production-tree validation, and public GitHub Pages smoke testing.

Current blueprint category ranges remain explicitly non-release evidence until independently confirmed against the current DESE primary source. `verified` and `executable` stay false until those source and supported-scope requirements are genuinely satisfied.

See `CONTENT_STANDARDS.md`, `MAP_RELEASE_CHECKLIST.md`, `DEVELOPMENT_WORKFLOW.md`, `OFFICIAL_MAP_SOURCES.md`, `BLUEPRINT_TRANSCRIPTION.md`, and `PLAN.md`.

`main` is reserved for reviewed, deployable work.