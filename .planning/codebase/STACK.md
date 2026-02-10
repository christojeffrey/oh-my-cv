# Technology Stack

**Analysis Date:** 2026-02-10

## Languages

**Primary:**

- TypeScript 5.5.3 - All source code (TypeScript strict mode enabled)
- JavaScript - Runtime compilation via bundlers

**Secondary:**

- Vue 3.4.31 - Component framework (site/)
- React 18.3.1 - Component framework (react-site/)

## Runtime

**Environment:**

- Node.js 20 - Required for development and build (from CI/CD config)

**Package Manager:**

- pnpm 9.4.0 - Workspace-based monorepo management
- Lockfile: pnpm-lock.yaml present (lockfileVersion 9.0)

## Frameworks

**Core:**

- Vue 3 - Frontend framework for site/
  - Nuxt 3.12.3 - Meta-framework for Vue app
  - Pinia 2.1.7 - State management
  - VueUse 10.11.0 - Vue composition utilities
  - radix-vue 1.9.0 - Headless UI components
- React 18.3.1 - Frontend framework for react-site/
  - Vite 7.2.4 - Build tool and dev server
  - @tanstack/react-router 1.154.13 - File-based routing
  - Jotai 2.16.2 - Primitive state management
  - @radix-ui/react-\* - Headless UI components

**Testing:**

- Not detected - No test files or testing framework configured

**Build/Dev:**

- tsup 8.5.1 - Package bundler for npm packages
- Vite 7.2.4 - React app build tool
- Nuxt 3.12.3 - Vue app build tool
- TypeScript 5.5.3 - Type checking and compilation

## Key Dependencies

**Critical:**

- markdown-it 14.1.0 - Markdown parsing for resume content
- KaTeX 0.16.11 - LaTeX math rendering in resumes
- @monaco-editor/react 4.7.0 / monaco-editor 0.50.0 - Code editor component
- localforage 1.10.0 - Client-side storage abstraction (IndexedDB/WebSQL/localStorage)

**Infrastructure:**

- Vite - Build tool for React site
- Nuxt - Build tool and SSR framework for Vue site
- pnpm-workspaces - Monorepo package management
- tsup - Zero-config TypeScript bundler for packages

**UI Frameworks:**

- shadcn-ui 0.9.5 / shadcn-nuxt 0.10.4 - Component library built on Radix
- tailwindcss 3.4.10 - Utility-first CSS framework (React)
- unocss 0.61.2 - Atomic CSS engine (Vue)
- tailwindcss-animate 1.0.7 / unocss-preset-animations - CSS animations

**Markdown Processing:**

- markdown-it 14.1.0 - Core markdown parser
- remark-gfm 4.0.1 - GitHub Flavored Markdown
- remark-math 6.0.0 - Math syntax parsing
- rehype-katex 7.0.1 - KaTeX rendering
- markdown-it-deflist 3.0.0 - Definition lists
- markdown-it-link-attributes 4.0.1 - Link attributes
- Custom markdown-it plugins (packages/markdown-it-\*)

**Data Handling:**

- js-yaml 4.1.0 - YAML parsing for front matter
- @ohmycv/front-matter - Custom front matter parser
- case-police 0.6.1 - Capitalization checking

## Configuration

**Environment:**

- Environment variables: NUXT_PUBLIC_GOOGLE_FONTS_KEY (optional Google Fonts API key)
- Configured via: `site/nuxt.config.ts`, `react-site/vite.config.ts`
- Runtime config: Public config only (no server secrets)

**Build:**

- `pnpm-workspace.yaml` - Workspace configuration
- `tsconfig.base.json` - Base TypeScript configuration
- `react-site/vite.config.ts` - Vite configuration
- `site/nuxt.config.ts` - Nuxt configuration
- `site/unocss.config.ts` - UnoCSS configuration
- `react-site/tailwind.config.js` - Tailwind configuration

**Linting/Formatting:**

- `biome.json` - Biome linter and formatter config
- `eslint.config.js` - ESLint config (uses @renovamen/eslint-config)
- `.prettierrc` - Not present (Biome used instead)

## Platform Requirements

**Development:**

- Node.js 20+ (from CI/CD)
- pnpm 9.4.0+ (packageManager in root package.json)
- Modern browser (React 18+ features)

**Production:**

- GitHub Pages - Static hosting (from CI/CD)
- PWA support - Service worker for offline capability
- Static site generation - Nuxt generate

---

_Stack analysis: 2026-02-10_
