# Technology Stack

**Project:** Oh My CV
**Researched:** February 10, 2026
**Confidence:** HIGH

---

## Recommended Stack

### Core Framework

| Technology     | Version | Purpose       | Why Recommended                                                                                                                                      |
| -------------- | ------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React**      | 19.x    | UI library    | Latest stable release (Dec 2024) with Actions, Server Components, improved error reporting, `use` API, and better performance. Ready for production. |
| **TypeScript** | 5.6+    | Type safety   | Essential for bulletproof applications. Use strict mode with all strict family options enabled.                                                      |
| **Vite**       | 7.x     | Build tooling | Blazing fast HMR, excellent DX, native support for latest standards. Already in use.                                                                 |

### State Management

| Technology          | Version            | Purpose      | Why Recommended                                                                                                                                            |
| ------------------- | ------------------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Jotai**           | 2.x (keep current) | Atomic state | Already installed and working. Excellent for fine-grained reactivity and local component state. Simple API, great TypeScript support, no providers needed. |
| **TanStack Router** | Keep current       | Routing      | Already in use. Modern, type-safe file-based routing with excellent loading states and data integration.                                                   |

**Jotai vs Zustand decision:** Jotai is excellent and already integrated. Zustand (56.9k stars) would be slightly simpler for pure global stores, but Jotai's atomic model is better suited for this app's pattern. No migration needed.

### UI Components & Styling

| Technology                    | Version              | Purpose            | Why Recommended                                                                                                                 |
| ----------------------------- | -------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **shadcn/ui**                 | Current (up-to-date) | Component library  | Industry standard for 2025. Beautiful accessible Radix UI primitives, fully customizable, TypeScript-first. Already integrated. |
| **TailwindCSS**               | 3.4+ (keep current)  | Styling            | Utility-first CSS, excellent DX, small bundle. Already integrated.                                                              |
| **clsx** + **tailwind-merge** | Keep current         | Class utilities    | Standard shadcn/ui utilities for conditional classes.                                                                           |
| **class-variance-authority**  | Keep current         | Variant management | Shadcn/ui's CVA for component variants.                                                                                         |
| **lucide-react**              | Keep current         | Icons              | Modern, tree-shakeable icon library.                                                                                            |

### Form Handling

| Technology          | Version | Purpose           | Why Recommended                                                                                                                                           |
| ------------------- | ------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React Hook Form** | 7.x     | Form validation   | Industry standard. Uncontrolled components for performance, minimal re-renders, excellent TypeScript support. Works seamlessly with shadcn/ui components. |
| **Zod**             | 3.x     | Schema validation | TypeScript-first schema validation, integrates perfectly with RHF. Use `zodResolver` from `@hookform/resolvers`.                                          |

**React 19 Actions vs React Hook Form:** React 19's built-in Actions are great for simple forms, but React Hook Form remains superior for complex forms, validation, and production use cases. Use RHF with Zod.

### Data Fetching

| Technology         | Version      | Purpose           | When to Use                                                  |
| ------------------ | ------------ | ----------------- | ------------------------------------------------------------ |
| **React 19 use()** | Built-in     | Simple async data | Use `use` hook with Suspense for reading promises in render. |
| **Localforage**    | Keep current | Local storage     | Already installed. IndexedDB wrapper for offline storage.    |

**Note:** TanStack Query would be recommended for complex server state, but this app appears to be local-first. If adding API calls later, add `@tanstack/react-query`.

### Error Handling

| Technology               | Version      | Purpose             | Why Recommended                                                                                                                                                            |
| ------------------------ | ------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **react-error-boundary** | 4.x          | Error boundaries    | Simple, reusable error boundary component (7.9k stars). Wrap route boundaries to catch rendering errors. React 19 has improved error reporting but still needs boundaries. |
| **Sonner**               | Keep current | Toast notifications | Already installed (v2.0.0). Beautiful toast notifications for non-critical errors and success messages.                                                                    |

### Testing

| Technology                      | Version | Purpose           | Why Recommended                                                                                              |
| ------------------------------- | ------- | ----------------- | ------------------------------------------------------------------------------------------------------------ |
| **Vitest**                      | 2.x     | Test runner       | Vite-native, fast, modern test runner. Shares config with Vite. Replaces Jest for better DX and performance. |
| **React Testing Library**       | 16.x    | Component testing | Standard for testing React components (user-centric testing, not implementation details).                    |
| **@testing-library/jest-dom**   | Latest  | DOM assertions    | Custom matchers for Jest/Vitest.                                                                             |
| **@testing-library/user-event** | 14.x    | User interactions | Simulates real user interactions better than fireEvent.                                                      |

