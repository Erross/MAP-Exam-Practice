# MAP V1 Build Plan

## Foundation
- [x] Bootstrap repository and protect `main` as production.
- [x] Establish exam-family-neutral registry/session architecture compatible with future AP/ACT aggregation.
- [x] Record current DESE source basis and source-version caveat.
- [x] Encode all 14 Grade-Level grade/subject assessments and official session/timing/calculator/point metadata.
- [x] Define zero-cost machine-scorable MAP interaction schema.
- [x] Define clean-room, naive-review, randomized-form, retake, and exact-tree release gates.
- [ ] Complete browser shell, persistence, scoring, and interaction renderers.
- [ ] Add CI/build/Pages workflow.

## Current cost-constrained scope

Build all machine-scorable practice possible. Defer:

- listening/audio playback content;
- ELA long-form writing prompts requiring human scoring;
- Science constructed responses requiring human scoring;
- written portions of Math performance events.

Do not replace deferred components with MCQ and call the result operationally complete.

## Content order
1. Grade 8 Math auto-scorable bank + machine-scorable PE parts.
2. Grade 8 Science auto-scorable MC/TE bank.
3. Grade 8 ELA reading/language auto-scorable bank (writing/listening explicit gaps).
4. Grade 5 Math/Science/ELA.
5. Grade 3 Math/ELA.
6. Grade 4 Math/ELA.
7. Grade 6 Math/ELA.
8. Grade 7 Math/ELA.

Each assessment remains draft/development until release-scale content, 5,000-form audit, 5,000-retake audit, fresh clean-room pass, and naive UX pass are complete.

## 2026-2027 revalidation gate

Before any Spring 2027 fidelity claim, re-check the complete 2026-2027 DESE Examiner's Manual, blueprints, item specs, practice forms, scoring guides, calculator rules, item types, and timing guidance as they are published. Reconcile changes before promotion.
