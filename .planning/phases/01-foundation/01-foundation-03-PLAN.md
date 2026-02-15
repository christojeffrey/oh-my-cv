---
phase: 01-foundation
plan: 03
type: execute
wave: 2
depends_on: []
files_modified:
  - react-site/src/components/ErrorBoundary/ErrorBoundary.tsx
  - react-site/src/components/ErrorBoundary/FallbackUI.tsx
  - react-site/src/components/ErrorBoundary/index.ts
  - react-site/src/main.tsx
autonomous: true
user_setup: []

must_haves:
  truths:
    - ErrorBoundary class component implements getDerivedStateFromError and componentDidCatch
    - FallbackUI component displays error message with reload button
    - main.tsx configures React 19 onCaughtError, onUncaughtError, and onRecoverableError callbacks
  artifacts:
    - path: "react-site/src/components/ErrorBoundary/ErrorBoundary.tsx"
      exists: true
      exports: ["ErrorBoundary"]
      contains: "static getDerivedStateFromError"
    - path: "react-site/src/components/ErrorBoundary/FallbackUI.tsx"
      exists: true
      exports: ["FallbackUI"]
      contains: "Something went wrong"
    - path: "react-site/src/components/ErrorBoundary/index.ts"
      exists: true
      exports: ["ErrorBoundary", "FallbackUI"]
    - path: "react-site/src/main.tsx"
      contains: "onCaughtError"
      contains: "onUncaughtError"
      contains: "onRecoverableError"
  key_links:
    - from: "react-site/src/main.tsx"
      to: "React 19 createRoot"
      via: "onCaughtError and onUncaughtError callbacks"
      pattern: "createRoot.*onCaughtError"
    - from: "react-site/src/components/ErrorBoundary/ErrorBoundary.tsx"
      to: "react-site/src/components/ErrorBoundary/FallbackUI.tsx"
      via: "import and use FallbackUI on error"
      pattern: "from.*FallbackUI"
---

<objective>
Create ErrorBoundary class components and configure React 19 root error handlers.

Purpose: React 19 still requires class components for error boundaries. This plan creates the ErrorBoundary components and configures React 19's new error handling callbacks on createRoot.

Output: ErrorBoundary class component with FallbackUI, React 19 error handlers configured in main.tsx.
</objective>

<execution_context>
@C:/Users/jeff/.config/opencode/get-shit-done/workflows/execute-plan.md
@C:/Users/jeff/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-foundation/01-RESEARCH.md
@react-site/src/main.tsx
@.planning/codebase/STRUCTURE.md
@.planning/codebase/STACK.md
</context>

<tasks>

<task type="auto">
  <name>Create ErrorBoundary class component</name>
  <files>react-site/src/components/ErrorBoundary/ErrorBoundary.tsx</files>
  <action>
    Create react-site/src/components/ErrorBoundary/ErrorBoundary.tsx with:

    import { Component, ReactNode } from 'react';
    import { FallbackUI } from './FallbackUI';

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

      static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
      }

      componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
        console.error('Error caught by boundary:', error, errorInfo);
      }

      render() {
        if (this.state.hasError) {
          return this.props.fallback || <FallbackUI error={this.state.error} />;
        }

        return this.props.children;
      }
    }

    export default ErrorBoundary;

    Per research: React 19 still requires class components for error boundaries. getDerivedStateFromError synchronously updates state.

  </action>
  <verify>cat react-site/src/components/ErrorBoundary/ErrorBoundary.tsx</verify>
  <done>ErrorBoundary.tsx implements class component with getDerivedStateFromError and componentDidCatch</done>
</task>

<task type="auto">
  <name>Create FallbackUI component</name>
  <files>react-site/src/components/ErrorBoundary/FallbackUI.tsx</files>
  <action>
    Create react-site/src/components/ErrorBoundary/FallbackUI.tsx with:

    import { AlertTriangle, RefreshCw } from 'lucide-react';

    interface FallbackUIProps {
      error?: Error;
    }

    export function FallbackUI({ error }: FallbackUIProps) {
      const handleReload = () => {
        window.location.reload();
      };

      return (
        <div className="flex items-center justify-center min-h-screen bg-background p-6">
          <div className="max-w-md w-full bg-card border border-destructive/50 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 text-destructive mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-lg font-semibold">Something went wrong</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              {error?.message || 'An unexpected error occurred while rendering this page.'}
            </p>
            <button
              onClick={handleReload}
              className="flex items-center gap-2 w-full justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

  </action>
  <verify>cat react-site/src/components/ErrorBoundary/FallbackUI.tsx</verify>
  <done>FallbackUI.tsx displays error message with reload button</done>
</task>

<task type="auto">
  <name>Create ErrorBoundary barrel export</name>
  <files>react-site/src/components/ErrorBoundary/index.ts</files>
  <action>
    Create react-site/src/components/ErrorBoundary/index.ts with:

    export { default as ErrorBoundary } from './ErrorBoundary';
    export { FallbackUI } from './FallbackUI';

  </action>
  <verify>cat react-site/src/components/ErrorBoundary/index.ts</verify>
  <done>index.ts barrel exports ErrorBoundary and FallbackUI</done>
</task>

<task type="auto">
  <name>Configure React 19 root error handlers</name>
  <files>react-site/src/main.tsx</files>
  <action>
    Update react-site/src/main.tsx to add React 19 error handlers:
    Change the createRoot call from:
      createRoot(document.getElementById('root')!).render(
    To:
      const root = createRoot(document.getElementById('root')!, {
        onCaughtError: (error, errorInfo) => {
          console.error('Error caught by boundary:', error, errorInfo);
        },
        onUncaughtError: (error, errorInfo) => {
          console.error('Uncaught error:', error, errorInfo);
        },
        onRecoverableError: (error, errorInfo) => {
          console.warn('Recoverable error:', error, errorInfo);
        },
      });

      root.render(

    Per research: React 19 provides error handling callbacks on createRoot for logging. External error tracking can be added later.

  </action>
  <verify>grep -E "(onCaughtError|onUncaughtError|onRecoverableError)" react-site/src/main.tsx</verify>
  <done>main.tsx creates root with onCaughtError, onUncaughtError, and onRecoverableError callbacks</done>
</task>

</tasks>

<verification>
After completion:
1. Verify tsc completes without errors
2. Verify pnpm run build succeeds
3. Verify React 19 callbacks are logged to console (on error)
</verification>

<success_criteria>

1. ErrorBoundary class component created with getDerivedStateFromError and componentDidCatch
2. FallbackUI component created with error message and reload button
3. main.tsx configures React 19 onCaughtError, onUncaughtError, and onRecoverableError callbacks
4. Build succeeds
5. TypeScript compiles successfully
   </success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-03-SUMMARY.md`
</output>
