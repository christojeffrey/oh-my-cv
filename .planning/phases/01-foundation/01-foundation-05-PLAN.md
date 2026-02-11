---
phase: 01-foundation
plan: 05
type: execute
wave: 3
depends_on: ["01-03"]
files_modified:
  - react-site/src/routes/__root.tsx
  - react-site/src/routes/index.tsx
  - react-site/src/routes/editor.$id.tsx
  - react-site/src/routes/landing.tsx
autonomous: true
user_setup: []

must_haves:
  truths:
    - Root-level error boundary wraps entire application
    - Route-level error boundaries wrap each route component
    - Errors are caught gracefully instead of blank screens
    - User sees friendly error message with reload option
  artifacts:
    - path: "react-site/src/routes/__root.tsx"
      contains: "ErrorBoundary"
      pattern: "Outlet.*ErrorBoundary|ErrorBoundary.*Outlet"
    - path: "react-site/src/routes/index.tsx"
      contains: "ErrorBoundary"
    - path: "react-site/src/routes/editor.$id.tsx"
      contains: "ErrorBoundary"
    - path: "react-site/src/routes/landing.tsx"
      contains: "ErrorBoundary"
  key_links:
    - from: "react-site/src/routes/__root.tsx"
      to: "react-site/src/components/ErrorBoundary/ErrorBoundary.tsx"
      via: "import and wrap Outlet"
      pattern: "import.*ErrorBoundary.*@/components/ErrorBoundary"
    - from: "react-site/src/routes/index.tsx"
      to: "react-site/src/components/ErrorBoundary/ErrorBoundary.tsx"
      via: "import and wrap Route component"
      pattern: "ErrorBoundary.*{.*Route.*}"
---

<objective>
Wrap all routes in error boundaries to provide graceful error handling at the route level.

Purpose: Route-level error boundaries provide better UX by isolating errors to specific routes. If one route crashes, other routes remain functional.

Output: All routes (root, dashboard, editor, landing) wrapped in ErrorBoundary components.
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
@.planning/phases/01-foundation/01-foundation-03-PLAN.md
@react-site/src/routes/__root.tsx
@react-site/src/routes/index.tsx
@react-site/src/routes/editor.$id.tsx
@react-site/src/routes/landing.tsx
@.planning/codebase/STRUCTURE.md
</context>

<tasks>

<task type="auto">
  <name>Wrap root route in ErrorBoundary</name>
  <files>react-site/src/routes/__root.tsx</files>
  <action>
    Update react-site/src/routes/__root.tsx to wrap Outlet in ErrorBoundary:
    1. Add import: import { ErrorBoundary } from '@/components/ErrorBoundary';
    2. Update component return to wrap Outlet:
       Change:
         <div className="min-h-screen bg-background font-ui flex flex-col">
           <Header />
           <main className="workspace">
             <Outlet />
           </main>
           <Toaster />
           <TanStackRouterDevtools />
         </div>
       To:
         <div className="min-h-screen bg-background font-ui flex flex-col">
           <Header />
           <main className="workspace">
             <ErrorBoundary>
               <Outlet />
             </ErrorBoundary>
           </main>
           <Toaster />
           <TanStackRouterDevtools />
         </div>

    This provides root-level error boundary as safety net for all routes.

  </action>
  <verify>grep "ErrorBoundary" react-site/src/routes/__root.tsx</verify>
  <done>__root.tsx wraps Outlet in ErrorBoundary</done>
</task>

<task type="auto">
  <name>Wrap dashboard route in ErrorBoundary</name>
  <files>react-site/src/routes/index.tsx</files>
  <action>
    Update react-site/src/routes/index.tsx to wrap route component in ErrorBoundary:
    1. Add import: import { ErrorBoundary } from '@/components/ErrorBoundary';
    2. Update Route export to wrap component:
       Current Route structure should wrap the existing component with ErrorBoundary.

    If Route exports a component directly, modify to:
      export const Route = createFileRoute('/')({
        component: () => (
          <ErrorBoundary>
            <Dashboard />
          </ErrorBoundary>
        ),
      });

    Per research: Route-level boundaries provide better UX by isolating errors to specific routes.

  </action>
  <verify>cat react-site/src/routes/index.tsx</verify>
  <done>index.tsx wraps dashboard component in ErrorBoundary</done>
</task>

<task type="auto">
  <name>Wrap editor route in ErrorBoundary</name>
  <files>react-site/src/routes/editor.$id.tsx</files>
  <action>
    Update react-site/src/routes/editor.$id.tsx to wrap route component in ErrorBoundary:
    1. Add import: import { ErrorBoundary } from '@/components/ErrorBoundary';
    2. Update Route export to wrap component with ErrorBoundary.

    Similar to index.tsx, wrap the existing component with ErrorBoundary.

  </action>
  <verify>grep "ErrorBoundary" react-site/src/routes/editor.$id.tsx</verify>
  <done>editor.$id.tsx wraps editor component in ErrorBoundary</done>
</task>

<task type="auto">
  <name>Wrap landing route in ErrorBoundary</name>
  <files>react-site/src/routes/landing.tsx</files>
  <action>
    Update react-site/src/routes/landing.tsx to wrap route component in ErrorBoundary:
    1. Add import: import { ErrorBoundary } from '@/components/ErrorBoundary';
    2. Update Route export to wrap component with ErrorBoundary.

    Similar to other routes, wrap the existing component with ErrorBoundary.

  </action>
  <verify>grep "ErrorBoundary" react-site/src/routes/landing.tsx</verify>
  <done>landing.tsx wraps landing component in ErrorBoundary</done>
</task>

</tasks>

<verification>
After completion:
1. Verify tsc completes without errors
2. Verify pnpm run build succeeds
3. Test: Intentionally throw an error in a route component and verify FallbackUI appears
</verification>

<success_criteria>

1. \_\_root.tsx wraps Outlet in ErrorBoundary
2. index.tsx wraps dashboard in ErrorBoundary
3. editor.$id.tsx wraps editor in ErrorBoundary
4. landing.tsx wraps landing page in ErrorBoundary
5. Build succeeds
6. TypeScript compiles successfully
   </success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-05-SUMMARY.md`
</output>
