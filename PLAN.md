# MAP V1 Build Plan

## Foundation
- [x] Bootstrap repository and protect `main` as production.
- [x] Establish exam-family-neutral registry/session architecture compatible with future AP/ACT aggregation.
- [x] Record current DESE source basis and source-version caveat.
- [x] Encode all 14 Grade-Level grade/subject assessments and official session/timing/point metadata.
- [x] Model calculator policy as none / available / item-designated; Grades 6-8 Math release requires expectation-level verified designation.
- [x] Define zero-cost machine-scorable MAP interaction schema.
- [x] Define clean-room, naive-review, randomized-form, retake, and exact-tree release gates.
- [x] Complete browser shell, local persistence, session locking, raw practice scoring, answer review, and machine-scorable interaction renderers.
- [x] Add persistent answer-option randomization so semantic keys survive display shuffling and resume.
- [x] Add local four-function/scientific practice calculator behavior where the verified MAP calculator policy permits it.
- [x] Add CI, production build, randomized audit, and GitHub Pages workflow.
- [x] Keep draft banks non-launchable in normal production; `?dev=1` explicitly enables development testing.
- [x] Add blueprint-aware full-form assembly primitives and block release until the current DESE blueprint is independently verified.
- [x] Require 5,000 verified-blueprint full-form draws and <=40% mean full-form exact-item retake overlap for any released assessment.
- [x] Measure answer-position tells on browser-effective persisted shuffles, while retaining source order only as an authoring diagnostic.
- [x] Add stimulus/set-family overlap diagnostics for ELA and Science.
- [x] Add exact Missouri Science expectation-code validation for Grades 5 and 8.

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

Since that run, Grade 3, 6, and 7 ELA received **42 additional original reading items across 14 new literary/informational stimulus families** specifically to reduce exact-item and stimulus-family retake reuse. The catalog regression floor has been raised to 1,736. The new head still requires the normal CI confirmation before these additions are treated as validated evidence.

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

The Grade 3/6/7 expansion targets those specific misses. Do not claim those grades pass until the expanded head is re-simulated.

### Math

Development supported-scope diagnostics are already below the project target at all six grades under the transcribed ranges. This is not release verification because the current-primary blueprint ranges still require independent confirmation.

### Science

Exact Missouri expectation-code validation currently passes all Grade 5 and Grade 8 Science items, and both banks exceed 90 development points with at least 30 points in each PS/LS/ESS strand. Full-form release execution remains blocked until the authoritative constructed-response share and treatment are established; deferred CR must not be silently replaced with MCQ.

### Primary-source verification

- The live DESE Grade-Level page points to the current April 2026 blueprint file and confirms the 14 total point counts.
- The 2025-2026 DESE Test Coordinator's Manual independently confirms the current session structure: ELA has 3 sessions in Grades 3,5,6,7 and 4 sessions in Grades 4,8; Math has 3 sessions with the performance event in Session 3; Science has 2 sessions containing CR, MC, and TE items.
- DESE's current Assessment page confirms that Math `Calculator Designation` is expectation-specific in the item specifications.
- The exact reporting-category ranges and exact Grades 6-8 expectation calculator designations remain release-blocked until the governing PDFs can be independently inspected rather than inferred from a wrapper/transcription.
- `js/blueprints.js` must therefore remain `verified:false` / `officialRangesVerified:false`, and assessment execution must remain closed.

### Independent review

No bank authored or repaired in this build may self-certify its clean-room audit. The release checklist still requires a genuinely independent clean-room review of each browser-effective bank, repair-and-restart on substantive findings, naive age-appropriate UX review, and exact prospective production-tree validation.

## Next build order

1. Re-run and inspect CI on the 1,736-item head; measure the new Grade 3/6/7 ELA exact-item and stimulus overlap.
2. If all ELA supported-scope forms meet the development overlap gates, make those thresholds regression-failing in CI; otherwise add only the passage/category capacity still responsible for the miss.
3. Independently verify the current April 2026 DESE reporting-category point ranges from the governing blueprint PDF and then reconcile `js/blueprints.js`.
4. Independently verify Grades 6-8 Math expectation-level calculator designations from the current DESE Math item specifications.
5. Establish the authoritative Science constructed-response share/treatment before enabling any Science full-form release claim.
6. Run independent clean-room audits assessment by assessment; after any substantive repair, restart the complete bank review from scratch.
7. Run fresh younger-grade, middle-grade, and older-grade naive UX reviews.
8. Validate the exact prospective production tree before marking any assessment released or merging to `main`.
9. After merge, smoke-test the deployed GitHub Pages production site.

For every assessment: independently verify the current blueprint/item specifications before release-scale promotion; then require release-scale randomized forms, retake-overlap gates, answer-tell gates, full-bank clean-room review, repair-and-restart if needed, and fresh naive UX review.

## 2026-2027 revalidation gate

Before any Spring 2027 fidelity claim, re-check the complete 2026-2027 DESE Examiner's Manual, blueprints, item specs, practice forms, scoring guides, calculator rules, item types, timing guidance, and any DRC interaction changes as they are published. Reconcile changes before promotion.
