# MAP V1 Build Plan

## Foundation
- [x] Bootstrap repository and protect `main` as production.
- [x] Establish exam-family-neutral registry/session architecture compatible with future AP/ACT aggregation.
- [x] Record current DESE source basis and source-version caveat.
- [x] Encode all 14 Grade-Level grade/subject assessments and official session/timing/point metadata.
- [x] Model calculator policy as none / available / item-designated; Grades 6-8 Math release requires item-level verified designation.
- [x] Define zero-cost machine-scorable MAP interaction schema.
- [x] Define clean-room, naive-review, randomized-form, retake, and exact-tree release gates.
- [x] Complete browser shell, local persistence, session locking, raw practice scoring, answer review, and machine-scorable interaction renderers.
- [x] Add persistent answer-option randomization so semantic keys survive display shuffling and resume.
- [x] Add local four-function/scientific practice calculator behavior where the verified MAP calculator policy permits it.
- [x] Add CI, production build, randomized audit, and GitHub Pages workflow.
- [x] Keep draft banks non-launchable in normal production; `?dev=1` explicitly enables development testing.
- [x] Add blueprint-aware full-form assembly primitives and block release until a current DESE blueprint is independently transcribed and verified.
- [x] Require 5,000 verified-blueprint full-form draws and <=40% full-form retake overlap for any released assessment.
- [x] Measure answer-position tells on browser-effective persisted shuffles, while retaining source order only as an authoring diagnostic.

## Current cost-constrained scope

Build all machine-scorable practice possible. Defer:

- listening/audio playback content;
- ELA long-form writing prompts requiring human scoring;
- Science constructed responses requiring human scoring;
- written portions of Math performance events.

Do not replace deferred components with MCQ and call the result operationally complete.

## Development vertical slices completed

- [x] Grade 3 Math and ELA.
- [x] Grade 4 Math and ELA; Grade 4 ELA writing/listening remain explicit gaps.
- [x] Grade 5 Math, ELA, and Science; listening/Science CR/written PE components remain explicit gaps.
- [x] Grade 6 Math and ELA.
- [x] Grade 7 Math and ELA.
- [x] Grade 8 Math, ELA, and Science; writing/listening/Science CR/written PE components remain explicit gaps.

Current development total: **214 original development items across all 14 Grade-Level banks**. Every bank remains `draft` / `development-needs-clean-room`; this is broad architecture/content coverage, not release evidence.

Latest validated prospective PR tree at this stage passed:

- all 14 assessment configurations and 14 blueprint records;
- all 14 browser-effective development banks;
- 17 response/scoring fixture types;
- persisted answer-option randomization and session locking;
- blueprint assembly unit fixtures;
- **180,000 seeded development-session draws**;
- static `_site` production build.

## Current measured blockers

The audit intentionally reports release metrics even for draft banks.

- Most ordinary development sessions still have **~82-100% mean exact-item retake overlap** because the banks are only vertical slices, not release-scale pools.
- Machine-scorable Math performance-event pools are especially small and typically have 100% overlap.
- Browser-effective answer positions are approximately balanced after persisted shuffling; source-order imbalance is now an authoring diagnostic rather than the release key-position gate.
- Several prose-heavy banks still have excessive uniquely-longest-correct / correct-vs-distractor length tells and require content repair while scaling.
- Real `js/blueprints.js` records intentionally remain `verified: false` until the current DESE reporting-category point ranges and supported-scope treatment have been independently transcribed from the governing blueprint.
- Grades 6-8 Math items intentionally do not receive calculator permission until each expectation's current Calculator Designation is independently verified.

These are release blockers, not waivers.

## Next build order

1. Independently transcribe and double-check the current DESE blueprints into `js/blueprints.js`, including reporting-category point ranges and the treatment of deferred components.
2. Verify item-level calculator designations for Grades 6-8 Math from current item specifications.
3. Expand Grade 8 and Grade 5 banks to multiple supported-scope form-equivalents, repairing tell metrics during authoring rather than afterward.
4. Expand Grades 3, 4, 6, and 7 to the same release-scale diversity.
5. Add stimulus-family/set-level overlap auditing for ELA and Science, not only exact-item overlap.
6. Run independent clean-room audits assessment by assessment; after any substantive repair, restart the complete bank review from scratch.
7. Run fresh younger-grade and older-grade naive UX reviews.
8. Validate the exact prospective production tree before marking any assessment released or merging to `main`.

For every assessment: independently verify the full current blueprint/item specifications before release-scale promotion; then require release-scale randomized forms, <=40% retake overlap, answer-tell gates, full bank clean-room review, repair-and-restart if needed, and a fresh naive UX review.

## 2026-2027 revalidation gate

Before any Spring 2027 fidelity claim, re-check the complete 2026-2027 DESE Examiner's Manual, blueprints, item specs, practice forms, scoring guides, calculator rules, item types, timing guidance, and any DRC interaction changes as they are published. Reconcile changes before promotion.
