# Refranes Mexicanos — website

[refranes.cesargdm.com](https://refranes.cesargdm.com): React Router v7 on
Cloudflare Workers (Worker `refranes-cesargdm`). The Worker in
`workers/app.ts` also serves the public dataset at `/refranes.json` with open
CORS; the data is bundled from `@refranes/data` at build time, so data changes
go live only after a deploy.

## Develop

From the repo root:

```bash
bun install
bun run --cwd apps/website dev      # http://localhost:5173
bun run --cwd apps/website check    # route typegen + typecheck
```

## Deploy

Deploys are manual; nothing deploys on merge.

```bash
(cd apps/website && bun run build && bunx wrangler deploy --dry-run)   # verify
bun run --cwd apps/website deploy                                      # ship
```
