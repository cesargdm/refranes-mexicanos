# Refranes Mexicanos Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 2015 Swift iOS app with an Expo React Native app (papel picado animation concept) plus a public website at refranes.cesargdm.com serving the completed dictionary as downloadable JSON.

**Architecture:** Bun-workspaces monorepo in this repo: `packages/data` (canonical `refranes.json` + types + validation) consumed by `apps/app` (Expo SDK 55, Unistyles 3, Reanimated, Skia) and `apps/website` (React Router v7 + Vanilla Extract on Cloudflare Workers, serving `/refranes.json` CORS-open).

**Tech Stack:** bun, TypeScript, Expo SDK 55 + Expo Router, react-native-unistyles v3, react-native-reanimated, react-native-gesture-handler, @shopify/react-native-skia, react-native-mmkv, expo-haptics, React Router v7, @vanilla-extract/css, Cloudflare Workers (wrangler).

**Repo facts:** default branch `master`, remote `git@github.com:cesargdm/refranes-mexicanos.git`. Spec: `docs/superpowers/specs/2026-06-12-refranes-mexicanos-migration-design.md`.

---

### Task 1: Monorepo scaffold + Swift removal

**Files:**
- Create: `package.json` (root), `.gitignore` (replace), `tsconfig.base.json`
- Delete: all Swift/Xcode artifacts (`refranesMexicanos*/`, `*.swift`, `MoreRefranesViewController.swift`)

- [ ] **Step 1: Remove Swift app** — `git rm -r refranesMexicanos refranesMexicanos.xcodeproj refranesMexicanosTests refranesMexicanosWatch "refranesMexicanosWatch Extension" MoreRefranesViewController.swift` (first extract `RefranesBook.swift` content to `.tmp/refranes-source.swift` for the data task).
- [ ] **Step 2: Root `package.json`** with `"workspaces": ["apps/*", "packages/*"]`, `"private": true`, scripts `check` (runs data validation + typechecks via `bun run --filter '*' check`).
- [ ] **Step 3: `.gitignore`** for node/expo/wrangler (node_modules, .expo, ios/android build dirs, .wrangler, dist, .tmp).
- [ ] **Step 4: Commit** `chore: convert repo to bun monorepo, remove Swift app`.

### Task 2: `packages/data` — completed dictionary

**Files:**
- Create: `packages/data/package.json`, `packages/data/refranes.json`, `packages/data/index.ts`, `packages/data/validate.ts`, `packages/data/tsconfig.json`

- [ ] **Step 1: Author `refranes.json`.** Convert every entry from the Swift source. Editorial rules (from spec): write the ~40 missing `significado` (marked TERMINAR in source), fix typos/accents (`haz de beber`→`has de beber`, `fracazando`→`fracasando`, `caé`→`cae`, `alenta`→`alentá/se alenta→se hace lento (rewrite)`, `escenciales`→`esenciales`, `desemepeñará`→`desempeñará`, `creé`→`cree`, `hacerce`→`hacerse`, etc. — full prose pass on every meaning), normalize `tipo` to lowercase `refrán|dicho`. Entry shape:

```json
{ "id": "a-falta-de-pan-tortillas", "refran": "A falta de pan, tortillas.", "significado": "…", "tipo": "dicho" }
```

ids: lowercase, accents stripped, punctuation dropped, hyphen-separated.

- [ ] **Step 2: `index.ts`:**

```ts
import refranesJson from './refranes.json'

export type RefranTipo = 'refrán' | 'dicho'
export type Refran = {
	id: string
	refran: string
	significado: string
	tipo: RefranTipo
}
export const refranes = refranesJson as Refran[]
```

- [ ] **Step 3: `validate.ts`** (run with `bun packages/data/validate.ts`): asserts unique slug-shaped ids (`/^[a-z0-9ñ]+(-[a-z0-9ñ]+)*$/` — note: strip accents but keep ñ), non-empty `refran`/`significado`, `tipo` in enum, no leftover `TERMINAR`. Exit 1 with message on failure. Wire as `"check"` script in `packages/data/package.json`.
- [ ] **Step 4: Run** `bun packages/data/validate.ts` → expect `OK: N refranes válidos`.
- [ ] **Step 5: Commit** `feat(data): canonical refranes.json with completed meanings`.

