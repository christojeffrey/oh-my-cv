# React Application Pitfalls

**Domain:** React Applications / Resume Builder
**Researched:** February 11, 2026
**Confidence:** HIGH

## Executive Summary

React applications are prone to specific categories of pitfalls that directly impact maintenance, production quality, and user experience. Based on official React documentation and ecosystem research, the most critical pitfalls for the "Oh My CV" resume builder project include:

1. **XSS vulnerabilities from unsanitized markdown** - Direct impact on production security
2. **Missing error boundaries** - Causes complete app crashes in production
3. **State mutation** - Leads to unpredictable UI behavior and bugs
4. **Unnecessary re-renders** - Performance degradation as app grows
5. **Missing cleanup in useEffect** - Memory leaks and SSR failures
6. **TypeScript `any` overuse** - Defeats the purpose of static typing
7. **Direct window/document access** - Breaks SSR compatibility
8. **Monolithic state management** - Scales poorly, becomes unmaintainable

This research identifies these pitfalls with specific warning signs, prevention strategies, and phase-specific recommendations for the roadmap.

---

## Critical Pitfalls

### Pitfall 1: XSS from Unsanitized User Content

**What goes wrong:**
Rendering unsanitized HTML or markdown with `dangerouslySetInnerHTML` or other rendering methods allows attackers to inject malicious scripts. This can steal user data, redirect users, or perform actions on their behalf.

**Why it happens:**
Developers often use `dangerouslySetInnerHTML` for rendering markdown, rich text, or HTML fragments without proper sanitization. The resume builder particularly has this risk since it renders user-provided markdown content.

**How to avoid:**

```tsx
// ✅ CORRECT: Sanitize before rendering
import DOMPurify from "dompurify";

function MarkdownRenderer({ content }: { content: string }) {
  const cleanHTML = DOMPurify.sanitize(marked(content));
  return (
    <div className="markdown-content" dangerouslySetInnerHTML={{ __html: cleanHTML }} />
  );
}

// ❌ WRONG: Direct rendering without sanitization
function UnsafeMarkdown({ content }: { content: string }) {
  return <div dangerouslySetInnerHTML={{ __html: marked(content) }} />;
}
```

**Warning signs:**

- Using `dangerouslySetInnerHTML` without a sanitization library
- Rendering user-provided content (markdown, HTML) directly
- No Content Security Policy (CSP) headers configured
- Security scanners flagging potential XSS vulnerabilities

**Phase to address:** Phase 1 (Foundation)

- This is a security-critical issue that must be addressed before production
- Should be integrated with the markdown rendering infrastructure

---

### Pitfall 2: Missing Error Boundaries

**What goes wrong:**
When a component throws an error during rendering, the entire React tree unmounts, showing users a blank screen instead of a graceful error message. This results in poor user experience and makes debugging difficult.

**Why it happens:**
Developers often skip error boundaries assuming their components will never throw errors. However, network failures, malformed data, or unexpected user input can trigger errors.

**How to avoid:**

```tsx
// ✅ CORRECT: Wrap critical sections in error boundaries
import { Component, ReactNode } from "react";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    // Send to error reporting service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>We apologize for the inconvenience.</p>
          <button onClick={() => window.location.reload()}>Try again</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Use at route level and around critical components
<ErrorBoundary>
  <ResumeEditor />
</ErrorBoundary>;
```

**Warning signs:**

- App shows blank screen when errors occur
- No error reporting to monitoring services
- Components render complex logic (data fetching, transformations) without protection
- Console errors visible in production

**Phase to address:** Phase 1 (Foundation)

- Error boundaries should be implemented early in the project
- Wrap all route components and potentially problematic sections

---

### Pitfall 3: Direct Mutation of State and Props

**What goes wrong:**
Mutating state or props directly breaks React's rendering model, causing components to not re-render when they should, or re-render with stale data. This leads to unpredictable UI behavior and difficult-to-track bugs.

**Why it happens:**
Developers familiar with imperative programming often mutate objects/arrays directly instead of creating new ones. This is especially common with arrays (`push`, `pop`) and objects (modifying nested properties).

**How to avoid:**

