# MAP Content Authoring Standards

A bank is not release-ready because it contains enough questions or passes its own tests. The browser-effective content delivered to students is the release artifact.

## 1. Official specification first

Before authoring or materially revising a grade/subject bank, independently verify current Missouri DESE sources: Grade-Level blueprint, Examiner's Manual, Missouri Learning Standards, grade/subject item specifications, performance-level descriptors, current practice form/scoring guide, and relevant rubrics.

Record the verification date and administration basis in `OFFICIAL_MAP_SOURCES.md`. Stop if current authoritative sources materially conflict.

## 2. Originality

All questions, passages, scenarios, datasets, diagrams, and stimuli must be original/synthetic unless explicitly identified as lawfully reusable. Official MAP materials establish structure, interaction style, boundaries, and difficulty expectations; they are not a question bank to copy.

## 3. Grade appropriateness

Every item must be reviewed for:

- exact Missouri grade-level expectation and assessment boundary;
- cognitive complexity/DOK allowed by the item specification;
- age-appropriate language and scenario maturity;
- grade-appropriate numerical complexity and prerequisites;
- passage/text complexity for ELA;
- science background knowledge actually expected at the assessed level.

Readability statistics are diagnostic only and never substitute for content review.

## 4. Item integrity

Every browser-effective item must have a globally unique stable ID, grade, subject, standard/expectation identifier, strand/domain, DOK, item type, points, session eligibility, scoring definition, rationale, originality/provenance field, and variant-family identifier where useful.

Selected-response items require distinct plausible options and exactly one unambiguous semantic key unless the item explicitly requires multiple selections. Multi-select items must state the required number of selections where applicable.

Constructed-response items must use `scoring.mode: "manual"`, include an explicit rubric whose maximum equals the item point value, and must not contain an automatic answer key. Capturing a written response is not evidence that the response can be automatically scored.

## 5. Technology-enhanced items

The response requested in prose must agree with the stored scoring model and rendered control. For graph/number-line/placement items, coordinates, tolerances, units, labels, and acceptable-equivalence rules must be explicit and independently checked.

## 6. Stimulus fidelity

Passage, science-set, table, chart, and performance-event material is atomic when the questions depend on shared context. Rendered stimulus content, structured data, stems, answers, and rationales must agree exactly.

## 7. Deferred official components

Audio/listening and **human scoring** of written responses are deferred in the current zero-cost scope. The application may capture and persist a constructed response for later manual review, but those points must be excluded from automatic earned/possible totals until a human score exists. The user-facing result must clearly separate auto-scored points from manual-review points.

Deferred components must remain represented in assessment metadata and user-facing limitations. Do not replace a required writing, listening, constructed-response, or written performance-event component with extra multiple-choice questions and call the result structurally complete.

## 8. Statistical tell gates

For conventional four-option selected response on a mature release bank:

- uniquely longest correct option <= 25%;
- each raw key position normally 15-35%;
- no repeated conspicuous absolute-language distractor patterns;
- correct-answer and distractor length distributions should not reveal the key;
- duplicate/near-duplicate stems and variant siblings are prohibited within one attempt.

TE items require equivalent answer-pattern leakage checks appropriate to their response type.

## 9. Blueprint/form audit

A complete releasable auto-scorable assessment must be tested with at least 5,000 independently seeded production draws. Each draw verifies session count/order, point totals represented by the supported scope, strand/standard distributions, item-type rules, stimulus integrity, calculator policy, variant exclusion, and deferred-component accounting.

Run 5,000 independent retake pairs and require <=40% mean exact-item overlap **and <=40% mean point-weighted overlap** for release-scale Math banks. Measure stimulus/set overlap separately where relevant. The development Math simulator enforces both full-form overlap thresholds in CI, but those development results do not substitute for verified-current-blueprint release evidence.

## 10. Independent clean-room review

A reviewer/session that did not author the bank must independently reconstruct the governing specification from current DESE sources before trusting repository claims. The reviewer inspects the entire browser-effective bank, independently answers every item, recomputes quantitative answers, checks every distractor, checks standard/DOK/grade appropriateness, verifies structured stimuli, and exercises the rendered application.

Use **audit -> repair -> restart from scratch**. After substantive repair, the previous clean-room result no longer counts. Release target: zero substantive findings on a fresh final pass.

## 11. Naive student review

A fresh assessor receives only the goal of using the site for realistic unofficial Missouri MAP practice. They should understand grade/subject selection, sessions, untimed timing guidance, calculator rules, navigation, session submission/locking, results, and the explicit limitations caused by deferred audio/written components.

Use separate naive review for younger and older grade bands.
