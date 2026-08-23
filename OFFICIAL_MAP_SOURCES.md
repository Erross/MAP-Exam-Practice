# Official Missouri MAP Sources

Verified: **2026-08-23**

Current build basis: **2025-2026 Grade-Level operational guidance**, with mandatory revalidation against 2026-2027 materials before claiming Spring 2027 fidelity. DESE has already posted 2026-2027 calendar entries while the latest complete operational Grade-Level manual available during this verification is the 2025-2026 manual.

Primary sources:

1. Missouri DESE Grade-Level assessment hub: https://dese.mo.gov/quality-schools/assessment/grade-level
2. Guide to the Missouri Assessment Program: https://dese.mo.gov/quality-schools/assessment/guide-missouri-assessment-program
3. 2025-2026 Grade-Level Examiner's Manual: https://dese.mo.gov/sites/g/files/zuston521/files/media/pdf/2026/04/2025-2026%20MAP%20Grade-Level%20EM_v2_AOD.pdf
4. MAP Grade-Level Assessment Blueprints: https://dese.mo.gov/quality-schools/assessment/media/pdf/map-grade-level-assessment-blueprints
5. Missouri DESE English Language Arts curriculum/item-specification hub: https://dese.mo.gov/college-career-readiness/curriculum/english-language-arts
6. Missouri DESE Mathematics curriculum/item-specification hub: https://dese.mo.gov/college-career-readiness/curriculum/mathematics
7. Missouri DESE Science curriculum/item-specification hub: https://dese.mo.gov/college-career-readiness/curriculum/science
8. Grade-specific Performance Level Descriptors and current practice forms/scoring guides linked from the Grade-Level hub.
9. 2025-2026 Missouri Instructional Testlet Administration Guide, used only as corroborating evidence for current expectation-code usage, grade-level testlet mappings, and the distinction between automatically scored interactions and educator-scored Text Input/Constructed Response items; it is not a substitute for the summative blueprint/item specifications.

The current DESE blueprint resource resolves to the April 2026 file `MAP Grade-Level Assessment Blueprints_AOD.pdf`. On 2026-08-23 the actual 15-page primary PDF was obtained and directly inspected. All Math, ELA, and Science reporting-category point ranges in `BLUEPRINT_TRANSCRIPTION.md` and `js/blueprints.js` were reconciled to that file. The primary-current category-range gate is therefore closed; this does **not** by itself make any assessment release-ready.

Direct inspection also corrected several earlier interpretations that had split combined Math reporting categories too finely: Grade 4 and Grade 5 use a single GM + DS range, Grade 7 uses a single GM + DSP range, and Grade 8 uses combined NS + EEI and GM + DSP ranges. Grade 8 ELA's 4-point "Approaching the task as a reader" row is under Language, not a second writing-task bucket.

## Source precedence

When DESE pages from different administration years disagree, the project does not average or silently choose values. For operational session behavior in this build, the current complete **2025-2026 Examiner's Manual** takes precedence over older general-guide timing tables. The current blueprint and grade/subject item specifications control content distribution and assessment boundaries; practice forms control interaction/style only when they do not conflict with the governing operational documents.

Science Grade-Level materials may assess expectations introduced in earlier elementary grades. Therefore an item delivered in a Grade 5 Science practice bank is not required to carry a `5.*` expectation code; its standard tag must identify the actual Missouri expectation being assessed.

For Mathematics, DESE item specifications include calculator designations that are useful authoring metadata for an expectation. They do **not** override the current administration-level policy encoded by this project. The 2025-2026 Grade-Level Examiner's Manual/timing guidance shows calculators unavailable in Grades 3-5 Mathematics and **allowed in all three Mathematics sessions in Grades 6-8**. Accordingly, the application exposes calculator availability throughout Grades 6-8 Math sessions. Item-level `calculatorLevel` may still be used to describe the most appropriate local practice keypad or whether a particular synthetic item actually benefits from calculator use; it is not used to turn the operational calculator permission on and off item-by-item.

## ELA writing interpretation

