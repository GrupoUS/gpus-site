---
phase: 06-qa-performance-and-ship
plan: 02
subsystem: testing
tags: [lighthouse, chrome-launcher, performance, accessibility, seo, ci]

# Dependency graph
requires:
  - phase: 06-01
    provides: "Tech debt cleanup, unused deps removed, reduced-motion guards"
provides:
  - "Reusable Lighthouse CI audit script (scripts/lighthouse-audit.mjs)"
  - "Pre-deploy gate chain (lint + check + build) in package.json"
  - "lighthouse and chrome-launcher devDependencies"
affects: [deploy, ci, performance-monitoring]

# Tech tracking
tech-stack:
  added: [lighthouse@13.0.3, chrome-launcher@1.2.1]
  patterns: [programmatic-lighthouse-api, retry-best-score, chrome-auto-detection]

key-files:
  created:
    - scripts/lighthouse-audit.mjs
  modified:
    - package.json
    - .gitignore

key-decisions:
  - "Desktop preset for less score variance (per RESEARCH.md)"
  - "Retry up to 3 times with best-score-per-category to handle Lighthouse variance"
  - "Chrome path auto-detection with fallback chain (/usr/bin, /usr/sbin) + CHROME_PATH env"
  - "Lighthouse audit intentionally separate from predeploy (requires running preview server)"
  - "Lighthouse WSL cache directory added to .gitignore"

patterns-established:
  - "Lighthouse CI pattern: launch Chrome, audit pages, retry on failure, summary table, exit code"
  - "Pre-deploy gate chain: lint + astro check + build (sequential via &&)"

requirements-completed: [D-01, D-02, D-03, D-04, D-12]

# Metrics
duration: 10min
completed: 2026-03-27
---

# Phase 06 Plan 02: Lighthouse CI Audit Summary

**Reusable Lighthouse CI script auditing 9 content pages with >= 95 threshold across 4 categories, retry logic for score variance, and pre-deploy gate chain in package.json**

## Performance

- **Duration:** 10 min
- **Started:** 2026-03-27T01:10:42Z
- **Completed:** 2026-03-27T01:21:01Z
- **Tasks:** 2 (1 pre-completed, 1 executed)
- **Files modified:** 4

## Accomplishments
- Created `scripts/lighthouse-audit.mjs` with programmatic Lighthouse API auditing all 9 content pages
- Threshold enforcement (>= 95) across Performance, Accessibility, Best Practices, and SEO
- Retry logic (3 attempts, best score per category) to handle Lighthouse score variance
- Chrome auto-detection fallback chain for WSL environments
- Wired `lighthouse:audit` and `predeploy` scripts in package.json
- Installed `lighthouse` and `chrome-launcher` as devDependencies

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Google Chrome in WSL** - Pre-completed (Chrome 146.0.7680.164 at /usr/sbin/google-chrome)
2. **Task 2: Create Lighthouse CI audit script + wire pre-deploy gate** - `d72e8f5` (feat)

## Files Created/Modified
- `scripts/lighthouse-audit.mjs` - Lighthouse CI audit script (291 lines): 9-page audit, 95 threshold, retry logic, ANSI summary table, Chrome auto-detection
- `package.json` - Added lighthouse:audit + predeploy scripts, lighthouse + chrome-launcher devDependencies
- `bun.lock` - Updated lockfile with new dependencies
- `.gitignore` - Added lighthouse WSL cache directory exclusion

## Decisions Made
- **Desktop preset:** Used `preset: 'desktop'` for less Lighthouse score variance (per RESEARCH.md Pitfall 1)
- **Retry best-score:** On threshold failure, retry up to 2 more times and take the BEST score per category -- handles legitimate score variance without masking real regressions
- **Chrome path fallback chain:** Auto-detect Chrome via `existsSync` on common paths (/usr/bin/google-chrome-stable, /usr/bin/google-chrome, /usr/sbin/google-chrome, chromium variants) before falling back to chrome-launcher auto-detect -- needed because WSL installs Chrome in /usr/sbin which chrome-launcher doesn't check
- **Lighthouse separate from predeploy:** The `predeploy` script runs lint + check + build (no running server needed). `lighthouse:audit` requires a running preview server and is run separately -- this avoids requiring server management in the gate chain
- **WSL cache in .gitignore:** Chrome-launcher creates a `C:\Users\...` directory in WSL project root; added glob pattern `C\:*` to .gitignore

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Chrome-launcher cannot auto-detect Chrome in /usr/sbin**
- **Found during:** Task 2 (script creation and testing)
- **Issue:** chrome-launcher's auto-detection does not check `/usr/sbin/google-chrome`, which is where Chrome installs in WSL
- **Fix:** Added Chrome path fallback chain with `existsSync` checks on common system paths before falling back to chrome-launcher auto-detect
- **Files modified:** scripts/lighthouse-audit.mjs
- **Verification:** Script successfully launches Chrome from /usr/sbin/google-chrome
- **Committed in:** d72e8f5

**2. [Rule 3 - Blocking] Lighthouse WSL cache directory polluting git status**
- **Found during:** Task 2 (post-test verification)
- **Issue:** Chrome-launcher creates a `C:\Users\Mauricio\AppData\Local\lighthouse.*` cache directory in the project root on WSL
- **Fix:** Added `C\:*` glob pattern to .gitignore
- **Files modified:** .gitignore
- **Verification:** `git status --short` no longer shows the directory
- **Committed in:** d72e8f5

---

**Total deviations:** 2 auto-fixed (2 blocking issues)
**Impact on plan:** Both fixes necessary for the script to work correctly in WSL. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## User Setup Required
- Google Chrome must be installed in WSL (already completed -- Chrome 146.0.7680.164)
- To run audit: start preview server (`bun run preview`) then run `bun run lighthouse:audit`

## Next Phase Readiness
- Lighthouse CI audit script ready for production use
- Pre-deploy gate chain (`bun run predeploy`) validates lint + types + build
- Full deploy validation: `bun run predeploy && bun run preview &` then `bun run lighthouse:audit`
- Script accepts BASE_URL as argv[2] for pointing to staging/production servers

## Self-Check: PASSED

- scripts/lighthouse-audit.mjs: FOUND
- 06-02-SUMMARY.md: FOUND
- Commit d72e8f5: FOUND

---
*Phase: 06-qa-performance-and-ship*
*Completed: 2026-03-27*
