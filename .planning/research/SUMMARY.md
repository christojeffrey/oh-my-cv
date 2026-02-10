# Project Research Summary

**Project:** Oh My CV
**Domain:** React resume builder application
**Researched:** February 11, 2026
**Confidence:** HIGH

## Executive Summary

Oh My CV is a local-first React resume builder that renders user-provided markdown content. Expert builders approach this type of application with a focus on type safety, state isolation, and security—especially XSS protection for markdown rendering. The research strongly recommends a modern React 19 stack with TypeScript strict mode, atomic state management via Jotai (already integrated), and shadcn/ui components for accessibility.

The recommended approach builds on existing infrastructure (Jotai, TanStack Router, Vite, localforage) while adding form validation (React Hook Form + Zod), error boundaries (react-error-boundary), and security controls (DOMPurify for markdown sanitization). Key risks center on XSS vulnerabilities from unsanitized markdown, missing error boundaries causing complete app crashes, and state mutation bugs. These are mitigated by sanitizing all user content before rendering, wrapping routes in error boundaries, and maintaining strict TypeScript with proper state update patterns.

## Key Findings

### Recommended Stack

The project has excellent foundation with React 19, TypeScript 5.6+, Vite 7, Jotai, TanStack Router, shadcn/ui, and Biome already integrated. Key additions needed are React Hook Form for form handling, Zod for schema validation, react-error-boundary for error isolation, and DOMPurify for XSS prevention. The stack represents 2025 industry standards with bulletproof patterns—strict TypeScript, atomic state, and modern tooling.

**Core technologies:**

- **React 19.x** — Latest stable with Actions, `useOptimistic`, better error handling; production-ready
- **TypeScript 5.6+** — Strict mode non-negotiable for type safety; prevents runtime bugs
- **Jotai 2.x** — Atomic state management; already integrated, excellent for fine-grained reactivity
- **shadcn/ui** — Accessible component library on Radix primitives; TypeScript-first, fully customizable
- **React Hook Form + Zod** — Form validation standard; uncontrolled components for performance
- **Biome 2.x** — 100x faster than ESLint; handles linting, formatting, import sorting

### Expected Features

Resume builders require table stakes features around data integrity (validation, persistence), user feedback (loading states, error handling), and accessibility. Differentiators focus on resume-specific workflow improvements like smart validation, auto-save, and real-time preview. Several commonly requested features (global context, Redux, Formik) are explicitly anti-patterns for this stack.

**Must have (table stakes):**

- **Form validation** — Users expect inline validation errors; React Hook Form + Zod provides industry-standard solution
- **Error boundaries** — Prevents app crashes from cascading; wrap routes with react-error-boundary
- **Type safety** — Strict TypeScript catches issues at compile time; foundation for all features
- **Loading states** — Visual feedback during async operations; use Suspense + skeletons
- **Accessible components** — Keyboard navigation, ARIA support; shadcn/ui provides this by default
- **Local data persistence** — Don't lose work on refresh; localforage already installed

**Should have (competitive):**

- **Smart validation** — Context-aware rules (e.g., graduation date > birth date); Zod's `refine()` enables this
- **Real-time sync preview** — Live preview while editing; Jotai atoms enable fine-grained reactivity
- **Auto-save** — Never lose work; debounced saves to localforage
- **Toast notifications** — Non-intrusive feedback; Sonner already installed

**Defer (v2+):**

- **Undo/Redo for forms** — Power user feature; track history in Jotai atoms
- **Template validation** — ATS compatibility checks; requires external knowledge base
- **Offline-First** — Work without internet; Service Worker + localforage, complex implementation
- **Sentry integration** — Production error tracking; add when preparing for launch

### Architecture Approach

Four-layer architecture (Presentation, State, Service, Utility) with feature-based component organization. Atomic state via Jotai separates concerns without prop drilling. Service layer isolates business logic and external integrations (storage, toast notifications). Route-based data loading via TanStack Router provides type-safe params and consistent loading/error states. Monorepo structure with pnpm workspaces allows shared library development while keeping main app focused.

**Major components:**

1. **Routes** — Page-level layout, data loading via TanStack Router loaders, integrate services
2. **Feature components** — Dashboard, Editor organized by business domain; compose UI elements
3. **UI components** — shadcn/ui design system; atomic, reusable, accessible primitives
4. **Jotai atoms** — Atomic state for cross-component sharing; derived atoms for computed values
5. **Services** — Business logic, localforage wrapper, toast notification wrapper
6. **Utils** — Pure functions; markdown processing, front-matter parsing, case correction

### Critical Pitfalls

Resume builders face specific pitfalls around XSS (markdown rendering), state complexity (large CV data), and user experience (lost work, confusing errors). Research identifies 8 critical pitfalls with clear prevention strategies.

