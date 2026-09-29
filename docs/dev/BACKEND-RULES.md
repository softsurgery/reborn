# Reborn API — Backend Rules

## Stack

NestJS 11, TypeScript 5, TypeORM 0.3 (MySQL), XState 5, MinIO (S3), Socket.IO, JWT auth, class-validator, SWC compiler, Yarn 1.

## Module Anatomy

Every domain module follows: `controllers/`, `services/`, `repositories/`, `entities/`, `dtos/`, `enums/`, `errors/`, `workflows/` (if applicable), and a root `.module.ts`.

Services extend `AbstractCrudService<Entity>`. Repositories wrap TypeORM.

## Naming Conventions

**Files** — kebab-case with suffix: `job-request.entity.ts`, `create-job-request.dto.ts`, `job-request.notfound.error.ts`, `job-request.workflow.ts`.

**Classes** — PascalCase matching file suffix: `JobRequestEntity`, `CreateJobRequestDto`, `JobRequestNotFoundException`.

**Enums** — PascalCase names, PascalCase values with human-readable strings: `JobRequestStatus.Pending = 'pending'`.

## Entity Rules

- All entities extend `EntityHelper` (provides `createdAt`, `updatedAt`, `deletedAt` soft delete).
- Domain entities (users, jobs) use `@PrimaryGeneratedColumn('uuid')`.
- Secondary entities (views, saves, follows) use `@PrimaryGeneratedColumn('increment')`.
- Always define both the relation property AND the FK column separately.
- Use `onDelete: 'CASCADE'` for owned relationships.
- Decimal columns use `precision: 10, scale: 2`.

## DTO Pattern

Three DTOs per entity:

- `CreateXDto` — input for creation, class-validator decorators.
- `UpdateXDto` — `extends Partial<CreateXDto>`.
- `ResponseXDto` — output serialization, class-transformer decorators.

Convert entities to DTOs using `toDto()` / `toDtoArray()`. Never expose raw entities in responses.

## Controller Pattern

```typescript
@ApiTags('resource-name')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor, LogInterceptor, NotificationInterceptor)
@Controller({ version: '1', path: '/resource-name' })
```

Standard endpoints: `GET /list` (paginated), `GET /all`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`.

- Use `@LogEvent(EventType.X)` for audit logging.
- Use `@Notify(NotificationType.X)` for triggering notifications.
- Access current user via `req.user?.sub`.

## Routing

Routes are namespaced: `/api/` (main), `/api/admin/`, `/api/public/` (no auth), `/api/callback/` (OAuth/webhooks), `/api/test/` (dev).

## Pagination

Custom system: `PageDto<T>` wraps data + `PageMetaDto` (page, take, total count). `QueryBuilder` builds TypeORM `FindManyOptions` from query params (`page`, `limit`, `join`, `filter`, `sort`).

## XState Workflow Pattern

1. **Define machine** in `workflows/<name>.workflow.ts` — states with `meta` (`isUpdatable`, `title`, `category`, `description`, `actor`, `iconName`) and transition events.
2. **Create workflow service** extending `AbstractWorkflowService<StatusEnum, EventsEnum>` — implements `findOneById()` (returns status + next steps) and `next()` (triggers transition + side effects).
3. **Expose via controller** — `GET /:id/workflow` for current state, `PUT /:id/<action>` for transitions.

XState validates transitions — invalid ones throw automatically.

## Auth

JWT access (1d) + refresh tokens. `AuthGuard` protects all routes by default. Google OAuth via `google-auth-library`. RBAC with seeded permissions/roles.

## Transactions

Use `@Transactional()` decorator (from `@nestjs-cls/transactional`) on service methods that perform multiple writes. CLS propagates transaction context automatically.

## Seeding

Seeders run on `postinstall` via `nestjs-command`. Covers: permissions, roles, admin, templates, skills, regions, currencies, job-categories, job-tags, configuration, public-resource, storage-folders. All idempotent.

`yarn seed:playground` creates test users and jobs for development.

## Error Handling

One exception class per file in `errors/<entity>/`. Extend NestJS built-in exceptions. Use descriptive names: `JobRequestCannotRequestOwnJobException`.

## Code Style

- Prettier: single quotes, trailing commas.
- ESLint: typescript-eslint recommended (type-checked), `no-floating-promises: warn`, unused vars with `_` prefix ignored.
- TypeScript: `strictNullChecks: true`, `strict: false`, target `ES2023`.

## Docker

Multi-stage build: `node:22-alpine` (build with SWC) → `gcr.io/distroless/nodejs20-debian12` (runtime). Entry: `dist/main.js`. No shell in production.