```tsx
// ❌ WRONG: Mutating state directly
function TodoListBad() {
  const [todos, setTodos] = useState<Todo[]>([]);

  function addTodo(text: string) {
    // BAD: Mutates the array directly
    todos.push({ id: Date.now(), text, done: false });
    setTodos(todos); // Won't trigger re-render!
  }

  function toggleTodo(id: number) {
    // BAD: Mutates object in array
    const todo = todos.find((t) => t.id === id)!;
    todo.done = !todo.done;
    setTodos(todos);
  }

  return /* ... */;
}

// ✅ CORRECT: Create new objects/arrays
function TodoListGood() {
  const [todos, setTodos] = useState<Todo[]>([]);

  function addTodo(text: string) {
    setTodos([...todos, { id: Date.now(), text, done: false }]);
  }

  function toggleTodo(id: number) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  return /* ... */;
}

// Alternative: Use Immer for complex updates
import { useImmer } from "use-immer";

function TodoListImmer() {
  const [todos, updateTodos] = useImmer<Todo[]>([]);

  function toggleTodo(id: number) {
    updateTodos((draft) => {
      const todo = draft.find((t) => t.id === id);
      if (todo) {
        todo.done = !todo.done; // Safe mutation of draft
      }
    });
  }

  return /* ... */;
}
```

**Warning signs:**

- State updates don't trigger re-renders
- UI shows stale data after state changes
- Strict Mode calls component twice but UI doesn't behave differently
- Using `push`, `pop`, `splice`, `sort` directly on state arrays

**Phase to address:** Phase 1 (Foundation)

- Establish patterns for correct state updates early
- Consider using Immer for complex state updates
- Enable Strict Mode to catch mutations during development

---

### Pitfall 4: Missing Cleanup in useEffect

**What goes wrong:**
Effects that set up subscriptions, timers, or connections without cleanup functions cause:

- Memory leaks (event listeners accumulating)
- Server-side rendering failures (window/document not available)
- Race conditions and stale data
- Connections that never close

**Why it happens:**
Developers focus on the setup logic (the effect body) but forget to return a cleanup function. This is especially common with event listeners, intervals, timeouts, and API connections.

**How to avoid:**

```tsx
// ❌ WRONG: No cleanup
function ChatRoomBad({ roomId }: { roomId: string }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect(); // Never disconnects!

    // Event listener never removed
    window.addEventListener("resize", handleResize);

    return <div>Chat Room {roomId}</div>;
  }, [roomId]);
}

// ✅ CORRECT: Proper cleanup
function ChatRoomGood({ roomId }: { roomId: string }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();

    function handleResize() {
      // ... handle resize
    }
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      connection.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [roomId]);

  return <div>Chat Room {roomId}</div>;
}

// ✅ CORRECT: Abort fetch requests
function UserProfile({ userId }: { userId: number }) {
  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function fetchProfile() {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          signal: controller.signal
        });
        const data = await response.json();

        if (!ignore) {
          setProfile(data);
        }
      } catch (error) {
        if (!ignore && error.name !== "AbortError") {
          setError(error);
        }
      }
    }

    fetchProfile();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [userId]);

  return /* ... */;
}
```

**Warning signs:**

- Chrome DevTools shows increasing event listener counts
- Network requests complete after component unmounts
- "Maximum update depth exceeded" errors
- Hydration mismatches when using SSR
- Direct access to `window` or `document` in effects without guards

**Phase to address:** Phase 1 (Foundation)

- Establish cleanup patterns from the start
- Add eslint rules for `react-hooks/exhaustive-deps` and `react-hooks/rules-of-hooks`

---

### Pitfall 5: Premature or Incorrect Memoization

**What goes wrong:**
Either (a) over-memoizing everything, causing code complexity and maintenance burden without performance gains, or (b) under-memoizing expensive calculations, causing unnecessary re-renders and performance issues.

**Why it happens:**
Developers either:

- Add `useMemo` and `useCallback` everywhere without measuring performance impact
- Don't memoize at all, then suffer performance issues as the app grows
- Misuse memoization to "fix" bugs that should be solved differently

**How to avoid:**

