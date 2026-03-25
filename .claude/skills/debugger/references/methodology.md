# Debug Methodology

> 4-Phase systematic debugging: Investigate → Analyze Patterns → Hypothesize → Implement.

---

## Phase 1: Investigate

**BEFORE attempting ANY fix.**

### Self-Interrogation (write answers)

```
1. What SHOULD happen? (expected behavior, exact values)
2. What ACTUALLY happens? (observed behavior, exact values)
3. WHERE do they diverge? (specific point)
```

### Read Error Messages Completely

- Don't skip past errors
- Read stack traces **completely** — line numbers, file paths, error codes
- They often contain the exact solution

### Reproduce Consistently

- Can you trigger it reliably?
- What are the exact steps?
- **If not reproducible → gather more data, don't guess**

### Check Recent Changes

```bash
git diff HEAD~5
git log --oneline -10
```

### Multi-Component Tracing

For each boundary (Astro page → React Island → Content Collection → JSON data):

```typescript
// Add logging at each layer
console.error("=== Astro page props ===", { slug, params });
console.error("=== React Island props ===", { items, initialState });
console.error("=== Content Collection entry ===", { collection, id: entry.id });
console.error("=== JSON data ===", { count: data.length, keys: Object.keys(data[0]) });
```

---

## Phase 2: Analyze Patterns

1. **Find Working Examples** — Locate similar working code
2. **Compare Differences** — List EVERY difference, however small
3. **Understand Dependencies** — What config/env does this need?

---

## Phase 3: Hypothesize

**Scientific method — one variable at a time.**

1. **Form Single Hypothesis** — "X is the root cause because Y"
2. **Test Minimally** — Smallest possible change
3. **Verify Before Continuing**:
   - Worked? → Phase 4
   - Didn't work? → NEW hypothesis, don't add more fixes

### Cognitive Biases to Avoid

| Bias | Symptom | Countermeasure |
|------|---------|----------------|
| **Confirmation** | Seeking proof, ignoring disproof | Ask: "What would disprove this?" |
| **Anchoring** | Fixating on first error | Read ENTIRE output before hypothesis |
| **Fixation** | Persisting with wrong approach | 2-strike rule: change approach after 2 failures |
| **Ownership** | "My code is fine" | Same scrutiny for your code as unfamiliar code |
| **Optimism** | "That should fix it" | Run gates EVERY time |

### Generate 3 Hypotheses

Before committing to any fix:
- [ ] Generated ≥ 2 alternative hypotheses
- [ ] Evidence DISPROVES other hypotheses (not just proves mine)
- [ ] Fix addresses ROOT CAUSE, not symptom

---

## Phase 4: Implement

### 1. Create Failing Test

```typescript
it("should reject empty event slug", () => {
  expect(() => getEventData("")).toThrow();
});
```

### 2. Implement Single Fix

- ONE change at a time
- No "while I'm here" improvements

### 3. Verify Gates

```bash
bun run check && bun run lint:check && bun test
```

### 3-Fix Escalation Rule

- **< 3 fixes failed** → Return to Phase 1
- **≥ 3 fixes failed** → **STOP.** Question architecture. Discuss with user.

---

## Root Cause Tracing

Trace backward through call chain to find original trigger.

### 5-Step Backward Trace

```
1. Observe Symptom        → "Cannot read properties of undefined (reading 'data')"
2. Find Immediate Cause   → const { data } = entry; // entry is undefined
3. Ask: What Called This? → getEntry("events", slug)
4. Keep Tracing Up        → slug = undefined — Astro.params not yet available
5. Find Original Trigger  → getStaticPaths missing this slug value
```

**Fix at source:**

```typescript
// Root cause: slug missing from getStaticPaths
export async function getStaticPaths() {
  const events = await getCollection("events");
  return events.map((event) => ({
    params: { slug: event.slug }, // ← Ensure all slugs are generated
  }));
}
```

### Git Bisect for Regressions

```bash
git bisect start
git bisect bad                    # Current is broken
git bisect good HEAD~20           # This was working
# Git guides you to exact commit
git bisect reset
```

---

## Templates

### 5 Whys

```markdown
**Problem**: [Describe error]
1. Why? → [First cause]
2. Why? → [Deeper cause]
3. Why? → [Underlying issue]
4. Why? → [Systemic reason]
5. Why? → [Root cause]

**Root Cause**: [Final determination]
**Fix**: [Solution implemented]
```

### Debug Report

```markdown
## Debug Report

**Issue**: [Description]
**Bug Type**: Cosmetic | Performance | Security | Functionality
**Root Cause**: [5 Whys result]
**Fix**: [What was changed]
**Verification**:
- [ ] `bun run check` ✅
- [ ] `bun test` ✅

**Lessons Learned**: What would have caught this earlier?
```

### Commit Message

```
fix(scope): brief description

Root cause: [5 Whys result]
Fix: [What was changed]

Tested: bun run check ✅, bun test ✅
```
