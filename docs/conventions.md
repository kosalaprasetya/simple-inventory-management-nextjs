# Conventions

This document covers naming rules, file structure, and code style conventions used throughout the codebase.

---

## File Naming

| Pattern | Location | Example |
|---------|----------|---------|
| `*.schema.ts` | `validation/` | `category.schema.ts` |
| `*.type.ts` or `*.types.ts` | `types/` | `category.type.ts` |
| `*.repository.ts` | `repository/` | `category.repository.ts` |
| `*.service.ts` | `service/` | `category.service.ts` |
| `*.controller.ts` | `controller/` | `category.controller.ts` |
| `*.action.ts` | `actions/` | `create.action.ts` |
| `*.tsx` | `ui/` | `Category.tsx`, `CategoryTable.tsx` |
| `*.interface.ts` | module root | `category.interface.ts` |

---

## Module Folder Structure

Every module follows this exact structure:

```
modules/<name>/
  ├── <name>.interface.ts          # Barrel exports
  ├── validation/
  │   └── <name>.schema.ts         # Zod schemas (CREATE, UPDATE)
  ├── types/
  │   └── <name>.type.ts           # TypeScript types
  ├── repository/
  │   └── <name>.repository.ts     # Prisma queries
  ├── service/
  │   └── <name>.service.ts        # Business logic
  ├── controller/
  │   └── <name>.controller.ts     # Validation + response wrapping
  ├── actions/
  │   ├── create.action.ts         # Create server action
  │   ├── update.action.ts         # Update server action
  │   └── delete.action.ts         # Delete server action
  └── ui/
      ├── <Name>.tsx               # Main list/page component
      ├── components/
      │   ├── <Name>Table.tsx      # Table component
      │   ├── CreateDialog.tsx     # Create form modal
      │   └── UpdateDialog.tsx     # Update form modal
      └── hooks/                   # (reserved for custom hooks)
```

---

## Import Aliases

The project uses `@/` as an alias for the project root:

```ts
// Instead of:
import db from "../../../lib/db";
import { Response } from "../../../lib/response";

// Use:
import db from "@/lib/db";
import Response from "@/lib/response";
```

**Configured in** `tsconfig.json`:
```json
{
  "paths": {
    "@/*": ["./*"]
  }
}
```

---

## Module Exports (Interface Files)

Each module has a barrel file that re-exports its public API:

```ts
// modules/category/category.interface.ts
export * as CategoryAction from "./controller/category.controller";
export * as CategoryTypes from "./types/category.type";
```

**Rules:**
- Other modules import from the interface, never directly from controller or types
- The interface file is the module's "public API"
- Internal files (service, repository) are not exported

```ts
// Correct — imports through the interface:
import { CategoryAction, CategoryTypes } from "@/modules/category/category.interface";

// Wrong — imports directly from internal files:
import CategoryController from "@/modules/category/controller/category.controller";
```

---

## Class vs Function Components

| Type | Used For | Example |
|------|---------|---------|
| **Function component** (arrow) | Client components | `const Category = ({ data }) => { ... }` |
| **Function component** (declaration) | Server page components | `async function CategoryPage() { ... }` |
| **Static class** | Controllers, services, repositories, utilities | `class CategoryController { static async create() {} }` |

**Why static classes?** All controllers, services, and repositories use `static` methods. This is a simplified pattern — no dependency injection, no instances. Just direct method calls.

```ts
// All methods are static:
export default class CategoryRepository {
  static async create(data) { ... }
  static async list(query) { ... }
  static async get(id) { ... }
}

// Called directly, never instantiated:
CategoryRepository.create(data);  // ✓
new CategoryRepository().create(data);  // ✗
```

---

## Response Format

Every controller returns the same shape:

```ts
// Success:
Response.success("Category created successfully", 201, result);
// → { success: true, statusCode: 201, message: "Category created successfully", data: result }

// Error:
Response.error("Validation failed", 400, errors);
// → { success: false, statusCode: 400, message: "Validation failed", data: errors }
```

**Status codes used:**
| Code | When |
|------|------|
| 200 | Successful read/update/delete |
| 201 | Successful create |
| 400 | Validation failed |
| 404 | Resource not found |
| 500 | Unexpected server error |

---

## Error Handling

### In Controllers

Every method wraps logic in try/catch:

