# reborn

Monorepo for the Reborn platform. Shared libraries live in the separate [softsurgery-abstractions](https://github.com/softsurgery/softsurgery-abstractions) repo and are checked out here as the `packages/` git submodule.

| App | Package | Stack |
|------|---------|--------|
| `apps/web` | `reborn-back-office` | Next.js |
| `apps/landing` | `reborn-landing` | Next.js |
| `apps/mobile` | `reborn-mobile-app` | Expo React Native |
| `apps/api` | `reborn-api` | NestJS |
| `apps/api-client` | `@softsurgery/api-client` | Typed HTTP client |
| `apps/i18n` | `@softsurgery/i18n` | Shared locales / i18n |

```text
/
├── apps/
│   ├── web/
│   ├── landing/
│   ├── mobile/
│   ├── api-client/
│   ├── i18n/
│   └── api/
├── packages/         # git submodule → softsurgery/softsurgery-abstractions
├── scripts/
├── package.json
└── pnpm-workspace.yaml
```

## Clone

`packages/` is a submodule. Clone with submodules, or init them after a plain clone:

```sh
git clone --recurse-submodules git@github.com:softsurgery/reborn.git
# or
git submodule update --init --recursive
```

Edit shared packages in [softsurgery-abstractions](https://github.com/softsurgery/softsurgery-abstractions) (or inside the `packages/` working tree). Bump the submodule when apps should pick up a new revision:

```sh
cd packages && git pull origin main && cd ..
git add packages && git commit -m "chore: bump softsurgery-abstractions"
```

## Package manager

[pnpm](https://pnpm.io) workspaces (`apps/*`, `packages/*`) with Turbo. App dependencies on `@softsurgery/*` stay `workspace:*`.

```sh
pnpm install
```

## Develop

```sh
pnpm dev              # all apps under apps/
pnpm dev:web
pnpm dev:mobile
pnpm dev:api
pnpm build
pnpm lint
pnpm check-types
pnpm format
```
