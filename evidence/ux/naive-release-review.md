# Naive student-facing release review

Review date: 2026-08-23

Scope: final student-facing short-practice flow only. This review deliberately did not use answer keys, bank-quality conclusions, or authoring notes as evidence. It evaluated what a student sees and needs to understand from the released UI, configuration, renderer behavior, persistence behavior, and responsive/accessibility rules.

## Younger-grade pass — Grade 3

Assessor stance: a Grade 3 student arriving without prior explanation.

Reviewed path:

1. Home page and Grade 3 card selection.
2. Grade 3 ELA preflight and an available reading/language session.
3. Grade 3 Math preflight and an available Math session.
4. Question navigation, answer entry, flagging, Previous/Next, Save & exit, resume, submission confirmation, and results.
5. Narrow-screen/responsive behavior and keyboard-focus behavior from the shipping CSS/contracts.

Findings after repair: **pass — no substantive finding**.

Evidence/observations:

- The home page says this is unofficial Missouri practice and explicitly says MAP is untimed.
- Released cards say `Practice ready`; development-only status wording is not shown in ordinary use.
- Preflight separates the **official point target** from the **up-to-12-item practice-set size** and states that the short set is not a full operational MAP session.
- Missing/deferred content is disclosed before the student chooses a session. A missing component is not silently replaced with extra multiple-choice questions.
- Grade 3 Math clearly says the calculator is not allowed/not applicable; no calculator control is shown during the session.
- Session timing is labeled as a typical guideline, not a countdown or stopping rule.
- Response controls persist answers locally; multi-digit and multi-field controls do not require a full-view rerender after each keystroke/change.
- The navigator exposes current, answered, and flagged state; keyboard focus is visibly styled.
- `Save & exit` accurately preserves an in-progress session, and starting a new session warns before replacing saved work.
- Submission explicitly states that the session locks after submission and reports unanswered/flagged counts before the student confirms.
- Results are labeled `Unofficial practice result` and explicitly say they are not a MAP scale score or proficiency classification.

## Older-grade pass — Grade 8

Assessor stance: a Grade 8 student arriving without prior explanation and expecting calculator use and more complex passages/stimuli.

Reviewed path:

1. Home page and Grade 8 ELA/Math/Science selection.
2. Grade 8 ELA preflight, including writing/listening limitations.
3. Grade 8 Math preflight and calculator-enabled session.
4. Grade 8 Science preflight, stimulus-set context, scientific calculator, and constructed-response handling.
5. Navigation, saved session behavior, submission, results, responsive two-column passage/stimulus layout, and keyboard/accessibility behavior.

Findings after repair: **pass — no substantive finding**.

Evidence/observations:

- Grade 8 ELA discloses that long-form writing and listening/audio are outside the automatically scored release scope before a session starts.
- Grade 8 Math says the calculator is available and exposes the calculator control in-session.
- Grade 8 Science exposes scientific-calculator availability and clearly identifies stimulus-set context when several questions share a stimulus.
- Constructed responses are labeled `manual scoring`; the result page separates manual-review points from auto-scored points and never awards prose points automatically.
- The preflight language now uses permanent `Practice scope` wording rather than implying the released product is an unfinished development build.
- Passage/stimulus layouts collapse to one column on narrower screens; the question navigator becomes a grid rather than consuming the left rail.
- Visible focus styling exists for buttons, links, inputs, selects, textareas, and summaries.
- Student-entered written responses are escaped before result-page display.
- No screen claims full operational-form equivalence or an official score.

## Release interpretation

This naive review approves the **certified short-practice product**, not a complete summative MAP simulator. `status:"released"` means students may use the assessment's reviewed short-practice sessions. It does **not** mean `fullSimulationAvailable:true`, and it does not change blueprint `executable:false` where deferred official components prevent complete operational-form execution.

No UX repair from this review changed any browser-effective assessment item content, so the final clean-room bank fingerprints remain valid.
