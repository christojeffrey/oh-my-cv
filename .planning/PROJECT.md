# Oh My CV - Complete React Migration

## What This Is

A resume/CV builder that lets users create, customize, and export professional resumes using markdown. The app currently has both Vue/Nuxt and React implementations - this project finalizes the React migration by removing Vue entirely and implementing bulletproof React architecture.

## Core Value

Users can create and manage resumes with markdown that look great and export perfectly.

## Requirements

### Validated

<!-- From existing React implementation - these work and stay -->

- ✓ Create, edit, save resumes with Monaco editor
- ✓ Real-time preview with smart pagination
- ✓ Customization: fonts, colors, spacing, paper size
- ✓ Export to PDF (via browser print)
- ✓ Import/export resume data (JSON)
- ✓ Dark mode support
- ✓ i18n: English, Spanish, Chinese
- ✓ PWA with offline capability
- ✓ Local storage (IndexedDB via LocalForage)

### Active

<!-- Scope for this migration -->

- [ ] Delete Vue/Nuxt site and all Vue-specific code
- [ ] Remove Vue packages from workspace
- [ ] Consolidate duplicate type definitions to single source
- [ ] Consolidate duplicate services (storage, markdown)
- [ ] Implement bulletproof React architecture patterns
- [ ] Add XSS sanitization for markdown rendering
- [ ] Implement comprehensive error notifications
- [ ] Clean up storage service architecture
- [ ] Prepare storage abstraction for remote backend
- [ ] Add TypeScript strict mode with full type coverage
- [ ] Implement proper error boundaries
- [ ] Set up linting/testing infrastructure

### Out of Scope

- Remote storage implementation (future milestone)
- Test coverage (you're not familiar with it yet)
- OAuth authentication (current is local-only)

## Context

**Current State:**

- React site (`react-site/`) is feature-complete and working
- Vue site (`site/`) is legacy but still present
- Monorepo with shared packages that support both frameworks
- Tech stack: React 18.3, TypeScript, TanStack Router, Jotai, shadcn/ui, Tailwind

**Technical Debt:**

- Duplicate implementations across React and Vue codebases
- Duplicate type definitions in multiple files
- Large monolithic storage service
- Missing error notifications for failures
- XSS risk from unsanitized markdown
- No test infrastructure

**From Codebase Map:**

- React migration is already complete feature-wise
- Architecture has layered structure (routes/components/atoms/services/utils)
- All core features working in React site

## Constraints

- **Tech Stack**: Must use React with TypeScript - no Vue
- **UI Library**: shadcn/ui for all components
- **Architecture Quality**: Bulletproof React patterns - no shortcuts
- **Data Persistence**: Must support migration from local (IndexedDB) to remote storage
- **Timeline**: Quality over speed - take time to get it right
- **User Data**: Existing user resumes must remain accessible after migration

## Key Decisions

| Decision                   | Rationale                                          | Outcome   |
| -------------------------- | -------------------------------------------------- | --------- |
| Delete Vue entirely        | Duplicate code maintenance burden, React is future | — Pending |
| Bulletproof React patterns | "Always get it right" - maintainability priority   | — Pending |
| shadcn/ui for all UI       | Better tooling, consistent design system           | — Pending |
| Keep existing packages     | Shared utilities are framework-agnostic            | — Pending |
| XSS sanitization required  | Security vulnerability flagged in codebase map     | — Pending |

---

_Last updated: 2025-02-10 after initialization_
