# Architecture Research

**Domain:** React resume builder application
**Researched:** 2025-02-11
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Presentation Layer                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Routes  │  │ Components│ │   UI    │  │ Atoms   │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │            │            │            │              │
├───────┴────────────┴────────────┴────────────┴──────────────┤
│                        State Layer                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │  Atoms  │  │ Hooks    │  │ Context  │                   │
│  │ (Jotai) │  │ (Custom) │  │ (i18n)  │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
├─────────────────────────────────────────────────────────────┤
│                        Service Layer                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  API/Storage Services (localforage, toast, fonts) │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                        Utility Layer                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ Utils    │  │ Libs     │  │ Packages  │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component         | Responsibility                                                       | Typical Implementation                                                   |
| ----------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Routes**        | Page-level layout, data loading via route params, integrate services | `createFileRoute` from TanStack Router, load data in component or loader |
| **Components**    | Feature-specific UI (Dashboard, Editor, etc.)                        | Functional components with hooks, composition of UI elements             |
| **UI Components** | Reusable design system elements (Button, Dialog, etc.)               | Radix UI primitives + Tailwind styling (shadcn/ui pattern)               |
| **Atoms**         | Atomic state using Jotai for cross-component sharing                 | Primitive and derived atoms, useAtom hooks                               |
| **Services**      | Business logic, external API/storage operations                      | Singleton classes with async methods, error handling                     |
| **Utils**         | Pure functions, helpers, shared logic                                | Exported functions, no side effects                                      |

## Recommended Project Structure

```
src/
├── routes/              # Route components (page-level)
│   ├── __root.tsx     # Root route with layout providers
│   ├── index.tsx       # Landing page
│   ├── editor.$id.tsx  # Editor page (dynamic route)
│   └── routeTree.gen.ts # Generated route tree
├── components/          # Feature-based component organization
│   ├── dashboard/      # Dashboard feature components
│   │   ├── Dashboard.tsx
│   │   ├── FileActions.tsx
│   │   ├── NewResume.tsx
│   │   └── ResumeCard.tsx
│   ├── editor/         # Editor feature components
│   │   ├── CodeEditor.tsx
│   │   ├── Preview.tsx
│   │   ├── EditorSidebar.tsx
│   │   ├── EditorToolbar.tsx
│   │   ├── ResizeHandle.tsx
│   │   └── toolbar/   # Sub-feature: toolbar items
│   │       ├── ToolbarFile.tsx
│   │       ├── ToolbarThemeColor.tsx
│   │       └── ...
│   ├── shared/         # Shared components across features
│   │   ├── Header.tsx
│   │   ├── BrandName.tsx
│   │   ├── Logo.tsx
│   │   ├── Markdown.tsx
│   │   └── ToggleDark.tsx
│   └── ui/             # Design system (atomic UI components)
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── select.tsx
│       └── ...
├── atoms/              # Jotai atomic state (state management)
│   ├── index.ts        # Public API
│   ├── data.ts         # CV data atoms
│   ├── style.ts        # Style configuration atoms
│   └── ui.ts           # UI state atoms
├── services/            # Service layer (business logic + storage)
│   ├── storage.ts       # Local storage service
│   ├── toast.ts         # Toast notification service
│   └── fonts.ts         # Font loading service
├── utils/              # Pure utility functions
│   ├── index.ts        # Public API
│   ├── markdown.ts      # Markdown processing
│   ├── front-matter.ts  # Front matter parsing
│   ├── case-police.ts   # Case correction
│   ├── dynamic-css.ts  # Dynamic CSS injection
│   └── google-fonts-loader.ts
├── lib/                # Third-party library integrations
│   └── utils.ts        # shadcn/ui utilities (cn, etc.)
├── configs/             # Configuration files
│   ├── i18n.ts         # i18next configuration
│   └── pwa.ts           # PWA configuration
├── locales/             # Internationalization
│   ├── en.ts
│   ├── es.ts
│   ├── zh-cn.ts
│   ├── en.json
│   ├── es.json
│   └── zh.json
├── constants/           # Application constants
│   └── index.ts
├── index.css           # Global styles
├── main.tsx            # Application entry point
└── types.d.ts          # Global type declarations
```