### Task 3: `apps/app` — Expo scaffold + theme

**Files:**
- Create: `apps/app/` via `bunx create-expo-app@latest app --template blank-typescript` (then move), `apps/app/app.json`, `apps/app/unistyles.ts`, Expo Router structure `apps/app/app/_layout.tsx`, `apps/app/app/(tabs)/_layout.tsx`

- [ ] **Step 1: Scaffold** in `apps/`, add deps: `expo-router react-native-unistyles react-native-reanimated react-native-gesture-handler @shopify/react-native-skia react-native-mmkv expo-haptics react-native-safe-area-context react-native-screens react-native-edge-to-edge react-native-nitro-modules expo-symbols`. `packages/data` consumed via workspace dep `"@refranes/data": "workspace:*"`.
- [ ] **Step 2: `unistyles.ts` theme tokens** (single theme — bold light):

```ts
const theme = {
	colors: {
		magenta: '#EB00AF', teal: '#52B2B2', gold: '#F5C242',
		violet: '#7A3BD7', ink: '#241B2F', paper: '#FFF9F2',
		flagInk: '#FFFFFF',
	},
	flagPalette: ['#EB00AF', '#52B2B2', '#F5C242', '#7A3BD7', '#E8453C'],
	space: (n: number) => n * 4,
	radius: { card: 24, chip: 999 },
} as const
```

- [ ] **Step 3: Tabs** — `(tabs)/index.tsx` (Refranes), `(tabs)/buscar.tsx`, `(tabs)/favoritos.tsx`; SF Symbols via expo-symbols for icons.
- [ ] **Step 4: Verify** `bun run --cwd apps/app check` (tsc) passes; app boots in iOS simulator via Argent workflow (Metro port 8082 if 8081 busy).
- [ ] **Step 5: Commit** `feat(app): Expo scaffold, theme, tab navigation`.

### Task 4: Papel picado banner screen

**Files:**
- Create: `apps/app/components/PapelPicadoFlag.tsx` (Skia flag with cut-out border motifs), `apps/app/components/BannerString.tsx` (rope curve + sway), `apps/app/components/CascadeText.tsx` (word-by-word spring entrance), `apps/app/components/TearShreds.tsx` (tear particles), `apps/app/components/MeaningScroll.tsx` (pull-tab unroll), `apps/app/hooks/useRefranDeck.ts` (shuffled order, current index, next/prev)
- Modify: `apps/app/app/(tabs)/index.tsx`

Behavior contract (from spec):
- Idle sway ±2° pendulum (Reanimated `withRepeat` sine); pauses while meaning open. Respect `useReducedMotion` → crossfade everywhere.
- New refrán: flag pulled across on the string (translateX spring with overshoot), words cascade in (per-word opacity+translateY springs, 40ms stagger).
- Swipe left/right (Gesture Handler Pan): current flag tears — 8–12 shreds (precomputed Skia paths slicing the flag rect) fall with randomized rotation/gravity, fade out; haptic `impactAsync(Medium)` on tear.
- Flag color cycles `flagPalette[index % 5]`; cut-out border motif cycles 6 redrawn talavera/papel picado SVG motifs.
- Pull-tab below flag opens `MeaningScroll` (animated height unroll), shows `tipo` chip, star toggle, share icon.

- [ ] **Step 1: Build `CascadeText` + `PapelPicadoFlag` static composition**, verify visually on simulator (Argent screenshot).
- [ ] **Step 2: Add sway + entrance + tear gesture + shreds**, verify by interacting on simulator.
- [ ] **Step 3: Add `MeaningScroll` + haptics + reduced-motion fallback.**
- [ ] **Step 4: `tsc` clean, QA pass on simulator** (entrance, tear→next, scroll open/close).
- [ ] **Step 5: Commit** `feat(app): papel picado banner experience`.

