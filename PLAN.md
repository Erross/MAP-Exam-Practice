# MAP V1 Build Plan

## Foundation
- [x] Bootstrap repository and protect `main` as production.
- [x] Establish exam-family-neutral registry/session architecture compatible with future AP/ACT aggregation.
- [x] Record current DESE source basis and source-version caveat.
- [x] Encode all 14 Grade-Level grade/subject assessments and official session/timing/point metadata.
- [x] Model current calculator policy: no calculator in Grades 3-5 Math, calculator available throughout all three Grades 6-8 Math sessions, four-function in Grade 5 Science, and scientific in Grade 8 Science. Expectation-level Math Calculator Designation may be retained as independently checked fidelity metadata but does not revoke current session-level access.
- [x] Define zero-cost machine-scorable MAP interaction schema.
- [x] Define clean-room, naive-review, randomized-form, retake, and exact-tree release gates.
- [x] Complete browser shell, local persistence, session locking, raw practice scoring, answer review, and machine-scorable interaction renderers.
- [x] Add persistent answer-option randomization so semantic keys survive display shuffling and resume.
- [x] Add local four-function/scientific practice calculator behavior where verified MAP administration policy permits it.
- [x] Add CI, production build, randomized audit, and GitHub Pages workflow.
- [x] Keep draft banks non-launchable in normal production; `?dev=1` explicitly enables development testing.
- [x] Add blueprint-aware full-form assembly primitives and block release until official requirements and supported-scope execution are independently verified.
- [x] Require 5,000 full-form/supported-form draws and <=40% mean exact-item retake overlap for release-scale banks.
- [x] Measure answer-position tells on browser-effective persisted shuffles, while retaining source order only as an authoring diagnostic.
- [x] Add stimulus/set-family overlap diagnostics for ELA and Science.
- [x] Add exact Missouri Science expectation-code validation for Grades 5 and 8.
- [x] Make ELA supported-scope development diversity regression-failing at <=40% mean exact-item overlap and <=50% mean stimulus-family overlap across 5,000 retake pairs.
- [x] Add a dedicated current-DESE session contract test covering ELA session counts/listening omissions, Math PE placement/calculator policy, and Science two-session CR disclosure.
- [x] Add real manual-scored Science CR practice: six synthetic 2-point items per Science grade, balanced across PS/LS/ESS and Sessions 1/2, with every generic Science practice draw guaranteed to surface at least one eligible CR.
- [x] Directly inspect the current April 2026 DESE `MAP Grade-Level Assessment Blueprints_AOD.pdf` and reconcile all 14 official point/range records.
- [x] Rerun Math and ELA development form diagnostics under the corrected primary-source model and repair the ELA capacity gaps exposed by that correction.

## Current cost-constrained scope

Build all machine-scorable practice possible and capture written responses where useful. Defer for now:

- listening/audio playback content;
- human scoring of Grade 4/8 ELA passage-based writing prompts;
- human scoring of Science constructed responses;
- human scoring of written portions of Math performance events.

Do not replace deferred components with MCQ and call the result operationally complete. Manual-response capture is allowed, but its points remain excluded from the automatic percentage until a human score exists.

## Development coverage completed

- [x] Grade 3 Math and ELA.
- [x] Grade 4 Math and ELA; passage-writing/listening remain explicit gaps.
- [x] Grade 5 Math, ELA, and Science; listening/human-scored Science CR/written PE components remain explicit gaps.
- [x] Grade 6 Math and ELA.
- [x] Grade 7 Math and ELA.
- [x] Grade 8 Math, ELA, and Science; passage-writing/listening/human-scored Science CR/written PE components remain explicit gaps.

Current development floor: **1,780 original development items across all 14 Grade-Level banks**. Every bank remains `draft` / `development-needs-clean-room`; this is development evidence, not release approval.

## Primary blueprint reconciliation - completed 2026-08-23

The actual current 15-page April 2026 Missouri DESE blueprint PDF was obtained and visually checked page by page. The primary-source range blocker is closed and `js/blueprints.js` records `officialRangesVerified:true` for all 14 assessments while correctly retaining `verified:false` / `executable:false`.

Direct inspection identified material corrections to the earlier corroborating transcription:

- Grade 4 Math: GM + DS is one 10-18 point / 20-37% reporting category.
- Grade 5 Math: GM + DS is one 8-18 point / 16-36% reporting category.
- Grade 7 Math: GM + DSP is one 9-18 point / 18-33% reporting category.
- Grade 8 Math: NS + EEI is one 17-25 point / 32-46% category; GM + DSP is one 12-20 point / 23-37% category.
- Grade 8 ELA: the 4-point "Approaching the task as a reader" row belongs to Language, not a second writing-task bucket.

The same reconciliation clarified ELA supported scope. Current administration guidance identifies passage-based writing prompts in Grades 4 and 8. Grade 6/7 Writing reporting-category work is included in auto-scored supported-form diagnostics instead of being discarded as a deferred human-scored prompt. Grade 8's 4-point Language/reader row is represented by the Missouri `8.W.3` revise/edit expectation family rather than an invented `8.L` code, while the actual 8-point Grade 8 passage-writing component remains deferred.