```tsx
// ❌ WRONG: Memoizing everything without need
function FormBad() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Unnecessary: Simple calculation
  const isValid = useMemo(() => {
    return name.length > 0 && email.includes('@');
  }, [name, email]);

  // Unnecessary: Stable function not needed
  const handleSubmit = useCallback(() => {
    console.log('submit', { name, email });
  }, [name, email]);

  return /* ... */;
}

// ✅ CORRECT: Measure first, optimize only when needed
function FormGood() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Simple validation - no memoization needed
  const isValid = name.length > 0 && email.includes('@');

  // Stable function not needed unless passed to memoized child
  const handleSubmit = () => {
    console.log('submit', { name, email });
  };

  return /* ... */;
}

// ✅ CORRECT: Memoize expensive calculations
function ExpensiveList({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState('');

  // Memoize only if actually slow (measure first!)
  const filteredItems = useMemo(() => {
    console.log('Filtering items...'); // Logs to verify re-runs
    return items.filter(item => item.name.includes(filter));
  }, [items, filter]);

  return (
    <input value={filter} onChange={e => setFilter(e.target.value)} />
    <MemoizedList items={filteredItems} />
  );
}

const MemoizedList = memo(function List({ items }: { items: Item[] }) {
  return <ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>;
});
```

**Warning signs:**

- Adding `useMemo`/`useCallback` without profiling
- Large number of memoization calls scattered throughout codebase
- Using memoization to fix logic bugs (state not updating)
- Performance issues with simple components

**Phase to address:** Phase 2 (Performance Optimization)

- Don't optimize prematurely
- Profile with React DevTools Profiler before optimizing
- Focus on actual performance bottlenecks, not theoretical ones

---

### Pitfall 6: Overusing `any` in TypeScript

**What goes wrong:**
Using `any` defeats the purpose of TypeScript, allowing type errors to slip through to runtime. This reduces code quality, makes refactoring dangerous, and hides potential bugs.

**Why it happens:**
Developers use `any` as a shortcut when types are complex or unknown, especially when:

- Migrating JavaScript to TypeScript incrementally
- Working with third-party libraries lacking types
- Dealing with dynamic data (API responses, user input)

**How to avoid:**

```tsx
// ❌ WRONG: Using any everywhere
function processUserDataBad(user: any) {
  // No type checking - property could be anything
  console.log(user.name.toUpperCase()); // Runtime error if name is not a string
  console.log(user.age + 10); // No type safety
  return user as any; // Hides errors from callers
}

// ✅ CORRECT: Define proper types
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  preferences?: UserPreferences;
}

interface UserPreferences {
  theme: "light" | "dark";
  notifications: boolean;
}

function processUserDataGood(user: User) {
  // Type-safe - TypeScript catches errors
  console.log(user.name.toUpperCase()); // ✓ Type-checked
  console.log(user.age + 10); // ✓ Type-checked
  return user; // ✓ Type is preserved
}

// ✅ CORRECT: For unknown data, use unknown + type guards
function parseApiResponse(data: unknown): User | null {
  if (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "name" in data &&
    "email" in data
  ) {
    const obj = data as Record<string, unknown>;
    return {
      id: String(obj.id),
      name: String(obj.name),
      email: String(obj.email),
      age: Number(obj.age)
    };
  }
  return null;
}
```

**Warning signs:**

- Multiple `as any` casts throughout codebase
- TypeScript errors ignored with `@ts-ignore`
- No shared type definitions for API responses
- Type errors only discovered at runtime

**Phase to address:** Phase 1 (Foundation)

- Set up TypeScript with strict mode from the start
- Create shared type definitions for common data structures
- Establish pattern: `unknown` + type guards for dynamic data
- Configure eslint to warn on `@ts-ignore` and explicit `any`

---

### Pitfall 7: Direct Window/Document Access (SSR Breaks)

**What goes wrong:**
Accessing `window`, `document`, or other browser globals directly during rendering breaks server-side rendering (SSR) and causes hydration mismatches. Even without SSR, this pattern couples components to browser environment, making testing and reuse difficult.

**Why it happens:**
Developers need to access browser APIs (local storage, URL params, screen size) and do so directly in components without considering SSR or testing implications.

**How to avoid:**

```tsx
// ❌ WRONG: Direct window access in render
function ComponentBad() {
  // Crashes on server, hydration mismatch on client
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return <div className={isDark ? "dark" : "light"}>...</div>;
}

// ✅ CORRECT: Check for browser environment
function ComponentGood() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Only runs on client, no hydration issues
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return <div className={isDark ? "dark" : "light"}>...</div>;
}

// ✅ CORRECT: Abstract browser APIs into custom hooks
function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    }
    return defaultValue;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue] as const;
}
```

