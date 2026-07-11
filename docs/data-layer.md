# Data Layer

This document covers the database schema, models, and migration patterns.

---

## Database

- **Engine:** PostgreSQL
- **ORM:** Prisma 7
- **Connection:** Defined in `.env` as `DATABASE_URL`
- **Client:** Singleton instance in `lib/db.ts`

---

## Models

### User

Table name: `users`

| Field | Type | Constraints | Default |
|-------|------|-------------|---------|
| `id` | String (UUID) | Primary key | Auto-generated |
| `name` | String | Required | — |
| `email` | String | Unique, Required | — |
| `password` | String | Required | — |
| `role` | String | Required | `"user"` |
| `createdAt` | DateTime | Required | `now()` |
| `updatedAt` | DateTime | Required | Auto-updated |

### Category

Table name: `categories`

| Field | Type | Constraints | Default |
|-------|------|-------------|---------|
| `id` | String (UUID) | Primary key | Auto-generated |
| `label` | String | Unique, Required | — |
| `description` | String | Optional | — |
| `createdAt` | DateTime | Required | `now()` |
| `updatedAt` | DateTime | Required | Auto-updated |

### Item

Table name: `items`

| Field | Type | Constraints | Default |
|-------|------|-------------|---------|
| `id` | String (UUID) | Primary key | Auto-generated |
| `user_id` | String | Required (FK → users) | — |
| `category_id` | String | Required (FK → categories) | — |
| `name` | String | Required | — |
| `stock` | Int | Required | — |
| `description` | String | Optional | — |
| `createdAt` | DateTime | Required | `now()` |
| `updatedAt` | DateTime | Required | Auto-updated |

---

## Relationships

```
users ─────────── 1:N ──────────── items
                                         │
categories ────── 1:N ──────────── items
```

- **User → Items:** One user can own many items (`user_id` FK)
- **Category → Items:** One category can contain many items (`category_id` FK)
- **Item → User:** Each item belongs to exactly one user
- **Item → Category:** Each item belongs to exactly one category

> **Note:** The Prisma schema does not define explicit `@relation` directives. The foreign keys (`user_id`, `category_id`) are stored as plain `String` fields. Relations are handled at the application level through manual queries.

---

## Schema Files

The Prisma schema is split across multiple files:

```
prisma/
├── schema.prisma               # Main config (generator, datasource)
└── model/
    ├── user.schema.prisma       # User model
    ├── category.schema.prisma   # Category model
    └── item.schema.prisma       # Item model
```

---

## Migrations

Migrations are stored in `prisma/migrations/`:

| Migration | Purpose |
|-----------|---------|
| `20260615121924_init` | Initial schema — creates users, categories, items tables |
| `20260615232144_add_role_to_user_table` | Adds `role` column to users table |

### Common Commands

```bash
# Run pending migrations
bunx prisma migrate dev

# Create a new migration after schema changes
bunx prisma migrate dev --name <migration-name>

# Reset database (deletes all data)
bunx prisma migrate reset

# Regenerate Prisma client (after schema changes)
bunx prisma generate

# Browse database in browser
bunx prisma studio
```

---

## How Models Are Used

### Repository Layer

All database queries go through repository classes:

```ts
// modules/user/repository/user.repository.ts
export default class UserRepository {
  static async create(data: CreateUserType) {
    return await db.userModel.create({ data });
  }

  static async list(query: ListUserQueryType) {
    const where: Prisma.UserModelWhereInput = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
      ];
    }
    const [items, paging] = await db.userModel
      .paginate({ where, orderBy: { createdAt: query.sortOrder } })
      .withPages({ page: query.page, limit: query.limit });
    return { items, paging };
  }
}
```

### Service Layer

Services call repositories:

```ts
// modules/user/service/user.service.ts
export default class UserService {
  static async create(data: CreateUserType) {
    const user = await UserRepository.create(data);
    const { password, ...result } = user;
    return result;  // Don't return password hash
  }
}
```

### Controller Layer

Controllers validate input and wrap responses:

```ts
// modules/user/controller/user.controller.ts
export default class UserController {
  static async create(data: CreateUserType) {
    const result = UserValidation.CREATE.safeParse(data);
    if (!result.success) {
      return Response.error("Validation failed", 400, result.error.flatten().fieldErrors);
    }
    const user = await UserService.create(result.data);
    return Response.success("User created", 201, user);
  }
}
```

---

## Data Patterns

### Sensitive Data

The `password` field is never returned to the client:

```ts
// In repository:
const user = await db.userModel.create({ data });
const { password, ...result } = user;  // Strip password
return result;
```

### Pagination

All list queries use Prisma's `paginate` extension:

```ts
const [items, paging] = await db.model
  .paginate({ where, orderBy })
  .withPages({ page, limit });
```

The `PagingType` returned:

```ts
{
  currentPage: number;  // Current page (1-indexed)
  totalPages: number;   // Total number of pages
}
```

### Search

Search uses Prisma's `contains` with `mode: "insensitive"`:

```ts
where.OR = [
  { name: { contains: search, mode: "insensitive" } },
  { email: { contains: search, mode: "insensitive" } },
];
```

### Sorting

Sorting uses Prisma's `orderBy`:

```ts
orderBy: { createdAt: sortOrder }  // "asc" or "desc"
```

---

## Related Diagrams

- [ERD Diagram](./erd/erd.drawio) — Visual database diagram

---

## Next Steps

- [Architecture](./architecture.md) — How the data layer fits into the overall system
- [Backend Patterns](./backend.md) — How controllers, services, and repositories work
- [How to Develop a Module](./how-to-develop-module.md) — Adding a new model
