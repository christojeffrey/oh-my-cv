# Coding Conventions

**Analysis Date:** 2026-02-10

## Naming Patterns

**Files:**

- Components: PascalCase - `ToggleDark.tsx`, `Dashboard.tsx`, `ResumeCard.tsx`
- Utilities/services: camelCase - `storage.ts`, `markdown.ts`, `toast.ts`
- Constants: camelCase - `index.ts`
- Types/interfaces: PascalCase - `ResumeStyles`, `DbResume`, `Font`

**Functions:**

- camelCase - `getResumes()`, `createResume()`, `renderMarkdown()`
- Public methods: camelCase
- Private methods: camelCase with underscore prefix - `_emptyResults()`, `_parse()`, `_bodyBegin()`

**Variables:**

- camelCase - `darkMode`, `setDarkMode`, `isLoading`, `containerRef`
- Constants: UPPER_SNAKE_CASE for module-level constants - `PAPER_SIZES`, `DISABLE_KEY`, `MM_TO_PX`
- React refs: camelCase with `Ref` suffix - `containerRef`, `zoomRef`

**Types:**

- PascalCase interfaces - `ResumeStyles`, `DbResume`, `SystemData`
- PascalCase type aliases - `ToastType`, `Preset`, `ChangedCase`
- PascalCase enums - `Paper` type in `ResumeStyles`

## Code Style

**Formatting:**

- **Tool:** Biome (primary), Prettier via `@renovamen/prettier-config`
- **Indent:** 2 spaces
- **Line width:** 100 characters
- **Quotes:** Double quotes for both strings and JSX
- **Semicolons:** Always
- **Trailing commas:** es5 style (objects, arrays, functions)
- **Arrow parentheses:** Always - `(value) => value` not `value => value`

**Linting:**

- **Tool:** Biome (recommended), ESLint with `@renovamen/eslint-config` (legacy)
- **Run commands:**
  ```bash
  pnpm run lint:biome      # Check code with Biome
  pnpm run lint:biome:fix  # Fix Biome issues
  pnpm run format          # Format code with Biome
  pnpm run check           # Run full Biome check
  pnpm run check:fix       # Fix all Biome issues
  pnpm run lint            # Check code with ESLint (legacy)
  ```

**Key Biome rules:**

- `recommended` enabled for all categories (a11y, complexity, correctness, performance, security, style, suspicious)
- `noNonNullAssertion` set to warn
- Organize imports enabled

## Import Organization

**Order:**

1. External dependencies (npm packages)
2. Internal imports (workspace packages)
3. Relative imports (same project)
4. Styles/CSS files

**Example:**

```typescript
import { useEffect } from "react";
import { useAtom } from "jotai";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { darkModeAtom } from "@/atoms";
import "./index.css";
```

**Path Aliases:**

- `@/*` → `./src/*` in `react-site/` (configured in `react-site/tsconfig.json` and `react-site/vite.config.ts`)
- `~/` → `./src/` in `site/` (Nuxt convention)
- Workspace packages: `@ohmycv/*` → `../packages/*/dist/index.mjs`

## Error Handling

**Patterns:**

- Try-catch for async operations
- Console.error for logging errors
- Return fallback values on error (null, [], {})
- No explicit error types typically defined

**Example:**

```typescript
async getResumes(): Promise<DbResume[]> {
  try {
    const keys = await this.store.keys();
    const resumes: DbResume[] = [];
    for (const key of keys) {
      const item = await this.store.getItem<DbResume>(String(key));
      if (item) {
        resumes.push(item);
      }
    }
    return resumes;
  } catch (error) {
    console.error("Failed to get resumes:", error);
    return [];
  }
}
```

**Service class pattern:**

- Methods return `Promise<T | null>` or `Promise<T>` with default fallback
- Errors logged but not thrown to caller in most cases
- Silent failures for non-critical operations

## Logging

**Framework:** `console` (native browser console)

**Patterns:**

- Error logging: `console.error("Failed to get resumes:", error)` - includes context message
- Warning logging: `console.warn("Import data version mismatch:", ...)` - used for version mismatches
- No structured logging framework
- No info/debug logging in production code

## Comments

**When to Comment:**

- JSDoc/TSDoc for exported public APIs
- Inline comments for complex logic
- Implementation notes for adapted/borrowed code
- TODO/FIXME for future work

**JSDoc/TSDoc:**

- Used for exported functions, classes, interfaces
- Includes descriptions, parameters (`@param`), return values (`@returns`), examples
- File-level JSDoc for attribution/copyright

**Example:**

```typescript
/**
 * Convert
 *
 *  <dt>...</dt>
 *  <dd>...</dd>
 *
 * to
 *
 * <dl>
 *   <dt>...</dt>
 *   <dd>...</dd>
 * </dl>
 *
 * @param html HTML string
 * @returns HTML string with resolved deflists
 */
private resolveDeflist(html: string): string { ... }

/**
 * @fileoverview This file is modified from https://github.com/antfu/case-police/blob/main/packages/case-police/src/utils.ts.
 *
 * The original file relies on Node.js APIs, which are removed in this file, so that
 * this package can be used in the browser environment.
 */
```

**Comment styles:**

- `//` for single-line comments
- `/* */` for multi-line comments
- `/** */` for JSDoc

## Function Design

**Size:**

- No strict size limit observed
- Functions typically kept under 50 lines when possible
- Longer functions for complex business logic (e.g., `StorageService.createResume`)

**Parameters:**

- Use typed parameters
- Default values with `= {}` or `= value`
- Options pattern for multiple parameters: `options: { ignore?: string[]; dict?: Record<string, string> }`
- Destructure in function signature: `({ value }: { value: string }) =>`

**Return Values:**

- Always typed with TypeScript
- Async functions return `Promise<T>` or `Promise<T | null>`
- Services return `null` on error
- Use `undefined` for optional returns that differ from error states

**Example:**

```typescript
async createResume(data?: Partial<DbResume>): Promise<DbResume | null> {
  try {
    const id = Date.now();
    const resume: DbResume = { id, ...data };
    await this.store.setItem(String(id), resume);
    return resume;
  } catch (error) {
    console.error("Failed to create resume:", error);
    return null;
  }
}
```

## Module Design

**Exports:**

- Named exports preferred for utilities: `export const slugify = ...`
- Default exports for main entry points: `export default replace`
- Class exports: `export class StorageService` and `export const storageService = new StorageService()`
- Re-exports: `export * from "./file";` in barrel files

**Barrel Files:**

- Used in packages to consolidate exports
- `index.ts` files re-export from internal modules
- Example: `packages/utils/src/index.ts` re-exports from file, common, types, is

**Service pattern:**

- Singleton service instances exported: `export const storageService = new StorageService()`
- Class defined, instantiated, exported as constant
- Both class and instance available for testing/flexibility

**Package structure:**

```
packages/<name>/
├── src/
│   ├── index.ts          # Main entry, re-exports
│   └── <feature>.ts      # Implementation files
└── dist/                 # Built output (CJS + ESM)
```

**TypeScript configuration:**

- Strict mode enabled globally
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `verbatimModuleSyntax: true` (react-site)
- `moduleResolution: "bundler"` (react-site) or `"node"` (packages/base)
- Paths configured for aliases

---

_Convention analysis: 2026-02-10_
