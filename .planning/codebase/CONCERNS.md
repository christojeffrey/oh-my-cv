# Codebase Concerns

**Analysis Date:** 2026-02-10

## Tech Debt

**Duplicate Implementations (React vs Vue sites):**

- Issue: Two complete implementations exist - `site/` (Vue/Nuxt) and `react-site/` (React). React migration is marked complete but both codebases remain.
- Files: `site/src/`, `react-site/src/`
- Impact: Increases maintenance burden, potential confusion over which is "active", duplicate code to maintain
- Fix approach: Remove or archive `site/` directory after verifying React site is fully functional and all features are migrated

**Duplicate Type Definitions:**

- Issue: Core types defined in multiple locations causing maintenance overhead and risk of divergence
- Files: `react-site/src/atoms/data.ts`, `react-site/src/constants/index.ts`, `react-site/src/services/storage.ts`, `react-site/src/services/fonts.ts`, `site/src/utils/storage/db.ts`
  - `Font` interface (5 locations)
  - `ResumeStyles` interface (2 locations)
  - `DbResume` interface (2 locations)
- Impact: Type changes require updates in multiple files, risk of inconsistencies
- Fix approach: Consolidate types into shared package (`@renovamen/utils`) or single source-of-truth file

**Duplicate Service Implementations:**

- Issue: StorageService implemented separately for React and Vue sites with similar but divergent logic
- Files: `react-site/src/services/storage.ts`, `site/src/utils/storage/index.ts`
- Impact: Bug fixes/features need to be implemented twice, potential for behavioral differences
- Fix approach: Move storage service to shared package with platform-specific adapters

**Duplicate Markdown Services:**

- Issue: MarkdownService implementation duplicated with slight variations
- Files: `react-site/src/utils/markdown.ts` (124 lines), `site/src/utils/markdown.ts` (147 lines)
- Impact: Plugin configuration changes need to be duplicated, maintenance overhead
- Fix approach: Move markdown service to shared package, export configured instance

## Known Bugs

**Missing Toast Notifications:**

- Symptoms: Multiple TODO comments indicate toast notifications for error messages are planned but not implemented
- Files: `site/src/components/editor/toolbar/file/Import.vue:103`, `site/src/composables/monaco/index.ts:39`, `site/src/utils/storage/index.ts:45,56,70,84,102,105,123,126,137`
- Trigger: Any error in storage operations
- Workaround: Errors logged to console only, users not notified
- Fix approach: Implement toast notification system (already imported as `useToast()` in some places)

**Incorrect Error Message:**

- Symptoms: Console error says "Failed to missing resume" instead of "Failed to duplicate resume"
- Files: `react-site/src/services/storage.ts:388`
- Trigger: Duplicate resume operation fails
- Workaround: None
- Fix approach: Change error message to "Failed to duplicate resume"

## Security Considerations

**XSS via dangerouslySetInnerHTML:**

- Risk: User-controlled markdown rendered without sanitization
- Files: `react-site/src/components/shared/Markdown.tsx:14`
- Current mitigation: None explicit; markdown-it doesn't sanitize by default
- Recommendations: Implement DOMPurify or similar sanitization before rendering HTML

**Unvalidated Import Data:**

- Risk: Import functionality doesn't fully validate imported JSON structure
- Files: `site/src/utils/storage/index.ts:167-208`, `react-site/src/services/storage.ts:410-450`
- Current mitigation: Basic version/format validation only
- Recommendations: Add schema validation (e.g., Zod) for imported data

## Performance Bottlenecks

**Large Storage Service File:**

- Problem: Monolithic storage service with all operations (458 lines)
- Files: `react-site/src/services/storage.ts`
- Cause: All CRUD operations, import/export, styling in single class
- Improvement path: Split into separate modules (CRUD, import/export, migration)

**LocalForage Sequential Operations:**

- Problem: Multiple sequential async operations without batching
- Files: `react-site/src/services/storage.ts:38-48` (getResumes loop)
- Cause: Iterating through keys and fetching items one by one
- Improvement path: Use Promise.all() for parallel item fetching where possible

**ID Generation Collision Risk:**

