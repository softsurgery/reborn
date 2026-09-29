# Reborn Mobile App — Mobile Rules

## Stack

Expo SDK 54, React Native 0.81, Expo Router 6, TypeScript 5.9, NativeWind 4 (Tailwind for RN), Zustand 5, TanStack React Query 5 (with AsyncStorage persister), Axios, Zod 4, react-i18next, Socket.IO client, react-native-reanimated, @rn-primitives, @tabler/icons-react-native, lucide-react-native, react-native-maps, Yarn 1.

New Architecture is enabled. Typed routes are enabled.

## Navigation (Expo Router)

File-based routing under `app/`. Tab navigation uses `(tabs)/` folder convention. Dynamic routes use `[param].tsx`. Layouts use `_layout.tsx` for providers and nav shells.

Navigate with `router.push()`, `router.replace()`, `router.back()` from `expo-router`.

## Styling (NativeWind)

```tsx
<View className="flex-1 bg-background p-4">
  <Text className="text-lg font-semibold text-foreground">Hello</Text>
</View>
```

- Use `className` for all styling. Avoid inline `style={{}}` and inline `color={}` unless you get aware that something is wrong with styling.
- Use `cn()` utility for conditional classes (from `clsx` + `tailwind-merge`).
- Use CVA (`class-variance-authority`) for component variants.
- Theme tokens in `tailwind.config.js` — use semantic names (`bg-background`, `text-foreground`).

## Component Architecture

- `components/ui/` holds primitives only (button, input, dialog, etc.) built on `@rn-primitives` — no business logic. Feature components go in domain folders (`jobs/`, `chat/`, `explore/`, `profile/`, etc.) mirroring the navigation structure. Shared components in `shared/`.
- Every main module component must use be named `SomthingPortal.tsx`

## State Management

**Zustand** for client state, **React Query** for server state. Never mix.

Key stores in `hooks/stores/`:

| Store                       | Persisted | Purpose                       |
| --------------------------- | --------- | ----------------------------- |
| `useAuthPersistStore`       | ✅        | JWT tokens (access + refresh) |
| `usePreferencePersistStore` | ✅        | User preferences              |
| `useAuthStore`              | —         | Runtime auth state            |
| `useJobStore`               | —         | Job selection/filters         |
| `useJobApplyStore`          | —         | Job application form          |
| `useUserStore`              | —         | Current user profile          |
| `useChatPendingStore`       | —         | Pending chat messages/uploads |
| `useExploreFilterStore`     | —         | Explore screen filters        |

Persistent stores use `zustand/persist` middleware with `AsyncStorage`. React Query cache also persists to AsyncStorage via `@tanstack/query-async-storage-persister`.

## API Layer

Centralized Axios instance in `api/axios.ts`. Key behaviors:

- **Request interceptor**: attaches JWT `Authorization` header + `x-timezone` header.
- **Response interceptor**: on 401, auto-refreshes token using refresh token. On failure → clears tokens → redirects to login.
- **Global delay**: configurable via `EXPO_PUBLIC_GLOBAL_DELAY` for dev testing.

API functions grouped by domain in `api/`: `job.ts`, `job-request.ts`, `auth.ts`, `chat/`, etc. Never call axios directly from components.

## Auth Flow

1. Login via email/password or Google SSO (`useSSO` hook + `expo-auth-session`).
2. Tokens stored in `useAuthPersistStore` (AsyncStorage).
3. Axios interceptor auto-attaches token.
4. On 401 → auto-refresh → on failure → logout + redirect.

## Types

All in `types/`, grouped by domain (`job-management.ts`, `user-management.ts`, `chat.ts`, etc.). Mirror the API's response DTO shapes. **Enum values must match backend exactly.**

## i18n

- All user-facing strings use `t('key')` via `react-i18next`. Locale files in `i18n/locales/`. RTL support via `useRTL` hook. Never hardcode display text.
- Never use default values in translation functions

## Realtime

Socket.IO client configured in `lib/socket.ts`. Used for chat and notifications. Connect after auth, disconnect on logout. Event listeners go in context providers or hooks, not components.

## Context Providers

`LoaderContext` (global loading), `ChatContext` (active chat), `NotificationContext` (badge counts), `ScrollViewContext` (nested scroll coordination). Mounted in `_layout.tsx` files. Prefer Zustand for state that doesn't need React tree propagation.

## File Naming

Components: `PascalCase.tsx`. Hooks: `useCamelCase.ts`. Utilities: `kebab-case.ts`. API files: `kebab-case.ts`. Types: `kebab-case.ts`. Import aliases: `~/` and `@/` map to project root.

## Environment Variables

Prefixed with `EXPO_PUBLIC_`. Key vars: `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_GLOBAL_DELAY`, `EXPO_PUBLIC_GOOGLE_CLIENT_ID`. Never commit `.env`.