1. **XSS from unsanitized markdown** — Use DOMPurify before rendering user content; this is security-critical for Phase 1
2. **Missing error boundaries** — Wrap routes in react-error-boundary; prevents blank screens, provides recovery UI
3. **State mutation** — Never mutate state directly; use spread operators or Immer; Strict Mode catches this
4. **Missing cleanup in useEffect** — Always return cleanup functions for subscriptions, timers, fetch controllers
5. **TypeScript any overuse** — Use `unknown` + type guards for dynamic data; defeats purpose of TypeScript
6. **Direct window/document access** — Move to useEffect with `typeof window` checks; breaks SSR otherwise
7. **Monolithic state** — Split into focused atoms/contexts; Jotai's atomic model prevents this
8. **Unnecessary re-renders** — Profile before optimizing; Jotai's fine-grained reactivity minimizes this

## Implications for Roadmap

Based on combined research, the project should follow a phased approach that addresses critical pitfalls first (security, error handling, type safety), then builds core features (validation, persistence), and finally adds competitive differentiators (smart validation, real-time preview). Feature dependencies from FEATURES.md show type safety as foundation for everything else.

### Phase 1: Foundation (Security & Type Safety)

**Rationale:** Security vulnerabilities and missing error boundaries are showstoppers. XSS prevention via DOMPurify must be integrated before rendering any markdown. TypeScript strict mode provides foundation for all subsequent development. Error boundaries prevent catastrophic failures.
**Delivers:** Secure markdown rendering, error boundary infrastructure, strict TypeScript configuration, basic state patterns
**Addresses:** Form validation, error boundaries, type safety, accessible components (from FEATURES.md)
**Avoids:** XSS vulnerability, missing error boundaries, state mutation, TypeScript any overuse (from PITFALLS.md)

**Research Flag:** **Needs deep research** — DOMPurify configuration for markdown-specific needs (allowing safe tags, preventing XSS while preserving formatting). Multiple markdown rendering libraries exist; integration approach needs validation.

### Phase 2: Core Editor (Data & Persistence)

**Rationale:** With foundation in place, build the core editor experience. Form validation via React Hook Form + Zod is table stakes. Local persistence via localforage ensures users don't lose work. State management patterns via Jotai are established in this phase.
**Delivers:** Form validation system, resume data models, local storage service, auto-save debouncing, loading states, toast notifications
**Uses:** React Hook Form, Zod, localforage, Jotai atoms, Sonner (from STACK.md)
**Implements:** Service layer pattern, route-based data loading, feature-based component organization (from ARCHITECTURE.md)

**Research Flag:** **Needs research** — React Hook Form integration with shadcn/ui components using `Controller`. Zod schema design for resume-specific validation rules (email formats, date ranges, required fields). Localforage quota limits and eviction strategy for large resume collections.

### Phase 3: Editor Enhancements (Preview & Polish)

**Rationale:** With core editing working, add user experience improvements. Real-time preview leverages Jotai's atomic reactivity. Smart validation adds resume-specific rules. Loading states and toast notifications provide feedback.
**Delivers:** Real-time markdown preview, context-aware validation rules, optimistic UI updates, export quality checks, loading skeletons
**Implements:** Derived Jotai atoms for preview, Zod refine() for smart validation, React 19 useOptimistic (from FEATURES.md)

**Research Flag:** **Skip deep research** — Well-documented patterns. Jotai derived atoms are straightforward. React 19's useOptimistic has official docs.

### Phase 4: Quality & Optimization

**Rationale:** Performance and accessibility come after features work. Code splitting ensures fast initial load. Accessibility audit ensures WCAG compliance. Performance optimization based on profiling, not premature.
**Delivers:** Route-based code splitting (automatic via TanStack Router), accessibility audit results, performance optimizations from profiling, keyboard navigation enhancements
**Avoids:** Premature memoization, over-optimization without measurement (from PITFALLS.md)

**Research Flag:** **Skip deep research** — TanStack Router handles code splitting automatically. Accessibility has established checklists. Performance optimization should be based on actual profiling data collected during this phase.

### Phase 5: Production Readiness

**Rationale:** Advanced features like undo/redo and offline support are nice-to-haves. Sentry integration and PWA configuration prepare for production launch.
**Delivers:** Undo/redo for forms, Service Worker for offline support, Sentry error tracking, PWA manifest, analytics integration
**Uses:** Service Worker API, Sentry SDK, Vite PWA plugin (from STACK.md)

**Research Flag:** **Needs research** — Service Worker caching strategy for resume data. Offline sync conflict resolution. Sentry configuration for React 19. PWA manifest for resume builder use case.

### Phase Ordering Rationale

- **Phase 1 first** because security (XSS) and error handling are blocking risks; TypeScript strict mode is dependency for all features
- **Phase 2 next** because form validation and persistence are core user value; establishes service layer and state patterns used throughout
- **Phase 3 then** builds on Phase 2's data models and validation; preview requires data structure to be stable
- **Phase 4 after** because optimization without working features is premature; accessibility can be tested against working UI
- **Phase 5 last** because advanced features and production tooling are not needed for internal validation

