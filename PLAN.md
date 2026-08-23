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
- [x] Add blueprint-aware full-form assembly primitives and block release until the current DESE blueprint is independently verified.
- [x] Require 5,000 verified-blueprint full-form draws and <=40% mean full-form exact-item retake overlap for any released assessment.
- [x] Measure answer-position tells on browser-effective persisted shuffles, while retaining source order only as an authoring diagnostic.
- [x] Add stimulus/set-family overlap diagnostics for ELA and Science.
- [x] Add exact Missouri Science expectation-code validation for Grades 5 and 8.
- [x] Make ELA supported-scope development diversity regression-failing at <=40% mean exact-item overlap and <=50% mean stimulus-family overlap across 5,000 retake pairs.
- [x] Add a dedicated current-DESE session contract test covering ELA session counts/listening omissions, Math PE placement/calculator policy, and Science two-session CR disclosure.

## Current cost-constrained scope

Build all machine-scorable practice possible. Defer for now:

- listening/audio playback content;
- ELA long-form writing prompts requiring human scoring;
- Science constructed responses requiring human scoring;
- written portions of Math performance events.

Do not replace deferred components with MCQ and call the result operationally complete.

## Development coverage completed

- [x] Grade 3 Math and ELA.
- [x] Grade 4 Math and ELA; Grade 4 ELA writing/listening remain explicit gaps.
- [x] Grade 5 Math, ELA, and Science; listening/Science CR/written PE components remain explicit gaps.
- [x] Grade 6 Math and ELA.
- [x] Grade 7 Math and ELA.
- [x] Grade 8 Math, ELA, and Science; writing/listening/Science CR/written PE components remain explicit gaps.

Current development floor: **1,736 original development items across all 14 Grade-Level banks**. Every bank remains `draft` / `development-needs-clean-room`; this is development evidence, not release approval.

The latest fully completed CI run before the current ELA diversity expansion validated:

- all 14 assessment configurations and browser-effective banks;
- 1,694 development items at that prior head;
- 17 response/scoring fixture types plus manual constructed-response capture excluded from automatic scoring;
- exact Science expectation codes for all 82 Grade 5 and 83 Grade 8 Science items;
- Math supported-form construction and 5,000 development form/retake pairs per grade, all six grades below 40% mean overall exact-item and point overlap under the currently transcribed ranges;
- ELA supported-form construction for all six grades;
- persisted answer-option randomization, delivery-group integrity, session locking, randomized practice-session checks, and static `_site` production build.

Since that run, Grade 3, 6, and 7 ELA received **42 additional original reading items across 14 new literary/informational stimulus families** specifically to reduce exact-item and stimulus-family retake reuse. The catalog regression floor is now 1,736, the ELA diversity diagnostic is now a hard development gate, and the current DESE session contract has its own regression test. The new head still requires execution of the normal validation suite before these additions are treated as validated evidence.

## Current measured blockers

Release gates remain intentionally closed.

### ELA scale

Before the latest expansion, development supported-scope full-form diagnostics showed:

- Grade 3: 43.8% mean exact-item overlap; 49.6% stimulus overlap.
- Grade 4: 34.9% exact-item; 35.3% stimulus.
- Grade 5: 38.6% exact-item; 40.2% stimulus.
- Grade 6: 45.1% exact-item; 55.8% stimulus.
- Grade 7: 44.3% exact-item; 55.6% stimulus.
- Grade 8: 39.4% exact-item; 40.1% stimulus.

The Grade 3/6/7 expansion targets those specific misses. `scripts/ela-form-feasibility.mjs` now fails validation if any grade exceeds 40% mean exact-item overlap or 50% mean stimulus overlap. Do not claim the expanded grades pass until the 1,736-item head is actually re-simulated.

### Math

Development supported-scope diagnostics are already below the project target at all six grades under the transcribed ranges. This is not release verification because the current-primary blueprint ranges still require independent confirmation.

The current 2025-2026 administration policy is now treated separately from expectation-level item-spec metadata: Grades 3-5 Math do not permit calculators; Grades 6-8 Math permit calculators in all three sessions. Item-spec Calculator Designation can be checked and recorded for fidelity, but it is not an unresolved permission gate for the current session behavior.

### Science

Exact Missouri expectation-code validation currently passes all Grade 5 and Grade 8 Science items, and both banks exceed 90 development points with at least 30 points in each PS/LS/ESS strand. Current DESE administration material confirms both Science sessions contain constructed-response work. Full-form release execution remains blocked until the authoritative constructed-response share/treatment is established; deferred CR must not be silently replaced with MCQ.

### Primary-source verification

- The live DESE Grade-Level page points to the current April 2026 governing blueprint and confirms the 14 total point counts.
- The current DESE PDF.js wrapper exposes the underlying April 2026 blueprint filename/path, but the review environment still has not obtained an independently inspectable render of the primary PDF. The transcribed category ranges therefore remain corroborating evidence only.
- The 2025-2026 DESE Test Coordinator's Manual independently confirms the current session structure: ELA has 3 sessions in Grades 3,5,6,7 and 4 sessions in Grades 4,8; Math has 3 sessions with the performance event in Session 3; Science has 2 sessions containing CR, MC, and TE items.
- Current DESE administration guidance confirms calculator access is unavailable in Grades 3-5 Math and available throughout all three Grades 6-8 Math sessions; Grade 5 Science permits four-function and Grade 8 Science permits scientific calculator use.
- DESE Math item specifications also contain expectation-level `Calculator Designation`; where that metadata is used by this bank it should be independently checked for fidelity, but it does not override the current administration-level session access above.
- The exact reporting-category ranges remain release-blocked until the governing April 2026 PDF can be independently inspected rather than inferred from the wrapper/transcription.
- `js/blueprints.js` must therefore remain `verified:false` / `officialRangesVerified:false`, and assessment execution must remain closed.

### Independent review

No bank authored or repaired in this build may self-certify its clean-room audit. The release checklist still requires a genuinely independent clean-room review of each browser-effective bank, repair-and-restart on substantive findings, naive age-appropriate UX review, and exact prospective production-tree validation.

## Next build order

1. Execute and inspect the full validation suite on the 1,736-item head; capture the new Grade 3/6/7 ELA exact-item and stimulus-overlap metrics from the now-regression-failing diagnostic.
2. If the ELA diversity gate fails, add only the passage/category capacity responsible for the remaining miss and re-run; if it passes, freeze those metrics as current development evidence.
3. Independently inspect the current April 2026 DESE blueprint PDF and confirm every reporting-category point range before reconciling `js/blueprints.js` or changing `officialRangesVerified`.
4. Establish the authoritative Science constructed-response share/treatment before enabling any Science full-form release claim; use current practice/scoring material for interaction and rubric fidelity, not as a substitute for an operational blueprint.
5. Run independent clean-room audits assessment by assessment; after any substantive repair, restart the complete bank review from scratch.
6. Run fresh younger-grade, middle-grade, and older-grade naive UX reviews.
7. Validate the exact prospective production tree before marking any assessment released or merging to `main`.
8. After merge, smoke-test the deployed GitHub Pages production site.

For every assessment: independently verify the current blueprint/item specifications before release-scale promotion; then require release-scale randomized forms, retake-overlap gates, answer-tell gates, full-bank clean-room review, repair-and-restart if needed, and fresh naive UX review.

## 2026-2027 revalidation gate

Before any Spring 2027 fidelity claim, re-check the complete 2026-2027 DESE Examiner's Manual, blueprints, item specs, practice forms, scoring guides, calculator rules, item types, timing guidance, and any DRC interaction changes as they are published. Reconcile changes before promotion.
