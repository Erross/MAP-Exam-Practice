# MAP Grade-Level V1 Release Checklist

Release target: **certified short-practice product**, not complete secure operational-form equivalence.

## Official specification
- [x] Current April 2026 DESE blueprint directly inspected and reconciled into `js/blueprints.js` / `BLUEPRINT_TRANSCRIPTION.md`.
- [x] Official total-point targets and reporting-category ranges recorded with `officialPointTargetVerified:true` and `officialRangesVerified:true`.
- [x] Release semantics distinguish official-source verification from complete form executability. Short-practice release does not set blueprint `verified:true`/`executable:true` when required operational components remain outside scope.
- [x] Current 2025-2026 Grade-Level Examiner's Manual independently rechecked for final release.
- [x] Missouri Learning Standards / expanded expectations / item-specification resources independently checked during content review.
- [x] Grade-specific Performance Level Descriptors checked as the grade-fit frame of reference.
- [x] Current DESE practice-form/scoring-guide resources inspected for interaction/style evidence only; no official item text is copied.
- [x] Verification date and administration basis recorded.
- [x] Session count/order, official point target, timing guidance, calculator policy, and item-type families independently rechecked as part of final release review.
- [x] Grades 6-8 Math calculator access remains available throughout all three sessions under the current 2025-2026 administration policy; expectation-level metadata does not revoke session-level access.
- [x] Deferred listening/writing/CR/manual-scored PE components accurately recorded for the release candidate.

## Effective bank
- [x] Browser-effective aggregate audited, not only source files.
- [x] IDs globally unique.
- [x] Every item satisfies required standard/strand/DOK/item-type/points/session/scoring/rationale/provenance contracts.
- [x] Practice content is original/synthetic; no secure/released official question wording is used as bank content.
- [x] Stimulus-backed items have stable stimulus/set identifiers.
- [x] Stimulus/set metadata and displayed prose/data are internally consistent.
- [x] Passage/set delivery behavior preserves intended grouping.
- [x] Constructed responses use manual scoring mode, have point-matched rubrics, and contain no automatic answer key.
- [x] Final clean-room fingerprints for all 14 assessments are source-controlled and CI-enforced in `evidence/clean-room/final-certification.json`.

## Content correctness and grade fit
- [x] All 1,780 browser-effective items independently reviewed answer-blind on their current substantive content.
- [x] Distractors/alternate responses reviewed for correctness and ambiguity.
- [x] Quantitative answers independently recomputed during Math/Science review.
- [x] Standard/expectation tags checked against current Missouri resources; substantive mis-tags found during review were repaired and affected assessments restarted from item 1.
- [x] DOK/grade-fit/vocabulary/scenario/prerequisite/numeric/text complexity reviewed.
- [x] Browser-effective selected-response tell metrics remain behind unchanged CI gates; source-order key position is only an authoring diagnostic because choices are shuffled at runtime.
- [x] Uniquely-longest-correct <=25% where the metric is meaningful.

## Form/capacity evidence
- [x] Corrected current-primary reporting-category groupings are used by form/capacity diagnostics, including combined G4/G5 GM+DS, G7 GM+DSP, and G8 NS+EEI / GM+DSP.
- [x] 5,000 independently seeded current-primary development/full or supported-scope draws pass applicable constraints for Math/ELA diagnostics.
- [x] Supported form harnesses hit their configured supported-scope targets/ranges where such an executable supported subset is defined.
- [x] Session order and calculator rules remain valid.
- [x] Stimulus families stay intact where required.
- [x] Variant siblings do not collide.
- [x] Deferred official components are never silently replaced with extra auto-scored content.
- [x] Manual-review points are excluded from automatic earned/possible totals and clearly disclosed.
- [x] Generic up-to-12-item student practice draws are not presented as full-form release evidence.
- [x] Science full-form execution remains blocked because no governing public fixed summative CR point allocation has been found.