**Testing strategy for beginners:** Start with Vitest + React Testing Library. Test critical user paths first. Add Playwright later for E2E if needed.

### Code Quality & Tooling

| Technology     | Version            | Purpose            | Why Recommended                                                                                                |
| -------------- | ------------------ | ------------------ | -------------------------------------------------------------------------------------------------------------- |
| **Biome**      | 2.x (keep current) | Linter + Formatter | Fast (100x faster than ESLint), supports linting, formatting, and import sorting. Already installed (v2.3.13). |
| **TypeScript** | 5.6+               | Type checking      | Strict mode is non-negotiable for bulletproof code. See configuration below.                                   |

### TypeScript Configuration (Bulletproof)

Use these strict settings for maximum type safety:

```jsonc
{
  "compilerOptions": {
    // Core strict mode - enables all below
    "strict": true,

    // Individual strict mode options (all enabled by strict: true)
    "strictNullChecks": true, // Catch null/undefined bugs
    "noImplicitAny": true, // No implicit any types
    "strictFunctionTypes": true, // Correct function param checks
    "strictBindCallApply": true, // Check bind/call/apply
    "strictPropertyInitialization": true, // Class properties must be initialized
    "noImplicitThis": true, // Explicit this typing
    "useUnknownInCatchVariables": true, // catch variables are unknown, not any

    // Additional bulletproof settings
    "noUncheckedIndexedAccess": true, // Add undefined to index access
    "noImplicitReturns": true, // All code paths must return
    "noFallthroughCasesInSwitch": true, // Prevent switch fallthrough bugs
    "noUnusedLocals": true, // Catch unused variables
    "noUnusedParameters": true, // Catch unused params
    "exactOptionalPropertyTypes": true, // Strict optional properties

    // Module resolution
    "moduleResolution": "bundler", // Modern resolution
    "resolveJsonModule": true,
    "esModuleInterop": true
  }
}
```

---

## Installation

```bash
# Core dependencies (if not already installed)
npm install react react-dom@^19 typescript@^5.6

# State management (keep Jotai, add if missing)
npm install jotai@^2

# Form handling
npm install react-hook-form@^7 zod@^3 @hookform/resolvers@^3

# Error handling
npm install react-error-boundary@^4

# Testing (dev dependencies)
npm install -D vitest@^2 @testing-library/react@^16 @testing-library/jest-dom@^6 @testing-library/user-event@^14 jsdom

# TypeScript
npm install -D typescript@^5.6 @types/react@^19 @types/react-dom@^19

# Biome (if not already installed)
npm install -D @biomejs/biome@^2
```

---

## Alternatives Considered

| Category         | Recommended     | Alternative      | Why Not                                                                                                                                         |
| ---------------- | --------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| State Management | Jotai (keep)    | Zustand          | Zustand is great (56.9k stars) and slightly simpler, but Jotai is already working and better for atomic state. No compelling reason to migrate. |
| State Management | Jotai           | Redux Toolkit    | Overkill for this app. Too much boilerplate, complex setup. Jotai provides same power with less ceremony.                                       |
| State Management | Jotai           | Context API      | Too many re-renders, no devtools, harder to organize. Use only for truly component-local state.                                                 |
| Forms            | React Hook Form | React 19 Actions | React 19 Actions are good for simple forms, but RHF is battle-tested, has better validation integration, and handles complex forms better.      |
| Forms            | React Hook Form | Formik           | Formik is older, more complex API, slower re-render strategy. RHF is the modern standard.                                                       |
| Testing          | Vitest          | Jest             | Jest is slower, more config, and being replaced. Vitest is Vite-native, faster, and has same API.                                               |
| Linter           | Biome           | ESLint           | ESLint is 10-100x slower, more config. Biome is the modern replacement with better DX.                                                          |
| Linter           | Biome           | Prettier         | Biome handles both linting and formatting. No need for separate tools.                                                                          |

---

## What NOT to Use

