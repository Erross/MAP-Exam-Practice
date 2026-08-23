# Development and Release Workflow

`main` is production. Except for the one-time empty-repository bootstrap, development occurs on focused branches.

```text
focused core / assessment / content branch
                    ↓
       independent clean-room gate
                    ↓
       fresh integration branch
                    ↓
      exact prospective-tree check
                    ↓
                   main
                    ↓
        GitHub Pages + smoke test
```

Suggested branches:

- `core/<change>` for shared engine/renderer/session work;
- `assessment/map-g<grade>-<subject>` for a new grade/subject assessment;
- `content/map-g<grade>-<subject>-<change>` for bank repair/expansion;
- `fix/<issue>` for focused defects;
- `docs/<change>` for documentation.

Assessments remain `draft` until their supported scope has complete release-scale content and all gates pass. A partial auto-scorable bank may be available as `development`, but must not be described as a complete MAP simulation when required audio/written components are deferred or require human scoring.

## Independent clean-room handoff

**Use the simple project procedure in `CLEAN_ROOM_REVIEW.md`. Do not invent external agent infrastructure just to satisfy this gate.** The normal AP/ACT-style process is a fresh answerless browser-effective worksheet, a deliberately blinded reviewer pass, freeze/seal, then keyed reconciliation.

The essential requirement is answer blindness during the independent judgment phase. A fresh human or separate agent is welcome when readily available, but is not required. The same capable reasoning model may perform the reviewer pass provided it deliberately treats prior authoring conclusions, remembered keys, tests, PR descriptions, and earlier audits as non-evidence and does not inspect scoring/rationales/rubrics while recording the new blind judgments.

The clean-room reviewer must inspect the **browser-effective aggregate**, not the individual authoring layers.

### Preferred sealed two-phase worksheet

Generate a blind worksheet for one assessment from the exact candidate tree:

```bash
npm run audit:review-template -- --assessment=g5-science > g5-science-review.json
```

The worksheet contains the browser-effective item content plus empty reviewer fields for:

- an independent answer for every item;
- correctness;
- ambiguity;
- grade fit;
- standard/expectation alignment; and
- notes.

For auto-scored items, `reviewerAnswer` is the response the reviewer independently believes is correct. For a constructed response, `reviewerAnswer` records the response elements or scoring criteria the reviewer independently expects a correct response to contain. The blind worksheet deliberately excludes `scoring`, `rationale`, and the official manual rubric.

Every assessment worksheet also contains a SHA-256 `browserEffectiveFingerprint` derived from the complete current browser-effective bank state, including scoring/rationale state. This means a prompt, option, scoring, rationale, metadata, or ordering repair invalidates the packet even when item IDs stay the same.

Before review starts, enter reviewer mode explicitly: ignore prior authoring conclusions and remembered keys; solve from the fresh answerless worksheet and current governing Missouri sources/answerless standard definitions only. Do not treat existing tests or prior audit claims as evidence.

After **all** blind answers and verdicts are complete, seal the blind phase:

```bash
npm run audit:seal -- g5-science-review.json > g5-science-sealed-review.json
```

Sealing:

- verifies the worksheet still matches the exact browser-effective fingerprint;
- verifies every independent response and blind verdict is complete;
- freezes the completed blind review behind its own SHA-256 fingerprint; and
- only then exposes the current constructed-response rubrics for a second, post-blind rubric-quality review.

The sealed file still does **not** expose auto-scored answer keys or rationales. The reviewer compares each exposed manual rubric with the response/scoring elements they already committed during the blind phase and sets `manualRubricVerdict` to `pass` or `finding`.

After the manual-rubric phase is complete, reconcile the sealed review against the candidate bank:

```bash
npm run audit:reconcile -- g5-science-sealed-review.json
```

Reconciliation exits nonzero when:

- an auto-scored reviewer answer disagrees with the repository key;
- any required reviewer field is incomplete;
- the reviewer records any correctness, ambiguity, grade-fit, or alignment finding;
- a manual-response rubric is flagged;
- the frozen blind review was modified after sealing; or
- the browser-effective assessment fingerprint changed for any reason.

This is a review-handoff mechanism, **not** proof merely because the scripts ran. Test fixtures that mechanically populate repository keys only prove the tooling works and never count as clean-room evidence. The evidence is the independently completed answer-blind judgments plus successful later reconciliation.

### Raw manifest mode

For reviewers who prefer their own notes/answer capture system, the deterministic blind manifest remains available:

```bash
npm run audit:manifest > clean-room-blind.json
```

To review one assessment only:

```bash
npm run audit:manifest -- --assessment=g5-science > g5-science-blind.json
```

A keyed manifest can be generated for post-review author reconciliation:

```bash
npm run audit:manifest -- --assessment=g5-science --answers > g5-science-keyed.json
```

Do not expose a keyed manifest before independent responses and judgments are recorded and frozen. The structured sealed workflow above is preferred because it mechanically enforces the exact-bank fingerprint and constructed-response rubric sequencing; raw-manifest review requires equivalent procedural evidence outside the tool.

After **any substantive content repair**, restart the complete clean-room audit from scratch and regenerate the blind worksheet/manifest from the repaired exact candidate tree. A prior review cannot certify a materially changed bank. The fingerprint is an additional guard, not permission to skip that rule.

After meaningful UX repair, use a fresh naive assessor.

## Promotion

Before promotion, create a new short-lived integration branch from latest `main`, bring in only reviewed heads, run `npm ci` where a lockfile exists and `npm run check`, validate the exact prospective production tree, then merge with an expected-head guard. If `main` moves, rebuild the candidate.

After merge, verify Pages deployment and smoke-test catalog -> preflight -> session -> submit -> results on the public artifact.
