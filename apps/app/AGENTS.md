# App (`apps/app`)

IMPORTANT: Expo has changed. Read the versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

- `bun run ios` / `bun run android` are `expo run:*` dev builds, not Expo Go. `ios/` and `android/` are generated and gitignored; config belongs in `app.json` / config plugins.
- Typecheck: `bun run check` (`tsc --noEmit`). `bun run lint` has no ESLint config yet and will try to scaffold one; don't run it unless asked to set up linting.
- React Compiler is deliberately off (`experiments.reactCompiler: false`); it caused subtle bugs. Don't re-enable it.
- MMKV is v4: `createMMKV({ id })`, not `new MMKV()`.
- In `babel.config.js`, `react-native-worklets/plugin` must stay the last plugin.

## Bun monorepo gotchas

- `babel-preset-expo` must stay an explicit devDependency; bun doesn't place it where Babel looks, and Metro fails with "Cannot find module 'babel-preset-expo'".
- `metro.config.js` needs `watchFolders = [workspaceRoot]` plus both `nodeModulesPaths`. Do not set `disableHierarchicalLookup`; it breaks the transformer under bun's store.
- Skia's postinstall copies its prebuilt binaries into `libs/`; it only runs because `@shopify/react-native-skia` is in the root `trustedDependencies` (bun blocks lifecycle scripts otherwise). That list replaces bun's default allowlist, so keep `esbuild`, `sharp` and `workerd` in it. If pod install fails with "Skia prebuilt binaries not found" in an older checkout, run `bun install --force` once.
