# Phase 2: Core Editor - Research

**Researched:** 2025-02-12
**Domain:** Form handling, validation, auto-save, storage abstraction
**Confidence:** HIGH

## Summary

Phase 2 requires implementing a robust form editor system for resume data with validation, auto-save, and proper state management. The research reveals that the project already has key infrastructure (Jotai for state, LocalForage for storage, Sonner for toasts), but needs React Hook Form + Zod integration and storage abstraction layer. Duplicate type definitions exist across the codebase that must be consolidated. The project does not yet have shadcn/ui's Field components, which are needed for the Controller pattern integration.

**Primary recommendation:** Use React Hook Form with Zod resolver, consolidate duplicate types into a shared types file, and add shadcn/ui Field components for accessible form patterns.

## Standard Stack

### Core

| Library             | Version | Purpose                              | Why Standard                                                                       |
| ------------------- | ------- | ------------------------------------ | ---------------------------------------------------------------------------------- |
| react-hook-form     | ^7.55+  | Form state management and validation | Performance-focused, minimal re-renders, de facto standard for React forms         |
| zod                 | ^3.23+  | Schema validation                    | TypeScript-first, type-safe, excellent React Hook Form integration via zodResolver |
| @hookform/resolvers | ^3.9+   | Integration layer                    | Official bridge between React Hook Form and validation libraries                   |

### Supporting

| Library                    | Version | Purpose                     | When to Use                                                             |
| -------------------------- | ------- | --------------------------- | ----------------------------------------------------------------------- |
| shadcn/ui Field components | Latest  | Accessible form composition | For all form layouts with labels, errors, descriptions                  |
| Sonner                     | ^2.0+   | Toast notifications         | Already in project, continue using for user feedback                    |
| Jotai                      | ^2.16+  | Global state management     | Already in project, use for form-scoped state alongside React Hook Form |

### Alternatives Considered

| Instead of      | Could Use       | Tradeoff                                                       |
| --------------- | --------------- | -------------------------------------------------------------- |
| React Hook Form | Formik          | React Hook Form has better performance and smaller bundle size |
| Zod             | Yup             | Zod has better TypeScript integration and smaller bundle       |
| Sonner          | React Hot Toast | Sonner is already installed and has better DX                  |

**Installation:**

```bash
pnpm add react-hook-form zod @hookform/resolvers
pnpm dlx shadcn@latest add field
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── types/
│   └── resume.ts          # Consolidated type definitions (Font, ResumeStyles, DbResume)
├── services/
│   ├── storage/
│   │   ├── index.ts          # Storage service interface
│   │   └── local.ts          # LocalForage implementation
│   └── storage.ts            # Legacy (to be refactored to use abstraction)
├── lib/
│   ├── auto-save.ts         # Debounced save hook
│   └── form-resolvers.ts    # Zod schemas
├── components/
│   ├── editor/
│   │   ├── ResumeForm.tsx   # Main form component using React Hook Form
│   │   └── AutoSaveIndicator.tsx
│   └── ui/
│       └── field.tsx         # shadcn/ui Field components (to be added)
```

### Pattern 1: React Hook Form with Zod Resolver

**What:** Use `useForm` with `zodResolver` for type-safe form validation
**When to use:** All resume data forms requiring validation
**Example:**

```typescript
// Source: https://react-hook-form.com/docs/useform#resolver
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const resumeSchema = z.object({
  name: z.string().min(1, 'Resume name is required'),
  markdown: z.string().min(10, 'Content must be at least 10 characters'),
  css: z.string().optional(),
})

export function ResumeForm() {
  const form = useForm<z.infer<typeof resumeSchema>>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      name: '',
      markdown: '',
      css: '',
    },
  })

  function onSubmit(data: z.infer<typeof resumeSchema>) {
    console.log(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

### Pattern 2: shadcn/ui Controller Pattern

**What:** Use `Controller` component with shadcn/ui Field components for accessible forms
**When to use:** All form inputs with controlled components
**Example:**

```typescript
// Source: https://ui.shadcn.com/docs/forms/react-hook-form
import { Controller, useForm } from 'react-hook-form'
import { Field, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

export function ResumeForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '' },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="name">Resume Name</FieldLabel>
            <Input
              {...field}
              id="name"
              aria-invalid={fieldState.invalid}
              placeholder="My Awesome Resume"
            />
            <FieldDescription>
              This name will appear on your dashboard.
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <button type="submit">Save</button>
    </form>
  )
}
```

### Pattern 3: Debounced Auto-Save Hook

**What:** Custom hook that debounces form changes and triggers save
**When to use:** All forms with auto-save requirements
**Example:**

```typescript
import { useEffect, useRef } from "react";
import { useDebounceCallback } from "use-debounce"; // or custom debounce

