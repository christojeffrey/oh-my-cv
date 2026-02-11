# Phase 1: Foundation - Research

**Researched:** February 11, 2026
**Domain:** React 19, Security (XSS), Error Handling, TypeScript Strict Mode, Biome, Vue Removal
**Confidence:** HIGH

## Summary

Phase 1 establishes a bulletproof React application foundation by upgrading to React 19, implementing XSS protection via DOMPurify, adding comprehensive error boundaries, enforcing strict TypeScript, configuring Biome for code quality, and removing the duplicate Vue codebase. This phase requires no dependencies and creates the secure, maintainable foundation for all subsequent phases.

**Primary recommendation:** Upgrade React to 19, implement DOMPurify for all user-content rendering, wrap all routes in error boundaries, enable all TypeScript strict options, configure Biome with security and correctness rules as errors, and delete the `site/` directory plus three Vue-specific packages.

## Standard Stack

### Core

| Library          | Version | Purpose                        | Why Standard                                                                                       |
| ---------------- | ------- | ------------------------------ | -------------------------------------------------------------------------------------------------- |
| React            | ^19.0.0 | UI framework                   | Latest stable release (Dec 2024) with new features, improved error handling, security improvements |
| React DOM        | ^19.0.0 | DOM rendering                  | Required companion to React 19, includes new error boundary callbacks                              |
| @types/react     | ^19.0.0 | TypeScript types               | Official types for React 19, breaking changes from 18.x                                            |
| @types/react-dom | ^19.0.0 | TypeScript types for React DOM | Required for React 19 with new APIs                                                                |
| DOMPurify        | ^3.3.1  | XSS sanitization               | Industry-standard, DOM-only, battle-tested, 16k+ GitHub stars                                      |
| TypeScript       | 5.9.3+  | Type safety                    | Modern version with full strict mode support                                                       |

### Supporting

| Library                | Version   | Purpose                         | When to Use                                                                                      |
| ---------------------- | --------- | ------------------------------- | ------------------------------------------------------------------------------------------------ |
| @tanstack/react-router | ^1.154.13 | Routing                         | For route-level error boundary wrapping                                                          |
| react-error-boundary   | ^4.x      | Function-based error boundaries | If class-based boundaries are undesirable (React 19 still requires classes for error boundaries) |
| markdown-it            | ^14.1.0   | Markdown parsing                | For integrating DOMPurify with markdown output                                                   |

### Alternatives Considered

| Instead of             | Could Use            | Tradeoff                                                                                       |
| ---------------------- | -------------------- | ---------------------------------------------------------------------------------------------- |
| DOMPurify              | sanitize-html        | Less mature, smaller community, not recommended                                                |
| DOMPurify              | js-xss               | Requires more configuration, less tested                                                       |
| Class Error Boundaries | react-error-boundary | Function-based but adds dependency, React 19 doesn't have native function error boundaries yet |

**Installation:**

```bash
pnpm add --save-exact react@^19.0.0 react-dom@^19.0.0
pnpm add --save-dev --save-exact @types/react@^19.0.0 @types/react-dom@^19.0.0
pnpm add --save-exact dompurify@^3.3.1
```

## Architecture Patterns

### Recommended Project Structure

```
react-site/
├── src/
│   ├── components/
│   │   ├── ErrorBoundary/       # Root-level error boundary component
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── FallbackUI.tsx
│   │   └── ui/                 # Shared UI components
│   ├── routes/
│   │   └── [route]/
│   │       └── RouteErrorBoundary.tsx  # Route-level error boundaries
│   ├── utils/
│   │   └── dompurify.ts           # DOMPurify wrapper utilities
│   └── main.tsx                   # Root with ErrorBoundary
```

### Pattern 1: DOMPurify with Markdown

**What:** Sanitize markdown-rendered HTML before injecting into DOM.

**When to use:** Whenever rendering user-generated or markdown content with `dangerouslySetInnerHTML` or React's `innerHTML`.

**Example:**

```typescript
// Source: https://github.com/cure53/DOMPurify#how-do-i-use-it
import DOMPurify from 'dompurify';

// Create a configured instance for HTML-only (most common case)
const purifier = new DOMPurify({
  USE_PROFILES: { html: true },  // Restrict to HTML, no SVG/MathML
});

export function SanitizedMarkdown({ content }: { content: string }) {
  const dirtyHtml = renderMarkdown(content);
  const cleanHtml = purifier.sanitize(dirtyHtml);
  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}
```

**Configuration notes:**

