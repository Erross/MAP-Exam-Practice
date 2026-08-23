# Missouri MAP Exam Practice

Unofficial Missouri Assessment Program (MAP) Grade-Level practice application for Grades 3–8.

The repository deliberately uses an exam-family-neutral assessment/session boundary so its registry and reusable engine can later be mounted alongside the related AP and ACT practice projects instead of merging three divergent applications.

## V1 scope

Configured Grade-Level assessments:

- English Language Arts: Grades 3–8
- Mathematics: Grades 3–8
- Science: Grades 5 and 8

The application models MAP as **untimed**, using DESE session times only as planning guidelines. It records official session boundaries, calculator policy, point targets, and deferred components in configuration.

Current zero-cost scope supports machine-scorable response semantics including multiple choice, multi-select, EBSR, dropdown, matching/matching tables, ordering/drag-drop semantics, hot text/hotspot, numeric/keypad input, number line, coordinate point/line, line plot, bar graph, clock input, and angle input. Manual constructed responses can also be captured, persisted, and reviewed by a human; they are never automatically awarded points or included in the auto-scored percentage.

Listening/audio and **human scoring** of prose remain deferred. The app does not replace required listening, writing, constructed-response, or written performance-event components with extra multiple-choice questions and pretend the resulting practice is operationally complete.

## Development status

The current foundation branch contains **1,780 original development items across all 14 Grade-Level banks**. All remain marked for clean-room review, and normal production UI does not launch draft banks. Append `?dev=1` locally/on a branch build to exercise development banks. A selected session currently draws a short practice set of up to 12 supported items from that session's pool; it is not presented as a complete operational MAP form.

The current April 2026 Missouri DESE `MAP Grade-Level Assessment Blueprints_AOD.pdf` has been directly inspected page by page. Official total points and all reporting-category ranges are primary-source verified in `js/blueprints.js`. That inspection corrected several earlier Math interpretations: Grade 4/5 use combined GM + DS categories, Grade 7 uses combined GM + DSP, and Grade 8 uses combined NS + EEI and GM + DSP. Grade 8 ELA's 4-point "Approaching the task as a reader" row is Language, not a second writing-prompt bucket.

Math Grades 3–8 have a development-only full-form harness that constructs 5,000 complete constrained forms plus 5,000 retake pairs per grade. The corrected primary-range model is green in CI. Current full-form retake overlap by item / points is G3 34.9% / 33.7%, G4 37.6% / 36.8%, G5 37.1% / 36.3%, G6 35.7% / 35.4%, G7 37.9% / 37.4%, and G8 38.1% / 37.7%. All are below the 40% development gate. `officialRangesVerified:true` means the source ranges are verified; it does **not** mean the bank or executable form is release-approved.

Science Grades 5 and 8 each have more than 90 development bank points and at least 30 points of capacity in Physical, Life, and Earth/Space Science. Exact Missouri expectation-code syntax and source-controlled expectation-dictionary coverage are green for all **88 Grade 5** and **89 Grade 8** items. Grade 5's semantic authoring sweep includes 29 high-confidence standard-code corrections, 29 consolidated prompt repairs, 15 answer-tell balances, plus additional post-consolidation matter-flow and force/mass repairs; Grade 8 includes 10 direct `6-8.ESS2.A.2` time/spatial-scale repairs plus a corrected `6-8.ESS3.C.1` population/per-capita resource-demand item. These repairs now live directly in the normal source-bank files; the temporary runtime repair overlays have been removed. Current selected-response uniquely-longest-correct rates are 14.5% for Grade 5 Science and 21.2% for Grade 8 Science, below the unchanged 25% gate.

Each Science grade includes six synthetic 2-point manual constructed-response items balanced across all three science strands and both sessions. Generic Science practice draws surface at least one eligible written response; its points are held for human review rather than automatically scored. This improves interaction fidelity without inventing an operational CR quota. Public current DESE evidence establishes CR/MC/TE in both Science sessions and a 60-point total, but does not provide a separate fixed summative CR point allocation; complete Science-form execution therefore remains intentionally blocked rather than guessing an auto/manual split.

