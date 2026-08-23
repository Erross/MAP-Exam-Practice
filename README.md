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

The current foundation branch contains **1,748 original development items across all 14 Grade-Level banks**. All remain marked for clean-room review, and normal production UI does not launch draft banks. Append `?dev=1` locally/on a branch build to exercise development banks.

The current April 2026 Missouri DESE `MAP Grade-Level Assessment Blueprints_AOD.pdf` has now been directly inspected. Official total points and all reporting-category ranges are primary-source verified in `js/blueprints.js`. That inspection corrected several earlier Math interpretations: Grade 4/5 use combined GM + DS categories, Grade 7 uses combined GM + DSP, and Grade 8 uses combined NS + EEI and GM + DSP. Grade 8 ELA's 4-point "Approaching the task as a reader" row is Language, not a second writing-prompt bucket.

Math Grades 3–8 have a development-only full-form harness that constructs 5,000 complete constrained forms plus 5,000 retake pairs per grade. The previous completed evidence was generated under the earlier transcription and must be rerun against the corrected primary-verified grouping model before current metrics are claimed. `officialRangesVerified:true` now means the source ranges are verified; it does **not** mean the bank or executable form is release-approved.

Science Grades 5 and 8 each have more than 90 development bank points and at least 30 points of capacity in Physical, Life, and Earth/Space Science. Exact Missouri expectation-code validation was green on the latest completed pre-CR head. The current branch additionally includes six synthetic 2-point manual constructed-response items per Science grade, balanced across all three science strands and both sessions. Generic Science practice draws surface at least one eligible written response; its points are held for human review rather than automatically scored. This improves interaction fidelity without inventing an operational CR quota. Complete Science-form release remains blocked until the authoritative summative CR share/treatment is established.

ELA Grades 3–8 can build a supported auto-scored development scope around genuinely non-deferred blueprint components. Direct primary-source reconciliation changed that scope: Grade 6/7 Writing reporting-category work is included rather than treated as a human-scored writing prompt, while Grade 8 includes its 4-point Language row and continues to defer the actual passage-based writing prompt. Grades 3, 6, and 7 previously received 42 additional original reading items across 14 new literary/informational stimulus families to address measured diversity misses. The ELA form harness enforces <=40% mean exact-item retake overlap and <=50% mean stimulus-family overlap across 5,000 retake pairs per grade; the revised supported shapes now require a fresh validation run.

Current DESE administration behavior is locked by a dedicated contract test: ELA session counts/listening omissions, Math Performance Event placement, calculator access, and the presence of constructed-response work in both Science sessions. Under the current 2025–2026 administration guidance, calculators are unavailable in Grades 3–5 Math and available throughout all three Grades 6–8 Math sessions; Grade 5 Science uses four-function and Grade 8 Science uses scientific calculator access.

## Development

```bash
npm ci
npm run check
npm run build
```

`npm run check` runs structural/unit tests, current-session and Science-manual-response contracts, exact-standard and bank-capacity guards, Math/ELA form diagnostics, seeded practice-session retake analysis, stimulus-overlap analysis, and answer-tell analysis.

## Release standard

A bank is released only after current authoritative DESE verification, release-scale blueprint-constrained content, 5,000-form evidence, 5,000 retake-pair evidence, an independent clean-room review of the browser-effective bank, repair followed by a fresh audit from scratch when needed, a fresh naive-user review, exact prospective-production-tree validation, and public GitHub Pages smoke testing.

The primary blueprint range gate is now closed: `officialRangesVerified:true`. Every assessment still remains `verified:false` and `executable:false` until the remaining supported-scope, Science CR, bank-alignment, current-head validation, clean-room, UX, and exact-tree requirements are genuinely satisfied.

See `CONTENT_STANDARDS.md`, `MAP_RELEASE_CHECKLIST.md`, `DEVELOPMENT_WORKFLOW.md`, `OFFICIAL_MAP_SOURCES.md`, `BLUEPRINT_TRANSCRIPTION.md`, and `PLAN.md`.

`main` is reserved for reviewed, deployable work.