export function useAutoSave<T>(
  data: T,
  saveFn: (data: T) => Promise<void>,
  delay = 1000
) {
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isDirtyRef = useRef(false);

  const debouncedSave = useDebounceCallback(
    async () => {
      if (isDirtyRef.current) {
        await saveFn(data);
        isDirtyRef.current = false;
      }
    },
    [data, saveFn],
    delay
  );

  useEffect(() => {
    isDirtyRef.current = true;
    debouncedSave();
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [data, debouncedSave]);
}
```

### Pattern 4: Storage Service Abstraction

**What:** Define interface for storage, implement LocalForage, allow future remote storage
**When to use:** All storage operations to enable future backend integration
**Example:**

```typescript
// src/services/storage/index.ts
export interface StorageService {
  getResumes(): Promise<DbResume[]>;
  getResume(id: number): Promise<DbResume | null>;
  createResume(data: Partial<DbResume>): Promise<DbResume | null>;
  updateResume(id: number, data: Partial<DbResume>): Promise<DbResume | null>;
  deleteResume(id: number): Promise<DbResume | null>;
  duplicateResume(id: number): Promise<DbResume | null>;
}

// src/services/storage/local.ts
export class LocalStorageService implements StorageService {
  private store = localforage.createInstance({ name: "oh-my-cv" });

  async getResumes(): Promise<DbResume[]> {
    // Implementation
  }

  // ... other methods
}

// src/services/storage/index.ts (export singleton)
export const storageService = new LocalStorageService();
```

### Anti-Patterns to Avoid

- **Direct LocalForage access in components:** All storage should go through service abstraction
- **Ignoring form dirty state:** Always show unsaved changes indicators, don't silently overwrite
- **Manual debouncing without cleanup:** Always cleanup timers to prevent memory leaks
- **Duplicate type definitions:** Define types once, import everywhere

## Don't Hand-Roll

| Problem                     | Don't Build                                   | Use Instead                            | Why                                                                                                         |
| --------------------------- | --------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Form validation logic       | Custom validation with manual error tracking  | React Hook Form + Zod                  | React Hook Form has been optimized for performance, handles edge cases, integrates with Zod for type safety |
| Debounce implementation     | Custom debounce with setTimeout refs          | useDebounceCallback or lodash.debounce | Prevents memory leaks from uncanceled timers, handles edge cases                                            |
| Toast notifications         | Custom toast state and rendering              | Sonner                                 | Already installed, handles positioning, stacking, accessibility                                             |
| Form accessibility patterns | Custom ARIA attributes and label association  | shadcn/ui Field components             | Handles proper label/description/error relationships, keyboard navigation, screen reader announcements      |
| Storage abstraction         | Direct LocalForage calls scattered throughout | Service interface pattern              | Enables future backend integration, easier testing, single source of truth                                  |

**Key insight:** Building custom form logic is tempting, but React Hook Form has handled years of edge cases (focus management, re-render optimization, async validation, etc.) that are difficult to get right. Similarly, shadcn/ui Field components handle accessibility patterns that are legally required and often overlooked.

## Common Pitfalls

### Pitfall 1: Missing Field Component Installation

**What goes wrong:** Attempting to use `Field`, `FieldError`, `FieldLabel` components that don't exist in the project yet
**Why it happens:** shadcn/ui documentation assumes you've added the Field component, but it's not in the project's UI folder
**How to avoid:** Run `pnpm dlx shadcn@latest add field` before implementing form components
**Warning signs:** TypeScript errors on imports from `@/components/ui/field`, missing file errors

### Pitfall 2: React Hook Form Re-render Loops

**What goes wrong:** Form re-renders on every keystroke causing performance issues
**Why it happens:** Not using `useDebounceCallback` for auto-save, or passing non-memoized callbacks to `useForm`
**How to avoid:** Use memoized callbacks, debounce async operations, leverage `mode: 'onBlur'` for validation
**Warning signs:** Input lag, visible jank, high re-render counts in React DevTools

### Pitfall 3: Zod Schema Type Mismatch

**What goes wrong:** Runtime validation errors despite type safety claims
**Why it happens:** Schema and form data types diverge, using `z.infer` incorrectly
**How to avoid:** Always use `z.infer<typeof schema>` for form types, run type checks after schema changes
**Warning signs:** TypeScript errors on `form.handleSubmit`, runtime validation failing unexpectedly

### Pitfall 4: Uncleaned Debounce Timers

**What goes wrong:** Memory leaks, save operations continuing after component unmount
**Why it happens:** Debounce timers not cleared in cleanup functions
**How to avoid:** Always return cleanup function that clears timeouts, use proper hooks
**Warning signs:** Saves completing after leaving page, console warnings about unmounted components

### Pitfall 5: Duplicate Type Definitions

**What goes wrong:** Type conflicts, maintenance burden, inconsistent data structures
**Why it happens:** Types defined in multiple files (`src/atoms/data.ts`, `src/services/storage.ts`) independently
**How to avoid:** Create `src/types/resume.ts`, export all types from there, update all imports
**Warning signs:** Same type defined in multiple files, need to change in multiple places

## Code Examples

Verified patterns from official sources:

### React Hook Form with Zod Schema

```typescript
// Source: https://react-hook-form.com/docs/useform#resolver
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const resumeSchema = z.object({
  name: z.string().min(1, 'Required'),
  markdown: z.string(),
})

export function ResumeEditor() {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof resumeSchema>>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      name: 'Untitled Resume',
      markdown: '',
    },
  })

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      {/* Form content */}
    </form>
  )
}
```

### shadcn/ui Field with Controller

```typescript
// Source: https://ui.shadcn.com/docs/forms/react-hook-form
import { Controller } from 'react-hook-form'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