## Retake diversity
- [x] 5,000 independent current-primary constrained attempt pairs measured where applicable.
- [x] Mean exact-item overlap <=40% for release-scale Math/ELA supported banks.
- [x] Mean point-weighted overlap <=40% for Math full-form diagnostics.
- [x] Mean stimulus/set overlap <=50% for stimulus-backed ELA supported-form diagnostics.
- [x] Stimulus/set overlap reported separately from item overlap.

## Browser/session/UX
- [x] Grade and subject selection is clear; all 14 certified short-practice assessments are production-visible.
- [x] Preflight states real MAP session count and that sessions are untimed.
- [x] Up-to-12-item practice size is clearly distinguished from the official point target and a complete operational MAP session.
- [x] Timing ranges labeled guidance, not limits.
- [x] Calculator policy correct for grade/subject/session.
- [x] Supported TE interactions keyboard-accessible where practicable.
- [x] Multi-digit and multi-field controls retain focus/input without full-view rerenders.
- [x] Question navigator exposes current/answered/flagged state accessibly.
- [x] Constructed-response text persists and is labeled as requiring human scoring.
- [x] Student-entered written responses are safely escaped on results.
- [x] Answers and randomized displayed option order persist through navigation/refresh.
- [x] Saved in-progress session behavior and `Save & exit` wording are clear.
- [x] Submitted session locks against re-entry.
- [x] Results separate auto-scored points from manual-review points.
- [x] Results are explicitly unofficial practice performance; no MAP scale score/proficiency classification is invented.
- [x] Audio/written/manual-scoring omissions are clear before starting.
- [x] Mobile/narrow layouts stack passage/stimulus workspaces and convert the navigator to a compact grid.

## Independent review
- [x] `CLEAN_ROOM_REVIEW.md` procedure followed; no paid/external agent infrastructure is required by the gate.
- [x] Fresh browser-effective answerless worksheet/manifest generated per assessment with exact fingerprint.
- [x] Prior authoring conclusions, remembered keys, tests, PR descriptions, and earlier audits treated as non-evidence during blind passes.
- [x] Scoring objects, answer keys, rationales, and CR rubrics withheld while blind judgments were recorded.
- [x] Entire browser-effective bank reviewed for correctness, ambiguity, grade fit, alignment, stimuli/sets, and response behavior.
- [x] Reviewer independently answered all auto-scored items and committed expected response/scoring elements for constructed responses before rubric exposure.
- [x] Blind judgments frozen/sealed before manual-rubric/key reconciliation.
- [x] Manual Science CR rubrics reviewed only after blind response commitment.
- [x] Reconciliation passes with zero final substantive findings on all 14 current fingerprints.
- [x] Every assessment with a substantive repair was restarted from item 1.
- [x] Final certification fingerprints are enforced by `tests/clean-room-final-certification.mjs`; any substantive bank drift fails CI and requires re-audit.

## Naive assessment
- [x] Fresh younger-grade Grade 3 student-facing flow reviewed.
- [x] Fresh older-grade Grade 8 student-facing flow reviewed.
- [x] No coaching required to understand short-practice scope, sessions, untimed timing, calculator use, save/resume, submit/locking, results, or limitations.
- [x] Evidence recorded in `evidence/ux/naive-release-review.md`.

## Promotion
- [ ] `npm run check` green on the exact final candidate SHA after all release-status/docs/test changes.
- [ ] `npm run build` green on that exact SHA.
- [ ] Production artifact contains the same certified browser-effective bank and release configuration audited in source.
- [ ] Current `main` rechecked immediately before merge.
- [ ] Exact prospective production tree validated against current `main`.
- [ ] PR head/base unchanged at merge; expected-head guard used.
- [ ] Resulting `main` tree/merge commit matches the validated prospective candidate.
- [ ] GitHub Pages deployment succeeds from merged `main`.
- [ ] Public site smoke-tested: catalog -> preflight -> released session availability/instructions -> static assets/about/source pages.
