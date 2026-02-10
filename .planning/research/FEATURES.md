# Feature Research

**Domain:** Bulletproof React Applications
**Researched:** February 11, 2026
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature                    | Why Expected                                                                                 | Complexity | Notes                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------- |
| **Form Validation**        | Users expect form fields to validate input before submission and show helpful error messages | LOW        | React Hook Form + Zod is the standard pattern. shadcn/ui integrates seamlessly.                    |
| **Error Boundaries**       | Apps must gracefully handle rendering errors without crashing the entire page                | LOW        | Use `react-error-boundary` (4.x) to wrap route segments. Display fallback UI with recovery option. |
| **Type Safety**            | TypeScript is expected for maintainable React applications                                   | MEDIUM     | Strict mode is non-negotiable. Use `strict: true` + all strict options.                            |
| **Loading States**         | Users expect visual feedback during async operations                                         | LOW        | Show spinners/skeletons during fetches. Use `Suspense` boundaries for data loading.                |
| **Optimistic UI**          | Modern apps provide instant feedback, updating UI before server confirms                     | MEDIUM     | React 19's `useOptimistic` hook provides built-in support.                                         |
| **Accessible Components**  | Users expect keyboard navigation, screen reader support, ARIA attributes                     | MEDIUM     | shadcn/ui components are built on Radix UI primitives - accessible by default.                     |
| **Form Error Display**     | Clear, contextual error messages near invalid fields                                         | LOW        | React Hook Form's `errors` object provides granular error access.                                  |
| **Toast Notifications**    | Non-intrusive success/error messages for non-critical actions                                | LOW        | Sonner (already installed) is the modern choice - beautiful, animated toasts.                      |
| **Local Data Persistence** | Users expect data to save locally and persist across sessions                                | MEDIUM     | Localforage (already installed) provides IndexedDB wrapper for offline storage.                    |
| **Input Debouncing**       | Prevents excessive re-renders on rapid input changes                                         | LOW        | Use React's built-in `useDeferredValue` or manual debouncing for search inputs.                    |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature                       | Value Proposition                                                              | Complexity | Notes                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------ | ---------- | -------------------------------------------------------------------------------------------- |
| **Smart Validation**          | Context-aware validation based on user's state (e.g., email depends on domain) | HIGH       | Zod's `refine()` allows conditional schemas. Great for resume builder validation.            |
| **Real-time Sync Preview**    | Show live preview while editing resume, updates instantly                      | MEDIUM     | Use Jotai atoms for real-time preview updates. Minimal latency with fine-grained reactivity. |
| **Auto-save with Recovery**   | Never lose work - saves automatically, recovers on refresh                     | HIGH       | Persist drafts to localforage. Implement debounced auto-save (e.g., every 2 seconds).        |
| **Undo/Redo for Forms**       | Restore previous form states, common in professional tools                     | HIGH       | Track form history in Jotai. Allow reverting to previous states.                             |
| **Template Validation**       | Validate resume against ATS/HR standards, highlight missing sections           | MEDIUM     | Zod schemas can validate completeness. Add custom rules for ATS compatibility.               |
| **Export Quality Guardrails** | Prevent exporting incomplete or invalid resumes                                | MEDIUM     | Validate all required fields before PDF export. Show helpful checklist.                      |
| **Keyboard Shortcuts**        | Power users expect Ctrl+S to save, Ctrl+Z to undo                              | MEDIUM     | Document shortcuts. Use `vue-shortcuts` pattern or React equivalents.                        |
| **Offline-First**             | Work without internet, sync when connection restores                           | HIGH       | Use Service Worker + localforage. Queue changes, sync on reconnect.                          |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature                                  | Why Requested                         | Why Problematic                                                     | Alternative                                                                                   |
| ---------------------------------------- | ------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Global Context for Everything**        | Seems like "React way" to share state | Causes unnecessary re-renders, hard to debug, devtools struggles    | Use Jotai atoms for fine-grained state. Context only for truly app-wide values (theme, auth). |
| **Complex Form Libraries**               | Want "everything built-in"            | Heavy bundles, rigid patterns, hard to customize                    | Use React Hook Form for validation + state. Build custom components with shadcn/ui.           |
| **Redux for Small Apps**                 | "Professional" state management       | Overkill, too much boilerplate, steeper learning curve              | Jotai (already integrated) provides simplicity with power.                                    |
| **Prop-Types**                           | Seems like "type safety"              | Inferior to TypeScript, less powerful, doubles schema work          | Use TypeScript interfaces + Zod for validation. Single source of truth.                       |
| **Manual Debouncing on Every Input**     | "Prevent excessive renders"           | React 19's `useDeferredValue` handles this more elegantly           | Use `useDeferredValue` for non-urgent updates. Manual debounce only for search APIs.          |
| **Custom Error Tracking Implementation** | Want control over error reporting     | Reinventing wheel, maintenance burden, missing features             | Use Sentry for production. Has React integration, stack traces, performance monitoring.       |
| **Loading Overlays**                     | "Show loading state clearly"          | Blocks user interaction, feels sluggish, poor UX                    | Skeleton loaders + `Suspense` boundaries are better. Progressive loading.                     |
| **Multiple Form Libraries**              | "Use best tool for each form"         | Inconsistent UX, bundle bloat, maintenance nightmare                | Standardize on React Hook Form + Zod across all forms.                                        |
| **Deep Component Nesting**               | "Organize logically"                  | Performance issues (re-renders bubble up), hard to trace errors     | Flatter component tree. Extract complex logic to custom hooks.                                |
| **@ts-ignore Pragmas**                   | Quick fix for type errors             | Hides real problems, accumulates technical debt, defeats TypeScript | Fix the type properly. Use `unknown` type if truly uncertain.                                 |