ELA Grades 3–8 can build a supported auto-scored development scope around genuinely non-deferred blueprint components. Direct primary-source reconciliation restored Grade 6/7 Writing reporting-category work and Grade 8's 4-point revise/edit Language bucket while continuing to defer the actual Grade 4/8 passage-based writing prompts and all Listening audio. Thirty-two additional upper-grade revise/edit items were added after the primary PDF exposed real G6/G7/G8 capacity gaps. Current 5,000-pair supported-form retake metrics are: G3 35.4% exact / 34.9% stimulus, G4 34.9% / 35.3%, G5 38.6% / 40.2%, G6 33.5% / 37.2%, G7 34.6% / 39.7%, and G8 38.5% / 40.1%. All six grades pass the hard <=40% exact-item and <=50% stimulus-family development gates.

Current DESE administration behavior is locked by a dedicated contract test: ELA session counts/listening omissions, Math Performance Event placement, calculator access, and the presence of constructed-response work in both Science sessions. Under the current 2025–2026 administration guidance, calculators are unavailable in Grades 3–5 Math and available throughout all three Grades 6–8 Math sessions; Grade 5 Science uses four-function and Grade 8 Science uses scientific calculator access.

The student-facing practice flow now has regression coverage for stable multi-digit/multi-field input persistence without full-view rerenders, short-practice-set disclosure, saved-session exit wording, question-navigator accessibility state, and safe display of student-entered written responses. This is preparatory UX hardening, not the required fresh naive-user release signoff.

## Development

```bash
npm ci
npm run check
npm run build
```

`npm run check` runs structural/unit tests, current-session and Science-manual-response contracts, clean-room tooling contracts, UI response-persistence guards, exact-standard and bank-capacity guards, Math/ELA form diagnostics, seeded practice-session retake analysis, stimulus-overlap analysis, and answer-tell analysis.

## Independent clean-room review

The preferred review flow is deliberately two-phase so no key or manual rubric is visible before the reviewer commits an independent response:

```bash
npm run audit:review-template -- --assessment=g5-science > g5-science-review.json
# independent reviewer completes every response + blind verdict
npm run audit:seal -- g5-science-review.json > g5-science-sealed-review.json
# reviewer now sees only manual CR rubrics and records rubric verdicts
npm run audit:reconcile -- g5-science-sealed-review.json
```

Every packet carries a SHA-256 fingerprint of the complete browser-effective assessment state. Any prompt, option, metadata, scoring, rationale, or ordering repair invalidates the packet and forces a fresh audit from item 1. The tooling enforces process integrity; it does not manufacture an independent reviewer.

## Release standard

A bank is released only after current authoritative DESE verification, release-scale blueprint-constrained content, 5,000-form evidence where applicable, 5,000 retake-pair evidence, an independent clean-room review of the browser-effective bank, repair followed by a fresh audit from scratch when needed, a fresh naive-user review, exact prospective-production-tree validation, and public GitHub Pages smoke testing.

The primary blueprint range gate, corrected-range development-form gates, Science source consolidation, and Science authoring semantic sweep are closed. Every assessment still remains `verified:false` and `executable:false` until genuinely independent clean-room certification, final naive UX review, exact-tree validation, and all assessment-specific deferred-component boundaries are satisfied. Science full-form execution additionally remains blocked by the unresolved authoritative CR-allocation question described above.

See `CONTENT_STANDARDS.md`, `MAP_RELEASE_CHECKLIST.md`, `DEVELOPMENT_WORKFLOW.md`, `OFFICIAL_MAP_SOURCES.md`, `BLUEPRINT_TRANSCRIPTION.md`, and `PLAN.md`.

`main` is reserved for reviewed, deployable work.
