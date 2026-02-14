# Architecture Code Smells Analysis - Oh My CV

**Date:** 2026-02-14  
**Project:** oh-my-cv (React CV Builder Application)

## Executive Summary

This document identifies architectural code smells found in the oh-my-cv project. The analysis covers violations of SOLID principles, code duplication, inconsistent patterns, poor separation of concerns, and other architectural issues that may impact maintainability, testability, and scalability.

---

## 🔴 Critical Issues

### 1. **Duplicated Type Definitions (DRY Violation)**

**Smell:** Repeated interface definitions across multiple files  
**Severity:** High  
**Impact:** Maintenance nightmare, potential inconsistencies

**Evidence:**
```typescript
// Found in FOUR different files:
// 1. src/atoms/data.ts
// 2. src/services/storage.ts
// 3. src/services/fonts.ts
// 4. src/constants/index.ts

export interface Font {
  name: string;
  fontFamily?: string;
}

// Found in TWO files:
// 1. src/atoms/data.ts
// 2. src/services/storage.ts

export interface ResumeStyles {
  marginV: number;
  marginH: number;
  lineHeight: number;
  paragraphSpace: number;
  themeColor: string;
  fontCJK: Font;
  fontEN: Font;
  fontSize: number;
  paper: "A4" | "letter" | "legal";
}

// Found in TWO files:
// 1. src/atoms/data.ts
// 2. src/services/storage.ts

export interface DbResume {
  id: number;
  name: string;
  markdown: string;
  css: string;
  styles: ResumeStyles;
  created_at: Date;
  updated_at: Date;
}
```

**Recommendation:**
- Create a single source of truth in `src/types/resume.ts`
- Export all domain types from there
- Update all imports across the codebase

**Files to Refactor:**
- `src/atoms/data.ts`
- `src/services/storage.ts`
- `src/services/fonts.ts`
- `src/constants/index.ts`

---

### 2. **Duplicated Default Values (Magic Numbers)**

**Smell:** Hardcoded default values repeated across multiple locations  
**Severity:** High  
**Impact:** Inconsistent behavior, difficult to maintain

**Evidence:**
```typescript
// Default styles found in 3+ locations:

// 1. src/atoms/data.ts (lines 44-59, 63-78)
export const cvDataAtom = atom<SystemData>({
  styles: {
    marginV: 50,
    marginH: 45,
    lineHeight: 1.3,
    paragraphSpace: 5,
    themeColor: "#377bb5",
    fontCJK: { name: "华康宋体", fontFamily: "HKST" },
    fontEN: { name: "Minion Pro" },
    fontSize: 15,
    paper: "A4",
  },
  // ...
});

// 2. src/services/storage.ts (lines 65-80)
async createResume(data?: Partial<DbResume>): Promise<DbResume | null> {
  const resume: DbResume = {
    styles: {
      marginV: 50,
      marginH: 45,
      lineHeight: 1.3,
      paragraphSpace: 5,
      themeColor: "#377bb5",
      fontCJK: { name: "华康宋体", fontFamily: "HKST" },
      fontEN: { name: "Minion Pro" },
      fontSize: 15,
      paper: "A4",
    },
    // ...
  };
}

// 3. src/routes/editor.$id.tsx (lines 39-54)
styles: resume.styles || {
  marginV: 50,
  marginH: 45,
  lineHeight: 1.3,
  paragraphSpace: 5,
  themeColor: "#377bb5",
  fontCJK: { name: "华康宋体", fontFamily: "HKST" },
  fontEN: { name: "Minion Pro" },
  fontSize: 15,
  paper: "A4",
}

// 4. src/constants/index.ts (lines 67-83)
export const DEFAULT_STYLES = {
  marginV: 50,
  marginH: 45,
  lineHeight: 1.3,
  paragraphSpace: 5,
  themeColor: "#377bb5",
  fontCJK: { name: "华康宋体", fontFamily: "HKST" },
  fontEN: { name: "Arial", fontFamily: "Arial, sans-serif" }, // DIFFERENT!
  fontSize: 15,
  paper: "A4" as ValidPaperSize,
};
```

