# Roadmap: Oh My CV - Complete React Migration

## Overview

A five-phase migration from Vue to React that establishes a bulletproof React 19 architecture. Phase 1 secures the foundation with XSS prevention, error boundaries, and strict TypeScript. Phase 2 delivers the core editing experience with validation and persistence. Phase 3 enhances the editor with real-time preview and smart validation. Phase 4 ensures quality with performance and accessibility. Phase 5 prepares for production with error tracking, offline support, and package cleanup.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Secure foundation with XSS prevention, error boundaries, and strict TypeScript
- [ ] **Phase 2: Core Editor** - Form validation, persistence, and toast notifications
- [ ] **Phase 3: Editor Enhancements** - Real-time preview, smart validation, and optimistic UI
- [ ] **Phase 4: Quality & Optimization** - Performance, accessibility, and code splitting
- [ ] **Phase 5: Production Readiness** - Error tracking, offline support, and package cleanup

## Phase Details

### Phase 1: Foundation

**Goal**: Application is secure from XSS, handles errors gracefully, and has bulletproof TypeScript
**Depends on**: Nothing (first phase)
**Requirements**: SEC-01, SEC-02, SEC-03, SEC-04, SEC-05, SEC-06, SEC-07, SEC-08
**Success Criteria** (what must be TRUE):

1. Markdown rendering is safe from XSS attacks
2. Application shows friendly error messages instead of blank screens
3. TypeScript catches all type errors at compile time
4. Code follows consistent linting and formatting rules
5. Vue/Nuxt site and Vue-specific packages are removed
   **Plans**: 6 plans

Plans:

- [x] 01-01: React 19 upgrade + Vue removal (SEC-01, SEC-08)
- [x] 01-02: DOMPurify XSS protection (SEC-02)
- [ ] 01-03: ErrorBoundary components + React 19 handlers (SEC-03, SEC-04)
- [ ] 01-04: TypeScript strict mode + Biome configuration (SEC-05, SEC-07)
- [ ] 01-05: Wrap routes in error boundaries (SEC-03, SEC-04)
- [ ] 01-06: Remove @ts-ignore/any types (SEC-06)

### Phase 2: Core Editor

**Goal**: Users can edit resume data with validation that persists locally
**Depends on**: Phase 1
**Requirements**: CORE-01, CORE-02, CORE-03, CORE-04, CORE-05, CORE-06, CORE-07, CORE-08
**Success Criteria** (what must be TRUE):

1. Users can edit resume fields and see real-time validation errors
2. Users' changes save automatically with visual feedback
3. Users see loading states during async operations
4. Users receive toast notifications for all actions
5. Resume data structure is consistent across the app
   **Plans**: TBD

Plans:

- [ ] 02-01: TBD

### Phase 3: Editor Enhancements

**Goal**: Users see real-time preview and context-aware validation
**Depends on**: Phase 2
**Requirements**: EDIT-01, EDIT-02, EDIT-03, EDIT-04, EDIT-05
**Success Criteria** (what must be TRUE):

1. Users see live markdown preview as they edit
2. Users receive helpful validation messages based on field context
3. UI updates instantly when users make changes (optimistic updates)
4. Users see skeleton loaders while content loads
5. Form errors appear at the field level with clear messages
   **Plans**: TBD

Plans:

- [ ] 03-01: TBD

### Phase 4: Quality & Optimization

**Goal**: Application is fast, accessible, and properly optimized
**Depends on**: Phase 3
**Requirements**: QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06
**Success Criteria** (what must be TRUE):

1. Application loads quickly with optimal bundle size
2. Users can navigate entire app using keyboard
3. All interactive elements have proper ARIA labels
4. Application meets WCAG accessibility standards
5. Performance baselines are established and optimized
   **Plans**: TBD

Plans:

- [ ] 04-01: TBD

### Phase 5: Production Readiness

**Goal**: Application has error tracking, offline support, and clean packages
**Depends on**: Phase 4
**Requirements**: PROD-01, PROD-02, PROD-03, PROD-04, PROD-05, PROD-06
**Success Criteria** (what must be TRUE):

1. Errors are tracked and reported for debugging
2. Application works offline with cached content
3. No Vue packages remain in workspace
4. Production build scripts are configured and tested
5. PWA manifest is configured for installability
   **Plans**: TBD

Plans:

- [ ] 05-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase                     | Plans Complete | Status      | Completed  |
| ------------------------- | -------------- | ----------- | ---------- |
| 1. Foundation             | 2/6            | In progress | 2026-02-11 |
| 2. Core Editor            | 0/TBD          | Not started | -          |
| 3. Editor Enhancements    | 0/TBD          | Not started | -          |
| 4. Quality & Optimization | 0/TBD          | Not started | -          |
| 5. Production Readiness   | 0/TBD          | Not started | -          |