**Warning signs:**

- "window is not defined" errors during SSR
- Hydration mismatch warnings in console
- "Text content does not match server-rendered HTML" warnings
- Components crash when rendered outside browser environment

**Phase to address:** Phase 1 (Foundation)

- Establish pattern: all browser access through custom hooks or effects
- Use `typeof window !== 'undefined'` guards when necessary
- Test components in non-browser environments

---

### Pitfall 8: Monolithic State Service

**What goes wrong:**
A single large state management service (like a huge Redux store or monolithic Context) becomes:

- Difficult to reason about (who updates what?)
- Hard to maintain (one file with hundreds of actions)
- Performance issues (everything re-renders on any state change)
- Impossible to tree-shake or code-split

**Why it happens:**
Developers start with a simple state solution and keep adding to it without refactoring. As the app grows, the monolithic structure becomes unwieldy.

**How to avoid:**

```tsx
// ❌ WRONG: Single massive store
const initialState = {
  user: {
    profile: null as Profile | null,
    preferences: null as Preferences | null,
    session: null as Session | null,
    notifications: []
    // ... 50 more user-related fields
  },
  editor: {
    resume: null as Resume | null,
    templates: [],
    history: []
    // ... 30 more editor fields
  },
  ui: {
    theme: "light",
    sidebarOpen: true,
    modal: null
    // ... 20 more UI fields
  }
  // ... hundreds more fields
};

function reducer(state = initialState, action: any) {
  // 200+ line switch statement
  switch (
    action.type
    // ... hundreds of cases
  ) {
  }
}

// ✅ CORRECT: Split into focused contexts/stores
// User context - focused on user data
const UserContext = createContext<UserContextValue | null>(null);

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<Preferences>({});

  const value = useMemo(
    () => ({
      user,
      setUser,
      preferences,
      setPreferences
    }),
    [user, preferences]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Editor context - focused on resume editing
const EditorContext = createContext<EditorContextValue | null>(null);

function EditorProvider({ children }: { children: ReactNode }) {
  const [resume, setResume] = useState<Resume>({});
  const [history, setHistory] = useState<Resume[]>([]);

  const value = useMemo(
    () => ({
      resume,
      setResume,
      history,
      setHistory
    }),
    [resume, history]
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

// UI context - focused on UI state
const UIContext = createContext<UIContextValue | null>(null);

function UIProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [modal, setModal] = useState<ModalState | null>(null);

  return (
    <UIContext.Provider value={{ theme, setTheme, modal, setModal }}>
      {children}
    </UIContext.Provider>
  );
}

// Compose providers
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <UIProvider>
      <UserProvider>
        <EditorProvider>{children}</EditorProvider>
      </UserProvider>
    </UIProvider>
  );
}
```

**Warning signs:**

- Single context/store with 50+ properties
- Reducer with 100+ action types
- Changing one piece of state causes many unrelated re-renders
- Difficult to find where state is updated
- Team members afraid to touch the state file

**Phase to address:** Phase 2 (State Management Refactoring)

- Start with smaller, focused state solutions
- Split large contexts/stores by feature or concern
- Consider colocation: keep state close to where it's used

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut                               | Immediate Benefit            | Long-term Cost                       | When Acceptable                     |
| -------------------------------------- | ---------------------------- | ------------------------------------ | ----------------------------------- |
| Using `any` for complex types          | Unblocks development quickly | Loses type safety, bugs slip through | MVP phase, strict types added later |
| Skipping error boundaries initially    | Faster initial development   | Production crashes, poor UX          | Never - add from start              |
| Inline styles instead of CSS modules   | No CSS file to create        | Hard to maintain, no caching         | Component prototypes                |
| Direct localStorage access             | Quick state persistence      | SSR issues, hard to test             | Internal tools only                 |
| Skipping TypeScript initially          | Faster prototyping           | Debt to pay later, no safety         | Proof of concept only               |
| `eslint-disable` comments              | Fixes lint errors quickly    | Loses code quality signals           | Temporary during refactoring        |
| Monolithic components initially        | Fewer files to manage        | Hard to understand, test, reuse      | Very small apps only                |
| Using external CDN libs instead of npm | No build step needed         | No version control, slower loads     | Experiments only                    |

