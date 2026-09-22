# Refranes Mexicanos — app

Expo / React Native app (`@refranes/app`): a papel picado banner you swipe
through, plus search (`buscar`) and favorites (`favoritos`, stored in MMKV by
refrán id). Data comes from `@refranes/data`.

## Develop

From the repo root:

```bash
bun install
bun run --cwd apps/app ios        # dev build on the iOS simulator (Metro on 8081)
bun run --cwd apps/app android    # dev build on an Android emulator
bun run --cwd apps/app check      # typecheck
```

These are `expo run:*` development builds, not Expo Go. `ios/` and `android/`
are generated; configure the app in `app.json` or config plugins.

See [`AGENTS.md`](./AGENTS.md) for project rules and bun monorepo gotchas.
