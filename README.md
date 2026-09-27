# reborn

Monorepo for the Reborn platform.

## Apps

| Path | Package | Stack |
|------|---------|--------|
| `apps/web` | `reborn-back-office` | Next.js |
| `apps/mobile` | `reborn-mobile-app-v2` | Expo React Native |
| `apps/api` | `reborn-api` | NestJS |

## Package manager

[pnpm](https://pnpm.io) workspaces. The three apps originally used Yarn Classic; the monorepo standardizes on pnpm.

```sh
pnpm install
```

## Develop

```sh
pnpm dev:web
pnpm dev:mobile
pnpm dev:api
```

Shared libraries can be added under `packages/` as needed.
