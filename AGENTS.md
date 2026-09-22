# Refranes Mexicanos

Bun-workspaces monorepo (`bun.lock`; use `bun`, never npm/yarn/pnpm). Default branch is `master`.

- `packages/data` — `refranes.json`, the single source of truth for both apps (`@refranes/data`).
- `apps/app` — Expo / React Native app. App-specific rules live in `apps/app/AGENTS.md`.
- `apps/website` — React Router v7 on Cloudflare Workers, serves refranes.cesargdm.com.

## Commands

```bash
bun install
bun run check                          # validate data + typecheck every workspace; the only gate (no CI, no tests, no lint config)
bun packages/data/validate.ts          # data only
bun run --filter @refranes/website check   # one workspace

bun run --cwd apps/app ios             # dev build on the iOS simulator; Metro on 8081
bun run --cwd apps/website dev         # website on http://localhost:5173
(cd apps/website && bun run build && bunx wrangler deploy --dry-run)   # verify a deploy without shipping
```

Deploys are manual (`bun run --cwd apps/website deploy` → Worker `refranes-cesargdm`), nothing deploys on merge. Only deploy when asked.

## Data rules

- Entries are `{ id, refran, significado, tipo }`; `tipo` is `"refrán"` or `"dicho"`; `id` is a kebab-case slug (`ñ` allowed). `validate.ts` enforces this, plus unique ids and no `TERMINAR` placeholders.
- Never rename or remove an existing `id`: the app stores favorites by id, and `https://refranes.cesargdm.com/refranes.json` is a public, documented API.
- The website bundles the JSON at build time (`apps/website/workers/app.ts`), so data changes go public only after a website deploy.

## Style

No formatter is configured; match the file. `packages/data` and the root `package.json` use tabs; the apps use 2 spaces. TypeScript, single quotes, no semicolons.
