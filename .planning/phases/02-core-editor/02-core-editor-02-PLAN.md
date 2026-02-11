---
phase: 02-core-editor
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - react-site/package.json
  - react-site/src/components/ui/field.tsx
  - react-site/src/lib/form-utils.ts
autonomous: true

must_haves:
  truths:
    - "react-hook-form, zod, and @hookform/resolvers installed in react-site"
    - "shadcn/ui Field components available for accessible form patterns"
    - "Form utility functions exported for use across form components"
    - "Build passes with new dependencies"
  artifacts:
    - path: "react-site/package.json"
      provides: "Form handling dependencies"
      contains: "react-hook-form, zod, @hookform/resolvers"
    - path: "react-site/src/components/ui/field.tsx"
      provides: "shadcn/ui Field components for accessible forms"
      exports: ["Field", "FieldLabel", "FieldError", "FieldDescription"]
    - path: "react-site/src/lib/form-utils.ts"
      provides: "Form utility functions and types"
      exports: ["getFormDefaults", "useFormState"]
  key_links:
    - from: "react-site/src/lib/form-utils.ts"
      to: "react-site/src/lib/form-resolvers.ts"
      via: "Import of ResumeFormValues"
      pattern: 'import.*ResumeFormValues.*from [''"]@/lib/form-resolvers[''"]'
    - from: "future form components"
      to: "react-site/src/components/ui/field.tsx"
      via: "Import of Field components"
      pattern: 'import.*Field.*from [''"]@/components/ui/field[''"]'
---

<objective>
Install React Hook Form dependencies, add shadcn/ui Field components, and create form utility functions. This establishes the form infrastructure for building type-safe, accessible resume editing forms.

Purpose: React Hook Form provides performant form state management. shadcn/ui Field components ensure accessibility. Utility functions provide reusable form patterns.

Output: Updated package.json with new dependencies, shadcn/ui Field components, form utility functions module
</objective>

<execution_context>
@C:/Users/jeff/.config/opencode/get-shit-done/workflows/execute-plan.md
@C:/Users/jeff/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/02-core-editor/02-RESEARCH.md
@react-site/package.json
@react-site/src/components/ui/
@react-site/src/lib/
</context>

<tasks>

<task type="auto">
  <name>Task 1: Install React Hook Form dependencies</name>
  <files>react-site/package.json</files>
  <action>
    Install form handling dependencies in react-site:

    Run: `pnpm add react-hook-form zod @hookform/resolvers`

    Verify in package.json that:
    - react-hook-form is added (latest version)
    - zod is added (latest version)
    - @hookform/resolvers is added (latest version)

    Use research.md recommendations for versions.

  </action>
  <verify>grep -E "react-hook-form|zod|@hookform/resolvers" react-site/package.json shows all three dependencies</verify>
  <done>react-hook-form, zod, and @hookform/resolvers installed in react-site/package.json</done>
</task>

<task type="auto">
  <name>Task 2: Add shadcn/ui Field components</name>
  <files>react-site/src/components/ui/field.tsx</files>
  <action>
    Add shadcn/ui Field components for accessible form patterns:

    Run: `pnpm dlx shadcn@latest add field` in react-site directory

    This will create `react-site/src/components/ui/field.tsx` with:
    - Field component (root wrapper)
    - FieldLabel component
    - FieldError component
    - FieldDescription component

    Verify the file exists and exports these components.
    Follow shadcn/ui Field documentation pattern from research.md.

  </action>
  <verify>ls react-site/src/components/ui/field.tsx exists, exports include Field, FieldLabel, FieldError, FieldDescription</verify>
  <done>shadcn/ui Field components installed and available for form building</done>
</task>

<task type="auto">
  <name>Task 3: Create form utility functions</name>
  <files>react-site/src/lib/form-utils.ts</files>
  <action>
    Create `react-site/src/lib/form-utils.ts` with reusable form utilities:

    1. Import types and schema:
       ```typescript
       import type { DbResume, ResumeStyles } from "@/types/resume"
       import type { ResumeFormValues } from "./form-resolvers"
       ```

    2. Create `getFormDefaults` function:
       - Accepts optional `resume?: Partial<DbResume>` parameter
       - Returns default values matching ResumeFormValues type
       - If resume provided, use its values (with fallbacks)
       - Default values:
         - name: "Untitled Resume"
         - markdown: "" (or default template from storage.ts if you prefer)
         - css: "" (or default CSS from storage.ts)
         - styles: default ResumeStyles (marginV: 50, marginH: 45, lineHeight: 1.3, paragraphSpace: 5, themeColor: "#377bb5", fontCJK: { name: "华康宋体", fontFamily: "HKST" }, fontEN: { name: "Minion Pro" }, fontSize: 15, paper: "A4")
         - created_at: current date
         - updated_at: current date

    3. Create `useFormState` hook (optional, for form dirty state tracking):
       - Accepts form control from React Hook Form
       - Returns object with isDirty, isValid, submitCount
       - Can use formState from useForm in calling component

    4. Export utility functions:
       ```typescript
       export { getFormDefaults, useFormState }
       ```

    Use research.md patterns for form utilities.

  </action>
  <verify>pnpm run build succeeds, TypeScript accepts getFormDefaults return type as ResumeFormValues</verify>
  <done>Form utility functions created for getting default values and tracking form state</done>
</task>

</tasks>

<verification>
- All three packages installed in react-site/package.json
- shadcn/ui Field components available (field.tsx exists and exports)
- Form utility functions compile with TypeScript
- Build passes with no errors
</verification>

<success_criteria>

- React Hook Form infrastructure ready for form components
- shadcn/ui Field components accessible for accessible form patterns
- Form utilities provide default values and state management
- Ready for form component implementation in Plan 02-03
  </success_criteria>

<output>
After completion, create `.planning/phases/02-core-editor/02-core-editor-02-SUMMARY.md`
</output>
