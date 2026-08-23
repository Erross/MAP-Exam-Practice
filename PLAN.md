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
- [x] Add local four-function/scientific practice calculator behavior where the verified MAP administration policy permits it.
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

Current development floor: **1,748 original development items across all 14 Grade-Level banks**. Every bank remains `draft` / `development-needs-clean-room`; this is development evidence, not release approval.

## Primary blueprint reconciliation - completed 2026-08-23

The actual current 15-page April 2026 Missouri DESE blueprint PDF was obtained and visually checked page by page. The primary-source range blocker is now closed and `js/blueprints.js` records `officialRangesVerified:true` for all 14 assessments while correctly retaining `verified:false` / `executable:false`.

Direct inspection identified material corrections to the earlier corroborating transcription:

- Grade 4 Math: GM + DS is one 10-18 point / 20-37% reporting category.
- Grade 5 Math: GM + DS is one 8-18 point / 16-36% reporting category.
- Grade 7 Math: GM + DSP is one 9-18 point / 18-33% reporting category.
- Grade 8 Math: NS + EEI is one 17-25 point / 32-46% category; GM + DSP is one 12-20 point / 23-37% category.
- Grade 8 ELA: the 4-point "Approaching the task as a reader" row belongs to Language, not a second writing-task bucket.

The Math full-form and capacity diagnostics now use those combined reporting categories. Previous Math overlap metrics were generated under the old split interpretation and are historical only until the new head is rerun.

The same reconciliation clarified ELA supported scope. Current administration guidance identifies passage-based writing prompts in Grades 4 and 8. Grade 6/7 Writing reporting-category work is therefore included in auto-scored supported-form diagnostics instead of being discarded as a deferred human-scored prompt. Grade 8 supported scope includes its 4-point Language row while continuing to defer the actual 8-point passage-writing component.

## Latest completed evidence before the primary reconciliation

The last fully completed CI evidence before the current reconciliation validated:

- all 14 assessment configurations and browser-effective banks;
- 1,694 development items at that earlier head;
- 17 response/scoring fixture types plus manual constructed-response capture excluded from automatic scoring;
- exact Science expectation codes for all 82 Grade 5 and 83 Grade 8 Science items at that earlier head;
- Math development full-form construction and retake diagnostics under the then-current transcription;
- ELA supported-form construction under the then-current supported shapes;
- persisted answer-option randomization, delivery-group integrity, session locking, randomized practice-session checks, and static `_site` production build.

Since then, Grade 3/6/7 ELA received **42 additional original reading items across 14 new literary/informational stimulus families**, and Grade 5/8 Science received **12 synthetic manual constructed-response items** total. The catalog floor is now 1,748, ELA diversity is a hard gate, Science generic practice surfaces CR, and exact blueprint groupings/support shapes have now been corrected from the primary PDF. Consequently, the exact current head requires a fresh full validation run before any current metrics are claimed.

## Current measured blockers

Release gates remain intentionally closed.

### Validation on corrected source model

The most immediate gate is now execution, not source retrieval. `npm run check` must complete on the current 1,748-item exact head using:

- corrected primary-verified Math reporting-category groupings;
- revised Grade 6/7/8 ELA supported shapes;
- the 12 new Science CR items;
- the hard ELA overlap gates;
- current Science exact-standard/manual-response contracts.

If any corrected-range or revised-scope capacity/diversity test fails, repair the bank or harness based on the official model rather than weakening the gate.

### ELA scale

Historical pre-expansion supported-form diagnostics were:

- Grade 3: 43.8% mean exact-item overlap; 49.6% stimulus overlap.
- Grade 4: 34.9% exact-item; 35.3% stimulus.
- Grade 5: 38.6% exact-item; 40.2% stimulus.
- Grade 6: 45.1% exact-item; 55.8% stimulus.
- Grade 7: 44.3% exact-item; 55.6% stimulus.
- Grade 8: 39.4% exact-item; 40.1% stimulus.

Those values were measured before both the 42-item expansion and the current supported-scope correction. They are useful only as history. The current `scripts/ela-form-feasibility.mjs` must now prove the revised Grade 3-8 shapes pass <=40% exact-item and <=50% stimulus overlap.

### Math

Primary range verification is complete. The full-form harness now uses the actual combined reporting categories from the April 2026 PDF. Old overlap values under split G4/G5/G7/G8 category interpretations are no longer current evidence. Fresh 5,000-form / 5,000-pair diagnostics are required.

The current 2025-2026 administration calculator policy remains: Grades 3-5 Math no calculator; Grades 6-8 Math calculator access in all three sessions. Item-spec Calculator Designation remains fidelity metadata, not a switch that revokes session permission.

### Science

The primary Science strand ranges are now directly verified:

- Grade 5: PS 17-26, LS 15-22, ESS 15-22; total 60.
- Grade 8: PS/LS/ESS each 15-23; total 60.

Current DESE administration material confirms both Science sessions contain CR, MC, and TE items. The branch contains manual CR practice in both sessions and all three strands, but the governing materials inspected so far do **not** provide a separate fixed CR point quota. Full-form Science executability therefore remains blocked until authoritative operational CR allocation/treatment is established rather than guessed.

### Science semantic standard alignment

Regex/exact-code validation is not enough to prove semantic alignment. A targeted review already found some Grade 5 force/motion items plausibly tagged to `4.PS.2.A.1` even when their prompt tests change-in-force effects better aligned to another expectation. Continue the item-by-item semantic standard audit and strengthen regression coverage so valid-looking but semantically wrong expectation codes are caught.

### Independent review

No bank authored or repaired in this build may self-certify its clean-room audit. The release checklist still requires a genuinely independent clean-room review of each browser-effective bank, repair-and-restart on substantive findings, naive age-appropriate UX review, and exact prospective production-tree validation.

## Next build order

1. Let the full CI/validation suite run on the corrected primary-blueprint head and inspect every failure rather than weakening gates.
2. Repair any Math capacity/diversity fallout caused by the correct combined reporting categories.
3. Repair any ELA capacity/diversity fallout caused by restoring Grade 6/7 Writing and Grade 8 Language to supported scope; add content only where the corrected official shape demonstrates a real shortage.
4. Complete the Grade 5/8 Science semantic expectation-tag sweep, beginning with the known `4.PS.2.A.1` force/motion suspects, and add semantic regression checks.
5. Establish authoritative Science constructed-response allocation/treatment if DESE materials expose it; otherwise retain explicit partial/manual practice rather than inventing a full-form quota.
6. Run independent clean-room audits assessment by assessment; after any substantive repair, restart the complete bank review from scratch.
7. Run fresh younger-grade, middle-grade, and older-grade naive UX reviews.
8. Validate the exact prospective production tree before marking any assessment released or merging to `main`.
9. After merge, smoke-test the deployed GitHub Pages production site.

For every assessment: use the now-primary-verified official blueprint, independently verify item specifications/semantic tags, require release-scale randomized forms and retake gates, run answer-tell and full-bank clean-room review, repair-and-restart if needed, and finish with fresh naive UX and exact-tree validation.

## 2026-2027 revalidation gate

Before any Spring 2027 fidelity claim, re-check the complete 2026-2027 DESE Examiner's Manual, blueprints, item specs, practice forms, scoring guides, calculator rules, item types, timing guidance, and any DRC interaction changes as they are published. Reconcile changes before promotion.
