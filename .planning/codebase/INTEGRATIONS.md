# External Integrations

**Analysis Date:** 2026-02-10

## APIs & External Services

**Fonts:**

- Google Fonts API - Google Fonts loading and management
  - SDK/Client: `@ohmycv/google-fonts-loader` (custom package)
  - Auth: `NUXT_PUBLIC_GOOGLE_FONTS_KEY` (optional env var)
  - Usage: Dynamic font loading in resume editor
  - Caching: PWA service worker caches Google Fonts for 365 days

**Case Checking:**

- case-police npm package - Capitalization correction
  - Client: `@ohmycv/case-police` (browser wrapper)
  - Purpose: Check and fix improper capitalization in resume text
  - Dictionary: Included in `packages/case-police/dict/` (abbreviates.json, brands.json, general.json, products.json, softwares.json)

## Data Storage

**Databases:**

- None (client-side only)

**File Storage:**

- Local filesystem (IndexedDB/WebSQL/localStorage via localforage)
  - Client: `localforage` package
  - Store name: "oh-my-cv"
  - Collection: "resumes"
  - Purpose: Store resume data (markdown, CSS, styles) in browser
  - Implementation: `react-site/src/services/storage.ts`, `site/src/utils/storage/localForage.ts`
  - TODO notes indicate future PGlite support planned

**Caching:**

- PWA service worker caching
  - Google Fonts: Cache-first strategy, 365-day expiration
  - Static assets: `.js`, `.css`, `.html`, `.otf`, `.ttf`, `.woff2`, `.png`, `.svg`
  - Max file size: 16MB

## Authentication & Identity

**Auth Provider:**

- None (client-side only application)
  - No user accounts or authentication
  - All data stored locally in browser

## Monitoring & Observability

**Error Tracking:**

- None detected
  - No Sentry, LogRocket, or similar services

**Logs:**

- Console only
  - Browser console.log/error for debugging
  - No centralized logging service

## CI/CD & Deployment

**Hosting:**

- GitHub Pages - Static site hosting
  - Deployment from: `site/dist` directory
  - URL: `https://ohmycv.app` (configured in site/nuxt.config.ts)
  - Branch: `main`
  - Environment: github-pages

**CI Pipeline:**

- GitHub Actions - `.github/workflows/deploy.yaml`
  - Trigger: Push to `main` branch
  - Runner: ubuntu-latest
  - Node version: 20
  - Package manager: pnpm
  - Cache: pnpm store cache
  - Build command: `pnpm release`
  - Deploy action: `actions/deploy-pages@v4`
  - Secrets used: `GOOGLE_FONTS_KEY` (optional)

**Release Workflow:**

- pnpm workspace release - `package.json` scripts
  - `pnpm build:pkg` - Build all packages
  - `pnpm build` - Build site
  - `pnpm release:pkg` - Publish packages to npm
  - Version bump: bumpp tool
  - Tag and push: Automated via bumpp

## Environment Configuration

**Required env vars:**

- None (all features work without env vars)

**Optional env vars:**

- `NUXT_PUBLIC_GOOGLE_FONTS_KEY` - Google Fonts API key for enhanced font loading
  - If empty: Basic Google Fonts functionality still works
  - Location: GitHub Actions secret for production, local for development

**Secrets location:**

- GitHub Secrets (for CI/CD)
- `.env` files - None detected in repository
  - Configured as `googleFontsKey: ""` in runtime config

## Webhooks & Callbacks

**Incoming:**

- None

**Outgoing:**

- Google Fonts API (public, no auth)
  - Fetch font metadata and stylesheets
  - Pattern: `https://fonts.googleapis.com/*`
  - Cached by PWA service worker

## Third-Party CDN Usage

**Icons:**

- Iconify - Icon loading
  - Via markdown-it-iconify and Iconify components
  - Used in resume content for icons (e.g., `data-icon="tabler:phone"`)
  - Font sources: `vscode-icons`, `logos`, `charm`, `tabler`

**Font Sources:**

- Google Fonts CDN - Font files delivery
  - Used by `@ohmycv/google-fonts-loader`
  - Fonts loaded dynamically based on resume configuration

---

_Integration audit: 2026-02-10_
