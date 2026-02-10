# Requirements: Oh My CV - Complete React Migration

**Defined:** 2025-02-10
**Core Value:** Users can create and manage resumes with markdown that look great and export perfectly.

## v1 Requirements

Requirements for bulletproof React migration - deleting Vue entirely and implementing production-ready architecture.

### Foundation (SEC)

- [ ] **SEC-01**: Upgrade to React 19
- [ ] **SEC-02**: Integrate DOMPurify for XSS sanitization
- [ ] **SEC-03**: Implement error boundaries at route level
- [ ] **SEC-04**: Add root-level error boundary with fallback UI
- [ ] **SEC-05**: Enable all TypeScript strict mode options
- [ ] **SEC-06**: Remove all `@ts-ignore` and `any` types
- [ ] **SEC-07**: Configure Biome for strict linting and formatting
- [ ] **SEC-08**: Delete Vue/Nuxt site (`site/` directory)

### Core Editor (CORE)

- [ ] **CORE-01**: Consolidate duplicate type definitions
- [ ] **CORE-02**: Integrate React Hook Form for form handling
- [ ] **CORE-03**: Implement Zod validation schemas for resume data
- [ ] **CORE-04**: Add shadcn/ui Controller pattern for form components
- [ ] **CORE-05**: Refactor storage service for remote storage abstraction
- [ ] **CORE-06**: Implement auto-save with debouncing
- [ ] **CORE-07**: Add toast notifications for all user actions
- [ ] **CORE-08**: Implement loading states for async operations

### Editor Enhancements (EDITOR)

- [ ] **EDIT-01**: Add real-time markdown preview with Jotai atoms
- [ ] **EDIT-02**: Implement context-aware smart validation
- [ ] **EDIT-03**: Add optimistic UI updates using React 19 hooks
- [ ] **EDIT-04**: Add loading skeletons for Suspense boundaries
- [ ] **EDIT-05**: Implement form field-level error display

### Quality (QUAL)

- [ ] **QUAL-01**: Configure TanStack Router automatic code splitting
- [ ] **QUAL-02**: Conduct accessibility audit (WCAG compliance)
- [ ] **QUAL-03**: Fix keyboard navigation issues
- [ ] **QUAL-04**: Add ARIA labels to interactive elements
- [ ] **QUAL-05**: Performance profiling and baseline measurement
- [ ] **QUAL-06**: Optimize bundle size based on profiling

### Production (PROD)

- [ ] **PROD-01**: Integrate Sentry for error tracking
- [ ] **PROD-02**: Configure PWA manifest for offline capability
- [ ] **PROD-03**: Implement Service Worker for offline caching
- [ ] **PROD-04**: Add analytics integration (optional)
- [ ] **PROD-05**: Remove Vue-specific packages from workspace
- [ ] **PROD-06**: Update package.json scripts for production build

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Features

- **ADV-01**: Undo/redo for form edits
- **ADV-02**: Template library with pre-built resume templates
- **ADV-03**: ATS compatibility validation
- **ADV-04**: Resume export to multiple formats (PDF, DOCX)
- **ADV-05**: Collaboration/sharing features
- **ADV-06**: Remote storage integration with cloud sync

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature              | Reason                                                 |
| -------------------- | ------------------------------------------------------ |
| OAuth authentication | Local-only app for v1; not needed for current use case |
| Real-time chat       | Out of scope for resume builder; not core value        |
| Video resume support | High complexity, storage costs, not MVP                |
| Mobile app           | Web-first approach; can be added later                 |
| Full test suite      | User not familiar with testing; basic tests only       |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase   | Status  |
| ----------- | ------- | ------- |
| SEC-01      | Phase 1 | Pending |
| SEC-02      | Phase 1 | Pending |
| SEC-03      | Phase 1 | Pending |
| SEC-04      | Phase 1 | Pending |
| SEC-05      | Phase 1 | Pending |
| SEC-06      | Phase 1 | Pending |
| SEC-07      | Phase 1 | Pending |
| SEC-08      | Phase 1 | Pending |
| CORE-01     | Phase 2 | Pending |
| CORE-02     | Phase 2 | Pending |
| CORE-03     | Phase 2 | Pending |
| CORE-04     | Phase 2 | Pending |
| CORE-05     | Phase 2 | Pending |
| CORE-06     | Phase 2 | Pending |
| CORE-07     | Phase 2 | Pending |
| CORE-08     | Phase 2 | Pending |
| EDIT-01     | Phase 3 | Pending |
| EDIT-02     | Phase 3 | Pending |
| EDIT-03     | Phase 3 | Pending |
| EDIT-04     | Phase 3 | Pending |
| EDIT-05     | Phase 3 | Pending |
| QUAL-01     | Phase 4 | Pending |
| QUAL-02     | Phase 4 | Pending |
| QUAL-03     | Phase 4 | Pending |
| QUAL-04     | Phase 4 | Pending |
| QUAL-05     | Phase 4 | Pending |
| QUAL-06     | Phase 4 | Pending |
| PROD-01     | Phase 5 | Pending |
| PROD-02     | Phase 5 | Pending |
| PROD-03     | Phase 5 | Pending |
| PROD-04     | Phase 5 | Pending |
| PROD-05     | Phase 5 | Pending |
| PROD-06     | Phase 5 | Pending |

**Coverage:**

- v1 requirements: 32 total
- Mapped to phases: 32
- Unmapped: 0 ✓

---

_Requirements defined: 2025-02-10_
_Last updated: 2025-02-10 after initial definition_
