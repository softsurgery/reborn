# reborn

Monorepo for the Reborn platform.

## Apps

| Path | Package | Stack |
|------|---------|--------|
| `apps/web` | `reborn-back-office` | Next.js |
| `apps/mobile` | `reborn-mobile-app-v2` | Expo React Native |
| `apps/api` | `reborn-api` | NestJS |

## Package manager

Yarn Classic (`1.22.22`) workspaces. Each app previously used Yarn; this monorepo continues with Yarn workspaces.

```sh
yarn install
```

## Develop

```sh
yarn dev:web
yarn dev:mobile
yarn dev:api
```

Shared libraries can be added under `packages/` as needed.