```ts
static async create(data) {
  try {
    // business logic
    return Response.success("Created", 201, result);
  } catch (error) {
    const errors = formatError(error);
    return Response.error("Error occurred!", 500, errors);
  }
}
```

### In Actions

Actions return typed error objects:

```ts
// Validation failure:
return { success: false, errors: result.errors };

// Operation failure:
return { success: false, errors: { name: ["Failed to create"] } };

// Success:
return { ...create } as CreateCategoryState;
```

### In UI Components

Errors display next to form fields:

```tsx
{state?.errors?.name?.[0] && (
  <p className="text-xs text-red-500">{state.errors.name[0]}</p>
)}
```

---

## Validation Schemas

Every module defines CREATE and UPDATE schemas:

```ts
export default class CategoryValidation {
  // CREATE: required fields
  static CREATE = z.object({
    label: z.string().min(1, "Label is required").max(100),
    description: z.string().max(300).optional(),
  });

  // UPDATE: all optional (can update just one field)
  static UPDATE = z.object({
    label: z.string().min(1).optional(),
    description: z.string().max(300).optional(),
  });
}
```

**Rules:**
- `CREATE` has required fields with validation messages
- `UPDATE` makes everything optional
- Field names must match the Prisma model fields

---

## Type Definitions

Every module defines types derived from Zod + Prisma:

```ts
export type CreateCategoryType = z.infer<typeof CategoryValidation.CREATE>;
export type UpdateCategoryType = z.infer<typeof CategoryValidation.UPDATE>;
export type CategoryType = Prisma.CategoryModel;

export type ListCategoryQueryType = {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: "asc" | "desc";
};
```

---

## Component Props

Props are typed inline or with exported types:

```tsx
// Inline typing (simple components):
function SearchBar({ value, onChange, placeholder }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) { ... }

// Interface typing (complex components):
interface WarehouseTableProps {
  warehouses: WarehouseTypes.WarehouseType[];
  onEdit: (warehouse: WarehouseTypes.WarehouseType) => void;
}
const WarehouseTable = ({ warehouses, onEdit }: WarehouseTableProps) => { ... }
```

---

## Server vs Client Directives

```tsx
// Server Component (default — no directive needed):
async function CategoryPage() { ... }

// Client Component (needs the directive):
"use client";
function Category({ data }) { ... }

// Server Action (needs the directive):
"use server";
export default async function createCategoryAction() { ... }

// Server-only module (import guard):
import "server-only";  // Prevents this module from being imported in client code
```

---

## Tailwind CSS Classes

### Color Palette

| Purpose | Classes |
|---------|---------|
| Page background | `bg-gray-700` |
| Card/container background | `bg-gray-800` |
| Input fields | `bg-gray-700` |
| Hover states | `hover:bg-gray-600` or `hover:bg-gray-500` |
| Active nav item | `bg-gray-600` |
| Primary text | `text-white` |
| Secondary text | `text-gray-400` |
| Empty state text | `text-gray-500` |
| Error text | `text-red-500` |
| Submit button | `bg-slate-600 hover:bg-slate-700` |
| Delete button | `bg-red-600 hover:bg-red-700` |

### Common Patterns

```tsx
// Rounded card
"rounded-lg bg-gray-800 p-4"

// Input field
"rounded-md bg-gray-700 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 w-full"

// Button
"cursor-pointer rounded-md bg-gray-600 px-3 py-2 text-sm text-white hover:bg-gray-500"

// Table row
"border-b border-gray-700/50 hover:bg-gray-600"
```

---

## Naming Conventions

| What | Convention | Example |
|------|-----------|---------|
| Variables | camelCase | `showCreateDialog`, `categoryToEdit` |
| Functions | camelCase | `onSearch`, `toggleSort`, `goToPage` |
| Components | PascalCase | `CategoryTable`, `CreateDialog` |
| Types | PascalCase | `CreateCategoryType`, `PagingType` |
| Files (components) | PascalCase | `CategoryTable.tsx` |
| Files (other) | camelCase | `create.action.ts`, `category.repository.ts` |
| Folders | camelCase | `actions/`, `repository/`, `validation/` |
| CSS classes | Tailwind utilities | `bg-gray-800`, `text-white`, `rounded-lg` |

---

## Next Steps

- [Troubleshooting](./troubleshooting.md) — Common errors and fixes
- [How to Develop a Module](./how-to-develop-module.md) — Build a new module
- [Architecture](./architecture.md) — Overall structure
