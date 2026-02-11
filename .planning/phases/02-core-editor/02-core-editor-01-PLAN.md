---
phase: 02-core-editor
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - react-site/src/types/resume.ts
  - react-site/src/atoms/data.ts
  - react-site/src/services/storage.ts
  - react-site/src/lib/form-resolvers.ts
autonomous: true

must_haves:
  truths:
    - "Single source of truth for all resume-related types (Font, ResumeStyles, DbResume)"
    - "Zod validation schema defined for resume data with appropriate constraints"
    - "All existing imports of duplicate types updated to use consolidated types"
    - "Build passes with no type errors related to resume types"
  artifacts:
    - path: "react-site/src/types/resume.ts"
      provides: "Consolidated type definitions for resume data"
      exports: ["Font", "ResumeStyles", "DbResume"]
    - path: "react-site/src/lib/form-resolvers.ts"
      provides: "Zod validation schemas for forms"
      exports: ["resumeSchema"]
  key_links:
    - from: "react-site/src/atoms/data.ts"
      to: "react-site/src/types/resume.ts"
      via: "Type imports"
      pattern: 'import.*from [''"]@/types/resume[''"]'
    - from: "react-site/src/services/storage.ts"
      to: "react-site/src/types/resume.ts"
      via: "Type imports"
      pattern: 'import.*from [''"]@/types/resume[''"]'
---

<objective>
Consolidate duplicate type definitions and create Zod validation schemas for resume data. This eliminates type duplication, establishes a single source of truth, and enables type-safe form validation.

Purpose: Type duplication causes maintenance burden and potential inconsistencies. Consolidating types and creating Zod schemas provides the foundation for form validation and auto-save functionality.

Output: `src/types/resume.ts` with consolidated types, `src/lib/form-resolvers.ts` with Zod schemas, updated imports across codebase
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
@react-site/src/atoms/data.ts
@react-site/src/services/storage.ts
@react-site/src/lib/
</context>

<tasks>

<task type="auto">
  <name>Task 1: Consolidate duplicate type definitions</name>
  <files>react-site/src/types/resume.ts, react-site/src/atoms/data.ts, react-site/src/services/storage.ts</files>
  <action>
    Create `react-site/src/types/resume.ts` with consolidated type definitions:

    1. Create the file with these exact exports (preserve existing type structure):
       - `Font` interface (name: string, fontFamily?: string)
       - `ResumeStyles` interface (all existing fields: marginV, marginH, lineHeight, paragraphSpace, themeColor, fontCJK, fontEN, fontSize, paper)
       - `DbResume` interface (id, name, markdown, css, styles, created_at, updated_at)

    2. Update `react-site/src/atoms/data.ts`:
       - Remove duplicate Font, ResumeStyles, DbResume definitions
       - Import from consolidated file: `import type { Font, ResumeStyles, DbResume } from '@/types/resume'`
       - Keep SystemData interface (uses ResumeStyles)
       - Keep all atom exports unchanged

    3. Update `react-site/src/services/storage.ts`:
       - Remove duplicate Font, ResumeStyles, DbResume definitions
       - Import from consolidated file: `import type { Font, ResumeStyles, DbResume } from '@/types/resume'`
       - Keep StorageService class unchanged (methods use DbResume type)

    Do NOT change any type definitions - only consolidate them.

  </action>
  <verify>pnpm run build succeeds with no type errors</verify>
  <done>Single `src/types/resume.ts` file with all resume types, all duplicate definitions removed, imports updated in atoms/data.ts and services/storage.ts</done>
</task>

<task type="auto">
  <name>Task 2: Create Zod validation schemas</name>
  <files>react-site/src/lib/form-resolvers.ts</files>
  <action>
    Create `react-site/src/lib/form-resolvers.ts` with Zod schemas:

    1. Import zod and types:
       ```typescript
       import { z } from "zod"
       import type { DbResume, ResumeStyles, Font } from "@/types/resume"
       ```

    2. Create `fontSchema` for Font type:
       - name: string, min 1 ("Font name is required")

    3. Create `resumeStylesSchema` for ResumeStyles type:
       - marginV: number, min 0, max 100
       - marginH: number, min 0, max 100
       - lineHeight: number, min 1, max 3
       - paragraphSpace: number, min 0, max 20
       - themeColor: string, regex pattern for hex color (# followed by 3 or 6 hex chars)
       - fontSize: number, min 8, max 24
       - paper: z.enum(["A4", "letter", "legal"])
       - fontCJK: fontSchema
       - fontEN: fontSchema

    4. Create `resumeSchema` for DbResume type:
       - id: number (use `z.coerce.number()` for string to number conversion)
       - name: string, min 1 ("Resume name is required")
       - markdown: string, min 10 ("Content must be at least 10 characters")
       - css: string, optional
       - styles: resumeStylesSchema
       - created_at: z.date() or z.coerce.date() for string to Date conversion
       - updated_at: z.date() or z.coerce.date()

    5. Export all schemas and inferred types:
       ```typescript
       export { fontSchema, resumeStylesSchema, resumeSchema }
       export type ResumeFormValues = z.infer<typeof resumeSchema>
       ```

    Use research.md patterns for Zod schema structure.

  </action>
  <verify>pnpm run build succeeds, TypeScript can infer ResumeFormValues from schema</verify>
  <done>Zod schemas defined for all resume types with appropriate validation rules, ResumeFormValues type exported for use with React Hook Form</done>
</task>

</tasks>

<verification>
- `pnpm run build` succeeds with no errors
- No duplicate type definitions remain (grep -r "interface Font\|interface ResumeStyles\|interface DbResume" in react-site/src shows only resume.ts)
- All imports of consolidated types use `@/types/resume` path
- Zod schemas compile with TypeScript and provide type safety
</verification>

<success_criteria>

- Single source of truth for resume types in `src/types/resume.ts`
- Zod validation schema `resumeSchema` with type-safe inference
- Build passes with no type-related errors
- Ready for React Hook Form integration in Plan 02-02
  </success_criteria>

<output>
After completion, create `.planning/phases/02-core-editor/02-core-editor-01-SUMMARY.md`
</output>
