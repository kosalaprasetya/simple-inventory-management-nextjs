# Backend Patterns

This document explains the server-side code patterns: Server Actions, controllers, services, and repositories.

---

## Server Actions

### What Are They?

Server Actions are functions that run on the server, called directly from client components. They replace traditional REST API routes.

```ts
"use server";  // ← This directive makes it a Server Action

export default async function createCategoryAction(
  _prevState: CreateCategoryState | undefined,
  data: FormData,
): Promise<CreateCategoryState> {
  // This code runs on the server, not in the browser
}
```

### Why Use Them?

| Traditional API | Server Actions |
|----------------|---------------|
| Create `/api/categories` route | Mark function with `"use server"` |
| Write fetch() in client | Call the function directly |
| Handle request/response manually | FormData comes automatically |
| Return JSON | Return any value |

### How They're Called

```tsx
// In a client component:
"use client";
import { useActionState } from "react";
import createCategoryAction from "../actions/create.action";

function MyForm() {
  const [state, action, isPending] = useActionState(createCategoryAction, initialState);
  
  return (
    <form action={action}>  {/* ← action is the server function */}
      <input name="label" />
      <button disabled={isPending}>
        {isPending ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
```

### The `useActionState` Hook

React 19 hook that manages form submission state:

```ts
const [state, action, isPending] = useActionState(serverAction, initialState);
```

| Return Value | Type | What It Is |
|-------------|------|-----------|
| `state` | `{ success, data?, errors? }` | Result from the server action |
| `action` | Function | Pass this to `<form action={action}>` |
| `isPending` | boolean | `true` while the action is running |

### Action File Pattern

Every action follows this structure:

```ts
"use server";

// 1. Define the state type
export type CreateCategoryState = {
  success: boolean;
  data?: { label: string; description?: string };
  errors?: { label?: string[]; description?: string[] };
};

// 2. Define the action function
export default async function createCategoryAction(
  _prevState: CreateCategoryState | undefined,
  data: FormData,
): Promise<CreateCategoryState> {
  // 3. Extract form data
  const input = Object.fromEntries(data.entries());

  // 4. Validate with Zod
  const result = Validation.validate(CategoryValidation.CREATE, input);
  if (!result.success || !result.data) {
    return { success: false, errors: result.errors };
  }

  // 5. Call the controller
  const create = await CategoryAction.default.createCategory(result.data);
  if (!create.success) {
    return { success: false, errors: { label: ["Failed to create"] } };
  }

  // 6. Invalidate cache
  revalidatePath("/category");

  // 7. Return success
  return { ...create } as CreateCategoryState;
}
```

---

## The Controller Layer

### What It Does

Controllers sit between actions and services. They:
1. Validate input (double-check with Zod)
2. Call the service
3. Wrap results in a standardized response
4. Handle errors

### The Pattern

```ts
export default class CategoryController {
  static async createCategory(data: CreateCategoryType) {
    try {
      // 1. Validate input
      const validateInput = Validation.validate(CategoryValidation.CREATE, data);
      if (!validateInput.success) {
        return Response.error("Validation failed", 400, validateInput.errors);
      }

      // 2. Call service
      const result = await CategoryService.createCategory(
        validateInput.data as CreateCategoryType,
      );

      // 3. Return success
      return Response.success("Category created successfully", 201, result);
    } catch (error) {
      // 4. Handle errors
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }
}
```

### Why Validate Twice?

Validation happens in both the action AND the controller:
- **Action validation:** Quick check before calling the controller (saves a round-trip)
- **Controller validation:** Defense in depth — the controller doesn't trust the action

### Response Format

Every controller returns the same shape:

```ts
// Success:
{ success: true, statusCode: 201, message: "Created", data: { id: "...", ... } }

// Error:
{ success: false, statusCode: 400, message: "Validation failed", errors: { ... } }
```

---

## The Service Layer

### What It Does

Services contain business logic. They:
1. Apply default values
2. Run business rules (duplicate checks, password hashing)
3. Delegate to the repository

### The Pattern

