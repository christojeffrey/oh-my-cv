# Oh My CV — Design System

## Intent

**Who:** Job seekers at their desk—7am before work or midnight after shifts. Stressed about applications, not your UI. On laptop (desktop) or mobile during commute.

**What they must accomplish:** Create resumes, edit markdown, customize styling, export PDF, manage multiple versions.

**How it should feel:** A refined document editor. Calm, focused, minimal friction. Professional warmth—like quality stationery. Not playful, not cold. The interface should disappear; the resume should feel like the only thing that matters.

## Direction

**Domain:** Professional documents, printed materials, resume creation

**Color world:** Warm paper tones, ink-like accents, classic print hierarchy

**Signature:** The A4 preview cards—actual document miniatures that scale responsively. When you see them, you know you're in the right place.

## Palette

```
Foundation: Warm neutrals (20° hue) — paper and ink
  - Background: 99% light / 6% dark — warm white / warm charcoal
  - Foreground: 14% light / 95% dark — soft black / off-white
  - Border: 88% light / 18% dark — subtle edges

Accent: Document-focused
  - Success: 142° green — saved states
  - Warning: 38° amber — unsaved/saving
  - Destructive: 0° red — delete actions

Why this works: Resumes are printed documents. The palette should feel like ink on quality paper—warm, not sterile.
```

## Depth

```
Borders: Primary depth tool
  - border-border/40 — subtle separation
  - border-border/60 — visible edges
  - Use borders over shadows for document feel

Shadows: For elevation only
  - shadow-subtle — resting state
  - shadow-elevated — hover/active
  - Never heavy shadows — documents don't float

Layering: Minimal
  - Cards, sheets, dialogs
  - Keep it flat; let content breathe
```

## Surfaces

```
Background: 99% (light) / 6% (dark)
  - The canvas — warm, neutral

Card: 100% (light) / 8% (dark)
  - Document containers
  - Elevated from background by border + subtle shadow

Muted: 92% (light) / 16% (dark)
  - Subtle backgrounds, placeholders
  - Skeleton loading states

Why this temperature: Warm neutrals feel like paper. Cold neutrals feel like software.
```

## Typography

```
Display: Instrument Serif
  - Headings, brand moments
  - Why: Serif = documents, credibility

UI: Inter
  - All interface text
  - Why: Clean, readable, invisible

Mono: JetBrains Mono
  - Code editing only
  - Why: Devs care about their editor

Scale:
  - H1: 30px / -0.025em letter-spacing
  - H2: 24px / -0.02em
  - H3: 20px / -0.015em
  - Body: 16px / -0.01em
```

## Spacing

```
Base unit: 4px (Tailwind default)

Common gaps:
  - gap-3 (12px) — compact lists, cards
  - gap-4 (16px) — standard spacing
  - gap-6 (24px) — sections, breathing room

Padding:
  - p-3 (12px) — cards, buttons
  - p-4 (16px) — panels, dialogs
  - px-4 py-2 — headers, toolbars

Why this scale: Comfortable but not wasteful. Resumes need density.
```

## Components

### Buttons

```
Size sm (h-7 px-2): Toolbars, compact
Default (h-9 px-4): Standard actions
Size icon (h-8 w-8): Icon-only

States:
  - ghost: default, subtle
  - secondary: active/selected
  - outline: cancel, secondary actions
  - destructive: delete only

Border on active states gives tactile feedback.
```

### Cards

```
border border-border/40
rounded-sm (not lg — documents have sharp corners)
bg-card
shadow-subtle → shadow-elevated on hover

Hover: transform translate-y-(-1px)
```

### Dialogs

```
Centered, max-w-md or max-w-lg
p-6 header, p-6 body, px-6 pb-6 footer
border-border/60 for containment

Backdrop: bg-background/80 backdrop-blur-sm
```

### Inputs

```
h-9 px-3
border-border
rounded-sm
focus: ring-1 ring-ring

No heavy shadows. Tactile borders only.
```

## Patterns

### Status Indicators

```
Saved: bg-emerald-500/10 text-emerald-600 border-emerald-200
Saving: bg-amber-500/10 text-amber-600 border-amber-200
Unsaved: bg-muted text-muted-foreground

Text-xs uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border
```

### Toolbar Segments

```
flex bg-muted/30 rounded-md p-0.5 border border-border/40

Buttons inside use ghost variant.
Active button gets bg-background shadow-sm.
```

### Dropdown Menus

```
Align end for most actions.
Separator before destructive actions.
Icon left, text right.
Destructive items: text-destructive focus:bg-destructive/10
```

### Mobile Responsiveness

```
sm:hidden — mobile-only blocks
hidden sm:block — desktop-only

Mobile: List view, compact rows
Desktop: Grid, preview cards

Test both. Job seekers use phones on breaks.
```

## Animation

```
Duration: 200-300ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)

Fade-in: subtle entry
Scale-in: dialogs, sheets
Hover: shadow + translate-y(-1px)

Nothing bouncy. Nothing flashy. This is a tool.
```

## Craft Checks

Before committing any UI change:

- [ ] Is the temperature warm (20° hue), not cold?
- [ ] Are borders `/40` for subtle, `/60` for visible?
- [ ] Are corners `sm` (sharp), not `lg` (round)?
- [ ] Is typography Inter for UI, Serif for display?
- [ ] Is spacing a multiple of 4px?
- [ ] Would this feel at home in a print editor?
- [ ] Does it disappear when not needed?

## What Makes This Unique

- A4 preview cards that look like actual documents
- Warm, paper-like palette in a sea of cold SaaS
- Serif display font for credibility
- Markdown-first but WYSIWYG-adjacent
- Feels like a tool, not a toy