**Critical Issue:** Notice that `constants/index.ts` has a DIFFERENT default for `fontEN` ("Arial" vs "Minion Pro")!

**Recommendation:**
- Use a single constant from `src/constants/index.ts`
- Import and use `DEFAULT_STYLES` everywhere
- Fix the inconsistency in font defaults

---

### 3. **Redundant Atom Definition**

**Smell:** Two atoms managing the same data  
**Severity:** Medium-High  
**Impact:** Confusion, potential state synchronization issues

**Evidence:**
```typescript
// src/atoms/data.ts

// Atom 1: Full CV data including styles
export const cvDataAtom = atom<SystemData>({
  markdown: "",
  css: "",
  resumeId: null,
  resumeName: "",
  styles: { /* ... */ },
  loaded: false,
});

// Atom 2: Just the styles (REDUNDANT)
export const resumeStyleAtom = atom<SystemData["styles"]>({
  marginV: 50,
  marginH: 45,
  // ... identical to cvDataAtom.styles
});

// Atom 3: Dark mode (OK - separate concern)
export const darkModeAtom = atom<"light" | "dark" | "system">("system");
```

**Issue:** `resumeStyleAtom` appears to be unused and duplicates the state already in `cvDataAtom.styles`.

**Recommendation:**
- Remove `resumeStyleAtom` if unused
- If needed, derive it from `cvDataAtom` using Jotai's derived atoms:
  ```typescript
  export const resumeStyleAtom = atom((get) => get(cvDataAtom).styles);
  ```

---

## 🟡 Moderate Issues

### 4. **Service Coupling & Missing Abstraction**

**Smell:** Services accessing storage directly without abstraction  
**Severity:** Medium  
**Impact:** Tight coupling, difficult to test, hard to swap implementations

**Evidence:**
```typescript
// src/services/storage.ts
class StorageService {
  private readonly store = localforage.createInstance({ /* ... */ });
  // Direct dependency on localforage
}

// src/components/editor/CustomizationPanel.tsx
const updateStyle = async <K extends keyof ResumeStyles>(
  key: K,
  value: ResumeStyles[K]
) => {
  // Business logic mixed with storage calls
  const newStyles = { ...cvData.styles, [key]: value };
  setCvData((prev) => ({ ...prev, styles: newStyles }));
  
  // Direct call to storage service
  await storageService.updateResume(cvData.resumeId, { styles: newStyles }, false);
};
```

**Issues:**
- Components are tightly coupled to storage implementation
- No repository pattern or abstraction layer
- Difficult to mock for testing
- Business logic mixed with persistence logic

**Recommendation:**
- Introduce a Repository pattern:
  ```typescript
  // src/repositories/resume-repository.ts
  interface IResumeRepository {
    getAll(): Promise<DbResume[]>;
    getById(id: number): Promise<DbResume | null>;
    create(data: Partial<DbResume>): Promise<DbResume>;
    update(id: number, data: Partial<DbResume>): Promise<DbResume>;
    delete(id: number): Promise<void>;
  }
  
  class LocalStorageResumeRepository implements IResumeRepository {
    // Implementation using localforage
  }
  ```
- Use dependency injection or React Context to provide the repository
- Components should only interact with the repository interface, not the concrete implementation

---

### 5. **Mixed Concerns in Components**

**Smell:** Components handling too many responsibilities  
**Severity:** Medium  
**Impact:** Violates Single Responsibility Principle, hard to test

