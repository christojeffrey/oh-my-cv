# Architecture

**Analysis Date:** 2026-02-10

## Pattern Overview

**Overall:** Monorepo with modular package architecture

**Key Characteristics:**

- Monorepo managed by pnpm workspaces containing shared packages and applications
- React application uses component-based architecture with TanStack Router for routing
- State managed via Jotai atomic state pattern
- Legacy Vue/Nuxt application maintained alongside new React implementation
- Packages are framework-agnostic utilities and components (both React and Vue versions)

## Layers

**Routes Layer:**

- Purpose: Entry points for each page/view in the application
- Location: `react-site/src/routes/`
- Contains: File-based route components using TanStack Router
- Depends on: Components, services, atoms
- Used by: TanStack Router (file-based routing system)

**Components Layer:**

- Purpose: Reusable UI components organized by domain
- Location: `react-site/src/components/`
- Contains:
  - `dashboard/` - Dashboard-specific components (ResumeCard, NewResume, FileActions, Dashboard)
  - `editor/` - Editor components (CodeEditor, Preview, EditorSidebar, EditorToolbar, ResizeHandle, toolbar/)
  - `shared/` - Shared layout components (Header, Logo, BrandName, ToggleDark, Markdown)
  - `ui/` - Base UI components from shadcn/ui (button, card, dialog, input, etc.)
- Depends on: services, atoms, utils, @ohmycv/\* packages
- Used by: Routes layer

**State Layer:**

- Purpose: Global application state management using atomic state pattern
- Location: `react-site/src/atoms/`
- Contains:
  - `data.ts` - CV data atom and resume style atom
  - `style.ts` - UI style-related atoms
  - `ui.ts` - UI state atoms
- Depends on: Jotai
- Used by: Components layer

**Services Layer:**

- Purpose: Business logic and external service integrations
- Location: `react-site/src/services/`
- Contains:
  - `storage.ts` - LocalForage-based resume persistence
  - `fonts.ts` - Google Fonts loading service
  - `toast.ts` - Toast notification wrapper around Sonner
- Depends on: localforage, @ohmycv/google-fonts-loader, sonner
- Used by: Components layer

**Utils Layer:**

- Purpose: Utility functions wrapping shared packages
- Location: `react-site/src/utils/`
- Contains:
  - `case-police.ts` - Case correction wrapper
  - `dynamic-css.ts` - Dynamic CSS injection wrapper
  - `front-matter.ts` - Front matter parsing wrapper
  - `google-fonts-loader.ts` - Font loading utilities
  - `markdown.ts` - MarkdownService class with markdown-it pipeline
  - `markdown-it-iconify.ts` - Iconify plugin for markdown
- Depends on: @ohmycv/\* packages, markdown-it ecosystem
- Used by: Components layer

**Configs Layer:**

- Purpose: Application configuration
- Location: `react-site/src/configs/`
- Contains:
  - `i18n.ts` - i18next configuration
  - `pwa.ts` - PWA configuration
- Depends on: i18next, vite-plugin-pwa
- Used by: main entry point

**Constants Layer:**

- Purpose: Application-wide constants
- Location: `react-site/src/constants/`
- Contains: `index.ts` - Paper sizes, margins, font presets, preset colors
- Depends on: None
- Used by: Components layer

**Lib Layer:**

- Purpose: Helper utilities and shared code
- Location: `react-site/src/lib/`
- Contains: `utils.ts` - Utility functions (cn for class merging)
- Depends on: clsx, tailwind-merge
- Used by: Components layer

**Packages Layer:**

- Purpose: Shared utilities and components used by applications
- Location: `packages/*/src/`
- Contains:
  - `case-police/` - Case correction library
  - `dynamic-css/` - Dynamic CSS injection
  - `front-matter/` - Front matter parser
  - `google-fonts-loader/` - Google fonts loading
  - `markdown-it-cross-ref/` - Markdown cross-reference plugin
  - `markdown-it-katex/` - KaTeX plugin for markdown
  - `markdown-it-latex-cmds/` - LaTeX commands plugin
  - `react-smart-pages/` - React smart pagination hook
  - `react-zoom/` - React zoom component
  - `utils/` - General utilities
  - `vue-shortcuts/` - Vue keyboard shortcuts
  - `vue-smart-pages/` - Vue smart pagination component
  - `vue-zoom/` - Vue zoom component
- Depends on: External dependencies (varies by package)
- Used by: React site and legacy Vue site

## Data Flow

**Resume Loading Flow:**

