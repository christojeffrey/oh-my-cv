# Draft: React Migration - Copy Everything Except Tech Stack

## User's Request

Copy everything to React, except the tech stack. Maintain look and feel. Use shadcn and jotai. Clean architecture.

## Initial Understanding

- Source: Vue site (`site/`) with full feature set
- Target: react-site
- Tech stack requirements: shadcn + jotai (already integrated)
- Quality requirement: Clean architecture, nice and clean look and feel

## Investigation Status - Phase 1 Complete

**Vue Site Analysis:**

- Built with Nuxt 3 + Pinia + UnoCSS
- Uses Vue-specific packages: vue-shortcuts, vue-smart-pages, vue-zoom
- Has rich component ecosystem

**React Site Analysis:**

- Built with Vite + React 18 + TanStack Router
- Already has shadcn + Jotai integrated
- Has basic editor and dashboard

**REACT_MIGRATION.md says migration is "complete"** - need to verify this

## Investigation Status - Phase 2 In Progress

Launched parallel agents to:

1. List all Vue components in `site/src/components/`
2. List all React components in `react-site/src/components/`
3. Compare feature parity

## Open Questions

- Is the React migration actually complete, or are there missing features?
- What Vue components don't have React equivalents?
- Are there UI/UX differences?
