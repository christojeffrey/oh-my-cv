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

The front-matter package imports `process` from `node:process` on line 3 of `packages/front-matter/src/front-matter.ts`. Even though the code has a `typeof process !== "undefined"` check to handle the browser environment, Vite still sees the import and externalizes the module when bundling for the browser, causing the error.

## Fix Applied

Removed the `import process from "node:process";` line from `packages/front-matter/src/front-matter.ts`. The typeof check already handles the case where process doesn't exist, and in Node.js environments, process is available globally without the import.

**File changed:** `packages/front-matter/src/front-matter.ts` - removed line 3

## Status

✅ **RESOLVED** - Fix verified and working
