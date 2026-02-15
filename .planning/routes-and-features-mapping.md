# Routes and Features Mapping

## 📍 Current Routes

Your app has **2 main routes**:

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/routes/index.tsx` | Dashboard - view all resumes |
| `/editor/:id` | `src/routes/editor.$id.tsx` | Resume editor for a specific resume |

Note: `src/routes/landing.tsx` exists but is NOT currently used (no route defined for it in `routeTree.gen.ts`)

---

## 🎯 Route → Feature Mapping

Here's what each route uses and what feature it should become:

### **Route 1: `/` (Dashboard)**

**Current Components Used:**
- `Dashboard.tsx` - Main container
- `ResumeCard.tsx` - Individual resume preview card
- `NewResume.tsx` - "Create new" card
- `FileActions.tsx` - Import/Export buttons

**Should Become:**
```
src/features/dashboard/
├── components/
│   ├── Dashboard.tsx
│   ├── ResumeCard.tsx
│   ├── NewResume.tsx
│   └── FileActions.tsx
├── hooks/
│   ├── use-resumes.ts          ← Extract data fetching from Dashboard
│   ├── use-resume-preview.ts   ← Extract preview logic from ResumeCard
│   └── use-resume-actions.ts   ← Extract CRUD operations
└── index.ts                     ← Public API
```

**API Calls (needs hooks):**
- ✅ `useResumes()` - Get all resumes (from `Dashboard.tsx`)
- ✅ `useCreateResume()` - Create new resume (from `NewResume.tsx`)
- ✅ `useResumeActions()` - Duplicate, delete (from `ResumeCard.tsx`)
- ✅ `useImportExport()` - Import/export JSON (from `FileActions.tsx`)

---

### **Route 2: `/editor/:id` (Resume Editor)**

**Current Components Used:**
- `editor.$id.tsx` - Route/layout
- `CodeEditor.tsx` - Monaco editor for markdown/CSS
- `Preview.tsx` - Live resume preview
- `EditorSidebar.tsx` - Right sidebar with all tools
- `EditorToolbar.tsx` - (seems unused?)
- `ResizeHandle.tsx` - Draggable resize handle
- `CustomizationPanel.tsx` - Settings panels (alternative to toolbar?)
- `settings/SliderField.tsx` - Reusable slider
- `toolbar/*` - 9 toolbar components (File, Paper, Theme, Fonts, etc.)

**Should Become:**
```
src/features/editor/
├── components/
│   ├── EditorLayout.tsx         ← Rename from editor.$id.tsx page component
│   ├── CodeEditor.tsx
│   ├── Preview.tsx
│   ├── EditorSidebar.tsx
│   ├── ResizeHandle.tsx
│   ├── settings/
│   │   └── SliderField.tsx
│   └── toolbar/
│       ├── ToolbarFile.tsx
│       ├── ToolbarPaper.tsx
│       ├── ToolbarThemeColor.tsx
│       ├── ToolbarFontFamily.tsx
│       ├── ToolbarFontSize.tsx
│       ├── ToolbarMargins.tsx
│       ├── ToolbarParagraphSpace.tsx
│       ├── ToolbarLineHeight.tsx
│       └── ToolbarCorrectCase.tsx
├── hooks/
│   ├── use-editor-data.ts       ← Extract from editor.$id.tsx
│   ├── use-preview-zoom.ts      ← Extract from Preview.tsx
│   ├── use-editor-tools.ts      ← Extract from EditorSidebar.tsx
│   └── use-resume-styles.ts     ← Extract from CustomizationPanel + toolbar components
└── index.ts                      ← Public API
```

**API Calls (needs hooks):**
- ✅ `useEditorData()` - Load resume by ID (from `editor.$id.tsx`)
- ✅ `useResumeStyles()` - Update styles (from `CustomizationPanel` + all toolbar components)

**Note:** Editor has FEWER API calls because most components just update state (atoms) and call `storageService.updateResume()` in the same pattern.

---

## 🗂️ Shared / Global Resources

These stay where they are (NOT features):

### `src/components/` - Truly Shared UI
```
src/components/
├── shared/          ← Keep these, used across features
│   ├── Header.tsx
│   ├── Logo.tsx
│   ├── BrandName.tsx
│   ├── ToggleDark.tsx
│   ├── Zoom.tsx
│   └── Markdown.tsx
├── ui/              ← Keep these, shadcn components
│   ├── button.tsx
│   ├── card.tsx
│   └── ... (11 more)
└── ErrorBoundary/   ← Keep this, global error handling
    ├── ErrorBoundary.tsx
    └── FallbackUI.tsx
```

### `src/services/` - Infrastructure Layer
```
src/services/
├── storage.ts       ← Keep this (used by both features)
├── fonts.ts         ← Keep this (used by editor + dashboard)
└── toast.ts         ← Keep this (global notifications)
```

### `src/atoms/` - Global State
**Current:**
```
src/atoms/
├── data.ts     ← cvDataAtom
├── style.ts    ← (seems related to editor)
└── ui.ts       ← (dark mode, etc.)
```

**Recommendation:**
- Keep `ui.ts` (global UI state like dark mode)
- **Move** `data.ts` → `src/features/editor/stores/cv-data.ts`
- **Move** `style.ts` → `src/features/editor/stores/` (if editor-specific)

### `src/hooks/` - Shared Hooks
```
src/hooks/
└── useSmartPages.ts  ← Keep this (used by both Dashboard and Editor)
```

### Other Shared Resources
- `src/lib/` - Third-party wrappers (keep as-is)
- `src/utils/` - Pure utilities (keep as-is)
- `src/types/` - **Needs discussion** (see below)
- `src/constants/` - Global constants (keep as-is)
- `src/locales/` - i18n translations (keep as-is)
- `src/configs/` - App configuration (keep as-is)

---

## 📦 Types Strategy

**Current:**
```
src/types/
└── resume.ts  ← DbResume, ResumeStyles, etc.
```

**Options:**

### Option 1: Keep Shared (Recommended)
```
src/types/
└── resume.ts  ← Keep here, used by BOTH dashboard and editor
```
**Reasoning:** `DbResume` is a domain model used across features, so it makes sense to keep it shared.

### Option 2: Move to Feature
```
src/features/resume/  ← New "resume" domain feature
├── types/
│   └── index.ts
└── index.ts
```
Then both `dashboard` and `editor` import from `@/features/resume`

**My recommendation:** **Option 1** - Keep `src/types/resume.ts` shared, since resume types are cross-cutting.

---

## 🎨 Routes Folder Structure

**Current:**
```
src/routes/
├── __root.tsx        ← Root layout
├── index.tsx         ← "/" route → Dashboard
├── editor.$id.tsx    ← "/editor/:id" route → Editor
└── landing.tsx       ← Not used yet
```

**After Refactoring:**

The routes will look like this:
```typescript
// src/routes/index.tsx
import { Dashboard } from '@/features/dashboard';

export const Route = createFileRoute('/')({
  component: () => <Dashboard />,
});
```

```typescript
// src/routes/editor.$id.tsx
import { EditorLayout } from '@/features/editor';

export const Route = createFileRoute('/editor/$id')({
  component: EditorLayout,  // or just Editor
});
```

---

## 📋 Minimal Feature Structure (Your Preference)

Based on your feedback "don't create folders if not necessary", here's the **minimal** structure:

### Dashboard Feature (HAS API calls)
```
src/features/dashboard/
├── components/
│   ├── Dashboard.tsx
│   ├── ResumeCard.tsx
│   ├── NewResume.tsx
│   └── FileActions.tsx
├── hooks/              ← ONLY create this (has API calls)
│   ├── use-resumes.ts
│   ├── use-resume-preview.ts
│   ├── use-resume-actions.ts
│   └── use-import-export.ts
└── index.ts
```

### Editor Feature (HAS API calls)
```
src/features/editor/
├── components/
│   ├── EditorLayout.tsx
│   ├── CodeEditor.tsx
│   ├── Preview.tsx
│   ├── EditorSidebar.tsx
│   ├── ResizeHandle.tsx
│   ├── settings/
│   │   └── SliderField.tsx
│   └── toolbar/
│       └── ... (9 toolbar components)
├── hooks/              ← ONLY create this (has API calls)
│   ├── use-editor-data.ts
│   ├── use-preview-zoom.ts
│   ├── use-editor-tools.ts
│   └── use-resume-styles.ts
├── stores/             ← Move cvDataAtom here
│   └── cv-data.ts
└── index.ts
```

**No `api/` folder** - just put the hooks in `hooks/` since they handle API calls.

**No `types/` folder** - use shared `src/types/resume.ts` or define inline if very feature-specific.

---

## 🚀 Quick Reference

| What | Where It Lives |
|------|----------------|
| Dashboard route (`/`) | `src/routes/index.tsx` |
| Editor route (`/editor/:id`) | `src/routes/editor.$id.tsx` |
| Dashboard feature | `src/features/dashboard/` |
| Editor feature | `src/features/editor/` |
| Resume types | `src/types/resume.ts` (shared) |
| Storage service | `src/services/storage.ts` (shared) |
| Smart pages hook | `src/hooks/useSmartPages.ts` (shared) |
| UI components | `src/components/ui/` (shared) |
| Header, Logo | `src/components/shared/` (shared) |

---

## ✅ Next Steps

1. **Create feature folders:**
   ```bash
   mkdir src\features\dashboard\components src\features\dashboard\hooks
   mkdir src\features\editor\components src\features\editor\hooks src\features\editor\stores
   ```

2. **Move components:**
   - `src/components/dashboard/*` → `src/features/dashboard/components/`
   - `src/components/editor/*` → `src/features/editor/components/`

3. **Extract hooks** (one at a time):
   - Start with `use-resumes.ts` (easiest)
   - Then `use-editor-data.ts`
   - Then refactor fat components

4. **Create barrel exports:**
   - `src/features/dashboard/index.ts`
   - `src/features/editor/index.ts`

5. **Update routes** to import from features

Would you like me to start with step 1 and help you move the files?
