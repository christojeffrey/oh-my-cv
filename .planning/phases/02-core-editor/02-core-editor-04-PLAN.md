---
phase: 02-core-editor
plan: 04
type: execute
wave: 3
depends_on: [02-core-editor-01, 02-core-editor-02, 02-core-editor-03]
files_modified:
  - react-site/src/components/editor/ResumeForm.tsx
  - react-site/src/components/editor/ResumeFormFields.tsx
  - react-site/src/routes/editor.$id.tsx
autonomous: true

must_haves:
  truths:
    - "ResumeForm component uses React Hook Form with Zod validation"
    - "Form fields use shadcn/ui Controller pattern for accessibility"
    - "Auto-save hook automatically saves form changes with debouncing"
    - "Validation errors display at field level with clear messages"
    - "Loading states show during save operations"
    - "Toast notifications appear for save success/failure"
    - "Build passes with no errors"
  artifacts:
    - path: "react-site/src/components/editor/ResumeForm.tsx"
      provides: "Main resume editing form with React Hook Form"
      exports: ["ResumeForm"]
    - path: "react-site/src/components/editor/ResumeFormFields.tsx"
      provides: "Form field components with Controller pattern"
      exports: ["ResumeNameField", "MarkdownField", "CssField", "StylesField"]
    - path: "react-site/src/routes/editor.$id.tsx"
      provides: "Editor route using ResumeForm"
  key_links:
    - from: "react-site/src/components/editor/ResumeForm.tsx"
      to: "react-site/src/lib/form-resolvers.ts"
      via: "Import of resumeSchema and ResumeFormValues"
      pattern: 'import.*resumeSchema.*from [''"]@/lib/form-resolvers[''"]'
    - from: "react-site/src/components/editor/ResumeForm.tsx"
      to: "react-site/src/lib/auto-save.ts"
      via: "Import of useAutoSave hook"
      pattern: 'import.*useAutoSave.*from [''"]@/lib/auto-save[''"]'
    - from: "react-site/src/components/editor/ResumeFormFields.tsx"
      to: "react-site/src/components/ui/field.tsx"
      via: "Import of Field components"
      pattern: 'import.*Field.*from [''"]@/components/ui/field[''"]'
---

<objective>
Create ResumeForm component using React Hook Form with Zod validation, implement form fields with shadcn/ui Controller pattern, integrate auto-save hook, and wire up editor route. This provides a complete form-based editing experience with validation, auto-save, and loading states.

Purpose: Form-based editing provides structure, validation, and auto-save. Controller pattern ensures accessibility. Integration with existing editor route provides seamless editing experience.

