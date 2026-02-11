---
phase: 01-foundation
plan: 04
type: execute
wave: 2
depends_on: []
files_modified:
  - react-site/tsconfig.json
  - biome.json
autonomous: true
user_setup: []

must_haves:
  truths:
    - All TypeScript strict mode options are enabled
    - Biome is configured for strict linting and formatting
    - Build succeeds with strict type checking enabled
  artifacts:
    - path: "react-site/tsconfig.json"
      contains: '"strict": true'
      contains: '"noUnusedLocals": true'
      contains: '"noUnusedParameters": true'
      contains: '"noFallthroughCasesInSwitch": true'
      contains: '"noUncheckedSideEffectImports": true'
    - path: "biome.json"
      contains: '"correctness": "error"'
      contains: '"security": "error"'
      contains: '"style": "warn"'
      contains: '"suspicious": "warn"'
  key_links:
    - from: "react-site/tsconfig.json"
      to: "TypeScript compiler"
      via: "strict mode options enforce type safety"
      pattern: '"strict": true'
    - from: "biome.json"
      to: "Biome linter"
      via: "strict rule levels enforce code quality"
      pattern: '"correctness": "error"'
---

<objective>
Enable all TypeScript strict mode options and configure Biome for strict linting and formatting.

Purpose: TypeScript strict mode options catch more type errors at compile time. Biome strict configuration enforces code quality with correctness and security rules as errors.

Output: tsconfig.json with all strict options enabled, biome.json configured with strict rule levels.
</objective>

<execution_context>
@C:/Users/jeff/.config/opencode/get-shit-done/workflows/execute-plan.md
@C:/Users/jeff/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-foundation/01-RESEARCH.md
@react-site/tsconfig.json
@biome.json
@.planning/codebase/CONVENTIONS.md
@.planning/codebase/STACK.md
</context>

<tasks>

<task type="auto">
  <name>Verify and enable TypeScript strict mode options</name>
  <files>react-site/tsconfig.json</files>
  <action>
    Verify react-site/tsconfig.json has all strict mode options enabled:
    - "strict": true (should already be enabled)
    - "noUnusedLocals": true (add if missing)
    - "noUnusedParameters": true (add if missing)
    - "noFallthroughCasesInSwitch": true (add if missing)
    - "noUncheckedSideEffectImports": true (add if missing)

    If any options are missing, add them to the compilerOptions section.

    Note: The tsconfig.json already has "strict": true enabled. This task verifies and adds the additional strict options.

    Per research: Enable options incrementally to avoid overwhelming error floods. Since strict is already enabled, add remaining options one at a time.

  </action>
  <verify>cat react-site/tsconfig.json | grep -E "(strict|noUnusedLocals|noUnusedParameters|noFallthroughCasesInSwitch|noUncheckedSideEffectImports)"</verify>
  <done>tsconfig.json has all TypeScript strict mode options enabled</done>
</task>

<task type="auto">
  <name>Configure Biome for strict linting and formatting</name>
  <files>biome.json</files>
  <action>
    Update biome.json to configure strict linting rules:
    In the linter.rules section, set strict rule levels:
    - "correctness": "error" (all correctness rules produce errors)
    - "security": "error" (all security rules produce errors)
    - "style": "warn" (style rules produce warnings, not errors)
    - "suspicious": "warn" (suspicious rules produce warnings, not errors)

    Current biome.json already has "recommended": true for all rule categories. This task adds explicit severity levels.

    Per research: Set correctness and security as errors for bulletproof code quality. Set style and suspicious as warnings to avoid overwhelming developers during foundation work.

  </action>
  <verify>cat biome.json | grep -E "(correctness|security|style|suspicious)" | head -10</verify>
  <done>biome.json configured with correctness and security as errors, style and suspicious as warnings</done>
</task>

<task type="auto">
  <name>Verify build succeeds with strict mode</name>
  <files>react-site/tsconfig.json,biome.json</files>
  <action>
    Verify that the build succeeds with strict TypeScript and Biome configuration:
    1. Run: pnpm run build (to verify TypeScript compiles with strict options)
    2. Run: pnpm run lint:biome (to verify Biome linter passes with strict rules)
    3. If there are errors, fix them before considering this task complete.

    Note: Existing type issues (like @ts-ignore and any types) will be addressed in plan 01-06. This task focuses on enabling the strict configuration and ensuring no NEW errors are introduced.

  </action>
  <verify>pnpm run build && pnpm run lint:biome</verify>
  <done>Build and Biome lint pass with strict configuration enabled</done>
</task>

</tasks>

<verification>
After completion:
1. Verify tsconfig.json contains all strict mode options
2. Verify biome.json has correctness and security as errors
3. Verify pnpm run build succeeds
4. Verify pnpm run lint:biome succeeds
</verification>

<success_criteria>

1. tsconfig.json has strict, noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch, noUncheckedSideEffectImports enabled
2. biome.json has correctness and security rules set to "error"
3. biome.json has style and suspicious rules set to "warn"
4. Build succeeds with strict TypeScript
5. Biome lint passes with strict rules
   </success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-04-SUMMARY.md`
</output>
