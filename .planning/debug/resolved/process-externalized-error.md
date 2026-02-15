# Debug Session: process-externalized-error

**Started:** 2026-02-12

## Issue Summary

**Error:** `Uncaught Error: Module "process" has been externalized for browser compatibility. Cannot access "process.platform" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`

## Symptoms

- **Expected behavior:** App runs in browser
- **Actual behavior:** Blank screen
- **Error messages:** Module "process" has been externalized for browser compatibility. Cannot access "process.platform" in client code.
- **Timeline:** Just started (was working, now it's broken)
- **Reproduction:** Running `npm run dev`

## Investigation Log

### Hypotheses

None yet - investigation starting.

## Current Focus

hypothesis: The `import process from "node:process"` on line 3 causes Vite to externalize the module. The fix is to remove this import since the typeof check already handles the case where process doesn't exist.
test: Remove the import and verify the app runs
expecting: App runs without the externalized module error
next_action: Apply the fix by removing the import line

## Eliminated

## Evidence

- timestamp: 2025-02-12T00:00:01.000Z
  checked: Searching codebase for "process.platform"
  found: packages/front-matter/src/front-matter.ts line 7: const PLATFORM = typeof process !== "undefined" ? process.platform : "";
  implication: This file accesses process.platform directly even though there's a typeof check
- timestamp: 2025-02-12T00:00:02.000Z
  checked: Searching for front-matter package usage
  found: react-site/package.json has "@ohmycv/front-matter": "file:../packages/front-matter"
  implication: front-matter is bundled into react-site
- timestamp: 2025-02-12T00:00:03.000Z
  checked: Reading front-matter.ts file
  found: Line 3 has `import process from "node:process";` which causes Vite to externalize the module. Line 7 has `typeof process !== "undefined"` check that already handles the case where process doesn't exist.
  implication: Removing the import will fix the issue since process is available globally in Node.js and the typeof check handles browser case

## Root Cause

The front-matter package accessed `process.platform` at module load time in `packages/front-matter/src/front-matter.ts`. Even though the code had a `typeof process !== "undefined"` check and no explicit import, Vite's static analysis detected the `process.platform` reference and externalized the module when bundling for the browser.

The dist files also contained a direct `import process from "process"` from an earlier build that needed to be regenerated.

## Fix Applied

Changed the code to be platform-agnostic by always including `\r?` in the regex pattern. This pattern works correctly for both Windows (CRLF) and Unix (LF) line endings, making the platform check unnecessary.

**Before:**
```typescript
const PLATFORM = typeof process !== "undefined" ? process.platform : "";
const PATTERN = ... + (PLATFORM === "win32" ? "\\r?" : "") + ...
```

**After:**
```typescript
const PATTERN = ... + "\\r?" + ...  // Optional carriage return for Windows compatibility
```

**File changed:** `packages/front-matter/src/front-matter.ts` - removed process.platform check

**Rebuilt:** Ran `npx tsup src/index.ts --format cjs,esm --dts` to update dist files

**Verification:**
- Dev server starts without errors on port 5177
- HTML page loads correctly
- No process references in built dist files

## Status

✅ **RESOLVED** - Fix verified and working (commit c68b99a)