Output: ResumeForm component with validation and auto-save, form field components, updated editor route
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
@react-site/src/routes/editor.$id.tsx
@react-site/src/components/editor/
@react-site/src/components/ui/
@react-site/src/lib/form-resolvers.ts
@react-site/src/lib/form-utils.ts
@react-site/src/lib/auto-save.ts
@react-site/src/lib/loading-state.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create ResumeForm component</name>
  <files>react-site/src/components/editor/ResumeForm.tsx</files>
  <action>
    Create `react-site/src/components/editor/ResumeForm.tsx` with React Hook Form integration:

    1. Import dependencies:
       ```typescript
       import { useForm } from "react-hook-form"
       import { zodResolver } from "@hookform/resolvers/zod"
       import { useAutoSave } from "@/lib/auto-save"
       import { getFormDefaults } from "@/lib/form-utils"
       import { resumeSchema, type ResumeFormValues } from "@/lib/form-resolvers"
       import type { DbResume } from "@/types/resume"
       import { ResumeNameField, MarkdownField, CssField, StylesField } from "./ResumeFormFields"
       import { useToast } from "@/components/ui/use-toast" // or use sonner directly
       import { toast } from "sonner"
       ```

    2. Create ResumeForm component:
       - Props: `initialResume?: Partial<DbResume>` (optional initial resume data)
       - Use useForm with:
         - resolver: zodResolver(resumeSchema)
         - defaultValues: getFormDefaults(initialResume)
         - mode: "onBlur" (validate on field blur, not every keystroke)
       - Extract: control, handleSubmit, formState, watch
       - Use useAutoSave hook:
         - data: watch() (entire form state)
         - resumeId: initialResume?.id || null
         - Returns: { isSaving, lastSaved }
       - Render form with form fields
       - Show "Saving..." indicator when isSaving
       - Show "Last saved: [time]" when lastSaved exists
       - onSubmit handler: can call handleSubmit and log data (auto-save handles persistence)

    3. Export ResumeForm component

    Use research.md React Hook Form patterns.
    Keep Monaco Editor integration from existing editor.$id.tsx for markdown field (don't replace with textarea).

    Note: This component wraps the form logic. Actual fields are in ResumeFormFields.tsx for separation of concerns.

  </action>
  <verify>TypeScript compilation succeeds, form uses ResumeFormValues type from schema</verify>
  <done>ResumeForm component with React Hook Form, Zod validation, and auto-save integration</done>
</task>

<task type="auto">
  <name>Task 2: Create form field components</name>
  <files>react-site/src/components/editor/ResumeFormFields.tsx</files>
  <action>
    Create `react-site/src/components/editor/ResumeFormFields.tsx` with individual form fields:

    1. Import dependencies:
       ```typescript
       import { Controller } from "react-hook-form"
       import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field"
       import { Input } from "@/components/ui/input"
       import { Textarea } from "@/components/ui/textarea"
       import { CodeEditor } from "./CodeEditor" // existing Monaco editor
       import type { FieldValues } from "react-hook-form"
       ```

    2. Create ResumeNameField component:
       - Props: name="name", control, label="Resume Name"
       - Use Controller to wrap Input
       - FieldLabel for accessibility
       - FieldError displays validation errors
       - FieldDescription: "This name will appear on your dashboard"

    3. Create MarkdownField component:
       - Props: name="markdown", control, label="Resume Content"
       - Use Controller to wrap existing CodeEditor component
       - Pass field.onChange to CodeEditor onChange
       - Pass field.value to CodeEditor value
       - FieldLabel for accessibility
       - FieldError displays validation errors

    4. Create CssField component:
       - Props: name="css", control, label="Custom CSS"
       - Use Controller to wrap Textarea
       - FieldLabel for accessibility
       - FieldError displays validation errors
       - FieldDescription: "Optional CSS for custom styling"

    5. Create StylesField component:
       - Props: name="styles", control, label="Resume Styles"
       - Use Controller to wrap form inputs for each style property
       - Nest fields for nested styles object (use Controller with array syntax or separate components)
       - For now, create simple fields:
         - marginV: Input type number
         - marginH: Input type number
         - lineHeight: Input type number step 0.1
         - paragraphSpace: Input type number
         - themeColor: Input type color
         - fontSize: Input type number
         - paper: Select from shadcn/ui (A4, letter, legal)
         - fontCJK.name: Input text
         - fontEN.name: Input text
       - FieldLabel and FieldError for each field

    6. Export all field components

    Use research.md shadcn/ui Controller pattern.

    Note: StylesField is complex - for this plan, keep it simple with individual inputs. Can enhance with better UI in later plans.

  </action>
  <verify>TypeScript compilation succeeds, all fields use Controller pattern with Field components</verify>
  <done>Form field components with shadcn/ui Controller pattern for accessibility and validation</done>
</task>

<task type="auto">
  <name>Task 3: Wire up editor route with ResumeForm</name>
  <files>react-site/src/routes/editor.$id.tsx</files>
  <action>
    Update `react-site/src/routes/editor.$id.tsx` to use ResumeForm:

    1. Read existing editor.$id.tsx to understand current structure
    2. Identify where to integrate ResumeForm:
       - Keep existing layout (EditorSidebar, Preview, etc.)
       - Replace or integrate ResumeForm into existing structure
       - Keep Monaco Editor for markdown field (don't replace)
       - Keep Preview component (shows rendered markdown)

    3. Integration approach:
       - Option A: Wrap entire editor with ResumeForm, keep Monaco Editor as MarkdownField
       - Option B: Create new form route alongside existing editor (for migration)
       - Option C: Replace existing editor with ResumeForm (breaking change)

    Recommended: Option C - Replace existing editor with ResumeForm to use new form infrastructure.

    4. Update editor.$id.tsx:
       - Import ResumeForm from "@/components/editor/ResumeForm"
       - Load resume data from storageService on mount
       - Pass initialResume to ResumeForm
       - Keep Preview component (connects to cvDataAtom or form state)
       - Remove old direct state management (cvDataAtom usage can be kept or migrated)

    5. Handle resume loading:
       - Use useAsyncEffect or existing loading pattern
       - Show loading state while fetching resume
       - Handle error if resume not found

    Use research.md auto-save and loading state patterns.

    Note: This may require significant changes to editor.$id.tsx. Preserve existing functionality where possible.

  </action>
  <verify>pnpm run build succeeds, editor route loads and displays ResumeForm</verify>
  <done>Editor route updated to use ResumeForm with validation, auto-save, and loading states</done>
</task>

</tasks>

<verification>
- ResumeForm component uses React Hook Form with Zod resolver
- Form fields use Controller pattern with shadcn/ui Field components
- Auto-save hook automatically saves form changes
- Validation errors display at field level
- Loading states show during save operations
- Toast notifications appear for save success/failure
- Editor route integrates ResumeForm
- Build passes with no errors
- Existing Monaco Editor preserved for markdown editing
- Preview component still works with form state
</verification>

<success_criteria>

- Users can edit resume fields with real-time validation
- Changes save automatically with visual feedback (saving indicator, last saved)
- Loading states show during async operations
- Toast notifications appear for user actions
- Resume data structure consistent across app
- Core Editor phase complete (all requirements met)
  </success_criteria>

<output>
After completion, create `.planning/phases/02-core-editor/02-core-editor-04-SUMMARY.md`
</output>
