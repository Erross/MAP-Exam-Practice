# Official Missouri MAP Sources

Verified: **2026-08-23**

Current V1 basis: **2025-2026 Grade-Level operational guidance**, with mandatory revalidation against 2026-2027 materials before claiming Spring 2027 fidelity. DESE has 2026-2027 calendar entries posted, but the latest complete Grade-Level operational manual available during this release verification is the 2025-2026 manual for Spring 2026.

## Primary sources

1. Missouri DESE Grade-Level assessment hub: https://dese.mo.gov/quality-schools/assessment/grade-level
2. Guide to the Missouri Assessment Program: https://dese.mo.gov/quality-schools/assessment/guide-missouri-assessment-program
3. 2025-2026 Grade-Level Examiner's Manual: https://dese.mo.gov/sites/g/files/zuston521/files/media/pdf/2026/04/2025-2026%20MAP%20Grade-Level%20EM_v2_AOD.pdf
4. 2025-2026 Grade-Level Test Coordinator's Manual, linked from the Grade-Level hub.
5. MAP Grade-Level Assessment Blueprints: https://dese.mo.gov/quality-schools/assessment/media/pdf/map-grade-level-assessment-blueprints
6. Missouri DESE English Language Arts curriculum/item-specification hub: https://dese.mo.gov/college-career-readiness/curriculum/english-language-arts
7. Missouri DESE Mathematics curriculum/item-specification hub: https://dese.mo.gov/college-career-readiness/curriculum/mathematics
8. Missouri DESE Science curriculum/item-specification hub: https://dese.mo.gov/college-career-readiness/curriculum/science
9. Grade-specific Performance Level Descriptors linked from the Grade-Level hub: ELA Grades 3-8, Math Grades 3-8, Science Grades 5 and 8.
10. Current practice forms and scoring guides linked from the Grade-Level hub for all 14 assessment configurations; Science includes separate scoring-rubric guides.
11. 2025-2026 Missouri Instructional Testlet Administration Guide, used only as corroborating evidence for expectation-code usage and educator-scored Text Input/Constructed Response behavior; it is not a substitute for the summative blueprint/item specifications.

## Final release recheck

The release source boundary was rechecked on 2026-08-23 after the final content audit. The live DESE Grade-Level hub still identifies ELA and Mathematics in Grades 3-8 and Science in Grades 5 and 8; lists the current 2025-2026 Examiner/Test Coordinator manuals; links the current grade-specific PLDs; and exposes the full practice-form/scoring-guide matrix for all assessment grades/subjects.

The current Examiner's Manual confirms:

- ELA has three sessions in Grades 3, 5, 6, and 7 and four in Grades 4 and 8;
- Grades 4 and 8 ELA Session 1 contains passage-based items including a writing prompt;
- Mathematics has three sessions, with Performance Events in Session 3;
- Science has two sessions and both contain constructed-response, multiple-choice, and technology-enhanced items;
- DESE timing values are guidelines/estimates and there is **no time limit for any Grade-Level assessment**;
- calculators are not allowed in Grades 3-5 Mathematics without an accommodation;
- the current administration policy encoded by this project allows calculator access throughout Grades 6-8 Mathematics sessions;
- Grade 5 and Grade 8 Science calculator access is represented as four-function and scientific respectively in the project;
- current technology-enhanced families include dropdown, matching, hot spots, graphing/bar graphing/line graphing, number lines, line plots, clock input, and angle drawing;
- practice-test open-ended responses are educator-scored rather than automatically awarded points.

The current DESE practice-form description states that the practice form mirrors the operational assessment for item types/test-system familiarity. The project uses that evidence for interaction/style fidelity only; it does not copy official question wording or use a practice form as proof of a hidden operational point allocation.

## Blueprint verification

The April 2026 `MAP Grade-Level Assessment Blueprints_AOD.pdf` was obtained and directly inspected page by page. All official total-point targets and reporting-category ranges in `BLUEPRINT_TRANSCRIPTION.md` and `js/blueprints.js` were reconciled to that primary PDF.

The inspection corrected earlier overly granular Math grouping assumptions:

- Grade 4 and Grade 5: combined GM + DS reporting-category range;
- Grade 7: combined GM + DSP range;
- Grade 8: combined NS + EEI and combined GM + DSP ranges.

Grade 8 ELA's 4-point "Approaching the task as a reader" row is Language, not a second writing-task bucket.

`officialPointTargetVerified:true` and `officialRangesVerified:true` mean the governing source totals/ranges are primary-source verified. They do **not** mean a complete operational form can be executed by this static application.

## Source precedence

When DESE pages from different administration years disagree, the project does not average values. For V1 operational session behavior, the latest complete **2025-2026 Examiner's Manual** takes precedence over older general-guide timing tables. The current blueprint and grade/subject item specifications control content distribution and assessment boundaries. Practice forms inform interaction/style only when consistent with those governing sources.

Science Grade-Level materials may assess expectations introduced in earlier elementary grades, so a Grade 5 Science item is not required to carry a `5.*` code; its standard tag must identify the actual Missouri expectation being assessed.

For Mathematics, expectation-level calculator designation is authoring metadata and does not override administration-level session permission. The application therefore does not turn Grades 6-8 Math calculator availability on/off item-by-item.

## ELA release interpretation

Grades 4 and 8 have passage-based writing prompts in official Session 1, and the final ELA session is Listening. Those components are represented in session metadata and disclosed to users but are not substituted with unrelated auto-scored items.

Grades 6 and 7 also have Writing-category blueprint work. That category is not treated as a deferred passage-writing prompt merely because it is named Writing; supported auto-scored revise/edit work remains in the V1 bank where aligned to current Missouri expectations.

## Science constructed-response boundary

The current Science blueprint provides strand ranges and a 60-point total. The administration manual establishes constructed-response presence in both sessions. Public current materials do **not** state a separate fixed summative Science CR point quota.

Accordingly, V1 may capture and persist a constructed response only when the item declares manual scoring, has a point-matched rubric, has no automatic answer key, and excludes those points from the automatic earned/possible percentage.

The project does **not** infer an operational Grade 5/8 auto/manual split from development-bank totals or practice-form CR counts. Science full-form executability stays blocked unless a governing source establishes that allocation.

## Release status versus full-form executability

The final V1 bank has completed clean-room certification and the student-facing short-practice assessments are production-visible with `status:"released"` and `practiceMode:"certified-short-practice"`.

That release state is intentionally separate from the blueprint engine's full-form state. `fullSimulationAvailable:false`, `verified:false`, and `executable:false` remain appropriate where audio, human-scored writing/PE components, or an authoritative Science CR allocation prevent a complete operational MAP form from being represented.

V1 therefore claims **production-ready original MAP short practice**, not complete secure operational-form equivalence. Any future claim about Spring 2027 fidelity requires fresh source verification against 2026-2027 DESE materials.