1. User navigates to `/editor/:id` route
2. Editor component (`react-site/src/routes/editor.$id.tsx`) loads
3. `useEffect` fetches resume data via `storageService.getResume(id)`
4. Resume data is stored in `cvDataAtom` using `setCvData()`
5. Editor components (CodeEditor, Preview) consume atom state via `useAtom(cvDataAtom)`
6. Changes to markdown/css update atom state → Preview component re-renders

**Resume Editing Flow:**

1. User types in Monaco Editor (CodeEditor component)
2. `onChange` handler updates `cvDataAtom` markdown field
3. Preview component receives updated markdown from atom
4. `markdownService.renderResume()` converts markdown → HTML
5. `useSmartPages` hook paginates HTML into pages
6. Preview component displays paginated content

**Resume Saving Flow:**

1. User clicks save button
2. FileActions component calls `storageService.updateResume(id, { markdown, css, styles })`
3. StorageService writes to LocalForage (IndexedDB)
4. Toast notification displays success message

**State Management:**

- Jotai atoms provide reactive state without context boilerplate
- Atom updates trigger re-renders in all subscribing components
- State is persisted to LocalForage for offline capability

## Key Abstractions

**MarkdownService:**

- Purpose: Converts markdown content with front matter to rendered HTML
- Examples: `react-site/src/utils/markdown.ts`
- Pattern: Service class with markdown-it plugin pipeline setup
- Methods: `renderMarkdown()`, `renderHeader()`, `renderResume()`

**StorageService:**

- Purpose: CRUD operations for resume data using LocalForage
- Examples: `react-site/src/services/storage.ts`
- Pattern: Service class wrapping IndexedDB via localforage
- Methods: `getResumes()`, `getResume()`, `createResume()`, `updateResume()`, `deleteResume()`, `duplicateResume()`, `exportToJSON()`, `importFromJson()`

**Jotai Atoms:**

- Purpose: Reactive state management without context
- Examples: `react-site/src/atoms/data.ts`, `react-site/src/atoms/style.ts`, `react-site/src/atoms/ui.ts`
- Pattern: Atomic state objects with `useAtom` hook for component access
- Key atoms: `cvDataAtom` (resume data), `resumeStyleAtom` (style settings), `darkModeAtom` (theme)

**useSmartPages:**

- Purpose: Automatically paginate HTML content into printable pages
- Examples: `packages/react-smart-pages/src/index.ts`
- Pattern: React hook returning `{ render, containerRef }`
- Algorithm: DOM measurement and element breaking based on page size/margins

**Package Exports:**

- Purpose: Reusable functionality across applications
- Examples: All packages in `packages/*/src/index.ts`
- Pattern: `export default` for main export, `export *` for named exports
- Build: tsup generates `dist/` with ESM and CJS formats

## Entry Points

**React Site Main Entry:**

- Location: `react-site/src/main.tsx`
- Triggers: Browser loads application
- Responsibilities:
  - Create React root
  - Initialize TanStack Router with route tree
  - Initialize i18next provider
  - Mount RouterProvider

**React Routes:**

- Location: `react-site/src/routes/`
- Files:
  - `__root.tsx` - Root layout with Header and Outlet
  - `index.tsx` - Dashboard route (`/`)
  - `editor.$id.tsx` - Editor route (`/editor/:id`)
  - `landing.tsx` - Landing/marketing page route

**Legacy Vue Site Entry:**

- Location: `site/src/app.vue`
- Triggers: Browser loads legacy application
- Responsibilities: Vue application entry point (being phased out)

## Error Handling

**Strategy:** Service-level try/catch with console logging

**Patterns:**

- Services wrap async operations in try/catch blocks
- Errors are logged to console with descriptive messages
- StorageService returns `null` on failure
- Components check for null/error states before rendering
- Toast notifications displayed to user on success/error

**Example pattern (from storage.ts):**

```typescript
async getResume(id: number): Promise<DbResume | null> {
  try {
    return await this.store.getItem<DbResume>(String(id));
  } catch (error) {
    console.error("Failed to get resume:", error);
    return null;
  }
}
```

## Cross-Cutting Concerns

**Logging:** Console-based logging (service errors, component lifecycle)

**Validation:** Type validation through TypeScript strict mode

**Authentication:** Not applicable (client-side only app)

**Internationalization:** i18next with resources in `react-site/src/locales/` (en, es, zh-cn)

**Dark Mode:** Managed via `darkModeAtom` with Tailwind dark mode support

**Offline Capability:** PWA with LocalForage storage for resume data persistence

---

_Architecture analysis: 2026-02-10_