- Problem: Date.now() for ID generation could cause collisions in rapid creation
- Files: `react-site/src/services/storage.ts:57`, `react-site/src/services/storage.ts:442`
- Cause: Timestamp-based IDs with no collision detection
- Improvement path: Use UUID or timestamp + random suffix

## Fragile Areas

**Storage Error Handling:**

- Files: `react-site/src/services/storage.ts`, `site/src/utils/storage/index.ts`
- Why fragile: All storage methods return empty/null on error without re-throwing or notifying users
- Safe modification: Add error boundary in React components, implement toast notifications
- Test coverage: No tests for error scenarios

**Markdown Plugin Type Safety:**

- Files: `react-site/src/utils/markdown.ts:38-42`, `site/src/utils/markdown.ts`
- Why fragile: TypeScript type checking disabled with @ts-ignore/@ts-expect-error and `as any` assertions
- Safe modification: Create proper type definitions for markdown plugins or migrate to typed alternatives
- Test coverage: No tests for markdown rendering edge cases

**Browser-Only Code Without SSR Checks:**

- Files: `react-site/src/components/editor/Preview.tsx:33-34`, `react-site/src/components/editor/ResizeHandle.tsx:28,34`
- Why fragile: Direct `window` access will break if SSR is ever enabled
- Safe modification: Wrap in `useEffect` or add `if (typeof window !== 'undefined')` guards
- Test coverage: No SSR/SSG tests

## Scaling Limits

**LocalForage Storage:**

- Current capacity: Browser localStorage limits (~5-10MB) or IndexedDB (~50MB+ depending on quota)
- Limit: Large resumes or many resumes may hit storage quotas
- Scaling path: Implement IndexedDB as primary storage with fallback, add storage quota warnings

**Font Loading:**

- Current capacity: All Google Fonts loaded for all resumes
- Limit: Network requests scale with font variety
- Scaling path: Implement font lazy loading, deduplicate font requests across resumes

## Dependencies at Risk

**Vue-Specific Packages:**

- Risk: Will become obsolete if Vue site is removed
- Impact: `@ohmycv/vue-shortcuts`, `@ohmycv/vue-smart-pages`, `@ohmycv/vue-zoom`
- Migration plan: React equivalents already implemented or not needed:
  - `vue-smart-pages` → `@ohmycv/react-smart-pages` (already exists)
  - `vue-shortcuts` → Not used in React site (consider if needed)
  - `vue-zoom` → Manual zoom implementation in React site

**Untyped Markdown Plugins:**

- Risk: Missing type definitions for markdown-it plugins
- Impact: `markdown-it-deflist` lacks proper types, requires @ts-expect-error
- Migration plan: Create type declaration files in project or find typed alternatives

## Missing Critical Features

**Comprehensive Error Notification System:**

- Problem: Users are not notified of errors (only console logs)
- Blocks: User awareness of failed operations
- Files: All storage operations have TODO comments for toast notifications

**Database Migration System:**

- Problem: TODO comment indicates migration system not fully implemented
- Blocks: Data structure changes require manual migration
- Files: `site/src/utils/storage/index.ts:163`

**Backup/Export Versioning:**

- Problem: No versioned export format that could handle schema evolution
- Blocks: Future data model changes will break existing exports
- Files: `react-site/src/services/storage.ts:393-406`

## Test Coverage Gaps

**No Unit Tests:**

- What's not tested: All business logic (storage, markdown, fonts, etc.)
- Files: All source files in `packages/src`, `react-site/src`, `site/src`
- Risk: Refactoring breaks functionality silently, regressions go undetected
- Priority: High

**No Integration Tests:**

- What's not tested: Component interactions, state management, data flow
- Files: React/Vue components, routing, state stores
- Risk: Feature changes break user workflows
- Priority: High

**No E2E Tests:**

- What's not tested: Complete user journeys (create, edit, export resume)
- Files: Critical user paths
- Risk: Critical bugs reach production
- Priority: Medium

**No Test Configuration:**

- What's not tested: Testing infrastructure not set up
- Files: Missing `vitest.config.*`, `jest.config.*` at project root
- Risk: Writing tests difficult without proper setup
- Priority: High (precondition for other testing)

---

_Concerns audit: 2026-02-10_
