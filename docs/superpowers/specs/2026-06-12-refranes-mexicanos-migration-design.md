# Refranes Mexicanos — React Native migration + website

**Date:** 2026-06-12
**Status:** Approved pending user spec review

## Goal

Migrate the 2015 Swift iOS app to React Native (Expo), redesign the sayings
experience around a "papel picado street" animation concept, and publish a
website at `refranes.cesargdm.com` that serves the dictionary as a public,
downloadable JSON dataset.

## Decisions (user-confirmed)

- **Structure:** convert this repo into a bun-workspaces monorepo
  (`apps/app`, `apps/website`, `packages/data`). Swift app removed in the
  migration commit; history stays in git.
- **Dictionary:** complete the ~40 empty `significado` entries (authored
  in-session), fix typos/accents in existing entries, normalize `tipo`.
- **Aesthetics:** modernized rosa mexicano — magenta `#EB00AF`, teal, gold,
  white talavera/papel picado motifs redrawn as vector assets.
- **App features:** sayings deck + favorites + search/browse + share.
  No watch app, no settings screen.
- **Animation concept:** papel picado street (see below).
- **Web stack:** React Router v7 + Vanilla Extract on Cloudflare Workers.
- **Shipping:** push to existing GitHub repo `main`; deploy Worker live and
  wire `refranes.cesargdm.com` DNS on the Cloudflare zone.

## Architecture

```
refranes-mexicanos/
├── apps/
│   ├── app/        Expo SDK 55, Unistyles 3, Reanimated, Gesture Handler,
│   │               Skia, expo-haptics, MMKV (favorites)
│   └── website/    React Router v7, Vanilla Extract, CF Workers
├── packages/
│   └── data/       refranes.json (canonical), TS types, validation script
└── docs/superpowers/specs/
```

`packages/data` is the single source of truth. Both app and website import
it; the website also exposes it verbatim at `/refranes.json`.

## Data — `packages/data`

- Schema per entry: `{ id, refran, significado, tipo }`.
  - `id`: stable slug of the saying (`a-falta-de-pan-tortillas`) — favorites
    key off it, so it must never change once published.
  - `tipo`: `"refrán" | "dicho"` (lowercase, normalized; source data had
    `Refrán`/`Dicho`/`Refran`).
- Editorial pass: write the ~40 missing meanings; fix typos and accents in
  existing ones (`haz de beber` → `has de beber`, `fracazando` → `fracasando`,
  `caé` → `cae`, `alenta`, `escenciales`, `desemepeñará`, etc.).
- `validate.ts` (run via `bun run check`): JSON parses, all fields present
  and non-empty, ids unique and slug-shaped, `tipo` in enum.
- Exported TS type `Refran` + typed import of the JSON.

## App — `apps/app`

### Sayings screen: "papel picado street"

The signature interaction. Composition:

- A rope/string curve strung across the upper screen; the current refrán
  hangs from it as a papel picado banner — a flag with decorative cut-out
  border (Skia-masked motifs derived from the original 6 mosaic tiles),
  saying text on the flat body in high-contrast type.
- **Idle:** banner sways gently (pendulum, ±2° max, slow ease). Optionally
  driven by device tilt (gyroscope) for a "hanging in the breeze" feel.
  Sway is subtle by design — legibility wins over spectacle.
- **Text entrance:** words of the refrán cascade in one-by-one with spring
  overshoot when a new banner arrives.
- **Swipe (next saying):** the banner tears — splits into shreds that
  flutter down with physics and fade — while the next banner is pulled
  across on the string with spring + overshoot. Flag color rotates through
  the palette (magenta → teal → gold → violet). Haptic on tear.
- **Meaning:** a pull-tab below the banner unrolls the `significado` like a
  paper scroll. Sway pauses while the scroll is open. Shows `tipo` chip
  (Refrán/Dicho), favorite star, share button.
- Reduced-motion setting respected: cross-fade instead of tear/sway.

### Other screens

- **Browse tab:** A–Z sectioned list of all sayings, fuzzy search box,
  `tipo` filter chips. Tapping a row opens that saying on the banner screen.
- **Favorites tab:** starred sayings list (MMKV-persisted set of ids),
  same row component as browse.
- **Share:** native share sheet, text format `"«refrán» — significado"`.
  (Pretty share-card image is a possible later iteration, out of scope.)

### Navigation

Expo Router tabs: Refranes (banner), Buscar, Favoritos.

## Website — `apps/website`

- Single landing page, same visual language. Sections:
  1. Hero: CSS/SVG papel picado banners with an animated featured refrán
     (web echo of the app concept — CSS keyframe sway + word cascade).
  2. Browsable/searchable list of all sayings (client-side filter over the
     bundled JSON).
  3. "Descarga el diccionario": prominent download link to
     `/refranes.json`, schema documented inline, MIT license note.
- `GET /refranes.json`: static asset, `Access-Control-Allow-Origin: *`,
  `Content-Type: application/json; charset=utf-8` — a genuinely public
  dataset endpoint.
- Deploy: Worker `refranes-cesargdm`, custom domain `refranes.cesargdm.com`
  on the existing Cloudflare zone.

## Error handling

- App is fully offline — data is bundled; no network states to handle.
- Favorites storage failures degrade silently to in-memory.
- Website is static — no server state beyond asset serving.

## Testing / verification

- Data: validation script as unit gate (schema, non-empty, unique ids).
- App: lint + typecheck; end-to-end QA on iOS simulator via Argent
  (banner entrance, tear/next, scroll open, favorite persists across
  restart, search filters, share sheet opens).
- Website: local build check; post-deploy verification that the page
  renders and `curl -I https://refranes.cesargdm.com/refranes.json`
  returns 200 + CORS header.

## Out of scope (deliberate)

- Apple Watch app, settings screen, share-card image generation,
  EAS builds / store submission, analytics, i18n (content is es-MX only),
  backend/API (dataset is static).