The current Test Coordinator's Manual states that Grades 4 and 8 have four ELA sessions and that their first session includes a passage-based writing prompt. Grades 3, 5, 6, and 7 have three sessions, with the final session serving the Listening strand. The primary blueprint still contains Writing reporting-category points in Grades 6 and 7, but those points are not treated as a deferred human-scored passage-writing prompt merely because the reporting category is named Writing. The development supported-scope harness therefore includes Grade 6/7 auto-scored Writing-category content and excludes the actual Grade 4/8 passage-writing prompt component.

## Constructed-response evidence and current limitation

The current Science blueprint confirms only strand ranges: Grade 5 PS 17-26, LS 15-22, ESS 15-22; Grade 8 PS/LS/ESS 15-23 each. The current administration manual separately confirms that **both Science sessions contain constructed-response, multiple-choice, and technology-enhanced items**.

This evidence is sufficient to justify the application's **manual-response capture boundary**: a constructed response may be entered and persisted, but it must declare manual scoring, include a rubric, contain no automatic answer key, and contribute no points to the automatic percentage until a human score exists.

It is **not** sufficient evidence for a fixed summative Grade 5 or Grade 8 Science constructed-response point allocation. The blueprint has no separate CR point bucket. Therefore the project must not infer a Science auto-scored target such as 54/56 points from development-bank totals, and must not build or label a 60-point all-auto Science form as operationally faithful. Science full-form executability remains blocked until the summative item-type/CR allocation is independently established or an explicitly partial supported-scope form is defined from authoritative evidence.

## Current operational facts encoded by the project

- ELA and Mathematics: Grades 3-8; Science: Grades 5 and 8.
- ELA: 3 sessions in Grades 3, 5, 6, 7; 4 sessions in Grades 4 and 8.
- Grades 4 and 8 ELA Session 1 includes passage-based items plus a writing prompt.
- Final ELA session is the listening strand.
- Mathematics: 3 sessions; Sessions 1-2 selected-response/TE; Session 3 performance event.
- Science: 2 sessions; both contain multiple-choice, TE, and constructed-response items.
- DESE timing ranges are guidelines; Grade-Level assessments do not use a student countdown time limit.
- Students may not return to a session after it is completed/submitted.
- Mathematics calculators: not allowed in Grades 3-5 without an accommodation; allowed throughout Grades 6-8 Mathematics sessions under the current 2025-2026 administration guidance.
- Science calculators: four-function in Grade 5 and scientific in Grade 8 under the administration guidance encoded by the project.
- Current point targets: Math G3-5 48, Math G6-8 54; ELA G3-6 and G8 56, ELA G7 52; Science G5/G8 60.
- Current reporting-category ranges: directly primary-source verified on 2026-08-23 and recorded in `BLUEPRINT_TRANSCRIPTION.md`.

## Blueprint verification status

`js/blueprints.js` contains a record for all 14 Grade-Level assessments. `officialPointTargetVerified:true` and `officialRangesVerified:true` now indicate that the current DESE total and reporting-category ranges have been directly checked against the governing primary materials.

A critical distinction remains between **official-source verification** and **release executability**. Every assessment remains `verified:false` and `executable:false` because other blockers remain: deferred Listening, Grade 4/8 passage-writing human scoring, Science CR allocation/human scoring, exact bank/category alignment, current-head simulation evidence, clean-room audit, naive UX review, and exact-tree validation.

Blueprint records must remain non-releasable until:

- the schema distinguishes official full-test constraints from executable auto-scored/manual-review subset constraints;
- deferred official components are represented explicitly rather than silently replaced;
- complete Math PE bundles and written/manual-scored PE behavior are accounted for;
- Science's operational CR treatment is established without guessing;
- 5,000 blueprint-constrained full-form or authoritative supported-scope draws pass on the exact candidate tree; and
- independent clean-room and exact-tree release gates pass.

This prevents a generic random-draw bank from being promoted merely because its total item count and development-session overlap look plausible.

## Scope caveat

Listening/audio and **human scoring** of written responses are intentionally deferred in the current static/free implementation. The application can capture constructed-response text for manual review, but it does not automatically grade prose. The repository must retain those official components in metadata and limitations rather than treating extra auto-scored questions as substitutes. An assessment may provide highly faithful auto-scored practice while still being correctly labeled as **not a complete operational MAP simulation**.