---

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration         | Common Mistake                                             | Correct Approach                                             |
| ------------------- | ---------------------------------------------------------- | ------------------------------------------------------------ |
| Markdown rendering  | Using `dangerouslySetInnerHTML` directly with user content | Sanitize with DOMPurify or use a trusted markdown library    |
| Local Storage       | Accessing during render (breaks SSR)                       | Access in useEffect with `typeof window` check               |
| API calls           | No error handling or loading states                        | Implement error boundaries, loading skeletons, retry logic   |
| Authentication      | Storing tokens in plain localStorage                       | Use httpOnly cookies or secure storage APIs                  |
| File uploads        | No size limits or validation                               | Validate on client and server, implement progress indicators |
| Analytics           | Tracking PII in production events                          | Sanitize data, implement opt-out mechanisms                  |
| Third-party widgets | Mounting in render (SSR issues)                            | Mount in useEffect or use lazy loading with `ssr: false`     |

---

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap                             | Symptoms                       | Prevention                                                     | When It Breaks                              |
| -------------------------------- | ------------------------------ | -------------------------------------------------------------- | ------------------------------------------- |
| Unnecessary re-renders           | Laggy UI, high CPU             | Memoize expensive calculations, use `React.memo` strategically | 100+ components, frequent state updates     |
| Large bundle size                | Slow initial load              | Code splitting, tree shaking, lazy routes                      | 50+ pages, complex libraries                |
| Missing virtualization           | Scrolling freezes              | Use react-window or react-virtualized                          | Lists with 1000+ items                      |
| Expensive calculations in render | UI freezes on every keystroke  | Move to useMemo or worker                                      | Complex filtering, sorting, transformations |
| Unoptimized images               | High bandwidth use             | Serve multiple sizes, use lazy loading                         | Many images, mobile users                   |
| Missing debounce/throttle        | Too many API calls             | Debounce search inputs, throttle scroll events                 | Search, infinite scroll                     |
| Key prop issues                  | Weird rendering bugs           | Use stable IDs, not array indices                              | Dynamic lists, reorderable items            |
| Inline function props            | Child re-renders unnecessarily | useCallback for stable references                              | Memoized child components                   |

---

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake                     | Risk                         | Prevention                                 |
| --------------------------- | ---------------------------- | ------------------------------------------ |
| XSS from markdown rendering | Script injection, data theft | Use DOMPurify, whitelist tags              |
| Unsafe HTML attributes      | Attribute injection          | Use whitelist libraries, sanitize props    |
| Unvalidated user input      | Data corruption, injection   | Validate on client and server              |
| Exposed API keys            | Unauthorized access          | Use environment variables, backend proxies |
| No Content Security Policy  | XSS vulnerabilities easier   | Implement CSP headers                      |
| Missing CSRF protection     | Cross-site request forgery   | Use CSRF tokens, SameSite cookies          |
| Plaintext sensitive data    | Interception                 | Use HTTPS, encrypt at rest                 |
| No rate limiting            | DoS attacks                  | Implement rate limiting on API             |