## Feature Dependencies

```
Type Safety (Strict TypeScript)
    └──requires──> All other features (forms, state, validation)
                        └──requires──> Zod Schemas
                                            └──requires──> React Hook Form

Form Validation (React Hook Form + Zod)
    └──requires──> shadcn/ui Components (for form controls)
    └──requires──> Toast Notifications (Sonner) for errors
    └──enhances──> Smart Validation

Error Boundaries (react-error-boundary)
    └──requires──> Sentry Integration (for logging)
    └──requires──> Fallback UI Components

State Management (Jotai)
    ├──requires──> Type Safety
    └──requires──> Local Data Persistence (localforage)

Optimistic UI (useOptimistic)
    └──requires──> Actions (useTransition or useActionState)
    └──requires──> Error Recovery (rollback on failure)

Auto-save
    ├──requires──> State Management (Jotai)
    ├──requires──> Local Data Persistence (localforage)
    └──enhances──> Real-time Sync Preview

Accessibility (Radix UI primitives via shadcn/ui)
    └──enhances──> All UI Components
```

### Dependency Notes

- **Type Safety requires all other features:** Without strict TypeScript, you lose compile-time catching of errors in forms, state, and validation. Type safety is the foundation.
- **React Hook Form requires shadcn/ui Components:** While RHF works with any input, shadcn/ui provides accessible, pre-styled components that integrate seamlessly via `Controller`.
- **Error Boundaries require Sentry Integration:** Error boundaries catch errors but you need a way to log them. Sentry provides the production monitoring.
- **State Management (Jotai) enhances Real-time Sync Preview:** Fine-grained reactivity means only the preview component re-renders when resume data changes, not the entire editor.
- **Auto-save enhances Real-time Sync Preview:** Auto-saved data can immediately power the preview, showing a "what you see is what you get" experience.
- **Optimistic UI requires Error Recovery:** Optimistic updates must rollback on server failure. You need to handle the rejection case.

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [ ] **Form Validation** — Users must be able to fill out resume forms with validation errors shown inline. Core to resume builder.
- [ ] **Type Safety** — Prevent runtime errors, catch issues at compile time. Non-negotiable for bulletproof code.
- [ ] **Error Boundaries** — Prevent app crashes from taking down the entire page. Wrap routes.
- [ ] **Loading States** — Show progress during saves, exports, and data loads. Users need feedback.
- [ ] **Accessible Components** — Resume builder must be usable by all users. shadcn/ui provides this out of the box.
- [ ] **Local Data Persistence** — Don't lose work on refresh. Save drafts to localforage.

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] **Toast Notifications** — Provide non-intrusive feedback for saves, exports, errors. Sonner already installed.
- [ ] **Optimistic UI** — Show instant feedback on form submissions. Improve perceived performance.
- [ ] **Smart Validation** — Add context-aware validation rules. Resume-specific (e.g., graduation date > birth date).
- [ ] **Auto-save** — Never lose work. Debounced auto-save to localforage.

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **Undo/Redo for Forms** — Power user feature. Track form state history in Jotai.
- [ ] **Real-time Sync Preview** — Show live preview while editing. Complex to implement correctly.
- [ ] **Template Validation** — ATS compatibility checks. Requires external knowledge base.
- [ ] **Export Quality Guardrails** — Prevent bad exports. Nice-to-have once users are exporting.
- [ ] **Keyboard Shortcuts** — Power user productivity gains. Nice-to-have for professional tools.
- [ ] **Offline-First** — Work without internet. Complex to implement and test thoroughly.
- [ ] **Sentry Integration** — Production error tracking. Add when preparing for production launch.

## Feature Prioritization Matrix

