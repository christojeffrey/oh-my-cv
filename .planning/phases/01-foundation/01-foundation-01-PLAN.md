---
phase: 01-foundation
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - react-site/package.json
  - package.json
  - pnpm-workspace.yaml
autonomous: true
user_setup: []

must_haves:
  truths:
    - React 19 and React DOM 19 are installed
    - Vue/Nuxt site directory is deleted
    - Vue-specific packages are deleted
    - root package.json no longer references site
    - pnpm-workspace.yaml no longer includes site
  artifacts:
    - path: "react-site/package.json"
      contains: '"react": "^19.0.0"'
      contains: '"react-dom": "^19.0.0"'
      contains: '"@types/react": "^19.0.0"'
      contains: '"@types/react-dom": "^19.0.0"'
    - path: "packages/vue-shortcuts"
      exists: false
    - path: "packages/vue-smart-pages"
      exists: false
    - path: "packages/vue-zoom"
      exists: false
    - path: "site"
      exists: false
    - path: "pnpm-workspace.yaml"
      not_contains: "- site"
    - path: "package.json"
      not_contains: "--filter=site"
  key_links:
    - from: "react-site/package.json"
      to: "React 19"
      via: "dependency version update"
      pattern: '"react": "\^19\.'
---

<objective>
Upgrade React to version 19 and remove the duplicate Vue/Nuxt codebase to establish a single-react architecture.

Purpose: React 19 provides improved error handling, security enhancements, and removes deprecated APIs. Deleting Vue eliminates maintenance burden of duplicate functionality.

Output: React site upgraded to React 19, Vue site and packages removed.
</objective>

<execution_context>
@C:/Users/jeff/.config/opencode/get-shit-done/workflows/execute-plan.md
@C:/Users/jeff/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-foundation/01-foundation-RESEARCH.md
@react-site/package.json
@package.json
@pnpm-workspace.yaml
@.planning/codebase/STRUCTURE.md
@.planning/codebase/STACK.md
</context>

<tasks>

<task type="auto">
  <name>Upgrade React to 19 in react-site</name>
  <files>react-site/package.json</files>
  <action>
    Update React dependencies in react-site/package.json:
    - Change "react": "^18.3.1" to "^19.0.0"
    - Change "react-dom": "^18.3.1" to "^19.0.0"
    - Change "@types/react": "^18.3.1" to "^19.0.0"
    - Change "@types/react-dom": "^18.3.1" to "^19.0.0"

    Note: TypeScript strict mode options are already enabled in tsconfig.json, no changes needed there.

  </action>
  <verify>cat react-site/package.json | grep -E "(react|@types/react)"</verify>
  <done>react-site/package.json shows React 19.0.0 and @types/react 19.0.0</done>
</task>

<task type="auto">
  <name>Delete Vue site directory</name>
  <files>site</files>
  <action>
    Remove the site/ directory and all its contents:
    rm -rf site

    This deletes the entire Vue/Nuxt application which is duplicate functionality to react-site.

  </action>
  <verify>ls -la | grep -c "^d.*site" || echo "0"</verify>
  <done>site directory no longer exists</done>
</task>

<task type="auto">
  <name>Delete Vue-specific packages</name>
  <files>packages/vue-shortcuts,packages/vue-smart-pages,packages/vue-zoom</files>
  <action>
    Remove Vue-specific packages from packages/ directory:
    rm -rf packages/vue-shortcuts
    rm -rf packages/vue-smart-pages
    rm -rf packages/vue-zoom

    These packages are only used by the Vue site and are no longer needed.

  </action>
  <verify>ls packages/ | grep -E "vue-" || echo "No vue packages"</verify>
  <done>vue-shortcuts, vue-smart-pages, vue-zoom packages deleted</done>
</task>

<task type="auto">
  <name>Update root package.json scripts</name>
  <files>package.json</files>
  <action>
    Update package.json to remove site references:
    - Change "build": "pnpm --filter=site build" to "pnpm --filter=react-site build"
    - Change "dev": "pnpm --filter=site dev" to "pnpm --filter=react-site dev"
    - Change "serve": "pnpm --filter=site serve" to "pnpm --filter=react-site serve"

    These scripts now point to react-site instead of the deleted Vue site.

  </action>
  <verify>cat package.json | grep -E "(build|dev|serve)"</verify>
  <done>root package.json scripts reference react-site instead of site</done>
</task>

<task type="auto">
  <name>Update pnpm-workspace.yaml</name>
  <files>pnpm-workspace.yaml</files>
  <action>
    Update pnpm-workspace.yaml to remove site reference:
    Change "packages: [ site, packages/* ]" to "packages: [ packages/* ]"

    The site workspace package no longer exists.

  </action>
  <verify>cat pnpm-workspace.yaml</verify>
  <done>pnpm-workspace.yaml no longer lists site as a workspace package</done>
</task>

</tasks>

<verification>
After completion:
1. Verify pnpm install completes without errors
2. Verify react-site build succeeds with tsc && vite build
3. Check that no Vue-related packages remain in node_modules
</verification>

<success_criteria>

1. React 19.0.0 and React DOM 19.0.0 are installed in react-site
2. @types/react 19.0.0 and @types/react-dom 19.0.0 are installed
3. site/ directory is deleted
4. vue-shortcuts, vue-smart-pages, vue-zoom packages are deleted
5. root package.json scripts reference react-site
6. pnpm-workspace.yaml does not include site
7. pnpm install succeeds
8. pnpm run build succeeds
   </success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-01-SUMMARY.md`
</output>