### Task 5: Favorites store + Browse/Search + Share

**Files:**
- Create: `apps/app/state/favorites.ts` (MMKV-backed), `apps/app/components/RefranRow.tsx`
- Modify: `apps/app/app/(tabs)/buscar.tsx`, `apps/app/app/(tabs)/favoritos.tsx`, banner screen (star wiring)

- [ ] **Step 1: `favorites.ts`** — MMKV `Set<string>` of ids + tiny external-store hook (`useSyncExternalStore`); silent in-memory fallback if MMKV init throws.
- [ ] **Step 2: Buscar** — SectionList A–Z, normalized accent-insensitive substring search, `tipo` filter chips; row tap → banner screen showing that id (`router.push` param consumed by `useRefranDeck`).
- [ ] **Step 3: Favoritos** — list of starred via same `RefranRow`; empty state copy.
- [ ] **Step 4: Share** — `Share.share({ message: '«…» — significado' })` from banner + rows.
- [ ] **Step 5: `tsc` + simulator QA:** star persists across `restart-app`, search filters, share sheet opens. Commit `feat(app): favorites, search, share`.

### Task 6: `apps/website` — React Router v7 on CF Workers

**Files:**
- Create: `apps/website/` via `bunx create-react-router@latest` Cloudflare template, `apps/website/app/routes/home.tsx`, `apps/website/app/styles/*.css.ts` (Vanilla Extract), `apps/website/public/refranes.json` (build step copies from `packages/data`), `apps/website/wrangler.jsonc`

Sections (from spec): hero with CSS papel picado banners + animated featured refrán (CSS keyframe sway + word cascade), searchable list (client-side over bundled data), "Descarga el diccionario" with schema docs + MIT note. `/refranes.json` static asset with `Access-Control-Allow-Origin: *` (assets config or explicit headers).

- [ ] **Step 1: Scaffold + Vanilla Extract plugin** wired into Vite config.
- [ ] **Step 2: Build the page** (hero, list, download section) using `@refranes/data` import; copy/emit `refranes.json` into build assets with a `prebuild` script (`cp ../../packages/data/refranes.json public/refranes.json`).
- [ ] **Step 3: CORS** — Workers assets serve with `Access-Control-Allow-Origin: *` for `/refranes.json` (via `public/_headers` if supported by the template's assets config, else a tiny worker fetch handler branch). Verify with `curl -I` against `bun run dev`.
- [ ] **Step 4: `wrangler.jsonc`:** name `refranes-cesargdm`, routes `[{ "pattern": "refranes.cesargdm.com", "custom_domain": true }]`.
- [ ] **Step 5: `bun run build` + local check, commit** `feat(website): landing + public refranes.json`.

*May be delegated to an Opus subagent in parallel with Tasks 4–5 once Task 2 lands.*

### Task 7: Ship

- [ ] **Step 1: Full QA sweep** — `bun run check` at root (data validate + both tsc), final Argent QA flow on simulator.
- [ ] **Step 2: Push** `git push origin master`.
- [ ] **Step 3: Deploy** `cd apps/website && bunx wrangler deploy` (custom domain auto-provisions DNS on the cesargdm.com zone).
- [ ] **Step 4: Verify live** — `curl -sI https://refranes.cesargdm.com/refranes.json` → 200, `access-control-allow-origin: *`; page renders (fetch HTML, spot-check).
- [ ] **Step 5: Update README** (repo had a stub) — one short paragraph + JSON link. Commit + push.

## Self-review notes

- Spec coverage: data (T2), app deck/animation (T4), favorites/search/share (T5), website + JSON + CORS (T6), push/deploy/DNS (T7), Swift removal (T1). Reduced motion + legibility constraints embedded in T4 contract. ✓
- Types consistent: `Refran`/`RefranTipo` defined once in `packages/data`, imported everywhere. ✓
- No TBDs; editorial content authored in T2 Step 1 per explicit rules (the content itself is the work product, enumerated in the source file's TERMINAR markers). ✓