**Evidence:**
```typescript
// src/components/editor/CustomizationPanel.tsx
export function CustomizationPanel() {
  const [cvData, setCvData] = useAtom(cvDataAtom);

  // Concern 1: State management
  const updateStyle = async <K extends keyof ResumeStyles>(/* ... */) => {
    const newStyles = { ...cvData.styles, [key]: value };
    setCvData((prev) => ({ ...prev, styles: newStyles }));
  };

  // Concern 2: Font loading (external API)
  const updateFont = async (type, field, value) => {
    // ...
    if (field === "name") {
      await googleFontsService.resolve(newFont); // Side effect
    }
  };

  // Concern 3: Data persistence
  await storageService.updateResume(cvData.resumeId, { styles: newStyles }, false);

  // Concern 4: UI rendering
  return (
    <div>
      <LayoutSettings />
      <ColorSettings />
      {/* ... */}
    </div>
  );
}
```

**Issues:**
- Component handles state management, font loading, persistence, and rendering
- Difficult to test each concern in isolation
- Violates Single Responsibility Principle

**Recommendation:**
- Extract logic into custom hooks:
  ```typescript
  // src/hooks/useResumeStyles.ts
  export function useResumeStyles() {
    const [cvData, setCvData] = useAtom(cvDataAtom);
    
    const updateStyle = useCallback(async (key, value) => {
      const newStyles = { ...cvData.styles, [key]: value };
      setCvData((prev) => ({ ...prev, styles: newStyles }));
      await resumeRepository.updateStyles(cvData.resumeId, newStyles);
    }, [cvData, setCvData]);
    
    return { styles: cvData.styles, updateStyle };
  }
  
  // src/hooks/useResumeFonts.ts
  export function useResumeFonts() {
    // Font-specific logic
  }
  ```

---

### 6. **Procedural Service Pattern (Anti-pattern)**

**Smell:** Services as singletons with procedural methods  
**Severity:** Medium  
**Impact:** Difficult to test, violates dependency inversion

**Evidence:**
```typescript
// src/services/storage.ts
export const storageService = new StorageService(); // Singleton export

// src/services/fonts.ts
export const googleFontsService = new GoogleFontsService(); // Singleton export

// src/utils/markdown.ts
export const markdownService = new MarkdownService(); // Singleton export
```

**Issues:**
- Services are globally instantiated
- No way to mock or inject dependencies in tests
- Violates Dependency Inversion Principle
- Cannot easily swap implementations

**Recommendation:**
- Use dependency injection via React Context:
  ```typescript
  // src/contexts/services-context.tsx
  const ServicesContext = createContext<Services | null>(null);
  
  export function ServicesProvider({ children }: PropsWithChildren) {
    const services = useMemo(() => ({
      storage: new StorageService(),
      fonts: new GoogleFontsService(),
      markdown: new MarkdownService(),
    }), []);
    
    return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
  }
  
  export function useServices() {
    const context = useContext(ServicesContext);
    if (!context) throw new Error("useServices must be used within ServicesProvider");
    return context;
  }
  ```

---

### 7. **Inconsistent Naming Conventions**

**Smell:** Mixed naming between `lib`, `libs`, `utils`, and `services`  
**Severity:** Low-Medium  
**Impact:** Confusion about where to place new code

**Evidence:**
```
src/
├── lib/              # Generic libraries (google-fonts-loader, markdown plugins)
├── utils/            # Utility functions (markdown, dompurify, dynamic-css)
├── services/         # Business services (storage, fonts, toast)
```

**Issues:**
- Overlapping responsibilities between `lib` and `utils`
- `markdown` appears in both `utils/markdown.ts` and `lib/markdown/`
- Unclear distinction between `lib`, `utils`, and `services`

**Examples:**
- `src/lib/google-fonts-loader.ts` vs `src/services/fonts.ts` (both font-related)
- `src/utils/markdown.ts` vs `src/lib/markdown/` (both markdown-related)

**Recommendation:**
```
src/
├── lib/              # Third-party integrations & low-level utilities
│   ├── markdown/     # Markdown-it plugins
│   ├── google-fonts/ # Google Fonts API wrapper
│   └── storage/      # LocalForage wrapper
├── services/         # Business logic & domain services
│   ├── resume.ts     # Resume business logic
│   ├── fonts.ts      # Font management (uses lib/google-fonts)
│   └── markdown.ts   # Markdown rendering (uses lib/markdown)
└── utils/            # Pure utility functions (no side effects)
    ├── css.ts
    ├── html.ts
    └── date.ts
```

