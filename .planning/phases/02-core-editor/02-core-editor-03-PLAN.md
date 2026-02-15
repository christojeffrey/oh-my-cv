---
phase: 02-core-editor
plan: 03
type: execute
wave: 2
depends_on: [02-core-editor-01]
files_modified:
  - react-site/src/services/storage/index.ts
  - react-site/src/services/storage/local.ts
  - react-site/src/services/storage.ts
  - react-site/src/lib/auto-save.ts
  - react-site/src/lib/loading-state.ts
autonomous: true

must_haves:
  truths:
    - "Storage abstraction interface defined for future remote storage support"
    - "LocalForage implementation satisfies storage interface"
    - "Legacy storage.ts refactored to use abstraction"
    - "Auto-save hook debounces saves and calls storage service"
    - "Loading state utilities track async operations"
    - "Build passes with no breaking changes to storage API"
  artifacts:
    - path: "react-site/src/services/storage/index.ts"
      provides: "Storage abstraction interface and singleton"
      exports: ["StorageService", "storageService"]
    - path: "react-site/src/services/storage/local.ts"
      provides: "LocalForage-based storage implementation"
      exports: ["LocalStorageService"]
    - path: "react-site/src/lib/auto-save.ts"
      provides: "Debounced auto-save hook"
      exports: ["useAutoSave"]
    - path: "react-site/src/lib/loading-state.ts"
      provides: "Loading state utilities"
      exports: ["useLoadingState"]
  key_links:
    - from: "react-site/src/lib/auto-save.ts"
      to: "react-site/src/services/storage/index.ts"
      via: "Import of storageService"
      pattern: 'import.*storageService.*from [''"]@/services/storage[''"]'
    - from: "react-site/src/services/storage.ts"
      to: "react-site/src/services/storage/index.ts"
      via: "Re-export of storageService"
      pattern: 'export.*from.*[''"]@/services/storage[''"]'
---

<objective>
Refactor storage service with abstraction interface, implement auto-save with debouncing, and add loading state utilities. This enables future remote storage integration, provides automatic save functionality, and supports loading indicators for async operations.

Purpose: Storage abstraction enables backend integration later. Auto-save improves UX by saving automatically. Loading states provide feedback for async operations.

Output: Storage abstraction with LocalForage implementation, debounced auto-save hook, loading state utilities
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
@react-site/src/services/storage.ts
@react-site/src/types/resume.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create storage abstraction interface</name>
  <files>react-site/src/services/storage/index.ts, react-site/src/services/storage/local.ts</files>
  <action>
    Create storage abstraction for future remote storage support:

    1. Create `react-site/src/services/storage/index.ts`:
       - Define `StorageService` interface with all CRUD methods:
         - getResumes(): Promise<DbResume[]>
         - getResume(id: number): Promise<DbResume | null>
         - createResume(data?: Partial<DbResume>): Promise<DbResume | null>
         - updateResume(id: number, data: Partial<DbResume>): Promise<DbResume | null>
         - deleteResume(id: number): Promise<DbResume | null>
         - duplicateResume(id: number): Promise<DbResume | null>
       - Import DbResume from `@/types/resume`
       - Export StorageService interface

    2. Create `react-site/src/services/storage/local.ts`:
       - Create `LocalStorageService` class that implements StorageService interface
       - Move all logic from existing StorageService class in storage.ts
       - Keep same LocalForage configuration and method implementations
       - Keep the VERSION constant and default markdown/css templates
       - Export LocalStorageService class

    3. In `react-site/src/services/storage/index.ts`:
       - Import LocalStorageService
       - Create singleton instance: `export const storageService = new LocalStorageService()`
       - Export both StorageService interface and storageService singleton

    Use research.md storage abstraction pattern.

  </action>
  <verify>TypeScript compilation succeeds, LocalStorageService implements StorageService interface</verify>
  <done>Storage abstraction interface defined, LocalForage implementation created, singleton exported</done>
</task>