| Avoid                            | Why                                                | Use Instead                                            |
| -------------------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| **Context API for global state** | Causes unnecessary re-renders, hard to debug       | Jotai for local state, TanStack Query for server state |
| **Redux Toolkit**                | Overkill for this app size, too much boilerplate   | Jotai for state, React Hook Form for form state        |
| **Formik**                       | Outdated, slower re-renders, more verbose          | React Hook Form with Zod                               |
| **Jest**                         | Slower, being deprecated by ecosystem, more config | Vitest (Vite-native)                                   |
| **ESLint + Prettier**            | Slower, two tools to maintain                      | Biome (one tool, 100x faster)                          |
| **prop-types**                   | Inferior to TypeScript, less type safety           | TypeScript interfaces                                  |
| **any type**                     | Defeats purpose of TypeScript                      | explicit types or unknown                              |
| **@ts-ignore**                   | Hides real problems                                | Fix the type issue properly                            |
| **inline styles (style={{}})**   | Performance issues, harder to maintain             | Tailwind CSS classes or styled-components if needed    |

---

## Stack Patterns by Use Case

**For local component state:**

- Use `useState` for simple local state
- Use `useReducer` for complex local state transitions
- Use Jotai atoms when state needs to be shared across a few components

**For global app state:**

- Use Jotai atoms with `useAtom` hook
- Organize related atoms in same file
- Use derived atoms (`atom(get)`) for computed values

**For form state:**

- Use React Hook Form with Zod validation
- Use `Controller` component for shadcn/ui components
- Keep form validation schemas in separate files

**For server state (if adding later):**

- Add `@tanstack/react-query` for caching, refetching, optimistic updates
- Combine with Jotai for selected server state in global store

**For error handling:**

- Wrap routes in `<ErrorBoundary fallback={ErrorFallback} />`
- Use Sonner toasts for non-critical errors
- Log errors to console and error tracking service

---

## Version Compatibility

| Package A      | Compatible With            | Notes                                        |
| -------------- | -------------------------- | -------------------------------------------- |
| React 19       | Jotai 2.x                  | Full support, no issues                      |
| React 19       | React Hook Form 7.x        | Full support, RHF 7.x designed for React 18+ |
| React 19       | React Testing Library 16.x | Full support                                 |
| React 19       | react-error-boundary 4.x   | Full support                                 |
| TypeScript 5.6 | React 19 types             | Full support                                 |
| Vite 7         | Vitest 2.x                 | Native integration, shared config            |

---

## Key Upgrades for 2025 Standards

### React 19 Migration (HIGH Priority - Do This First)

React 19 introduces significant improvements that modernize the codebase:

**What to adopt:**

1. **Actions for Forms** - Use `useActionState` for form submissions with pending/error states
2. **`useOptimistic`** - Show instant UI feedback during async operations
3. **`useFormStatus`** - Access form pending state in nested components
4. **`use` hook** - Read promises and context conditionally (bypasses hooks rules)
5. **ref as prop** - Remove `forwardRef` wrappers, pass ref directly as prop
6. **Better error boundaries** - React 19 has improved hydration error messages

**Breaking changes to be aware of:**

- React 19 removes some unstable APIs
- `useTransition` behavior slightly modified
- Some internal APIs changed (unlikely to affect this app)

**Migration strategy:**

1. Update `react` and `react-dom` to `^19`
2. Update `@types/react` and `@types/react-dom` to match
3. Run tests and fix any issues
4. Gradually adopt new features (Actions, `use`) where beneficial

### TypeScript Strict Mode (HIGH Priority)

If not already using strict mode, this is a one-time effort that pays dividends forever:

1. Enable `"strict": true` in tsconfig.json
2. Fix resulting type errors
3. Enable additional strict options one by one (see config above)
4. Each fix improves long-term maintainability

### Testing Setup (MEDIUM Priority)

If no tests exist, start simple:

1. Install Vitest and React Testing Library
2. Configure Vitest to use jsdom environment
3. Add basic test for a critical component
4. Build test coverage gradually from there

---

## Sources

- **React 19 official announcement** - https://react.dev/blog/2024/12/05/react-19 (HIGH confidence)
- **React Hook Form docs** - https://react-hook-form.com/get-started (HIGH confidence)
- **React Testing Library docs** - https://testing-library.com/docs/react-testing-library/intro (HIGH confidence)
- **Vitest docs** - https://vitest.dev/guide/ (HIGH confidence)
- **react-error-boundary** - https://github.com/bvaughn/react-error-boundary (HIGH confidence)
- **Zustand docs** - https://github.com/pmndrs/zustand (HIGH confidence - considered as alternative)
- **Biome docs** - https://biomejs.dev/guides/getting-started/ (HIGH confidence)
- **TypeScript tsconfig reference** - https://www.typescriptlang.org/tsconfig (HIGH confidence)
- **shadcn/ui docs** - https://ui.shadcn.com/docs/components (HIGH confidence)
