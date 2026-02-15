# Codebase Structure

**Analysis Date:** 2026-02-10

## Directory Layout

```
[project-root]/
├── .claude/               # Claude AI agent configuration
├── .github/               # GitHub workflows and configuration
├── .planning/             # Planning documents (this directory)
│   └── codebase/          # Codebase mapping documents
├── .sisyphus/             # Draft documents
├── node_modules/          # Root dependencies (pnpm)
├── packages/              # Shared packages
│   ├── case-police/       # Case correction library
│   ├── dynamic-css/       # Dynamic CSS injection
│   ├── front-matter/      # Front matter parser
│   ├── google-fonts-loader/ # Google fonts loading
│   ├── markdown-it-cross-ref/ # Markdown cross-reference plugin
│   ├── markdown-it-katex/ # KaTeX plugin for markdown
│   ├── markdown-it-latex-cmds/ # LaTeX commands plugin
│   ├── react-smart-pages/ # React smart pagination hook
│   ├── react-zoom/        # React zoom component
│   ├── utils/             # General utilities
│   ├── vue-shortcuts/     # Vue keyboard shortcuts
│   ├── vue-smart-pages/   # Vue smart pagination component
│   └── vue-zoom/          # Vue zoom component
├── react-site/            # Main React application
│   ├── public/            # Static assets
│   │   └── locales/       # I18n locale files
│   ├── src/               # React source code
│   │   ├── atoms/         # Jotai state atoms
│   │   ├── components/    # React components
│   │   ├── configs/       # Configuration files
│   │   ├── constants/     # Application constants
│   │   ├── lib/           # Helper utilities
│   │   ├── locales/       # Translation files
│   │   ├── routes/        # TanStack Router file-based routes
│   │   ├── services/      # Business logic services
│   │   ├── utils/         # Utility wrappers for packages
│   │   ├── index.css      # Global styles
│   │   ├── main.tsx       # Application entry point
│   │   ├── routeTree.gen.ts # Generated route tree
│   │   └── types.d.ts     # Type definitions
│   ├── dist/              # Build output (generated)
│   ├── package.json       # React app dependencies
│   ├── vite.config.ts     # Vite configuration
│   └── tailwind.config.js # Tailwind CSS configuration
├── site/                  # Legacy Vue/Nuxt application
│   ├── public/            # Static assets
│   ├── src/               # Vue source code
│   │   ├── assets/        # Vue assets
│   │   ├── components/    # Vue components
│   │   ├── composables/   # Vue composables
│   │   ├── i18n/          # I18n configuration
│   │   ├── pages/         # Vue router pages
│   │   ├── public/        # Public assets
│   │   ├── utils/         # Vue utilities
│   │   └── app.vue        # Vue app entry
│   ├── node_modules/      # Vue app dependencies
│   ├── package.json       # Vue app dependencies
│   ├── nuxt.config.ts     # Nuxt configuration
│   └── unocss.config.ts   # UnoCSS configuration
├── biome.json             # Biome linter configuration
├── eslint.config.js       # ESLint configuration
├── package.json           # Root package.json (monorepo scripts)
├── pnpm-lock.yaml         # pnpm lockfile
├── pnpm-workspace.yaml    # pnpm workspace configuration
└── tsconfig.base.json     # Base TypeScript configuration
```

## Directory Purposes

**`packages/`:**

- Purpose: Shared libraries and components used by both React and Vue applications
- Contains: Framework-agnostic utilities, React hooks, Vue components, markdown plugins
- Key files: Each package has `src/index.ts` (main export), `package.json`, `dist/` (build output)

**`react-site/`:**

- Purpose: Main React application for resume editing and management
- Contains: Full React application with routing, state management, and UI components
- Key files:
  - `src/main.tsx` - Application entry point
  - `src/routes/` - TanStack Router file-based routes
  - `vite.config.ts` - Vite bundler configuration with package aliases

**`react-site/src/atoms/`:**

- Purpose: Jotai atomic state for global application state
- Contains: State atoms for CV data, styles, and UI state
- Key files: `data.ts`, `style.ts`, `ui.ts`, `index.ts` (barrel export)

**`react-site/src/components/`:**

- Purpose: React UI components organized by domain
- Contains:
  - `dashboard/` - Dashboard components (ResumeCard, NewResume, FileActions, Dashboard)
  - `editor/` - Editor components (CodeEditor, Preview, EditorSidebar, EditorToolbar, ResizeHandle, toolbar/)
  - `shared/` - Shared layout components (Header, Logo, BrandName, ToggleDark, Markdown)
  - `ui/` - Base UI components from shadcn/ui
- Key files: Each component exports itself, no barrel files (import directly)

**`react-site/src/components/editor/toolbar/`:**

- Purpose: Editor toolbar sub-components for customization options
- Contains: Individual toolbar components (ToolbarFile, ToolbarPaper, ToolbarThemeColor, etc.)
- Key files: Each toolbar option has its own component file

**`react-site/src/services/`:**

- Purpose: Business logic and external service integrations
- Contains: `storage.ts` (LocalForage), `fonts.ts` (Google Fonts), `toast.ts` (Sonner wrapper)
- Key files: Each service exports a singleton instance (e.g., `export const storageService = new StorageService()`)

**`react-site/src/utils/`:**

- Purpose: Utility functions wrapping shared packages for React-specific usage
- Contains: `case-police.ts`, `dynamic-css.ts`, `front-matter.ts`, `google-fonts-loader.ts`, `markdown.ts`
- Key files: `index.ts` (barrel export)

**`react-site/src/routes/`:**