<task type="auto">
  <name>Task 2: Refactor legacy storage.ts to use abstraction</name>
  <files>react-site/src/services/storage.ts</files>
  <action>
    Refactor existing storage.ts to use new abstraction:

    1. Update `react-site/src/services/storage.ts`:
       - Remove StorageService class definition (moved to local.ts)
       - Remove LocalForage instance (moved to local.ts)
       - Remove all type definitions (consolidated in resume.ts)
       - Keep exports for backward compatibility: re-export from new location
       - Add: `export { storageService as default } from "./services/storage"`
       - Or simpler: Delete file entirely if no other references exist

    2. Search for imports of `@/services/storage` and update to `@/services/storage/index`:
       - Use grep to find: `grep -r "from.*@/services/storage" react-site/src/`
       - Update all imports to use new path
       - Or keep as `@/services/storage` and use barrel export

    Goal: All storage operations go through abstraction interface, no direct LocalForage access.

    Verify backward compatibility: All existing code using storageService still works.

  </action>
  <verify>pnpm run build succeeds, all storageService references point to new abstraction</verify>
  <done>Legacy storage.ts refactored, all storage operations use abstraction interface</done>
</task>

<task type="auto">
  <name>Task 3: Implement debounced auto-save hook</name>
  <files>react-site/src/lib/auto-save.ts</files>
  <action>
    Create `react-site/src/lib/auto-save.ts` with auto-save functionality:

    1. Import dependencies:
       ```typescript
       import { useEffect, useRef, useState } from "react"
       import { toast } from "sonner"
       import type { DbResume } from "@/types/resume"
       import { storageService } from "@/services/storage"
       ```

    2. Create `useAutoSave` hook:
       - Parameters: data (Partial<DbResume>), resumeId (number | null), delay = 1000 (ms)
       - State: `isSaving` (boolean), `lastSaved` (Date | null)
       - Refs: `saveTimer` (NodeJS.Timeout | null)
       - Effect: On data change, clear existing timer, set new timer
       - Timer callback:
         - Set isSaving = true
         - Call storageService.updateResume(resumeId, data)
         - On success: toast.success("Resume saved"), set lastSaved = now, set isSaving = false
         - On error: toast.error("Failed to save"), set isSaving = false
       - Cleanup: Clear timer on unmount
       - Returns: { isSaving, lastSaved }

    3. Export `useAutoSave` hook

    Use research.md auto-save pattern with debouncing.
    Keep debounce delay at 1000ms (1 second) for optimal UX.

    Note: Save only when resumeId is not null (i.e., resume exists in storage).

  </action>
  <verify>TypeScript compilation succeeds, hook returns { isSaving, lastSaved } with correct types</verify>
  <done>Auto-save hook with debouncing, loading state, and toast notifications</done>
</task>

<task type="auto">
  <name>Task 4: Create loading state utilities</name>
  <files>react-site/src/lib/loading-state.ts</files>
  <action>
    Create `react-site/src/lib/loading-state.ts` with loading state utilities:

    1. Create `useLoadingState` hook:
       - Parameters: async function (fn: () => Promise)
       - State: `isLoading` (boolean), `error` (Error | null)
       - Returns: { isLoading, error, execute }
       - `execute` function:
         - Sets isLoading = true, error = null
         - Calls the async function
         - On success: Sets isLoading = false
         - On error: Sets error = caught error, isLoading = false
         - Returns Promise result
       - Cleanup: Handle component unmount (cancel pending async if needed)

    2. Create `useAsyncEffect` hook (for loading data on mount):
       - Parameters: async function (fn: () => Promise<void>), dependencies array
       - State: `isLoading` (boolean), `error` (Error | null)
       - Effect: Calls async function on mount/dependencies change
       - Handles loading and error states
       - Returns: { isLoading, error }

    3. Export both hooks:
       ```typescript
       export { useLoadingState, useAsyncEffect }
       ```

    Use these for loading indicators during async storage operations.

    Note: These utilities work with any async operation, not just storage.

  </action>
  <verify>TypeScript compilation succeeds, hooks provide correct state management</verify>
  <done>Loading state utilities for tracking async operations and displaying indicators</done>
</task>

</tasks>

<verification>
- Storage abstraction interface defined and implemented
- LocalForage implementation satisfies interface
- Legacy storage.ts refactored to use abstraction
- All storageService references work with new abstraction
- Auto-save hook debounces saves and provides loading state
- Loading state utilities track async operations
- Build passes with no breaking changes
- Backward compatibility maintained (existing storage calls still work)
</verification>

<success_criteria>

- Storage abstraction enables future remote storage integration
- Auto-save provides automatic debounced saving with visual feedback
- Loading states enable responsive UI during async operations
- Ready for ResumeEditor form implementation in Plan 02-04
  </success_criteria>

<output>
After completion, create `.planning/phases/02-core-editor/02-core-editor-03-SUMMARY.md`
</output>
