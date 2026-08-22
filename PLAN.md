# MAP V1 Build Plan

## Foundation
- [x] Bootstrap repository and protect `main` as production.
- [x] Establish exam-family-neutral registry/session architecture compatible with future AP/ACT aggregation.
- [x] Record current DESE source basis and source-version caveat.
- [x] Encode all 14 Grade-Level grade/subject assessments and official session/timing/calculator/point metadata.
- [x] Define zero-cost machine-scorable MAP interaction schema.
- [x] Define clean-room, naive-review, randomized-form, retake, and exact-tree release gates.
- [x] Complete browser shell, local persistence, session locking, raw practice scoring, answer review, and machine-scorable interaction renderers.
- [x] Add persistent answer-option randomization so semantic keys survive display shuffling and resume.
- [x] Add local four-function/scientific practice calculator behavior where the MAP calculator policy permits it.
- [x] Add CI, production build, randomized audit, and GitHub Pages workflow.
- [x] Keep draft banks non-launchable in normal production; `?dev=1` explicitly enables development testing.

## Current cost-constrained scope

Build all machine-scorable practice possible. Defer:

- listening/audio playback content;
- ELA long-form writing prompts requiring human scoring;
- Science constructed responses requiring human scoring;
- written portions of Math performance events.

Do not replace deferred components with MCQ and call the result operationally complete.

## Development vertical slices completed

- [x] Grade 8 Math — initial auto-scorable development items including machine-scorable PE-style parts.
- [x] Grade 8 Science — initial MC/TE development items.
- [x] Grade 8 ELA — initial reading/language development items; writing/listening remain explicit gaps.
- [x] Grade 5 Math — initial auto-scorable development items including machine-scorable PE-style parts.
- [x] Grade 5 Science — initial MC/TE development items; CR remains an explicit gap.
- [x] Grade 5 ELA — initial reading/language development items; listening remains an explicit gap.

Current vertical-slice total: **78 original development items across 6 banks**. These are not release-scale banks and remain marked `development-needs-clean-room`.

## Current measured blockers

The audit intentionally reports release metrics even for draft banks. Current small banks have 100% mean retake overlap because each development session exposes essentially the whole available pool. Raw authored key-position/answer-length tells also remain immature in several prose banks even though delivered option order is randomized and persisted. These are known blockers, not waivers.

## Remaining content order

1. Expand Grade 8 and Grade 5 to release-scale auto-scorable banks with blueprint-constrained form assembly.
2. Grade 3 Math/ELA.
3. Grade 4 Math/ELA.
4. Grade 6 Math/ELA.
5. Grade 7 Math/ELA.

For every assessment: independently verify the full current blueprint/item specifications before release-scale authoring; then require release-scale randomized forms, <=40% retake overlap, answer-tell gates, full bank clean-room review, repair-and-restart if needed, and a fresh naive UX review.

## 2026-2027 revalidation gate

Before any Spring 2027 fidelity claim, re-check the complete 2026-2027 DESE Examiner's Manual, blueprints, item specs, practice forms, scoring guides, calculator rules, item types, timing guidance, and any DRC interaction changes as they are published. Reconcile changes before promotion.