---

## 🟢 Minor Issues

### 8. **Inconsistent Error Handling**

**Smell:** Errors handled inconsistently across services  
**Severity:** Low-Medium  
**Impact:** Difficult to debug, inconsistent user experience

**Evidence:**
```typescript
// Pattern 1: Console.error + return null (storage.ts)
async getResume(id: number): Promise<DbResume | null> {
  try {
    return await this.store.getItem<DbResume>(String(id));
  } catch (error) {
    console.error("Failed to get resume:", error); // Just log
    return null; // Swallow error
  }
}

// Pattern 2: Console.error + return empty array (storage.ts)
async getResumes(): Promise<DbResume[]> {
  try {
    // ...
  } catch (error) {
    console.error("Failed to get resumes:", error);
    return []; // Return empty array
  }
}

// Pattern 3: Console.error + no return (fonts.ts)
async resolve(font: Font): Promise<void> {
  try {
    // ...
  } catch (error) {
    console.error(`Failed to load font: ${font.name}`, error);
    // No return, continues execution
  }
}

// Pattern 4: No error handling (routes/editor.$id.tsx)
const loadResume = async () => {
  try {
    const resume = await storageService.getResume(Number.parseInt(id));
    // ... lots of code
  } catch (error) {
    console.error("Error loading resume:", error);
    setIsLoading(false); // Only set loading state
    // No user feedback!
  }
};
```

**Recommendation:**
- Create a centralized error handling strategy
- Use a proper error boundary pattern
- Show user-friendly error messages via toast notifications
- Consider using a Result type for operations that can fail:
  ```typescript
  type Result<T, E = Error> = 
    | { success: true; data: T }
    | { success: false; error: E };
  
  async getResume(id: number): Promise<Result<DbResume>> {
    try {
      const data = await this.store.getItem<DbResume>(String(id));
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
  ```

---

### 9. **Missing TypeScript Strict Mode Enhancements**

**Smell:** Optional chaining used defensively where types could be stricter  
**Severity:** Low  
**Impact:** Runtime errors may slip through

**Evidence:**
```typescript
// src/components/editor/Preview.tsx
fontFamily: cvData.styles.fontEN?.fontFamily || "Arial, sans-serif",

// Why is fontFamily optional in the type?
// This suggests the type definition might be incorrect
```

**Recommendation:**
- Review type definitions to ensure required fields are not marked as optional
- Enable stricter TypeScript settings if not already enabled:
  ```json
  {
    "compilerOptions": {
      "strict": true,
      "noUncheckedIndexedAccess": true,
      "exactOptionalPropertyTypes": true
    }
  }
  ```

---

### 10. **Component File Organization**

**Smell:** Sub-components defined in the same file as parent  
**Severity:** Low  
**Impact:** Large files, harder to navigate

**Evidence:**
```typescript
// src/components/editor/CustomizationPanel.tsx (221 lines)

export function CustomizationPanel() { /* ... */ }

interface SettingsProps { /* ... */ }
function LayoutSettings({ styles, onUpdate }: Readonly<SettingsProps>) { /* ... */ }
function ColorSettings({ styles, onUpdate }: Readonly<SettingsProps>) { /* ... */ }

interface FontSettingsProps { /* ... */ }
function FontSettings({ styles, onUpdateFont }: Readonly<FontSettingsProps>) { /* ... */ }

function PaperSettings({ styles, onUpdate }: Readonly<SettingsProps>) { /* ... */ }
```

**Note:** Based on conversation history, this was recently refactored (conversation 8f3d6a0a), so this is actually an improvement! However, the sub-components could still be moved to separate files.

