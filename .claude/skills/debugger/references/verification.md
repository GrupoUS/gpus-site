# Verification & Prevention

> Fix the bug AND fix the system that allowed it.

---

## Defense-in-Depth Validation

After fixing, add validation at EVERY layer data passes through.

### The Four Layers

| Layer | Purpose | Example |
|-------|---------|---------|
| **1. Entry Point** | Reject invalid input at boundary | Content Collection Zod schema |
| **2. Business Logic** | Ensure data makes sense | Validate event data before render |
| **3. Environment Guards** | Prevent dangerous operations | Block build with wrong SITE URL |
| **4. Debug Instrumentation** | Capture context for forensics | Stack traces, timestamps |

### Implementation

```typescript
// Layer 1: Entry Point (Content Collection schema + Zod)
const eventSchema = z.object({
  title: z.string().min(1, "Titulo é obrigatório"),
  date: z.date(),
  location: z.string(),
  capacity: z.number().positive(),
});

// Layer 2: Business Logic (Astro page data loading)
export async function getEventData(slug: string) {
  const event = await getEntry("events", slug);
  if (!event) {
    throw new Error(`Event not found: ${slug}`);
  }
  if (event.data.capacity <= 0) {
    throw new Error(`Invalid capacity for event: ${slug}`);
  }
  return event;
}

// Layer 3: Environment Guard
if (import.meta.env.MODE === "production") {
  const siteUrl = import.meta.env.SITE ?? "";
  if (!siteUrl.includes("namesacerta")) {
    throw new Error("Refusing to build with incorrect SITE URL");
  }
}

// Layer 4: Debug Instrumentation
console.error("DEBUG content-load:", {
  collection,
  slug,
  timestamp: new Date().toISOString(),
  stack: new Error().stack,
});
```

---

## Regression Prevention

### When to Apply

| Bug Level | Required Actions |
|-----------|-----------------|
| L1-L4     | Fix + test (standard flow) |
| L5        | Fix + test + regression risk note |
| L6+       | Fix + test + postmortem + prevention |

### Regression Risk Assessment

| Risk | Definition | Action |
|------|-----------|--------|
| **High** | Same bug class likely elsewhere | Scan codebase, fix ALL instances |
| **Medium** | Could recur if related code changes | Add guard, document |
| **Low** | Isolated incident | Standard fix |

### Prevention Checklist

Before closing a L5+ bug:

- [ ] **Test exists**: Fails without fix, passes with it
- [ ] **Guard added**: Defense-in-depth at appropriate layer
- [ ] **Pattern scan**: If High risk, scanned for same pattern elsewhere
- [ ] **Documentation**: Root cause in commit message

---

## Fix Verification Criteria

A fix is verified when ALL are true:

1. **Reproducible**: Bug can be reproduced on demand
2. **Test-proven**: Test fails without fix, passes with it
3. **Isolated**: Fix changes only what's necessary
4. **Gate-passing**: `check`, `lint`, `test` all pass
5. **Non-regressive**: No previously passing tests now fail

---

## Postmortem Template (L6+)

```markdown
## Bug Postmortem: [Brief Title]

**Date:** YYYY-MM-DD
**Severity:** P1/P2/P3/P4
**Time to Resolve:** Xh

### Timeline
1. Bug reported: [when, how]
2. Root cause identified: [when, technique]
3. Fix implemented: [when]
4. Fix verified: [when, how]

### Root Cause
[1-2 sentences. Be specific.]

### Why It Escaped
- [ ] Missing test coverage
- [ ] Insufficient defense-in-depth
- [ ] Edge case not considered
- [ ] Environment difference (dev vs prod)

### Prevention Measures
1. [Test added] — describe the test
2. [Guard added] — describe the validation
3. [Pattern fix] — if High risk, list other instances fixed

### Lessons Learned
What would have caught this earlier?
```
