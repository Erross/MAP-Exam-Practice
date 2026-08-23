# MAP Grade-Level Release Checklist

## Official specification
- [ ] Current DESE blueprint independently checked and transcribed into `js/blueprints.js`.
- [ ] Blueprint record has `verified: true` only after an independent second check of the current DESE ranges.
- [ ] Current Examiner's Manual independently checked.
- [ ] Missouri Learning Standards and item specifications independently checked.
- [ ] Performance Level Descriptors checked.
- [ ] Current practice form/scoring guide inspected for structure and interaction style only.
- [ ] Verification date and administration basis recorded.
- [ ] Session count/order, official point target, timing guidance, calculator policy, and item types verified.
- [ ] Grades 6-8 Math calculator access remains available throughout all three sessions under the current 2025-2026 administration policy; any expectation-level Calculator Designation metadata used by the bank is independently checked for fidelity and is not used to revoke session-level access.
- [ ] Deferred listening/writing/CR components accurately recorded.

## Effective bank
- [ ] Browser-effective aggregate audited, not only source files.
- [ ] IDs globally unique.
- [ ] Every item has standard/strand/DOK/item-type/points/session/scoring/rationale/provenance metadata.
- [ ] All practice content original/synthetic or explicitly reusable.
- [ ] No official MAP item wording copied into the bank.
- [ ] Every stimulus-backed released item has a stable stimulus/set identifier.
- [ ] Stimulus/set metadata and displayed prose/data are internally consistent.
- [ ] Passage/set delivery behavior preserves intended grouping and does not strand stimulus questions unpredictably.
- [ ] Constructed responses use manual scoring mode, have a point-matched rubric, and contain no automatic answer key.

## Content correctness and grade fit
- [ ] Every answer independently reviewed.
- [ ] Every distractor actually wrong and plausible.
- [ ] Every quantitative answer independently recomputed.
- [ ] Standard/expectation tag checked against current item specs.
- [ ] DOK within assessment boundary.
- [ ] Vocabulary, scenario, prerequisite knowledge, text complexity, and numeric complexity appropriate to grade.
- [ ] Browser-effective selected-response tell metrics pass; source-order key position is only an authoring diagnostic because choices are shuffled at runtime.
- [ ] Uniquely-longest-correct <=25% where the metric is meaningful.

## Production-form evidence
- [ ] At least 5,000 independently seeded **verified-blueprint full-form** draws pass all supported-scope constraints.
- [ ] Every full form hits the configured supported-scope point target and every current reporting-category range.
- [ ] Session order and calculator rules always valid.
- [ ] Stimulus families stay intact where required.
- [ ] Variant siblings never collide.
- [ ] Deferred official components are never silently replaced with extra auto-scored content.
- [ ] Manual-review points are excluded from automatic earned/possible totals and clearly disclosed to the user.
- [ ] Generic 12-item development-session draws are not presented as release evidence.

## Retake diversity
- [ ] 5,000 independent verified-blueprint attempt pairs measured.
- [ ] Mean exact-item overlap <=40% for release-scale banks.
- [ ] Mean point-weighted overlap <=40% for release-scale Math banks.
- [ ] Mean stimulus/set overlap <=50% where stimulus-backed content exists.
- [ ] Stimulus/set overlap is reported separately from item overlap.

## Browser/session/UX
- [ ] Grade and subject easy to select.
- [ ] Preflight states real MAP session count and that sessions are untimed.
- [ ] Timing ranges labeled guidance, not limits.
- [ ] Calculator policy correct for grade/subject/session/item.
- [ ] Supported TE interactions keyboard-accessible where practicable.
- [ ] Constructed-response text persists without losing focus and is labeled as requiring human scoring.
- [ ] Answers and randomized displayed option order persist through navigation/refresh.
- [ ] Submitted session locks against re-entry.
- [ ] Results clearly separate auto-scored points from any manual-review points.
- [ ] Results label themselves unofficial practice performance; no invented MAP scale score/proficiency classification.
- [ ] Audio/written omissions are clear before starting.

## Independent review
- [ ] Clean-room reviewer did not author the bank.
- [ ] Reviewer independently reconstructed official requirements before trusting repository claims/tests/evidence.
- [ ] Entire browser-effective bank reviewed for correctness, ambiguity, grade fit, metadata, duplicates, stimuli/sets, and rendering.
- [ ] Every quantitative item independently recomputed.
- [ ] After any substantive repair, audit restarted from scratch.
- [ ] Fresh final clean-room pass has zero substantive findings.

## Naive assessment
- [ ] Fresh younger-grade assessor flow reviewed.
- [ ] Fresh older-grade assessor flow reviewed.
- [ ] No coaching required to understand sessions, timing, calculator use, submit/locking, results, or limitations.

## Promotion
- [ ] `npm run check` green on exact candidate SHA.
- [ ] Production artifact contains the same browser-effective bank/configuration audited in source.
- [ ] Fresh integration branch created from current `main`.
- [ ] Exact prospective production tree validated.
- [ ] PR head/base unchanged at merge.
- [ ] Resulting `main` tree matches the validated prospective candidate.
- [ ] GitHub Pages deploys from merged `main` and public site is smoke-tested.