```ts
export default class CategoryService {
  static async create(data: CreateCategoryType) {
    return await CategoryRepository.create(data);
  }

  static async list(query?: ListCategoryQueryType) {
    // Apply defaults
    const listQuery = {
      page: query?.page || 1,
      limit: query?.limit ?? 10,
      search: query?.search || "",
      sortOrder: query?.sortOrder || "asc",
    } as ListCategoryQueryType;
    return await CategoryRepository.list(listQuery);
  }
}
```

### When Services Have Real Logic

Most services are thin wrappers, but some have real logic:

```ts
// user.service.ts — has actual business logic:
static async create(data: CreateUserType) {
  // Check for duplicate email
  const existing = await UserRepository.getByEmail(data.email);
  if (existing) throw new Error("Email already in use");

  // Hash the password before saving
  const hashedPassword = await Bcrypt.hash(data.password);
  return await UserRepository.create({ ...data, password: hashedPassword });
}
```

---

## The Repository Layer

### What It Does

Repositories are pure database queries. They:
1. Call Prisma methods
2. Return results
3. Have NO business logic, NO validation

### The Pattern

```ts
export default class CategoryRepository {
  static async create(data: CreateCategoryType): Promise<CategoryType> {
    return await db.category.create({ data });
  }

  static async list(query: ListCategoryQueryType) {
    const { page = 1, limit = 10, search = "", sortOrder = "asc" } = query;
    const skip = (page - 1) * limit;
    const where = search
      ? { OR: [{ label: { contains: search, mode: "insensitive" as const } }] }
      : undefined;

    const result = await db.category.findMany({
      skip,
      take: limit,
      orderBy: { label: sortOrder },
      where,
    });

    const totalItems = await db.category.count({ where });
    return {
      items: result,
      paging: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
      },
    };
  }

  static async get(id: string): Promise<CategoryType | null> {
    return await db.category.findUnique({ where: { id } });
  }

  static async update(id: string, data: UpdateCategoryType): Promise<CategoryType> {
    return await db.category.update({ where: { id }, data });
  }

  static async delete(id: string): Promise<CategoryType> {
    return await db.category.delete({ where: { id } });
  }
}
```

---

## Cache Invalidation

### Why It's Needed

After creating, updating, or deleting data, the page needs to show fresh data. Without cache invalidation, the page would show stale data.

### How It Works

```ts
// In the action, after a successful mutation:
revalidatePath("/category");

// This tells Next.js:
// "The data for /category is now stale.
//  Next time someone visits this page, re-fetch from the database."
```

### When to Use It

| Operation | `revalidatePath` Call |
|-----------|----------------------|
| Create | `revalidatePath("/category")` |
| Update | `revalidatePath("/category")` |
| Delete | `revalidatePath("/category")` |

Always revalidate the **list page** where the change should appear.

---

## Error Handling

### The Try/Catch Pattern

Every controller method wraps its logic in try/catch:

```ts
static async create(data) {
  try {
    // ... business logic
    return Response.success("Created", 201, result);
  } catch (error) {
    const errors = formatError(error);
    return Response.error("Error occurred!", 500, errors);
  }
}
```

### `formatError()` Normalization

```ts
formatError(error);
// Handles three cases:
// 1. ZodError → extracts field-level validation messages
// 2. Error → uses error.message
// 3. Unknown → generic "Unexpected Error!"
```

### Error Flow

```
Repository throws error
    → Service propagates it
    → Controller catches it
    → formatError() normalizes it
    → Response.error() wraps it
    → Action returns { success: false, errors: { field: ["message"] } }
    → Form displays error next to the field
```

---

## The Full Request Lifecycle

```
Client Form Submit
    │
    ▼
Server Action (validates with Zod)
    │
    ▼
Controller (validates again + wraps in Response)
    │
    ▼
Service (business logic + defaults)
    │
    ▼
Repository (Prisma query)
    │
    ▼
PostgreSQL
    │
    ▼
Results flow back up through each layer
    │
    ▼
Action calls revalidatePath()
    │
    ▼
Client receives { success, errors? }
    │
    ▼
Form updates UI
```

---

## Next Steps

- [Client Side](./client-side.md) — How UI components work
- [Helpers](./helpers.md) — Utility functions used by backend code
- [How to Develop a Module](./how-to-develop-module.md) — Build a complete module
