# Official Missouri MAP Sources

Verified: **2026-08-22**

Current build basis: **2025-2026 Grade-Level operational guidance**, with mandatory revalidation against 2026-2027 materials before claiming Spring 2027 fidelity. DESE has already posted 2026-2027 calendar entries while the latest complete operational Grade-Level manual available during this verification is the 2025-2026 manual.

Primary sources:

1. Missouri DESE Grade-Level assessment hub: https://dese.mo.gov/quality-schools/assessment/grade-level
2. Guide to the Missouri Assessment Program: https://dese.mo.gov/quality-schools/assessment/guide-missouri-assessment-program
3. 2025-2026 Grade-Level Examiner's Manual: https://dese.mo.gov/sites/g/files/zuston521/files/media/pdf/2026/04/2025-2026%20MAP%20Grade-Level%20EM_v2_AOD.pdf
4. MAP Grade-Level Assessment Blueprints (linked from the Grade-Level hub).
5. Missouri DESE English Language Arts curriculum/item-specification hub: https://dese.mo.gov/college-career-readiness/curriculum/english-language-arts
6. Missouri DESE Mathematics curriculum/item-specification hub: https://dese.mo.gov/college-career-readiness/curriculum/mathematics
7. Missouri DESE Science curriculum/item-specification hub: https://dese.mo.gov/college-career-readiness/curriculum/science
8. Grade-specific Performance Level Descriptors and current practice forms/scoring guides linked from the Grade-Level hub.
9. 2025-2026 Missouri Instructional Testlet Administration Guide, used only as corroborating evidence for current expectation-code usage and grade-level testlet mappings, not as a substitute for the summative blueprint/item specifications.

## Source precedence

When DESE pages from different administration years disagree, the project does not average or silently choose values. For operational session behavior in this build, the current complete **2025-2026 Examiner's Manual** takes precedence over older general-guide timing tables. The current blueprint and grade/subject item specifications control content distribution and assessment boundaries; practice forms control interaction/style only when they do not conflict with the governing operational documents.

Science Grade-Level materials may assess expectations introduced in earlier elementary grades. Therefore an item delivered in a Grade 5 Science practice bank is not required to carry a `5.*` expectation code; its standard tag must identify the actual Missouri expectation being assessed.

For Mathematics, DESE's current assessment-resource description states that the item specifications include a **Calculator Designation** indicating whether a calculator is available for questions written to a particular expectation. The application therefore models Grades 6-8 Math as `item-designated`, not as a blanket calculator-on condition. A released Grades 6-8 Math item must carry an independently verified `calculatorLevel` (`none`, `four-function`, or `scientific`). Grade 3-5 Math remains calculator-prohibited absent an accommodation. Science calculator availability is modeled at the assessment/session level from the governing administration guidance.

## Current operational facts encoded by the project

- ELA and Mathematics: Grades 3-8; Science: Grades 5 and 8.
- ELA: 3 sessions in Grades 3, 5, 6, 7; 4 sessions in Grades 4 and 8.
- Grades 4 and 8 ELA Session 1 includes passage-based items plus a writing prompt.
- Final ELA session is the listening strand.
- Mathematics: 3 sessions; Sessions 1-2 selected-response/TE; Session 3 performance event.
- Science: 2 sessions; operational assessment includes multiple-choice, TE, and constructed-response items.
- DESE timing ranges are guidelines; Grade-Level assessments do not use a student countdown time limit.
- Students may not return to a session after it is completed/submitted.
- Mathematics calculators: not allowed in Grades 3-5 without an accommodation; Grades 6-8 availability must follow the expectation/item calculator designation rather than a blanket grade-level switch.
- Science calculators: allowed in Grades 5 and 8 under the administration guidance encoded by the project.
- Current point targets: Math G3-5 48, Math G6-8 54; ELA G3-6 and G8 56, ELA G7 52; Science G5/G8 60.

## Blueprint transcription status

`js/blueprints.js` contains a record for all 14 Grade-Level assessments and the official total-point target for each. Those records intentionally remain `verified: false` until the current DESE blueprint category/item/point ranges have been independently transcribed and checked. The release audit refuses to release an assessment without a verified blueprint and then requires 5,000 blueprint-constrained full-form draws. This prevents a generic random-draw bank from being promoted merely because its total item count looks plausible.

## Scope caveat

Listening/audio and human-scored written responses are intentionally deferred. This repository must retain those official components in metadata and limitations rather than treating extra auto-scored questions as substitutes.