**Feature dependencies driving order:**

```
Type Safety (Phase 1) → Form Validation (Phase 2) → Smart Validation (Phase 3)
Error Boundaries (Phase 1) → Toast Notifications (Phase 2) → Optimistic UI (Phase 3)
State Management (Phase 2) → Real-time Preview (Phase 3)
```

### Research Flags

**Phases likely needing deeper research during planning:**

- **Phase 1 (Foundation):** DOMPurify configuration for markdown—multiple sanitization libraries exist, need to verify whitelist configuration preserves resume formatting while preventing XSS. Research specific to markdown + HTML sanitization.
- **Phase 2 (Core Editor):** React Hook Form + shadcn/ui integration—while both are well-documented, the `Controller` wrapper pattern for complex UI components (date pickers, rich text) needs validation. Zod schema design for resume domain requires understanding of ATS requirements.
- **Phase 5 (Production):** Offline-first conflict resolution—when users edit offline then sync, handling concurrent edits requires strategy. Service Worker caching for user-generated content has edge cases.

**Phases with standard patterns (skip research-phase):**

- **Phase 3 (Editor Enhancements):** Well-documented patterns—Jotai derived atoms, React 19 hooks, Zod refine() all have official documentation and community consensus.
- **Phase 4 (Quality & Optimization):** Standard practices—TanStack Router handles code splitting automatically, accessibility has established WCAG checklists, performance optimization should be data-driven.

## Confidence Assessment

| Area         | Confidence | Notes                                                                                                                                                         |
| ------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack        | HIGH       | Based on official React 19 docs, Jotai docs, React Hook Form docs—all HIGH confidence sources. Stack aligns with 2025 industry standards.                     |
| Features     | HIGH       | Source quality from React docs, react-error-boundary repo, Zod docs. Table stakes vs differentiators clearly distinguished. Feature dependencies well-mapped. |
| Architecture | HIGH       | Patterns from official React documentation, Jotai docs, TanStack Router docs. Four-layer architecture is standard. Anti-patterns well-documented.             |
| Pitfalls     | HIGH       | Source quality from official React docs, React GitHub issues, security best practices. Pitfalls mapped to specific prevention strategies.                     |

**Overall confidence:** HIGH

### Gaps to Address

- **Markdown sanitization specifics:** DOMPurify is recommended, but exact whitelist configuration for markdown (allowing headings, lists, links while blocking scripts) needs validation during Phase 1 implementation. Test with malicious payload samples.
- **ATS validation rules:** Template validation feature requires understanding of ATS (Applicant Tracking System) requirements. External research needed during Phase 2 if smart validation includes ATS compatibility checks.
- **Offline sync strategy:** Service Worker offline mode requires conflict resolution strategy (last-write-wins, merge, prompt user). Not critical for MVP but should be designed before Phase 5.
- **Performance baselines:** No current performance data. Phase 4 should establish baseline metrics (first contentful paint, time to interactive) before optimization. React DevTools Profiler will provide data.

## Sources

### Primary (HIGH confidence)

- React 19 Official Documentation — https://react.dev/blog/2024/12/05/react-19 — Actions, useOptimistic, error handling, strict mode
- React Hook Form Documentation — https://react-hook-form.com/get-started — Form validation patterns, shadcn/ui integration via Controller
- Zod Documentation — https://zod.dev — Schema validation, refine() for conditional validation, TypeScript-first
- Jotai Documentation — https://jotai.org/docs/basics/primitives — Atomic state management, derived atoms, fine-grained reactivity
- TanStack Router Documentation — https://tanstack.com/router/latest — Route-based data loading, type-safe params, automatic code splitting
- Biome Documentation — https://biomejs.dev/guides/getting-started/ — Linting, formatting, 100x faster than ESLint
- shadcn/ui Documentation — https://ui.shadcn.com/docs/components — Radix UI primitives, accessibility by default, component patterns

### Secondary (MEDIUM confidence)

- react-error-boundary Repository — https://github.com/bvaughn/react-error-boundary — Error boundary patterns, fallback UI strategies
- React Testing Library — https://testing-library.com/docs/react-testing-library/intro — User-centric testing approach, standard for React
- TypeScript tsconfig Reference — https://www.typescriptlang.org/tsconfig — Strict mode options, bulletproof configuration
- Pitfalls Research — Community consensus on React anti-patterns, common mistakes, recovery strategies

### Tertiary (LOW confidence)

- ATS Compatibility Standards — External research needed; resume parsing systems vary by vendor
- Performance Baselines — No current data; must be collected during Phase 4 profiling

---

_Research completed: February 11, 2026_
_Ready for roadmap: yes_
