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

The clean-room reviewer must inspect the **browser-effective aggregate**, not the individual authoring layers, and must not see repository answer keys/rationales before recording independent judgments.

### Preferred structured worksheet

Generate a blind worksheet for one assessment from the exact candidate tree:

```bash
npm run audit:review-template -- --assessment=g5-science > g5-science-review.json
```

The worksheet contains the browser-effective item content plus empty reviewer fields for:

- independent answer (for auto-scored items);
- correctness;
- ambiguity;
- grade fit;
- standard/expectation alignment;
- manual-rubric quality for constructed responses; and
- notes.

It deliberately excludes `scoring` and `rationale`. The reviewer completes the entire worksheet **before** any keyed view is opened.

After the blind review is complete, reconcile it against the candidate bank:

```bash
npm run audit:reconcile -- g5-science-review.json
```

Reconciliation exits nonzero when:

- an auto-scored reviewer answer disagrees with the repository key;
- any required reviewer field is incomplete;
- the reviewer records any substantive finding;
- a manual-response rubric is flagged; or
- browser-effective item order/content identity has changed enough that the worksheet no longer matches the candidate tree.

This is a review-handoff mechanism, **not** an independent reviewer. Test fixtures that mechanically populate repository keys only prove the tooling works and never count as clean-room evidence.

### Raw manifest mode

For reviewers who prefer their own notes/answer capture system, the deterministic blind manifest remains available:

```bash
npm run audit:manifest > clean-room-blind.json
```

To review one assessment only:

```bash
npm run audit:manifest -- --assessment=g5-science > g5-science-blind.json
```

Only after independent answers are recorded, a keyed reconciliation view may be generated:

```bash
npm run audit:manifest -- --assessment=g5-science --answers > g5-science-keyed.json
```

Do not give a keyed manifest to the clean-room reviewer before their independent answers and judgments are recorded. The blind manifest/template retain browser-effective item order, stable IDs, standards, strands, DOK, item type, points, session eligibility, stimulus/set identifiers, and displayed content.

After **any substantive content repair**, restart the complete clean-room audit from scratch and regenerate the blind worksheet/manifest from the repaired exact candidate tree. A prior review cannot certify a materially changed bank.

After meaningful UX repair, use a fresh naive assessor.

## Promotion

Before promotion, create a new short-lived integration branch from latest `main`, bring in only reviewed heads, run `npm ci` where a lockfile exists and `npm run check`, validate the exact prospective production tree, then merge with an expected-head guard. If `main` moves, rebuild the candidate.

After merge, verify Pages deployment and smoke-test catalog -> preflight -> session -> submit -> results on the public artifact.
