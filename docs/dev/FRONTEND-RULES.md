# Reborn Back Office — Frontend Rules

## Stack

Next.js 16 (Pages Router), React 19, TypeScript 5, Tailwind CSS 3, shadcn/ui (Radix), Zustand 5, TanStack React Query 5, Axios, NextAuth.js v4, next-i18next, Recharts, XYFlow + dagre, motion (Framer Motion), sonner, cmdk, vaul, TanStack React Table, Zod, Yarn 1.

## Pages Router

This project uses the **Next.js Pages Router** (not App Router). Pages group into feature folders under `src/pages/`: `user-management/`, `content-management/`, `services-management/`, `audit-monitoring/`, `system-reports/`, etc.

Page components should be thin — delegate logic to hooks and render components.

## Component Organization

Components are organized by **feature domain**, not by type. `components/ui/` holds shadcn/ui primitives only (no business logic). Feature folders (`user-management/`, `content-management/`, etc.) mirror the pages structure. Shared composites go in `shared/`, layout components in `layout/`.

## shadcn/ui Pattern

Primitives are built on `@radix-ui/*`, styled with `class-variance-authority` (CVA) for variants, and composed with `cn()` (from `clsx` + `tailwind-merge`):

```typescript
import { cn } from "@/lib/utils";
className={cn("base-classes", condition && "conditional-classes")}
```

## State Management

- **Zustand** for client/UI state (modals, filters, selections). One store per concern.
- **TanStack React Query** for all server state. `useQuery` for reads, `useMutation` for writes with query invalidation.
- Never mix the two — Zustand doesn't fetch, React Query doesn't hold UI state.

## Data Fetching

Centralized Axios instance in `src/api/`. Auth token injection via interceptors. API functions grouped by domain. Never use raw `fetch()`.

## Auth

NextAuth.js v4 with custom type extensions in `next-auth.d.ts`. Auth routes in `src/pages/api/auth/`.

## i18n

All user-facing strings use `t('key')` via react-i18next. Translations loaded via HTTP backend with localStorage caching. Never hardcode display text.

## Data Visualization

Recharts for dashboard charts. XYFlow + dagre for workflow/state machine graph rendering.

## UI Patterns

Toasts: `sonner`. Animations: `motion`. Command palette: `cmdk`. Drawers: `vaul`. DnD: `@dnd-kit`. Steppers: `@stepperize/react`. Tables: `@tanstack/react-table` with server-side pagination.

## Types

All types in `src/types/`, grouped by domain. Mirror the API's response DTO shapes. Use `interface` for objects, `enum` for fixed sets.

## File Naming

Components: `PascalCase.tsx`. Utilities: `kebab-case.ts`. Hooks: `use` prefix, `camelCase.ts`. Pages: `kebab-case.tsx`.

## Environment Variables

Client-accessible vars prefixed with `NEXT_PUBLIC_`. Never commit `.env`.