### Structure Rationale

- **routes/**: Route components define pages. TanStack Router's file-based routing matches this structure.
- **components/**: Feature-based organization groups related components together (Dashboard, Editor, Shared). This scales better than type-based organization.
- **components/ui/**: Atomic UI components isolated from feature logic. Reusable design system.
- **atoms/**: Jotai atoms for state management. Centralized but composable.
- **services/**: Business logic and external integrations (storage, notifications). Separates concerns from UI.
- **utils/**: Pure functions without side effects. Easy to test and share.
- **configs/**: Configuration that shouldn't change at runtime (i18n, PWA).
- **locales/**: Translation files for i18next.

## Architectural Patterns

### Pattern 1: Feature-Based Component Organization

**What:** Group components by business feature (dashboard, editor) rather than type (containers, presentational).

**When to use:**

- Applications with multiple distinct features
- Teams working on specific features in parallel
- When components have shared state within a feature

**Trade-offs:**

- Pros: Easier to find related code, better feature isolation, scales with feature count
- Cons: Risk of duplicate UI components if not shared via `ui/` folder

**Example:**

```typescript
// ✅ Good: Feature-based
components/
  ├── dashboard/
  │   ├── Dashboard.tsx
  │   ├── FileActions.tsx
  │   └── ResumeCard.tsx
  └── editor/
      ├── CodeEditor.tsx
      └── Preview.tsx

// ❌ Avoid: Type-based
components/
  ├── containers/
  │   ├── Dashboard.tsx
  │   └── Editor.tsx
  └── presentational/
      ├── FileActions.tsx
      └── ResumeCard.tsx
```

### Pattern 2: Atomic State with Jotai

**What:** Use atomic state management with Jotai for granular, composable state.

**When to use:**

- State shared across multiple components
- Need derived/computed state
- Want to avoid prop drilling

**Trade-offs:**

- Pros: Minimal boilerplate, composable, TypeScript-first, no context provider boilerplate
- Cons: Learning curve for those used to Redux/Context, requires understanding of dependency tracking

**Example:**

```typescript
// atoms/data.ts
import { atom } from "jotai";

// Primitive atom
const resumeIdAtom = atom<number | null>(null);

// Derived read-only atom
const hasResumeAtom = atom((get) => get(resumeIdAtom) !== null);

// Derived read-write atom
const resumeStyleAtom = atom(
  (get) => get(cvDataAtom).styles,
  (get, set, newStyles) => {
    set(cvDataAtom, (prev) => ({ ...prev, styles: newStyles }));
  }
);
```

### Pattern 3: Service Layer for Business Logic

**What:** Extract business logic and external integrations into service classes.

**When to use:**

- Complex business logic
- External API/storage operations
- Need consistent error handling and logging

**Trade-offs:**

- Pros: Separation of concerns, testable, reusable, consistent error handling
- Cons: Additional abstraction layer, may feel overengineered for simple logic

**Example:**

```typescript
// services/storage.ts
class StorageService {
  private readonly store = localforage.createInstance({
    name: "oh-my-cv",
    storeName: "resumes"
  });

  async getResumes(): Promise<DbResume[]> {
    try {
      const keys = await this.store.keys();
      const resumes: DbResume[] = [];
      for (const key of keys) {
        const item = await this.store.getItem<DbResume>(String(key));
        if (item) resumes.push(item);
      }
      return resumes;
    } catch (error) {
      console.error("Failed to get resumes:", error);
      return [];
    }
  }

  async createResume(data?: Partial<DbResume>): Promise<DbResume | null> {
    // ... implementation
  }
}

export const storageService = new StorageService();
```

### Pattern 4: Route-Based Data Loading

**What:** Load data at the route level using TanStack Router's loader pattern.

**When to use:**

- Page-specific data requirements
- Need to handle loading/error states consistently
- Want to separate data fetching from UI

**Trade-offs:**

- Pros: Consistent loading states, automatic error handling, type-safe route params
- Cons: Requires learning TanStack Router patterns, may be overkill for simple apps

**Example:**

```typescript
// routes/editor.$id.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { cvDataAtom } from "@/atoms";
import { storageService } from "@/services/storage";

export const Route = createFileRoute("/editor/$id")({
  loader: async ({ params }) => {
    const resume = await storageService.getResume(parseInt(params.id));
    return { resume };
  },
  component: Editor
});

function Editor() {
  const { resume } = Route.useLoaderData();
  const [, setCvData] = useAtom(cvDataAtom);

  // ... component implementation
}
```

### Pattern 5: Error Boundaries at Feature Boundaries

**What:** Wrap major features in error boundaries to prevent cascading failures.

**When to use:**

- Features that can fail independently
- Third-party integrations
- Complex rendering logic

**Trade-offs:**

- Pros: Isolates failures, improves UX, better error reporting
- Cons: Requires React class component (or use react-error-boundary), additional component boilerplate

**Example:**

```typescript
// Use react-error-boundary for function component syntax
import { ErrorBoundary } from 'react-error-boundary'

<ErrorBoundary
  fallback={<div>Dashboard unavailable</div>}
  onError={(error) => logErrorToService(error)}
>
  <Dashboard />
</ErrorBoundary>
```

## Data Flow

### Request Flow

```
User Action (button click)
    ↓
Component Event Handler
    ↓
[Optional] useTransition for non-blocking updates
    ↓
Service Method (business logic)
    ↓
State Update (Jotai atom write)
    ↓
Component Re-render (subscription)
    ↓
UI Update
```

### State Management

```
Jotai Store
    ↓ (subscription)
Components (useAtom)
    ↓ (read/write)
Atoms (primitive/derived)
    ↓ (dependencies)
Other Atoms
```

### Key Data Flows

1. **Resume Loading Flow:**

   - Route param → `loader` → `storageService.getResume()` → `cvDataAtom` → Editor components

2. **User Input Flow:**

   - User typing → `onChange` → Jotai atom update → Derived atoms recalculate → Re-render

3. **Settings Persistence Flow:**
   - Settings change → `storageService.updateResume()` → Localforage → Optimistic UI update

## Scaling Considerations

| Scale         | Architecture Adjustments                                                                  |
| ------------- | ----------------------------------------------------------------------------------------- |
| 0-1k users    | Current monolithic architecture is fine. Client-side storage sufficient.                  |
| 1k-100k users | Add server-side sync, implement conflict resolution, add analytics.                       |
| 100k+ users   | Consider microservice architecture for auth/storage, CDN for static assets, edge caching. |

### Scaling Priorities

1. **First bottleneck:** Local storage quota limits ( IndexedDB has ~50-250MB limit depending on browser )

   - Fix: Implement cloud sync, compress stored data, implement LRU eviction policy

2. **Second bottleneck:** Render performance with large markdown documents
   - Fix: Virtualize list rendering, implement incremental rendering, use React.memo strategically

## Anti-Patterns

### Anti-Pattern 1: Prop Drilling for Shared State

**What people do:** Pass state through multiple component layers instead of using atoms.

**Why it's wrong:** Creates tight coupling, makes components brittle, difficult to refactor.

**Do this instead:** Use Jotai atoms for state shared across component boundaries.

```typescript
// ❌ Bad: Prop drilling
function App() {
  const [theme, setTheme] = useState('light')
  return <Dashboard theme={theme} setTheme={setTheme} />
}

function Dashboard({ theme, setTheme }) {
  return <Editor theme={theme} setTheme={setTheme} />
}

// ✅ Good: Jotai atom
const themeAtom = atom('light')

function Dashboard() {
  const [theme, setTheme] = useAtom(themeAtom)
  return <Editor />
}
```

### Anti-Pattern 2: Business Logic in Components

**What people do:** Put storage API calls, data transformation, and validation directly in component useEffect or handlers.

**Why it's wrong:** Mixes concerns, hard to test, creates duplicate logic, components become bloated.

**Do this instead:** Extract business logic into service layer.

```typescript
// ❌ Bad: Logic in component
function Dashboard() {
  useEffect(() => {
    const loadResumes = async () => {
      const keys = await localforage.keys();
      const resumes = [];
      for (const key of keys) {
        const item = await localforage.getItem(key);
        if (item) resumes.push(item);
      }
      setResumes(resumes);
    };
    loadResumes();
  }, []);
  // ...
}

// ✅ Good: Service layer
function Dashboard() {
  useEffect(() => {
    const load = async () => {
      const resumes = await storageService.getResumes();
      setResumes(resumes);
    };
    load();
  }, []);
  // ...
}
```

### Anti-Pattern 3: Type-Based Component Organization

**What people do:** Organize components by type (containers, presentational, layouts, etc.).

**Why it's wrong:** Components that belong to same feature are scattered, hard to find related code, doesn't scale.

**Do this instead:** Organize by feature, with a shared `ui/` folder for reusable components.

### Anti-Pattern 4: Global Context for Everything

**What people do:** Create a giant context with all app state and dispatch everything through it.

**Why it's wrong:** Everything re-renders when any state changes, performance issues, type safety issues.

**Do this instead:** Use atomic state (Jotai) where components only subscribe to what they need.

```typescript
// ❌ Bad: Giant context
const AppStateContext = createContext({
  resumes: [],
  currentResume: null,
  theme: "light",
  user: null
  // ... everything
});

// ✅ Good: Focused atoms
const resumesAtom = atom<DbResume[]>([]);
const currentResumeAtom = atom<DbResume | null>(null);
const themeAtom = atom("light");
```

### Anti-Pattern 5: Ignoring TypeScript Strictness

**What people do:** Use `as any`, `@ts-ignore`, or disable strict TypeScript checks.

**Why it's wrong:** Loses type safety, runtime errors become more likely, refactoring becomes dangerous.

**Do this instead:** Use strict TypeScript configuration (the project already has this), define proper types.

## Integration Points

### External Services

| Service             | Integration Pattern                    | Notes                                        |
| ------------------- | -------------------------------------- | -------------------------------------------- |
| LocalForage         | Service singleton                      | Wrap in StorageService class for consistency |
| i18next             | Provider at root, useTranslation hooks | Configure in `configs/i18n.ts`               |
| Toast notifications | Service singleton (Sonner)             | Wrap for consistent error/success messaging  |
| PWA                 | Vite plugin, service worker            | Config in `configs/pwa.ts`                   |

### Internal Boundaries

| Boundary                  | Communication                     | Notes                                      |
| ------------------------- | --------------------------------- | ------------------------------------------ |
| Routes ↔ Components      | Props (route params, loader data) | Route loader data is type-safe             |
| Components ↔ Atoms       | useAtom hooks                     | Automatic dependency tracking              |
| Components ↔ Services    | Direct method calls, async/await  | Services are stateless singletons          |
| UI Components ↔ Tailwind | className composition             | Use `cn()` utility for conditional classes |

## TypeScript Configuration and Strictness

The project uses strict TypeScript configuration which is critical for bulletproof React applications:

```json
{
  "compilerOptions": {
    "strict": true, // Enable all strict checks
    "noUnusedLocals": true, // Catch unused variables
    "noUnusedParameters": true, // Catch unused parameters
    "noFallthroughCasesInSwitch": true, // Prevent switch fallthrough bugs
    "verbatimModuleSyntax": true, // Explicit imports only
    "moduleResolution": "bundler", // Modern module resolution
    "jsx": "react-jsx" // New JSX transform
  }
}
```

**Key Benefits:**

- Catches null/undefined errors at compile time
- Prevents impossible states
- Makes refactoring safe
- Self-documenting code

## Code Splitting and Lazy Loading

### Route-Based Splitting (Automatic)

TanStack Router automatically code-splits routes. Each route file becomes its own chunk.

```typescript
// routes/editor.$id.tsx is automatically split
// Only loaded when user navigates to /editor/:id
export const Route = createFileRoute("/editor/$id")({
  component: Editor
});
```

### Component-Based Splitting (Manual)

For heavy components not tied to routes:

```typescript
import { lazy, Suspense } from 'react'

const HeavyPreview = lazy(() => import('./components/editor/Preview'))

function Editor() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyPreview />
    </Suspense>
  )
}
```

### Library Splitting

Use monorepo packages for shared libraries:

```
packages/
├── case-police/
├── dynamic-css/
├── front-matter/
├── google-fonts-loader/
└── utils/
```

## Monorepo Patterns

### Current Monorepo Structure

The project uses pnpm workspaces with shared packages:

```
oh-my-cv/
├── react-site/           # Main application
├── packages/             # Shared packages
│   ├── case-police/      # Browser case correction
│   ├── dynamic-css/      # Dynamic CSS injection
│   ├── front-matter/     # Front matter parsing
│   ├── google-fonts-loader/ # Font loading
│   ├── utils/            # Shared utilities
│   ├── react-smart-pages/ # React pagination
│   └── react-zoom/       # React zoom component
├── package.json          # Root with workspaces
└── pnpm-workspace.yaml  # Workspace configuration
```

### Workspace Protocol

Local dependencies use `workspace:*` protocol:

```json
// react-site/package.json
{
  "dependencies": {
    "@ohmycv/case-police": "workspace:*",
    "@ohmycv/utils": "workspace:*"
  }
}
```

### Build Commands

```bash
# Build all packages
pnpm run build:pkg

# Build specific package
pnpm --filter=@ohmycv/utils run build:pkg

# Fast build (no types)
pnpm run build-fast:pkg
```

### Benefits

- **Single version control:** All code in one repo
- **Shared dependencies:** Dedupes via pnpm
- **Atomic commits:** Changes to app + lib in single commit
- **Type safety:** Local packages have full TypeScript support

## Error Boundary Strategy

### Recommended Placement

1. **Root Boundary:** Catch unexpected errors, show generic error page
2. **Feature Boundaries:** Dashboard, Editor, etc. - isolate feature failures
3. **Third-Party Boundaries:** Around external integrations (Monaco Editor, etc.)

```typescript
// Root error boundary in __root.tsx
import { ErrorBoundary } from 'react-error-boundary'

<ErrorBoundary
  fallback={
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground">
          Please refresh the page or contact support.
        </p>
      </div>
    </div>
  }
  onError={(error, errorInfo) => {
    logErrorToService({ error, errorInfo })
  }}
>
  <Outlet />
</ErrorBoundary>
```

### Recovery Strategy

- **Display helpful message:** Explain what went wrong
- **Provide recovery action:** "Refresh page", "Go home", "Retry"
- **Log details:** Send error stack to logging service
- **Preserve state:** Don't lose user's work when possible

## Sources

- [React 19 Docs - Understanding UI as a Tree](https://react.dev/learn/understanding-your-ui-as-a-tree) - HIGH confidence, official React documentation
- [React 19 Docs - useTransition](https://react.dev/reference/react/useTransition) - HIGH confidence, official React documentation
- [Jotai Documentation](https://jotai.org/docs/core/atom) - HIGH confidence, official Jotai documentation
- [TanStack Router Documentation](https://tanstack.com/router/latest) - HIGH confidence, official TanStack documentation
- [React 19 Docs - Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) - HIGH confidence, official React documentation
- [react-error-boundary library](https://github.com/bvaughn/react-error-boundary) - HIGH confidence, widely-used library

---

_Architecture research for: React resume builder application_
_Researched: 2025-02-11_