**Recommendation (Optional):**
```
src/components/editor/
├── CustomizationPanel.tsx     # Main component
└── settings/
    ├── LayoutSettings.tsx
    ├── ColorSettings.tsx
    ├── FontSettings.tsx
    └── PaperSettings.tsx
```

---

### 11. **Unclear Scope of `lib` vs Plugin Directories**

**Smell:** Library code mixed with application code  
**Severity:** Low  
**Impact:** Unclear boundaries, difficult to extract as npm package if needed

**Evidence:**
```
src/lib/
├── case-police/          # Custom plugin
├── markdown/             # Custom markdown-it plugins
├── dynamic-css.ts        # Utility function
├── front-matter.ts       # Parser
├── google-fonts-loader.ts # API wrapper
└── utils.ts              # Generic utilities (cn function)
```

**Issues:**
- `lib/utils.ts` contains the `cn` function (className utility), which is more of a UI utility
- `dynamic-css.ts` could be in `utils/`
- Unclear which code is "library" vs "application utility"

**Recommendation:**
- `lib/` should contain code that could potentially be extracted as separate packages
- Application-specific utilities should be in `utils/`
- Consider moving `lib/utils.ts` to `utils/classnames.ts`

---

## 📊 Architecture Metrics

| Metric | Count | Status |
|--------|-------|--------|
| Duplicated Interfaces | 4 (Font), 2 (ResumeStyles), 2 (DbResume) | 🔴 Critical |
| Duplicated Default Values | 4 locations | 🔴 Critical |
| Singleton Services | 3 | 🟡 Moderate |
| Component Concerns | 3-4 per component | 🟡 Moderate |
| Error Handling Patterns | 4+ different patterns | 🟡 Moderate |
| Directory Organization | Mixed | 🟢 Minor |

---

## 🎯 Recommended Refactoring Priorities

### Phase 1: High Priority (Week 1)
1. **Consolidate Type Definitions** - Create `src/types/resume.ts` and remove duplicates
2. **Unify Default Values** - Use single constant across codebase
3. **Remove Redundant Atom** - Remove or derive `resumeStyleAtom`

### Phase 2: Medium Priority (Week 2)
4. **Extract Business Logic to Hooks** - Create `useResumeStyles`, `useResumeFonts`
5. **Standardize Error Handling** - Implement consistent error handling strategy
6. **Improve Service Testability** - Add dependency injection via Context

### Phase 3: Low Priority (Week 3)
7. **Reorganize Directory Structure** - Clarify `lib` vs `utils` vs `services`
8. **Split Large Components** - Move sub-components to separate files if needed
9. **TypeScript Strictness** - Review optional types and enable stricter checks

---

## 🧪 Testing Recommendations

Due to the architectural issues identified, the following areas are particularly difficult to test:

1. **Storage Operations** - Tightly coupled to localforage
2. **Font Loading** - Direct singleton usage
3. **Component Business Logic** - Mixed with UI rendering

**Recommended Testing Strategy:**
- Unit tests for pure functions in `utils/`
- Integration tests for services with mock storage
- Component tests with mocked hooks
- E2E tests for critical user flows

---

## 📝 Summary

This codebase shows signs of rapid development with some good patterns (component composition, TypeScript usage, modern React hooks) but also several architectural code smells that should be addressed:

**Strengths:**
✅ Modern React patterns (hooks, Jotai for state)  
✅ TypeScript for type safety  
✅ Component composition (sub-components)  
✅ Recent refactoring efforts (based on conversation history)

**Weaknesses:**
❌ Significant code duplication (types, defaults)  
❌ Tight coupling to implementation details  
❌ Mixed concerns in components  
❌ Inconsistent error handling  
❌ Difficult to test in isolation

**Overall Assessment:** The code is functional but would benefit from refactoring to improve maintainability, testability, and scalability. The issues are addressable through systematic refactoring in the phases suggested above.

---

**Generated:** 2026-02-14T18:39:52+07:00  
**Analyzer:** Antigravity AI  
**Project Version:** 0.0.0
