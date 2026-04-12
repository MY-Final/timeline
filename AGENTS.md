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
  index.css                 ← Global CSS vars / dark mode
  App.css                   ← App-scoped styles
  assets/
    hero.png                ← Imported as ES module (gets hashed in dist)
    images/YYYY-MM-DD/      ← User photos; add new dates as subfolders
public/
  icons.svg                 ← SVG sprite, use <use href="/icons.svg#name">
  favicon.svg
```

No path aliases — all imports are relative, no `@/` shortcut.

---

## Styling

Plain CSS, no Tailwind, no CSS Modules, no pre-processor.

- Design tokens are CSS custom properties on `:root` in `index.css`
- Dark mode via `@media (prefers-color-scheme: dark)` only — no class toggle
- Native CSS nesting is used (Vite handles it without PostCSS)
- Main column: `1126px` wide, centered, `border-inline` borders
- Responsive breakpoint: `@media (max-width: 1024px)`
- Token names: `--text`, `--text-h`, `--bg`, `--border`, `--accent`, `--accent-bg`, `--shadow`, etc.

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

## UI/UX Skill (OpenCode)

The `ui-ux-pro-max` skill is installed at `.opencode/skills/ui-ux-pro-max/`.
Run it before any UI work.

```bash
# Required first step for any UI session
python skills/ui-ux-pro-max/scripts/search.py "timeline personal moments" --design-system --stack react -p "timeline"

# Persist design system across sessions (creates design-system/MASTER.md)
python skills/ui-ux-pro-max/scripts/search.py "timeline personal moments" --design-system --stack react --persist -p "timeline"

# Other searches
python skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <style|ux|typography|color>
python skills/ui-ux-pro-max/scripts/search.py "<keyword>" --stack react
```

Requires Python 3. Windows: `winget install Python.Python.3.12`

Non-negotiable UI rules enforced by the skill:
- No emoji icons — SVG only (Heroicons / Lucide)
- All clickable elements: `cursor-pointer`
- Body text contrast ≥ `#475569` in light mode
- Transitions: 150–300ms
- Responsive at 375 / 768 / 1024 / 1440px
- `prefers-reduced-motion` must be respected
- All `<img>` must have `alt` text

---

## Git

- `dist/` and `node_modules` are gitignored — do not commit
- `.opencode/` is committed (project-level AI config)
- `__pycache__/`, `*.pyc` are gitignored
- Remote: `https://github.com/MY-Final/timeline`