## Current exact-head development evidence

A completed CI run on the corrected 1,780-item model passed `npm run check` and `npm run build`, including core/session contracts, catalog/manifest checks, Science manual-response and exact-code checks, delivery-group/PE integrity, primary-range bank capacity, Math/ELA form diagnostics, 180,000 practice-session draws, tell analysis, and static production build.

### Math current-primary full-form diversity

Each grade constructed 5,000 complete development forms and 5,000 retake pairs under the directly verified April 2026 reporting-category groupings, preserving exactly one complete operational PE:

- Grade 3: 34.9% item overlap / 33.7% point overlap.
- Grade 4: 37.6% / 36.8%.
- Grade 5: 37.1% / 36.3%.
- Grade 6: 35.7% / 35.4%.
- Grade 7: 37.9% / 37.4%.
- Grade 8: 38.1% / 37.7%.

All six are below the 40% full-form development gate. These are development metrics, not release certification.

### ELA corrected supported scope

The direct primary-source correction initially caused honest capacity failures in Grade 6 Writing, Grade 7 Writing, and Grade 8 Language/revise-edit. The gates were not weakened. The banks received **32 new upper-grade revise/edit items** aligned to the `W.3` family, bringing the total catalog from 1,748 to 1,780.

Current 5,000-pair supported-form results:

- Grade 3: 35.4% exact-item / 34.9% stimulus overlap.
- Grade 4: 34.9% / 35.3%.
- Grade 5: 38.6% / 40.2%.
- Grade 6: 33.5% / 37.2%.
- Grade 7: 34.6% / 39.7%.
- Grade 8: 38.5% / 40.1%.

All six pass the hard <=40% exact-item and <=50% stimulus-family development gates.

### Science

The primary Science strand ranges are directly verified:

- Grade 5: PS 17-26, LS 15-22, ESS 15-22; total 60.
- Grade 8: PS/LS/ESS each 15-23; total 60.

Current tests confirm 88 Grade 5 and 89 Grade 8 Science items use syntactically valid exact Missouri expectation codes, both banks exceed the primary strand minimums with healthy development capacity, and each contains manual CR practice in both sessions and all strands.

However, exact-code membership is not sufficient proof of **semantic** alignment. Targeted review has already found valid-looking but semantically questionable tags in Grade 5 Physical Science, including force/motion items tagged to `4.PS.2.A.1` even though the prompt tests change in force magnitude, and magnet-distance items assigned to matter expectations. This semantic audit is now the highest-value content QA task.

The current administration material confirms both Science sessions contain CR, MC, and TE items, but the governing materials inspected so far do **not** provide a separate fixed CR point quota. Full-form Science executability therefore remains blocked until authoritative operational CR allocation/treatment is established rather than guessed.

## Remaining release blockers

### Science semantic standard alignment

1. Inventory every browser-effective Grade 5 and Grade 8 Science expectation tag against an exact source-controlled expectation dictionary.
2. Review prompt semantics, not merely regex/code validity.
3. Repair mis-tagged or poorly aligned items; rewrite weak items instead of forcing a convenient code.
4. Add targeted semantic regression coverage for known force/motion, magnetism, matter, light, ecosystem, and Earth-system families.
5. After substantive repairs, restart any affected independent clean-room audit from scratch.

### Science constructed-response operational allocation

Establish an authoritative summative CR item/point treatment if current DESE item specifications/scoring materials expose one. Until then, retain explicit manual/partial practice and do not invent a 60-point all-auto Science form.

### Independent review and release process

No bank authored or repaired in this build may self-certify its clean-room audit. The release checklist still requires:

- genuinely independent clean-room review of each browser-effective bank;
- repair-and-restart on substantive findings;
- naive age-appropriate UX review;
- exact prospective production-tree validation;
- merge only after the exact candidate remains green; and
- public GitHub Pages smoke testing after merge.

## Next build order

1. Complete the Grade 5/8 Science semantic expectation-tag sweep, beginning with the known force/motion and magnetism mismatches; add semantic regression checks.
2. Rerun exact-head CI after every substantive Science repair and keep the primary Math/ELA evidence gates intact.
3. Establish authoritative Science constructed-response allocation/treatment if DESE materials expose it; otherwise retain explicit partial/manual practice rather than inventing a full-form quota.
4. Run independent clean-room audits assessment by assessment; after any substantive repair, restart the complete bank review from scratch.
5. Run fresh younger-grade, middle-grade, and older-grade naive UX reviews.
6. Validate the exact prospective production tree before marking any assessment released or merging to `main`.
7. After merge, smoke-test the deployed GitHub Pages production site.

For every assessment: use the now-primary-verified official blueprint, independently verify item specifications/semantic tags, require release-scale randomized forms and retake gates, run answer-tell and full-bank clean-room review, repair-and-restart if needed, and finish with fresh naive UX and exact-tree validation.

## 2026-2027 revalidation gate

Before any Spring 2027 fidelity claim, re-check the complete 2026-2027 DESE Examiner's Manual, blueprints, item specs, practice forms, scoring guides, calculator rules, item types, timing guidance, and any DRC interaction changes as they are published. Reconcile changes before promotion.
