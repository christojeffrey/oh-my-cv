# Bulletproof React Architecture Analysis

## Executive Summary

This document analyzes the `oh-my-cv` React project against the [bulletproof-react](https://github.com/alan2207/bulletproof-react) architectural standards. The project currently follows a **component-centric** structure rather than a **feature-centric** structure, which is the core principle of bulletproof-react.

---

## 🔴 Critical Violations

### 1. **Project Structure - Missing Feature-Based Organization**

**Status**: ❌ **MAJOR VIOLATION**

The project uses a component-centric structure instead of feature-based modules:

**Current Structure:**
```
src/
├── components/
│   ├── dashboard/      # Should be a feature
│   ├── editor/         # Should be a feature
│   ├── shared/
│   └── ui/
├── hooks/
├── services/
├── atoms/
├── utils/
└── routes/
```

**Expected Bulletproof-React Structure:**
```
src/
├── features/
│   ├── dashboard/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── types/
│   │   └── index.ts       # Public API
│   ├── editor/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── types/
│   │   └── index.ts       # Public API
│   └── resume/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── stores/
│       ├── types/
│       └── index.ts
├── components/          # Only shared/generic components
├── hooks/              # Only shared hooks
├── lib/               # Third-party library wrappers
├── utils/             # Pure utility functions
└── routes/
```

**Violations:**

1. **`src/components/dashboard/`** - This is clearly a feature, not a shared component
   - Contains: `Dashboard.tsx`, `ResumeCard.tsx`, `NewResume.tsx`, `FileActions.tsx`
   - **Should be**: `src/features/dashboard/`

2. **`src/components/editor/`** - This is clearly a feature, not a shared component
   - Contains: `CustomizationPanel.tsx`, `CodeEditor.tsx`, `Preview.tsx`, `EditorSidebar.tsx`, etc.
   - **Should be**: `src/features/editor/`

---

### 2. **API Layer - Data Fetching Inside Components**

**Status**: ❌ **VIOLATION**

Data fetching logic is directly embedded in components instead of being abstracted into feature-specific API layers.

#### **Violating Files:**

##### `src/routes/editor.$id.tsx` (Lines 31-51)
```typescript
const loadResume = async () => {
  try {
    const resume = await storageService.getResume(Number.parseInt(id));
    if (resume) {
      setCvData({
        markdown: resume.markdown,
        css: resume.css,
        // ...
      });
    }
  } catch (error) {
    console.error("Error loading resume:", error);
  }
};
```

**Problem**: Direct service calls in route component.

**Expected Pattern**: Use a custom hook
```typescript
// src/features/editor/api/use-resume.ts
export function useResume(id: number) {
  const [cvData, setCvData] = useAtom(cvDataAtom);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResume = async () => {
      setIsLoading(true);
      try {
        const resume = await storageService.getResume(id);
        if (resume) {
          setCvData({...});
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadResume();
  }, [id]);

  return { cvData, isLoading };
}
```

##### `src/components/dashboard/Dashboard.tsx` (Lines 12-16)
```typescript
const loadResumes = async () => {
  setIsLoading(true);
  const data = await storageService.getResumes();
  setResumes(data);
  setIsLoading(false);
};
```

**Problem**: Data fetching logic inside presentational component.

**Expected**: Extract to `src/features/dashboard/api/use-resumes.ts`

##### `src/components/dashboard/ResumeCard.tsx` (Lines 56-143)
```typescript
useEffect(() => {
  const setupCard = async () => {
    // Inject custom CSS
    // Load fonts
    await googleFontsService.resolve(styles.fontEN);
    await googleFontsService.resolve(styles.fontCJK);
    setIsLoaded(true);
  };
  setupCard();
}, [resume]);
```

**Problem**: Complex side effects and data loading inside component.

**Expected**: Extract to a custom hook in `src/features/dashboard/hooks/`

##### Other violating components:
- `src/components/dashboard/NewResume.tsx` - Direct `storageService.createResume()` call
- `src/components/dashboard/FileActions.tsx` - Direct service calls
- `src/components/editor/CustomizationPanel.tsx` - Multiple `storageService.updateResume()` calls
- All toolbar components in `src/components/editor/toolbar/` - Direct service calls

---

### 3. **Feature Isolation - No Feature Boundaries**

**Status**: ❌ **VIOLATION**

Since there's no `features/` folder, there's no isolation between features. However, analyzing the current component structure reveals potential cross-feature coupling:

**Current Issues:**

1. **Global State Management**: `src/atoms/` is global
   - `cvDataAtom` is used across editor features and routes
   - Should be: `src/features/editor/stores/cv-data.ts`

2. **Shared Services**: `src/services/storage.ts` is used everywhere
   - This is acceptable as an infrastructure layer BUT
   - Feature-specific logic should be abstracted:
     ```typescript
     // ❌ Current: Direct service calls everywhere
     storageService.getResume(id)
     
     // ✅ Expected: Feature-specific API
     import { getResume } from '@/features/editor/api'
     ```

3. **No Public API Boundaries**: No `index.ts` files to control what's exported

---

### 4. **Dependency Flow - Violations**

**Status**: ⚠️ **PARTIAL VIOLATION**

The unidirectional flow should be: **Shared → Features → App**

**Current Violations:**

1. **Shared components importing from feature-like components**: ❌ None detected (good!)

2. **Routes directly importing from deep component paths**: ❌ **VIOLATION**
   ```typescript
   // src/routes/editor.$id.tsx
   import { CodeEditor } from "@/components/editor/CodeEditor.tsx";
   import { EditorSidebar } from "@/components/editor/EditorSidebar.tsx";
   import { Preview } from "@/components/editor/Preview.tsx";
   ```
   
   **Expected**:
   ```typescript
   // src/routes/editor.$id.tsx
   import { CodeEditor, EditorSidebar, Preview } from "@/features/editor";
   ```

3. **Components importing atoms directly**: ⚠️ Acceptable pattern but should be feature-scoped

---

### 5. **Component Design - Fat Components**

**Status**: ❌ **VIOLATION**

Multiple "fat components" mixing UI, business logic, and state management.

#### **Violating Files:**

##### `src/components/dashboard/ResumeCard.tsx` (243 lines)
**Problems:**
- ✅ UI rendering
- ❌ Data fetching (loading fonts)
- ❌ CSS injection logic (lines 59-133)
- ❌ Business logic (duplicate, delete operations)
- ❌ Navigation logic
- ❌ useSmartPages hook usage

**Complexity Score**: 🔴 9/10

**Refactoring Needed**:
```typescript
// Extract hook
// src/features/dashboard/hooks/use-resume-preview.ts
export function useResumePreview(resume: DbResume) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const setup = async () => {
      await googleFontsService.resolve(resume.styles.fontEN);
      await googleFontsService.resolve(resume.styles.fontCJK);
      setIsLoaded(true);
    };
    setup();
  }, [resume]);
  
  return { isLoaded };
}

// Extract CSS injection
// src/features/dashboard/utils/inject-resume-styles.ts
export function injectResumeStyles(resume: DbResume) { ... }

// Simplified component
export function ResumeCard({ resume, onUpdate }) {
  const { isLoaded } = useResumePreview(resume);
  const { handleEdit, handleDuplicate, handleDelete } = useResumeActions(resume, onUpdate);
  
  // Only UI rendering
}
```

##### `src/components/editor/Preview.tsx` (145 lines)
**Problems:**
- ✅ UI rendering
- ❌ Complex zoom calculations
- ❌ Container size management
- ❌ CSS injection
- ❌ Markdown rendering logic

**Complexity Score**: 🔴 8/10

**Refactoring Needed**:
```typescript
// Extract logic
// src/features/editor/hooks/use-preview-zoom.ts
export function usePreviewZoom(containerRef, paperSize) {
  // All zoom logic here
}

// src/features/editor/hooks/use-preview-renderer.ts
export function usePreviewRenderer(markdown, styles) {
  // Rendering + CSS injection
}
```

##### `src/routes/editor.$id.tsx` (112 lines)
**Problems:**
- ✅ Route definition
- ❌ Data loading
- ❌ Loading state management
- ❌ Error handling
- ✅ Layout composition (acceptable)

**Complexity Score**: 🟡 6/10

**Refactoring Needed**:
```typescript
// Extract to feature hook
// src/features/editor/api/use-editor-data.ts
export function useEditorData(id: number) {
  // All loading logic
}

// Simplified route
function Editor() {
  const { cvData, isLoading, error } = useEditorData(id);
  // Only layout
}
```

##### `src/components/editor/CustomizationPanel.tsx` (221 lines)
**Status**: ✅ **GOOD** - Already refactored into subcomponents!

This component demonstrates good composition:
- `LayoutSettings`
- `ColorSettings`
- `FontSettings`
- `PaperSettings`

However, it still violates API layer principles with direct service calls.

##### Other fat components:
- `src/components/editor/EditorSidebar.tsx` - 123 lines, managing tools config + scrolling
  - **Extract**: `useEditorTools()` hook

---

### 6. **Absolute Imports**

**Status**: ✅ **GOOD** (mostly)

The project uses absolute imports via `@/` alias configured in `tsconfig.json`.

**Minor Violations:**

1. `src/configs/i18n.ts` (Lines 3-5):
   ```typescript
   import en from "../locales/en";
   import es from "../locales/es";
   import zhCN from "../locales/zh-cn";
   ```
   
   **Fix**:
   ```typescript
   import en from "@/locales/en";
   import es from "@/locales/es";
   import zhCN from "@/locales/zh-cn";
   ```

---

## 📊 Summary Table

| Category | Status | Severity | Files Affected |
|----------|--------|----------|----------------|
| **Project Structure** | ❌ | 🔴 Critical | All files |
| **Feature Isolation** | ❌ | 🔴 Critical | All features |
| **API Layer** | ❌ | 🔴 Critical | 15+ components |
| **Dependency Flow** | ⚠️ | 🟡 Medium | Routes, components |
| **Component Design** | ❌ | 🔴 Critical | 6+ components |
| **Absolute Imports** | ⚠️ | 🟢 Low | 1 file |

---

## 🔧 Recommended Refactoring Plan

### Phase 1: Create Feature Structure (High Priority)
1. Create `src/features/dashboard/`
   - Move components from `src/components/dashboard/`
   - Create `api/`, `hooks/`, `types/`, `stores/`
   - Add `index.ts` for public API

2. Create `src/features/editor/`
   - Move components from `src/components/editor/`
   - Create `api/`, `hooks/`, `types/`, `stores/`
   - Add `index.ts` for public API

3. Create `src/features/resume/` (shared resume logic)
   - Move resume types from `src/types/resume.ts`
   - Move resume-related atoms
   - Create shared resume utilities

### Phase 2: Abstract API Layer (High Priority)
1. Extract data fetching to custom hooks:
   - `use-resume.ts`
   - `use-resumes.ts`
   - `use-resume-preview.ts`

2. Create feature-specific API modules:
   - `src/features/dashboard/api/`
   - `src/features/editor/api/`

### Phase 3: Refactor Fat Components (Medium Priority)
1. Extract business logic from:
   - `ResumeCard.tsx` → multiple hooks
   - `Preview.tsx` → zoom/render hooks
   - `EditorSidebar.tsx` → tools hook

2. Create headless components/hooks pattern:
   - `useZoom()` (headless)
   - `useResumeActions()` (headless)

### Phase 4: Clean Up Imports (Low Priority)
1. Fix relative imports in `src/configs/i18n.ts`
2. Add feature `index.ts` barrel exports
3. Update all imports to use feature public APIs

---

## 📋 Files Requiring Refactoring

### Critical Priority (Architectural Violations)

**Feature Structure:**
- `src/components/dashboard/` → `src/features/dashboard/`
  - Dashboard.tsx
  - ResumeCard.tsx
  - NewResume.tsx
  - FileActions.tsx

- `src/components/editor/` → `src/features/editor/`
  - CustomizationPanel.tsx
  - CodeEditor.tsx
  - Preview.tsx
  - EditorSidebar.tsx
  - EditorToolbar.tsx
  - ResizeHandle.tsx
  - settings/SliderField.tsx
  - toolbar/* (9 files)

**API Layer Violations (Create hooks/API):**
- `src/routes/editor.$id.tsx` → Extract `useEditorData()`
- `src/components/dashboard/Dashboard.tsx` → Extract `useResumes()`
- `src/components/dashboard/ResumeCard.tsx` → Extract `useResumePreview()`
- `src/components/dashboard/NewResume.tsx` → Extract `useCreateResume()`
- `src/components/dashboard/FileActions.tsx` → Extract `useResumeImportExport()`
- `src/components/editor/CustomizationPanel.tsx` → Extract `useResumeStyles()`
- All toolbar components → Extract `useToolbarAction()`

### High Priority (Fat Components)

- `src/components/dashboard/ResumeCard.tsx` (243 lines)
  - Extract: `useResumePreview()`, `useResumeActions()`, `injectResumeStyles()`
  
- `src/components/editor/Preview.tsx` (145 lines)
  - Extract: `usePreviewZoom()`, `usePreviewRenderer()`

- `src/components/editor/EditorSidebar.tsx` (123 lines)
  - Extract: `useEditorTools()`

- `src/routes/editor.$id.tsx` (112 lines)
  - Extract: `useEditorData()`

### Low Priority (Code Quality)

- `src/configs/i18n.ts` → Fix relative imports

---

## 🎯 Benefits of Refactoring

1. **Better Scalability**: Features are self-contained and can grow independently
2. **Easier Testing**: Each feature can be tested in isolation
3. **Clearer Boundaries**: Public APIs prevent unwanted coupling
4. **Improved Collaboration**: Teams can work on features without conflicts
5. **Faster Onboarding**: New developers understand feature structure immediately
6. **Better Code Reuse**: Shared logic is properly abstracted
7. **Maintainability**: Changes are localized to features

---

## 📚 References

- [Bulletproof React](https://github.com/alan2207/bulletproof-react)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [React Clean Architecture](https://github.com/eduardomoroni/react-clean-architecture)