- Default allows HTML, SVG, and MathML - restrict to HTML with `USE_PROFILES: { html: true }`
- `KEEP_CONTENT: true` preserves element content when element is removed
- For template systems, `SAFE_FOR_TEMPLATES: true` strips template syntax

### Pattern 2: React Error Boundary (Class-based)

**What:** Class component implementing `static getDerivedStateFromError` and `componentDidCatch` to catch rendering errors.

**When to use:** Route-level boundaries (one per route) and root-level boundary (wraps entire app).

**Example:**

```typescript
// Source: https://react.dev/reference/react/Component#static-getderivedstatefromerror
import { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: { componentStack: string };
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  // Synchronously updates state to render fallback UI
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  // Logs error to error reporting service
  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    // Log to external error tracking service here
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultFallbackUI error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Fallback UI component
function DefaultFallbackUI({ error }: { error?: Error }) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
      <p className="text-red-600 mt-2">{error?.message || 'An unexpected error occurred'}</p>
      <button onClick={() => window.location.reload()}>Reload Page</button>
    </div>
  );
}

export default ErrorBoundary;
```

**Usage in routes:**

```typescript
// Route-level: Wrap each route in its own ErrorBoundary
<Route path="/docs/:id" element={
  <ErrorBoundary fallback={<RouteFallbackUI />}>
    <DocumentView />
  </ErrorBoundary>
} />

// Root-level: Wrap entire app in App.tsx or main.tsx
<ErrorBoundary fallback={<RootFallbackUI />}>
  <Router>
    {/* Routes */}
  </Router>
</ErrorBoundary>
```

### Pattern 3: React 19 Root Error Handlers

**What:** Configure error handling callbacks on `createRoot` for production error reporting.

**When to use:** Root-level error boundary setup for logging all errors.

**Example:**

```typescript
// Source: https://react.dev/blog/2024/04/25/react-19-upgrade-guide#errors-in-render-are-not-re-thrown
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root")!, {
  // Called when error is caught by Error Boundary
  onCaughtError: (error, errorInfo) => {
    // Log to external service (Sentry, LogRocket, etc.)
    errorReportingService.captureException(error, errorInfo);
  },
  // Called when error is NOT caught by any Error Boundary
  onUncaughtError: (error, errorInfo) => {
    // Log critical errors that escape all boundaries
    errorReportingService.captureCriticalException(error, errorInfo);
  },
  // Called when error is thrown but automatically recovered
  onRecoverableError: (error, errorInfo) => {
    // Log but don't alert user (automatically recovered)
    console.warn("Recoverable error:", error, errorInfo);
  }
});
```

### Pattern 4: Biome Strict Configuration

**What:** Enable strict linting rules for correctness, security, and style.

**When to use:** `biome.json` configuration for the entire codebase.

**Example:**

```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.11/schema.json",
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": "error",
      "security": "error",
      "style": "warn",
      "suspicious": "warn"
    }
  },
  "javascript": {
    "linter": {
      "enabled": true
    },
    "formatter": {
      "enabled": true
    }
  },
  "files": {
    "includes": ["react-site/src/**/*", "packages/*/src/**/*"],
    "ignoreUnknown": false
  }
}
```

### Anti-Patterns to Avoid

- **Sanitizing after DOM insertion:** Always sanitize before `dangerouslySetInnerHTML`, not after. Post-insertion modifications void sanitization.
- **Single error boundary for entire app:** While root-level boundary catches everything, route-level boundaries provide better UX by isolating errors to specific routes.
- **Allowing SVG/MathML unnecessarily:** If only rendering markdown content, use `USE_PROFILES: { html: true }` to restrict attack surface.
- **Using `any` type:** Remove all `any` types and use proper TypeScript types instead.
- **`@ts-ignore` without justification:** Each suppression should include a comment explaining why it's necessary and a plan to remove it.
- **Trusting user content without sanitization:** All user-generated content must pass through DOMPurify before rendering.

## Don't Hand-Roll

| Problem                     | Don't Build                              | Use Instead                           | Why                                                                                                                    |
| --------------------------- | ---------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| XSS sanitization            | Custom HTML parsing/regex filtering      | DOMPurify                             | Edge cases: HTML comments, CSS injection, mXSS attacks, protocol-relative URLs, DOM clobbering - DOMPurify handles all |
| Error state management      | Manual error handling in each component  | React Error Boundaries                | Centralized error handling, automatic recovery, prevents white-screen crashes, standard pattern                        |
| TypeScript strict migration | Manual type fixes across entire codebase | Incremental option-by-option enabling | Allows fixing errors as they appear, prevents overwhelming error floods                                                |
| Code formatting/linting     | Manual enforcement, multiple tools       | Biome (unified)                       | Single tool for linting + formatting, faster than ESLint+Prettier, better TypeScript support                           |

