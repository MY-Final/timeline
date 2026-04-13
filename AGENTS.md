# AGENTS.md — timeline

Personal timeline web app recording moments between two people.
**No backend for now** — all data (images, content) lives in the frontend project.
Keep architecture backend-ready: isolate data access so a service layer can be dropped in later.

---

## Dev Commands

```bash
npm run dev        # Vite dev server with HMR
npm run build      # tsc -b && vite build  (TS errors fail the build)
npm run lint       # ESLint
npm run preview    # Preview production build
```

No test runner configured.

---

## TypeScript Strict Flags — Will Fail Build if Violated

- `noUnusedLocals` / `noUnusedParameters` — unused vars/params are errors
- `verbatimModuleSyntax` — use `import type { Foo }` for type-only imports, never `import { Foo }` when only the type is needed
- `erasableSyntaxOnly` — no `const enum`, no legacy decorators
- `moduleResolution: "bundler"` — Vite-native, do not use `node16`/`node`
- `noEmit: true` — tsc only type-checks; Vite does the actual transpile
- Imports use explicit `.tsx` extensions (e.g. `import App from './App.tsx'`). Follow this pattern.

---

## Project Structure

```
src/
  main.tsx                  ← ReactDOM.createRoot entry
  App.tsx                   ← Root component (no router yet)
  index.css                 ← Global CSS vars / dark mode + Tailwind import
  App.css                   ← App-scoped styles
  assets/
    hero.png                ← Imported as ES module (gets hashed in dist)
    images/YYYY-MM-DD/      ← User photos; add new dates as subfolders
  components/ui/            ← shadcn/ui components (auto-generated, do not hand-edit)
  lib/utils.ts              ← shadcn cn() utility
public/
  icons.svg                 ← SVG sprite, use <use href="/icons.svg#name">
  favicon.svg
components.json             ← shadcn config (style: base-nova, iconLibrary: lucide)
```

Path alias `@/` → `src/` is configured in both `vite.config.ts` and `tsconfig.app.json`.

---

## Styling

Tailwind CSS v4 (`@tailwindcss/vite` plugin) + shadcn/ui. No separate `tailwind.config.js` — v4 is configured via CSS.

- `@import "tailwindcss"` is at the top of `src/index.css`
- Design tokens remain as CSS custom properties on `:root` (coexist with Tailwind)
- Dark mode via `@media (prefers-color-scheme: dark)` only — no class toggle
- Native CSS nesting is used alongside Tailwind utilities
- Main column: `1126px` wide, centered, `border-inline` borders
- Responsive breakpoint: `@media (max-width: 1024px)`
- Token names: `--text`, `--text-h`, `--bg`, `--border`, `--accent`, `--accent-bg`, `--shadow`, etc.

### shadcn/ui

- Add components: `npx shadcn@latest add <component>`
- Style: `base-nova`, icon library: `lucide`
- Components land in `src/components/ui/` — do not hand-edit generated files
- Utility: `import { cn } from '@/lib/utils'`

---

## Asset Handling — Two Patterns

| Pattern | When to use | How |
|---|---|---|
| Vite import | Images used in components (get hashed in `dist`) | `import img from './assets/foo.png'`; use as `src={img}` |
| `public/` folder | Stable URLs, SVG sprites, favicon | Reference as `/icons.svg`, `/favicon.svg` — no import |

Images for the timeline go under `src/assets/images/YYYY-MM-DD/`.
Import them at the top of the component file that renders them.

---

## Architecture Notes

- No router yet — single `<App>` component. Add react-router when navigation is needed.
- No state manager — local `useState` only. Keep it that way until complexity justifies more.
- **Backend placeholder**: when a backend is added, create a `src/services/` layer that today's components can import. Don't put fetch calls directly in UI components.
- React 19 is in use; React Compiler is intentionally **not** enabled.

---

## Button Style Standard
All buttons across the app follow this consistent design language:

### Base Button Style (`hero-nav-btn`)
- Minimal, text-only with icon + uppercase label pattern
- Positioned absolutely on screen corners: 28px from edge, 24px from top
- Font: 11px, 0.15em letter spacing, 500 weight
- Color: `#e2a0b0` normal / dark mode `#9a6075`
- No background, no borders, no rounded corners
- Hover: color transitions to `#fb7185`, opacity 1.0
- Transition: 0.25s ease

### Button Types
1. **Navigation buttons** - icon + text label format
2. **Tag chips** - minimal underline only, underlines animate width 0→100% on hover/active
3. **Circular action buttons** - soft glassmorphism: backdrop-blur 12px, subtle rose border, hover scale -2px Y offset
4. **Invisible UI buttons** - no background, just color transitions

### Interaction Rules
- All buttons use `outline: none` — no focus rings
- Use `pointer-events: none` for decorative icons inside buttons
- All actions have immediate feedback on hover (color/opacity change)
- No drop shadows on text buttons
- Motion respects `prefers-reduced-motion: reduce` disables all transitions

---

## Git

- Remote: `https://github.com/MY-Final/timeline`
