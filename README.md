# Missouri MAP Exam Practice

Unofficial Missouri Assessment Program (MAP) Grade-Level practice application for Grades 3–8.

The repository uses an exam-family-neutral assessment/session boundary so its registry and reusable engine can later be mounted alongside the related AP and ACT practice projects instead of merging three divergent applications.

## V1 release scope

Released short-practice assessments:

- English Language Arts: Grades 3–8
- Mathematics: Grades 3–8
- Science: Grades 5 and 8

The application models MAP as **untimed**, using DESE session times only as planning guidelines. It records official session boundaries, calculator policy, point targets, and omitted/deferred components in configuration.

The zero-cost release supports machine-scorable response semantics including multiple choice, multi-select, EBSR, dropdown, matching/matching tables, ordering/drag-drop semantics, hot text/hotspot, numeric/keypad input, number line, coordinate point/line, line plot, bar graph, clock input, and angle input. Manual constructed responses can also be captured, persisted, and reviewed by a human; they are never automatically awarded points or included in the auto-scored percentage.

Listening/audio and **automatic human-judgment scoring** of prose are outside the V1 release. The app does not replace required listening, writing, constructed-response, or written performance-event components with extra multiple-choice questions and pretend the resulting practice is operationally complete.

## Release status

The V1 bank contains **1,780 original items across all 14 Grade-Level assessments**. Every browser-effective item has completed the project's answer-blind clean-room workflow on its current substantive content, including full item-1 restarts after substantive repairs. Final fingerprints are stored in `evidence/clean-room/final-certification.json` and enforced by `tests/clean-room-final-certification.mjs`; changing certified item content invalidates the matching fingerprint and fails CI until that assessment is re-audited.

All 14 assessment records are `status:"released"` with `practiceMode:"certified-short-practice"`. This means the reviewed short practice is available in the normal production UI. It does **not** mean a complete summative MAP form is executable: every assessment remains `fullSimulationAvailable:false`, and the blueprint records remain `executable:false` where omitted official components prevent a complete operational-form claim.

A selected session draws a short practice set of **up to 12 supported items** from that session's pool. The preflight screen separately shows the official summative point target and explicitly says the short set is not a complete operational MAP session.

The current April 2026 Missouri DESE `MAP Grade-Level Assessment Blueprints_AOD.pdf` was directly inspected page by page. Official total points and all reporting-category ranges are primary-source verified in `js/blueprints.js`. That inspection corrected several earlier Math interpretations: Grade 4/5 use combined GM + DS categories, Grade 7 uses combined GM + DSP, and Grade 8 uses combined NS + EEI and GM + DSP. Grade 8 ELA's 4-point "Approaching the task as a reader" row is Language, not a second writing-prompt bucket.

The final source-boundary review also rechecked the current 2025–2026 Grade-Level Examiner's Manual, DESE's current Grade-Level assessment hub, grade-specific PLDs, curriculum/expanded-expectation/item-specification resources, and the current practice-form/scoring-guide listings. The latest complete current manual confirms the session structure, item-type families, untimed timing policy, and calculator rules encoded by the application. See `OFFICIAL_MAP_SOURCES.md`.

## Form and retake evidence

Math Grades 3–8 have a development/full-form diagnostic harness that constructs 5,000 complete constrained forms plus 5,000 retake pairs per grade. The corrected primary-range model passes the repository's unchanged form and overlap gates. This evidence validates bank capacity and diversity; it does not override omitted written/manual-scored PE fidelity in the student-facing release.

ELA Grades 3–8 have a supported-scope form harness around non-deferred blueprint components. The current 5,000-pair gates require <=40% mean exact-item overlap and <=50% mean stimulus-family overlap. Grade 4/8 passage-writing prompts and all Listening audio remain outside the automatically scored V1 scope rather than being substituted with unrelated items.

Science Grades 5 and 8 contain 88 and 89 items respectively, including six synthetic 2-point manual constructed-response items per grade balanced across all three science strands and both sessions. Exact expectation syntax, source-controlled expectation-dictionary coverage, semantic regressions, manual-response contracts, and the unchanged <=25% uniquely-longest-correct selected-response tell gate are enforced by CI.

Public current DESE evidence establishes CR/MC/TE in both Science sessions and a 60-point total, but does not provide a separate fixed summative CR point allocation. Complete Science-form execution therefore remains intentionally blocked rather than guessing an auto/manual split.

## Student-facing behavior

The release flow has regression coverage for stable multi-digit/multi-field input persistence without full-view rerenders, saved-session behavior, short-practice disclosure, calculator messaging, question-navigator accessibility state, manual-response scoring boundaries, and safe display of student-entered written responses.

A final naive/student-facing review was conducted from both a younger Grade 3 and older Grade 8 perspective after the release wording was finalized. The evidence is recorded in `evidence/ux/naive-release-review.md`. The review approved the **short-practice product**, not full operational-form equivalence.

Results are deliberately described as unofficial raw practice performance. The app does not invent MAP scale scores or proficiency classifications.

## Development

```bash
npm ci
npm run check
npm run build
```

`npm run check` runs structural/unit tests, official-session and Science-manual-response contracts, clean-room tooling and final-fingerprint gates, release-visibility semantics, UI response-persistence guards, exact-standard and bank-capacity guards, Math/ELA form diagnostics, seeded practice-session retake analysis, stimulus-overlap analysis, and answer-tell analysis.

## Independent clean-room review

Use `CLEAN_ROOM_REVIEW.md`. The normal project workflow is deliberately simple and answer-blind:

```bash
npm run audit:review-template -- --assessment=g5-science > g5-science-review.json
# reviewer independently completes every response + blind verdict
npm run audit:seal -- g5-science-review.json > g5-science-sealed-review.json
# manual CR rubrics are reviewed only after the blind phase is sealed
npm run audit:reconcile -- g5-science-sealed-review.json
```

Every packet carries a SHA-256 fingerprint of the complete browser-effective assessment state. Any substantive prompt, option, metadata, scoring, rationale, or ordering repair invalidates that assessment's review and requires a restart from item 1.

A separate paid model service or custom external agent runner is **not** a release prerequisite. The essential gate is answer blindness during the independent judgment phase, followed by freeze/seal and keyed reconciliation.

## Release interpretation

`status:"released"` means the certified short-practice assessment is available to students. It does not mean `fullSimulationAvailable:true`, and it does not change a blueprint from `executable:false` when authoritative full-form constraints or required human/audio components are not represented.

This distinction is intentional. V1 is a production-ready **MAP practice application**, not a claim to reproduce complete secure operational MAP forms.

See `CONTENT_STANDARDS.md`, `CLEAN_ROOM_REVIEW.md`, `MAP_RELEASE_CHECKLIST.md`, `DEVELOPMENT_WORKFLOW.md`, `OFFICIAL_MAP_SOURCES.md`, `BLUEPRINT_TRANSCRIPTION.md`, and `PLAN.md`.

`main` is production and deploys to GitHub Pages only after exact-tree validation and release gates pass.