**Key insight:** Custom security solutions inevitably miss edge cases. DOMPurify has been battle-tested for 10+ years by security researchers. Error boundaries are React's built-in error handling mechanism. Biome replaces the ESLint+Prettier stack with a modern, faster unified tool.

## Common Pitfalls

### Pitfall 1: DOMPurify Not Configured for HTML-Only Content

**What goes wrong:** Default DOMPurify allows SVG and MathML in addition to HTML. For markdown-rendered content, this opens unnecessary attack surface.

**Why it happens:** Default configuration enables all markup types for flexibility, but markdown rendering typically only produces HTML.

**How to avoid:** Always configure `USE_PROFILES: { html: true }` for markdown content.

**Warning signs:** Seeing `<svg>` or `<math>` tags in sanitized output when only expecting HTML.

### Pitfall 2: Error Boundary Catches Too Broadly

**What goes wrong:** Root-level error boundary catches everything but provides poor UX - users lose context of where they were in the app.

**Why it happens:** Single error boundary wrapping entire app has no route-specific context.

**How to avoid:** Implement route-level error boundaries for each route, with root-level boundary as safety net.

**Warning signs:** Error UI shows generic message without route context, users confused about which feature failed.

### Pitfall 3: Ref Cleanup Functions Breaking Existing Code

**What goes wrong:** React 19 supports cleanup functions in `ref` callbacks. Returning a value (like implicit return) from ref callbacks now errors in TypeScript.

**Why it happens:** React 19's ref cleanup feature means any return value from ref callback is interpreted as a cleanup function, but TypeScript can't distinguish.

**How to avoid:** Explicitly return nothing or use block syntax: `ref={(el) => { this.el = el }}` instead of `ref={(el) => this.el = el}`

**Warning signs:** TypeScript errors about ref return types, ref cleanup running unexpectedly.

### Pitfall 4: TypeScript Strict Mode Overwhelm

**What goes wrong:** Enabling all strict options at once produces hundreds of type errors that are difficult to triage.

**Why it happens:** Strict mode catches previously ignored type issues across entire codebase.

**How to avoid:** Enable options incrementally: start with `strict: true` (already enabled), then enable `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports` one at a time.

**Warning signs:** Type error count spikes to 500+, difficult to identify which errors are blocking.

### Pitfall 5: Biome vs ESLint Confusion

**What goes wrong:** Existing ESLint configuration not honored, rules behave differently, developers frustrated by unfamiliar diagnostics.

**Why it happens:** Biome is a replacement for ESLint, not compatible. Rules and diagnostics are different.

**How to avoid:** Understand that Biome is a new tool, not ESLint-compatible. Use Biome's rule documentation, not ESLint equivalents.

**Warning signs:** ESLint rules not working, different error messages, developers confused by new tool.

### Pitfall 6: Vue Package References After Deletion

**What goes wrong:** Root `package.json` still references Vue packages, pnpm install fails or workspace links break.

**Why it happens:** Deleting `site/` doesn't remove package references from root workspace configuration.

**How to avoid:** Remove `site` from workspace packages list and delete Vue-specific packages (`vue-zoom`, `vue-shortcuts`, `vue-smart-pages`) from workspace.

**Warning signs:** `pnpm install` fails with "workspace package not found" for Vue packages.

## Code Examples

Verified patterns from official sources:

### DOMPurify Basic Usage

```typescript
// Source: https://github.com/cure53/DOMPurify#how-do-i-use-it
import DOMPurify from "dompurify";

const dirty = "<img src=x onerror=alert(1)//>";
const clean = DOMPurify.sanitize(dirty);
// Result: <img src="x">
```

### DOMPurify HTML-Only Configuration

```typescript
// Source: https://github.com/cure53/DOMPurify#how-do-i-use-it
import DOMPurify from "dompurify";

const dirty = "<svg><g/onload=alert(2)//<p>";
const clean = DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true } });
// Result: Empty string (SVG tags removed)
```

### Error Boundary with State Management

```typescript
// Source: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: any) {
    console.error(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

### React 19 Root Error Handlers

```typescript
// Source: https://react.dev/blog/2024/04/25/react-19-upgrade-guide#errors-in-render-are-not-re-thrown
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root")!, {
  onCaughtError: (error, errorInfo) => {
    // Send to error tracking service
  },
  onUncaughtError: (error, errorInfo) => {
    // Send critical error to error tracking service
  }
});
```

### TypeScript Strict Mode Configuration

```json
// Source: https://www.typescriptlang.org/tsconfig#strict
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client"],

    /* Linting - Strict Options */
    "strict": true, // Already enabled in react-site/tsconfig.json
    "noUnusedLocals": true, // Add this
    "noUnusedParameters": true, // Add this
    "noFallthroughCasesInSwitch": true, // Add this
    "noUncheckedSideEffectImports": true, // Add this

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