- Purpose: TanStack Router file-based routing
- Contains: Route component files
- Key files:
  - `__root.tsx` - Root layout with Header
  - `index.tsx` - Dashboard route
  - `editor.$id.tsx` - Editor route with dynamic id
  - `landing.tsx` - Landing page route

**`react-site/src/configs/`:**

- Purpose: Application configuration modules
- Contains: `i18n.ts` (i18next config), `pwa.ts` (PWA config)
- Key files: Each config exports configured instance

**`react-site/src/constants/`:**

- Purpose: Application-wide constants (paper sizes, presets, fonts)
- Contains: `index.ts`
- Key files: Exports constants for paper sizes, margins, font presets, preset colors

**`react-site/src/lib/`:**

- Purpose: Helper utilities and shared code
- Contains: `utils.ts` (cn utility for class merging)
- Key files: `cn()` function using clsx and tailwind-merge

**`react-site/src/locales/`:**

- Purpose: Translation files for i18n
- Contains: Translation JSON files
- Key files: `en.ts`, `es.ts`, `zh-cn.ts`

**`site/`:**

- Purpose: Legacy Vue/Nuxt application (being phased out, replaced by react-site)
- Contains: Vue/Nuxt application structure similar to react-site but using Vue
- Key files: `src/app.vue`, `nuxt.config.ts`, `unocss.config.ts`

**`.planning/codebase/`:**

- Purpose: Codebase mapping and analysis documents
- Contains: This document and ARCHITECTURE.md
- Key files: `STRUCTURE.md`, `ARCHITECTURE.md`

## Key File Locations

**Entry Points:**

- `react-site/src/main.tsx`: React application bootstrap (router, i18n provider)
- `react-site/src/routes/__root.tsx`: Root layout with Header and Outlet
- `react-site/src/routes/index.tsx`: Dashboard page
- `react-site/src/routes/editor.$id.tsx`: Editor page with dynamic id
- `site/src/app.vue`: Legacy Vue application entry

**Configuration:**

- `package.json`: Root monorepo scripts and dev dependencies
- `pnpm-workspace.yaml`: pnpm workspace configuration
- `vite.config.ts`: Vite bundler configuration with package aliases
- `tailwind.config.js`: Tailwind CSS configuration
- `tsconfig.base.json`: Base TypeScript configuration for all packages
- `biome.json`: Biome linter and formatter configuration

**Core Logic:**

- `react-site/src/services/storage.ts`: Resume data persistence (LocalForage)
- `react-site/src/services/fonts.ts`: Google Fonts loading
- `react-site/src/services/toast.ts`: Toast notifications
- `react-site/src/utils/markdown.ts`: Markdown rendering service
- `react-site/src/atoms/data.ts`: CV data and resume style atoms

**Testing:**

- No test files detected in current codebase

**Build Output:**

- `react-site/dist/`: React application build output
- `packages/*/dist/`: Package build outputs (ESM and CJS)

## Naming Conventions

**Files:**

- Components: PascalCase (e.g., `ResumeCard.tsx`, `EditorSidebar.tsx`)
- Utilities: camelCase (e.g., `storage.ts`, `markdown.ts`)
- Constants: camelCase (e.g., `index.ts` - exports named constants)
- Hooks: `use` prefix (e.g., `useSmartPages` in packages)
- Routes: File-based with `$id` for dynamic params (e.g., `editor.$id.tsx`)
- Package entry: Always `index.ts` in `src/`

**Directories:**

- Lowercase with hyphens for packages (e.g., `case-police`, `react-smart-pages`)
- Lowercase for feature directories (e.g., `atoms`, `components`, `services`)
- Lowercase for domain organization (e.g., `dashboard`, `editor`, `shared`)

## Where to Add New Code

**New Feature:**

- Primary code: `react-site/src/components/` (create new domain folder if needed)
- Services: `react-site/src/services/` (if new business logic)
- State: `react-site/src/atoms/` (if new global state)
- Routes: `react-site/src/routes/` (create new route file)
- Tests: Not currently set up (would be `react-site/src/**/*.test.tsx`)

**New Component/Module:**

- Implementation:
  - UI component: `react-site/src/components/[domain]/ComponentName.tsx`
  - Shared component: `react-site/src/components/shared/ComponentName.tsx`
  - Base UI component: `react-site/src/components/ui/component-name.tsx` (follows shadcn/ui pattern)

**Utilities:**

- Shared helpers: `packages/utils/src/` (for framework-agnostic utilities)
- React-specific helpers: `react-site/src/utils/`

**New Package:**

- Implementation: `packages/[package-name]/src/`
- Must include: `src/index.ts`, `package.json`
- Build script: `pnpm run build:pkg` uses tsup

**New Editor Toolbar Option:**

- Implementation: `react-site/src/components/editor/toolbar/Toolbar[Option].tsx`
- Import in: `react-site/src/components/editor/EditorSidebar.tsx`

## Special Directories

**`node_modules/`:**

- Purpose: Installed dependencies (pnpm)
- Generated: Yes (by pnpm install)
- Committed: No (.gitignore)

**`dist/` (in packages and react-site):**

- Purpose: Build output
- Generated: Yes (by tsup or vite build)
- Committed: No (.gitignore)

**`.planning/`:**

- Purpose: Project planning and codebase analysis documents
- Generated: Partially (by agents)
- Committed: Yes

**`.claude/`:**

- Purpose: Claude AI agent configuration
- Generated: No (manual configuration)
- Committed: Yes

**`site/node_modules/`:**

- Purpose: Legacy Vue app dependencies
- Generated: Yes (by pnpm install)
- Committed: No (.gitignore)

---

_Structure analysis: 2026-02-10_
