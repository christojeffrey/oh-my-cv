# AGENTS.md

This file contains guidelines and rules for AI agents working on this codebase.

## Critical Rules

### NEVER Run Development Servers

**MANDATORY RULE**: Do NOT start any development servers (e.g., `npm run dev`, `pnpm dev`, `vite dev`).

**Reason**: Running dev servers can cause issues:

- Multiple instances running simultaneously
- Port conflicts
- Hanging background processes
- Resource waste

**Instead**:

1. Verify if the dev server is already running by checking if localhost:port is accessible
2. If verification is needed, ask the user to run the dev server
3. Let the user manage the dev server lifecycle

## Project Structure

This is a monorepo using pnpm workspaces with the following structure:

- `react-site/` - Main React application using Vite
- `packages/` - Shared packages
  - `case-police/` - Case correction library for browser
  - `dynamic-css/` - Dynamic CSS handling
  - `front-matter/` - Front matter parser
  - `google-fonts-loader/` - Google fonts loading
  - `markdown-it-cross-ref/` - Markdown cross-reference plugin
  - `markdown-it-katex/` - KaTeX plugin for markdown
  - `markdown-it-latex-cmds/` - LaTeX commands plugin
  - `utils/` - Utility functions
  - `vue-shortcuts/` - Vue keyboard shortcuts
  - `vue-smart-pages/` - Vue smart pagination
  - `vue-zoom/` - Vue zoom component

## Build System

### Package Building

- Use `pnpm run build:pkg` to build all packages
- Use `pnpm run build-fast:pkg` for faster builds without type definitions
- Individual packages can be built with `pnpm --filter=<package-name> run build:pkg`

### Site Building

- Use `pnpm run build` to build the react-site
- Use `pnpm run dev` to start the dev server (ONLY if instructed by user)

## Linting and Formatting

The project uses multiple linting/formatting tools:

- **Biome** - Fast linter and formatter (recommended for new work)
  - `pnpm run lint:biome` - Check code with Biome
  - `pnpm run lint:biome:fix` - Fix Biome issues
  - `pnpm run format` - Format code with Biome
  - `pnpm run check` - Run full Biome check
  - `pnpm run check:fix` - Fix all Biome issues
- **ESLint** - Original linter (legacy)
  - `pnpm run lint` - Check code with ESLint

## Code Quality Standards

### TypeScript

- All code must be type-safe
- No `@ts-ignore`, `@ts-expect-error`, or `as any` unless absolutely necessary
- Always run `tsc` or TypeScript build to verify types before considering work complete

### Testing

- All tests must pass before work is considered complete
- Never delete or skip failing tests - fix the code, not the tests
- Run tests after making any changes that affect functionality

## Git Workflow

### Commits

- Never create commits unless explicitly requested by the user
- When creating commits, use descriptive messages following the project's style
- Check `git log --oneline -10` to understand the commit message style

### Branches and PRs

- Never force push to main/master branches
- Never modify git configuration
- Always use `git status` and `git diff` before committing

## Verification Requirements

Work is NOT complete until:

1. All tests pass (if test suite exists)
2. Build succeeds (no build errors)
3. Linting passes (Biome/ESLint)
4. Types are correct (if TypeScript)
5. The original user request is fully satisfied
6. No regressions are introduced

## Common Patterns

### Package Development

1. Make changes to source files in `src/`
2. Run `pnpm run build:pkg` to rebuild
3. Verify the generated `dist/` files
4. Test the changes in the consuming application

### Monorepo Workflows

1. Use `pnpm --filter=<package>` to work on specific packages
2. Use `pnpm -r` to run commands across all workspace packages
3. Local package dependencies use `workspace:*` or `file:` protocol

### Dependencies

- Add dependencies using `pnpm add <package>`
- Add dev dependencies using `pnpm add -D <package>`
- For workspace-wide dependencies, use `pnpm add -w <package>`

## Error Handling

### When You Encounter Errors

1. **DO NOT** make random changes hoping they'll work
2. **DO** read and understand the error message
3. **DO** investigate the root cause
4. **DO** fix the specific issue, not just suppress symptoms
5. If stuck after 3 attempts, consult with Oracle or ask the user

### Build Errors

- Read the full error output
- Check if dependencies are installed
- Verify file paths are correct
- Check TypeScript configuration
- Look for circular dependencies

### Runtime Errors

- Check the browser console
- Verify imports are correct
- Check that packages are built
- Verify environment variables

## Communication Style

- Be direct and concise
- Don't use fluff or acknowledgments
- Don't provide status updates unless asked
- Start work immediately
- Report completion when done, with clear evidence

## Code Review Self-Check

Before claiming work is done, ask yourself:

- [ ] Does this solve the user's problem completely?
- [ ] Are all tests passing?
- [ ] Is the code type-safe?
- [ ] Is the build successful?
- [ ] Are there any lint errors?
- [ ] Did I break any existing functionality?
- [ ] Is the code maintainable and follows project patterns?
- [ ] Have I provided evidence of success?

If any answer is "NO", the work is NOT complete.