## State of the Art

| Old Approach         | Current Approach                     | When Changed             | Impact                                                                                    |
| -------------------- | ------------------------------------ | ------------------------ | ----------------------------------------------------------------------------------------- |
| React 18.x           | React 19.0                           | Dec 5, 2024              | New JSX transform required (already in use), new error handling, Server Components stable |
| No XSS protection    | DOMPurify 3.3.1                      | N/A (new requirement)    | Industry-standard sanitization, prevents XSS attacks in markdown rendering                |
| No error boundaries  | React Error Boundaries (class-based) | N/A (new requirement)    | Graceful error handling, prevents white-screen crashes                                    |
| Basic TypeScript     | All strict options enabled           | N/A (incremental enable) | Bulletproof type safety, catches more bugs at compile time                                |
| ESLint + Prettier    | Biome                                | N/A (already installed)  | Unified linting/formatting, faster, better TypeScript support                             |
| React + Vue monorepo | React-only monorepo                  | N/A (Vue deletion)       | Simplified maintenance, no duplicate code                                                 |

**Deprecated/outdated:**

- **PropTypes**: Removed in React 19, use TypeScript for type checking
- **`defaultProps` on function components**: Removed in React 19, use ES6 default parameters
- **Legacy Context (`contextTypes`/`getChildContext`)**: Removed in React 19, use `contextType`
- **String refs**: Removed in React 19, use ref callbacks or `useRef`
- **`react-dom/test-utils`**: Removed in React 19, use `@testing-library/react`

## Open Questions

1. **Route-level error boundary placement strategy**

   - What we know: React 19 requires class-based Error Boundaries. @tanstack/react-router is used for routing.
   - What's unclear: Whether to create a generic `RouteErrorBoundary` component or customize per-route.
   - Recommendation: Create generic `RouteErrorBoundary` that accepts optional `fallback` prop, use per-route where specific UI needed.

2. **DOMPurify server-side integration**

   - What we know: Current app is client-side Vite build. DOMPurify works in browser natively.
   - What's unclear: If any SSR requirements exist for the CV content.
   - Recommendation: Assume client-side only for now. If SSR needed later, use `isomorphic-dompurify` package for Node.js compatibility.

3. **TypeScript migration order**

   - What we know: react-site already has `strict: true`. Additional options need enabling.
   - What's unclear: Order to enable additional strict options to minimize disruption.
   - Recommendation: Enable in this order: `noUnusedLocals` → `noUnusedParameters` → `noFallthroughCasesInSwitch` → `noUncheckedSideEffectImports`. Fix all errors before moving to next.

4. **Biome rule severity levels**
   - What we know: Biome supports `"error"`, `"warn"`, `"info"` severity levels.
   - What's unclear: Which rules should be errors vs warnings for a foundation phase.
   - Recommendation: Set `correctness: "error"` and `security: "error"`. Set `style` and `suspicious` to `"warn"` to avoid overwhelming developers during foundation work.

## Sources

### Primary (HIGH confidence)

- https://react.dev/blog/2024/12/05/react-19 - React 19 release notes (verified Dec 2024 stable release)
- https://react.dev/blog/2024/04/25/react-19-upgrade-guide - Official upgrade guide with codemod commands
- https://react.dev/reference/react/Component#static-getderivedstatefromerror - Error Boundary API documentation
- https://github.com/cure53/DOMPurify/blob/main/README.md - DOMPurify official documentation (v3.3.1)
- https://biomejs.dev/reference/configuration - Biome v2.3.11 configuration reference

### Secondary (MEDIUM confidence)

- https://github.com/facebook/react/blob/main/CHANGELOG.md#1900-december-5-2024 - React 19 changelog
- https://github.com/bvaughn/react-error-boundary - Function-based error boundary library (React 19 note: still requires classes for getDerivedStateFromError)

### Tertiary (LOW confidence)

- None - All critical claims verified with official sources

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - All versions and APIs verified from official React and library documentation
- Architecture: HIGH - Error boundary patterns from React docs, DOMPurify usage from official README
- Pitfalls: HIGH - Based on documented breaking changes in React 19 upgrade guide and DOMPurify configuration notes

**Research date:** February 11, 2026
**Valid until:** March 13, 2026 (30 days - React and DOMPurify are stable, Biome v2 is stable)