| Feature                              | User Value | Implementation Cost | Priority |
| ------------------------------------ | ---------- | ------------------- | -------- |
| Form Validation (RHF + Zod)          | HIGH       | LOW                 | P1       |
| Type Safety (Strict TypeScript)      | HIGH       | MEDIUM              | P1       |
| Error Boundaries                     | HIGH       | LOW                 | P1       |
| Loading States                       | HIGH       | LOW                 | P1       |
| Accessible Components (shadcn/ui)    | HIGH       | LOW                 | P1       |
| Local Data Persistence (localforage) | HIGH       | LOW                 | P1       |
| Toast Notifications (Sonner)         | MEDIUM     | LOW                 | P2       |
| Optimistic UI (useOptimistic)        | MEDIUM     | MEDIUM              | P2       |
| Auto-save                            | HIGH       | MEDIUM              | P2       |
| Smart Validation                     | MEDIUM     | MEDIUM              | P2       |
| Undo/Redo for Forms                  | LOW        | HIGH                | P3       |
| Real-time Sync Preview               | MEDIUM     | HIGH                | P3       |
| Template Validation                  | MEDIUM     | HIGH                | P3       |
| Export Quality Guardrails            | LOW        | MEDIUM              | P3       |
| Keyboard Shortcuts                   | LOW        | MEDIUM              | P3       |
| Offline-First                        | LOW        | HIGH                | P3       |
| Sentry Integration                   | MEDIUM     | LOW                 | P3       |

**Priority key:**

- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature             | Competitor A (Resume.io)   | Competitor B (Canva)             | Our Approach (Oh My CV)                                      |
| ------------------- | -------------------------- | -------------------------------- | ------------------------------------------------------------ |
| Form Validation     | Custom built-in validators | Mixed (some validated, some not) | React Hook Form + Zod (industry standard, flexible)          |
| Error Handling      | Basic error toasts         | Global error pages               | Error boundaries at route level + Sentry logging             |
| Type Safety         | JavaScript (no types)      | JavaScript (no types)            | Strict TypeScript (compile-time safety)                      |
| Loading States      | Spinners on all async      | Skeleton loaders                 | Skeleton loaders + Suspense boundaries (modern, progressive) |
| Optimistic UI       | Some actions               | Limited                          | React 19's `useOptimistic` (built-in, elegant)               |
| Accessibility       | Partial compliance         | WCAG AA focus                    | shadcn/ui on Radix UI primitives (fully accessible)          |
| Local Persistence   | Server-only                | Server + local cache             | Localforage + auto-save (offline-capable)                    |
| Real-time Preview   | Live preview               | Live preview                     | Jotai-powered real-time preview (fine-grained reactivity)    |
| Undo/Redo           | History sidebar            | Ctrl+Z limited                   | Form state history in Jotai atoms (customizable)             |
| Template Validation | ATS checker add-on         | ATS export options               | Zod schemas with custom rules (extensible)                   |

## Sources

- **React 19 Official Documentation** - https://react.dev (HIGH confidence)

  - Error boundaries (`Component.getDerivedStateFromError`, `componentDidCatch`)
  - `useTransition` for non-blocking updates
  - `useOptimistic` for optimistic UI
  - `useDeferredValue` for debouncing inputs

- **react-error-boundary** - https://github.com/bvaughn/react-error-boundary (HIGH confidence)

  - Simple reusable error boundary component
  - FallbackComponent, fallbackRender, resetKeys patterns

- **React Hook Form** - https://react-hook-form.com/get-started (HIGH confidence)

  - Industry standard for form validation
  - Uncontrolled components for performance
  - `Controller` for shadcn/ui integration
  - Zod resolver (`@hookform/resolvers/zod`)

- **Zod** - https://zod.dev (HIGH confidence)

  - TypeScript-first schema validation
  - Zero dependencies, 2kb gzipped
  - Immutable API
  - Built-in JSON Schema conversion

- **shadcn/ui Components** - https://ui.shadcn.com/docs/components (HIGH confidence)

  - Built on Radix UI primitives (accessible by default)
  - Fully customizable, no lock-in
  - TypeScript-first
  - 60+ components available

- **Sentry for React** - https://sentry.io/for/react/ (MEDIUM confidence - vendor documentation)

  - React SDK (`@sentry/react`)
  - Error tracking, stack traces, performance monitoring
  - Session replay, profiling
  - Integrates with TanStack Router, Redux

- **Jotai** - https://jotai.org/docs/basics/primitives (HIGH confidence - from STACK.md)
  - Atomic state management
  - Fine-grained reactivity
  - No providers needed
  - Already installed in project

---

_Feature research for: Bulletproof React Applications_
_Researched: February 11, 2026_