---

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall                | User Impact                        | Better Approach                            |
| ---------------------- | ---------------------------------- | ------------------------------------------ |
| No loading states      | Users don't know if app is working | Implement skeleton screens, spinners       |
| Missing error recovery | Users stuck on error               | Add retry buttons, clear error messages    |
| No optimistic updates  | Feels sluggish                     | Update UI immediately, rollback on failure |
| Lost work on refresh   | User frustration                   | Auto-save to localStorage                  |
| Poor mobile experience | High bounce rate                   | Responsive design, touch-friendly targets  |
| No keyboard navigation | Inaccessible to keyboard users     | Proper tab order, keyboard shortcuts       |
| Missing confirmations  | Accidental actions                 | Confirm destructive actions, show undo     |
| No feedback on actions | Users don't know action succeeded  | Toast notifications, status indicators     |
| Slow page transitions  | App feels sluggish                 | Use layout transitions, skeleton screens   |
| No offline support     | Can't work without internet        | Service workers, offline cache             |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Markdown Rendering:** Often missing sanitization — verify DOMPurify or equivalent is configured
- [ ] **Error Handling:** Often missing error boundaries — verify routes are wrapped
- [ ] **State Persistence:** Often missing auto-save — verify localStorage integration
- [ ] **Form Validation:** Often missing real-time feedback — verify validation UX
- [ ] **Mobile Responsive:** Often missing touch targets — verify on actual device
- [ ] **Accessibility:** Often missing keyboard navigation — verify tab through entire app
- [ ] **Performance:** Often missing code splitting — verify bundle size is reasonable
- [ ] **Security:** Often missing CSRF protection — verify API has safeguards
- [ ] **Testing:** Often missing integration tests — verify critical flows work
- [ ] **Analytics:** Often missing error tracking — verify Sentry or similar is set up

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall                      | Recovery Cost | Recovery Steps                                                                                                                                    |
| ---------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| XSS vulnerability discovered | HIGH          | 1. Audit all `dangerouslySetInnerHTML` usage<br/>2. Add sanitization layer<br/>3. Implement CSP headers<br/>4. Security audit of all user content |
| Missing error boundaries     | MEDIUM        | 1. Wrap all route components<br/>2. Add error reporting (Sentry)<br/>3. Test error scenarios<br/>4. Add fallback UI                               |
| State mutation bugs          | HIGH          | 1. Enable Strict Mode to catch issues<br/>2. Audit all state updates<br/>3. Refactor to use spread/Immer<br/>4. Add tests for state mutations     |
| Memory leaks                 | HIGH          | 1. Audit all useEffect for cleanup<br/>2. Profile with Chrome DevTools<br/>3. Fix cleanup functions<br/>4. Test unmounting scenarios              |
| Monolithic state             | HIGH          | 1. Analyze state usage patterns<br/>2. Split into focused contexts/stores<br/>3. Migrate consumers incrementally<br/>4. Delete old monolith       |
| Performance issues           | MEDIUM        | 1. Profile with React DevTools<br/>2. Identify bottlenecks<br/>3. Add strategic memoization<br/>4. Consider code splitting                        |
| TypeScript any usage         | MEDIUM        | 1. Search for `any` and `@ts-ignore`<br/>2. Define proper types<br/>3. Add type guards for dynamic data<br/>4. Enable stricter TS config          |
| SSR failures                 | HIGH          | 1. Audit all window/document access<br/>2. Add environment checks<br/>3. Move to effects/hooks<br/>4. Test with SSR                               |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall                      | Prevention Phase       | Verification                               |
| ---------------------------- | ---------------------- | ------------------------------------------ |
| XSS from markdown            | Phase 1 (Foundation)   | Security audit, CSP headers in place       |
| Missing error boundaries     | Phase 1 (Foundation)   | All routes wrapped, error reporting active |
| State mutation               | Phase 1 (Foundation)   | Strict Mode enabled, no linter warnings    |
| Missing cleanup in useEffect | Phase 1 (Foundation)   | useEffect linter rules configured          |
| SSR compatibility            | Phase 1 (Foundation)   | Works with window checks tested            |
| TypeScript strict types      | Phase 1 (Foundation)   | No `any` outside specific patterns         |
| Performance optimization     | Phase 2 (Optimization) | Profiling done, bottlenecks addressed      |
| State management refactoring | Phase 2 (Optimization) | Split into focused contexts                |
| Testing infrastructure       | Phase 3 (Quality)      | Critical flows have tests                  |
| Accessibility compliance     | Phase 3 (Quality)      | WCAG audit passed                          |

---

## Sources

- **Official React Documentation:** https://react.dev/learn (HIGH confidence)
  - Render and Commit phase documentation
  - useEffect cleanup and Strict Mode guidance
  - Component purity and mutation prevention
  - Error boundary patterns
  - Performance optimization strategies
- **React DOM Reference:** https://react.dev/reference/react-dom/components/common (HIGH confidence)
  - `dangerouslySetInnerHTML` security warnings
  - Event handling patterns
- **React GitHub Issues:** https://github.com/facebook/react/issues (MEDIUM confidence)
  - Security-related discussions and XSS concerns
- **React Patterns Research:** Best practices from ecosystem (MEDIUM confidence)
  - State management patterns
  - Testing approaches
  - Performance optimization strategies

---

_Pitfalls research for: React Applications / Resume Builder_
_Researched: February 11, 2026_
_Confidence: HIGH_
