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

The clean-room reviewer should inspect the **browser-effective aggregate**, not the individual authoring layers. Generate the default blind manifest from the exact candidate tree:

```bash
npm run audit:manifest > clean-room-blind.json
```

To review one assessment only:

```bash
npm run audit:manifest -- --assessment=g5-science > g5-science-blind.json
```

The default manifest deliberately excludes `scoring`, `rationale`, and other answer-key fields. The reviewer independently answers/checks the items before seeing repository keys. Only after that independent pass, generate the keyed reconciliation view:

```bash
npm run audit:manifest -- --assessment=g5-science --answers > g5-science-keyed.json
```

Do not give the keyed manifest to the clean-room reviewer before their independent answers are recorded. The manifest is deterministic and retains browser-effective item order, stable IDs, standards, strands, DOK, item type, points, session eligibility, stimulus/set identifiers and displayed content.

After substantive content repair, restart the complete clean-room audit from scratch and regenerate the blind manifest from the repaired exact candidate tree. A prior review cannot certify a materially changed bank.

After meaningful UX repair, use a fresh naive assessor.

## Promotion

Before promotion, create a new short-lived integration branch from latest `main`, bring in only reviewed heads, run `npm ci` where a lockfile exists and `npm run check`, validate the exact prospective production tree, then merge with an expected-head guard. If `main` moves, rebuild the candidate.

After merge, verify Pages deployment and smoke-test catalog -> preflight -> session -> submit -> results on the public artifact.
