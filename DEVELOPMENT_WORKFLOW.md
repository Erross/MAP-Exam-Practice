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

Assessments remain `draft` until their supported scope has complete release-scale content and all gates pass. A partial auto-scorable bank may be available as `development`, but must not be described as a complete MAP simulation when required audio/written components are deferred.

After substantive content repair, restart clean-room audit from scratch. After meaningful UX repair, use a fresh naive assessor.

Before promotion, create a new short-lived integration branch from latest `main`, bring in only reviewed heads, run `npm ci` where a lockfile exists and `npm run check`, validate the exact prospective production tree, then merge with an expected-head guard. If `main` moves, rebuild the candidate.

After merge, verify Pages deployment and smoke-test catalog -> preflight -> session -> submit -> results on the public artifact.
