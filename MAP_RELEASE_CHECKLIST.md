# MAP Grade-Level Release Checklist

## Official specification
- [x] Current April 2026 DESE blueprint directly inspected and reconciled into `js/blueprints.js` / `BLUEPRINT_TRANSCRIPTION.md`.
- [x] Official total-point targets and reporting-category ranges recorded with `officialPointTargetVerified:true` and `officialRangesVerified:true`.
- [ ] Blueprint record has `verified: true` only after all non-source release blockers are closed and a fresh independent final check passes on the exact candidate tree.
- [ ] Current Examiner's Manual independently checked.
- [ ] Missouri Learning Standards and item specifications independently checked.
- [ ] Performance Level Descriptors checked.
- [ ] Current practice form/scoring guide inspected for structure and interaction style only.
- [x] Verification date and administration basis recorded.
- [ ] Session count/order, official point target, timing guidance, calculator policy, and item types independently rechecked as part of final release review.
- [x] Grades 6-8 Math calculator access remains available throughout all three sessions under the current 2025-2026 administration policy; any expectation-level Calculator Designation metadata used by the bank is independently checked for fidelity and is not used to revoke session-level access.
- [ ] Deferred listening/writing/CR components accurately recorded for the exact release candidate.

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
- [ ] Corrected current-primary reporting-category groupings are used by all form/capacity diagnostics (including combined G4/G5 GM+DS, G7 GM+DSP, and G8 NS+EEI / GM+DSP).
- [ ] At least 5,000 independently seeded **current-primary blueprint** development/full or authoritative supported-scope draws pass all applicable constraints on the exact candidate SHA.
- [ ] Every supported form hits the configured supported-scope point target and every applicable current reporting-category range.
- [ ] Session order and calculator rules always valid.
- [ ] Stimulus families stay intact where required.
- [ ] Variant siblings never collide.
- [ ] Deferred official components are never silently replaced with extra auto-scored content.
- [ ] Manual-review points are excluded from automatic earned/possible totals and clearly disclosed to the user.
- [ ] Generic 12-item development-session draws are not presented as release evidence.

## Retake diversity
- [ ] 5,000 independent current-primary constrained attempt pairs measured.
- [ ] Mean exact-item overlap <=40% for release-scale banks.
- [ ] Mean point-weighted overlap <=40% for release-scale Math banks.
- [ ] Mean stimulus/set overlap <=50% where stimulus-backed content exists.
- [ ] Stimulus/set overlap is reported separately from item overlap.

## Browser/session/UX
- [ ] Grade and subject easy to select.
- [ ] Preflight states real MAP session count and that sessions are untimed.
- [ ] Short 12-item practice-set size is clearly distinguished from an operational/full MAP session and official point target.
- [ ] Timing ranges labeled guidance, not limits.
- [ ] Calculator policy correct for grade/subject/session/item.
- [ ] Supported TE interactions keyboard-accessible where practicable.
- [ ] Multi-digit and multi-field controls retain focus/input without requiring full-view rerenders.
- [ ] Question navigator exposes current/answered/flagged state accessibly.
- [ ] Constructed-response text persists without losing focus and is labeled as requiring human scoring.
- [ ] Student-entered written responses are safely escaped when shown in results.
- [ ] Answers and randomized displayed option order persist through navigation/refresh.
- [ ] Saved in-progress session behavior and exit wording are clear.
- [ ] Submitted session locks against re-entry.
- [ ] Results clearly separate auto-scored points from any manual-review points.
- [ ] Results label themselves unofficial practice performance; no invented MAP scale score/proficiency classification.
- [ ] Audio/written omissions are clear before starting.

## Independent review
- [ ] Clean-room reviewer did not author the bank and has not previously seen its keys/rationales.
- [ ] Reviewer independently reconstructed official requirements before trusting repository claims/tests/evidence.
- [ ] Entire browser-effective bank reviewed for correctness, ambiguity, grade fit, metadata, duplicates, stimuli/sets, and rendering.
- [ ] Exact browser-effective assessment fingerprint recorded in the blind review packet before review starts.
- [ ] Reviewer independently answers every auto-scored item and records expected response/scoring elements for every constructed response before seeing any key or manual rubric.
- [ ] All blind correctness/ambiguity/grade-fit/alignment judgments completed and sealed before manual rubrics are exposed.
- [ ] Constructed-response rubrics reviewed only after the blind phase is sealed; auto-scored keys/rationales remain hidden until reconciliation.
- [ ] Every quantitative item independently recomputed.
- [ ] Reconciliation passes on the same browser-effective fingerprint with zero answer mismatches, recorded findings, incomplete judgments, rubric findings, or post-seal tampering.
- [ ] After any substantive repair, audit restarted from scratch with a newly generated fingerprint/worksheet.
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
