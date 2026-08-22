# MAP Grade-Level Release Checklist

## Official specification
- [ ] Current DESE blueprint independently checked.
- [ ] Current Examiner's Manual independently checked.
- [ ] Missouri Learning Standards and item specifications independently checked.
- [ ] Performance Level Descriptors checked.
- [ ] Current practice form/scoring guide inspected for structure and interaction style only.
- [ ] Verification date and administration basis recorded.
- [ ] Session count/order, point target, timing guidance, calculator policy, and item types verified.
- [ ] Deferred listening/writing/CR components accurately recorded.

## Effective bank
- [ ] Browser-effective aggregate audited, not only source files.
- [ ] IDs globally unique.
- [ ] Every item has standard/strand/DOK/item-type/points/session/scoring/rationale/provenance metadata.
- [ ] All practice content original/synthetic or explicitly reusable.
- [ ] No official MAP item wording copied into the bank.
- [ ] Stimulus/set metadata internally consistent.

## Content correctness and grade fit
- [ ] Every answer independently reviewed.
- [ ] Every distractor actually wrong and plausible.
- [ ] Every quantitative answer independently recomputed.
- [ ] Standard/expectation tag checked against current item specs.
- [ ] DOK within assessment boundary.
- [ ] Vocabulary, scenario, prerequisite knowledge, text complexity, and numeric complexity appropriate to grade.

## Production-form evidence
- [ ] 5,000 seeded production draws pass all supported-scope constraints.
- [ ] Session order and calculator rules always valid.
- [ ] Stimulus families stay intact where required.
- [ ] Variant siblings never collide.
- [ ] Deferred official components are never silently replaced.

## Retake diversity
- [ ] 5,000 independent attempt pairs measured.
- [ ] Mean exact-item overlap <=40% for release-scale banks.
- [ ] Stimulus/set overlap separately reported where relevant.

## Browser/session/UX
- [ ] Grade and subject easy to select.
- [ ] Preflight states real MAP session count and that sessions are untimed.
- [ ] Timing ranges labeled guidance, not limits.
- [ ] Calculator policy correct for grade/subject/session.
- [ ] Supported TE interactions keyboard-accessible where practicable.
- [ ] Answers persist through navigation/refresh.
- [ ] Submitted session locks against re-entry.
- [ ] Results label themselves unofficial practice performance.
- [ ] Audio/written omissions are clear before starting.

## Independent review
- [ ] Clean-room reviewer did not author the bank.
- [ ] Reviewer independently reconstructed official requirements.
- [ ] Entire effective bank reviewed for correctness, ambiguity, grade fit, metadata, duplicates, and rendering.
- [ ] After any substantive repair, audit restarted from scratch.
- [ ] Fresh final clean-room pass has zero substantive findings.

## Naive assessment
- [ ] Fresh younger-grade assessor flow reviewed.
- [ ] Fresh older-grade assessor flow reviewed.
- [ ] No coaching required to understand sessions, timing, calculator use, submit/locking, results, or limitations.

## Promotion
- [ ] `npm run check` green on exact candidate SHA.
- [ ] Production artifact contains the same effective bank audited in source.
- [ ] Fresh integration branch created from current `main`.
- [ ] Exact prospective production tree validated.
- [ ] PR head/base unchanged at merge.
- [ ] GitHub Pages deploys from merged `main` and public site is smoke-tested.
