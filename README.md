# Refranes Mexicanos

A collection of Mexican sayings (*refranes* and *dichos*), each with its
meaning. A React Native app and a public website, sharing one canonical
dataset.

- **App** (`apps/app`) — Expo / React Native. A papel picado banner you swipe
  through, plus search and favorites.
- **Website** (`apps/website`) — [refranes.cesargdm.com](https://refranes.cesargdm.com),
  React Router on Cloudflare Workers.
- **Data** (`packages/data`) — `refranes.json`, the single source of truth.

## Public dictionary

The full dataset is free to download and use (MIT):

```
https://refranes.cesargdm.com/refranes.json
```

Served with open CORS. Each entry:

```json
{
  "id": "camaron-que-se-duerme-se-lo-lleva-la-corriente",
  "refran": "Camarón que se duerme, se lo lleva la corriente.",
  "significado": "Quien se descuida deja pasar las oportunidades…",
  "tipo": "refrán"
}
```

`tipo` is `"refrán"` or `"dicho"`.

## Develop

```bash
bun install
bun run check          # validate data + typecheck app & website

bun run --cwd apps/app ios        # run the app on a simulator
bun run --cwd apps/website dev    # run the website locally
```

## Deploy the website

```bash
bun run --cwd apps/website deploy
```