<Controller
  name="name"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Resume Name</FieldLabel>
      <Input
        {...field}
        id={field.name}
        aria-invalid={fieldState.invalid}
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

### Sonner Toast Notification

```typescript
// Source: https://ui.shadcn.com/docs/components/sonner
import { toast } from "sonner";

// Success
toast.success("Resume saved successfully");

// With description
toast("Your changes have been saved", {
  description: "Last saved: Just now"
});

// Error
toast.error("Failed to save resume");
```

### Auto-Save with Debouncing

```typescript
import { useEffect } from "react";
import { toast } from "sonner";

export function useAutoSave(data: any, saveFn: (data: any) => Promise<void>) {
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await saveFn(data);
        toast.success("Saved automatically");
      } catch (error) {
        toast.error("Failed to save");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [data, saveFn]);
}
```

## State of the Art

| Old Approach      | Current Approach | When Changed              | Impact                                               |
| ----------------- | ---------------- | ------------------------- | ---------------------------------------------------- |
| Manual form state | React Hook Form  | Ongoing (but established) | Reduced boilerplate, better performance, type safety |
| Yup validation    | Zod validation   | 2021-2022                 | Better TypeScript integration, smaller bundle        |
| Custom debounce   | use-debounce     | 2020+                     | Better DX, fewer bugs                                |
| Inline form JSX   | shadcn/ui Field  | 2023-2024                 | Better accessibility, consistent styling             |

**Deprecated/outdated:**

- **Formik**: Still works but React Hook Form has largely superseded it for new projects
- **Yup**: Still valid, but Zod has better TypeScript integration
- **Inline form patterns**: Still work, but shadcn/ui Field provides accessibility guarantees

## Open Questions

1. **Storage abstraction interface design**
   - What we know: Need to abstract LocalForage for future remote storage
   - What's unclear: Exact interface design for remote sync conflicts, offline-first vs online-first approach
   - Recommendation: Define simple CRUD interface first, defer sync complexity to Phase 4

2. **Loading state granularity**
   - What we know: Need loading states for async operations
   - What's unclear: Whether to use shadcn/ui Spinner component or build custom loading UI
   - Recommendation: Check existing components, use Spinner for inline states, consider skeleton for page-level loads

3. **Auto-save conflict handling**
   - What we know: Need debounced auto-save
   - What's unclear: How to handle multiple concurrent edits, conflict resolution
   - Recommendation: Implement basic debounce first, defer conflict resolution to Phase 4 with remote storage

## Sources

### Primary (HIGH confidence)

- react-hook-form.com - useForm documentation, Controller API, integration patterns
- zod.dev - Zod schema definitions, TypeScript integration
- ui.shadcn.com - Form components, Field API, React Hook Form integration examples
- @hookform/resolvers GitHub/README - Zod resolver usage and patterns

### Secondary (MEDIUM confidence)

- LocalForage documentation - Storage API usage (verified with existing code)
- Sonner documentation - Toast API (already in project)

### Tertiary (LOW confidence)

- None - All findings verified with primary sources

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - All libraries are well-established, official docs available, project already uses related patterns
- Architecture: HIGH - Patterns verified with official docs, existing codebase compatible
- Pitfalls: HIGH - Identified through official docs and common React Hook Form issues documented

**Research date:** 2025-02-12
**Valid until:** 2025-03-14 (30 days - stable domain)
