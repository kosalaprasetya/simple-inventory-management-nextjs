# How to Build a Module from Scratch

This guide walks through building a complete CRUD module (using **Category** as the example) with list, search, sort, pagination, create, update, and delete.

We will build a `warehouse` module step by step.

---

## Final File Structure

```
modules/warehouse/
  warehouse.interface.ts        # Public exports
  validation/warehouse.schema.ts
  types/warehouse.type.ts
  repository/warehouse.repository.ts
  service/warehouse.service.ts
  controller/warehouse.controller.ts
  actions/
    create.action.ts
    update.action.ts
    delete.action.ts
  ui/
    Warehouse.tsx               # Main list page (client)
    components/
      WarehouseTable.tsx        # Table with edit/delete
      CreateDialog.tsx          # Create form modal
      UpdateDialog.tsx          # Update form modal

app/(protected)/warehouse/
  page.tsx                      # Server page that fetches data
```

---

## Step 1: Database Schema

Create `prisma/model/warehouse.schema.prisma`:

```prisma
model Warehouse {
    id          String   @id @default(uuid())
    name        String   @unique
    location    String?
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt

    @@map("warehouses")
}
```

Then run:
```bash
npx prisma migrate dev --name add_warehouse_table
```

---

## Step 2: Validation Schema

Create `modules/warehouse/validation/warehouse.schema.ts`:

Defines what fields are required/optional for create and update.

```ts
import { z } from "zod";

export default class WarehouseValidation {
  static CREATE = z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name cannot exceed 100 characters"),
    location: z
      .string()
      .max(200, "Location cannot exceed 200 characters")
      .optional(),
  });

  static UPDATE = z.object({
    name: z.string().min(1, "Name cannot be empty").optional(),
    location: z
      .string()
      .max(200, "Location cannot exceed 200 characters")
      .optional(),
  });
}
```

**Rule:** `CREATE` has required fields. `UPDATE` makes everything optional so you can update just one field.

---

## Step 3: Types

Create `modules/warehouse/types/warehouse.type.ts`:

Generates TypeScript types from the Zod schemas and Prisma model.

```ts
import { z } from "zod";
import WarehouseValidation from "../validation/warehouse.schema";
import { Prisma } from "@/lib/generated/prisma/client";

export type CreateWarehouseType = z.infer<typeof WarehouseValidation.CREATE>;
export type UpdateWarehouseType = z.infer<typeof WarehouseValidation.UPDATE>;
export type WarehouseType = Prisma.WarehouseModel;

export type ListWarehouseQueryType = {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: "asc" | "desc";
};
```

---

## Step 4: Repository (Database Queries)

Create `modules/warehouse/repository/warehouse.repository.ts`:

Pure Prisma calls. No business logic. No validation.

```ts
import {
  WarehouseType,
  CreateWarehouseType,
  ListWarehouseQueryType,
  UpdateWarehouseType,
} from "../types/warehouse.type";
import db from "@/lib/db";

export default class WarehouseRepository {
  static async create(data: CreateWarehouseType): Promise<WarehouseType> {
    return await db.warehouse.create({ data });
  }

  static async list(query: ListWarehouseQueryType): Promise<{
    items: WarehouseType[];
    paging: { currentPage: number; totalPages: number; totalItems: number };
  }> {
    const { page = 1, limit = 10, search = "", sortOrder = "asc" } = query;
    const skip = (page - 1) * limit;
    const take = limit || undefined;
    const where = search
      ? { OR: [{ name: { contains: search, mode: "insensitive" as const } }] }
      : undefined;
    const result = await db.warehouse.findMany({
      skip,
      take,
      orderBy: { name: sortOrder },
      where,
    });
    const totalItems = await db.warehouse.count({ where });
    const paging = {
      currentPage: page,
      totalPages: limit > 0 ? Math.ceil(totalItems / limit) : 0,
      totalItems,
    };
    return { items: result, paging };
  }

  static async get(id: string): Promise<WarehouseType | null> {
    return await db.warehouse.findUnique({ where: { id } });
  }

  static async update(
    id: string,
    data: UpdateWarehouseType,
  ): Promise<WarehouseType> {
    return await db.warehouse.update({ where: { id }, data });
  }

  static async delete(id: string): Promise<WarehouseType> {
    return await db.warehouse.delete({ where: { id } });
  }
}
```

**Key points for `list()`:**
- `skip` / `take` handle pagination
- `where.OR` handles search across fields (add more fields to the array if needed)
- `orderBy` sorts by a field
- Returns `{ items, paging }` with `currentPage`, `totalPages`, `totalItems`

---

## Step 5: Service (Business Logic)

Create `modules/warehouse/service/warehouse.service.ts`:

Applies default values and sits between controller and repository.

```ts
import {
  CreateWarehouseType,
  ListWarehouseQueryType,
  UpdateWarehouseType,
} from "../types/warehouse.type";
import WarehouseRepository from "../repository/warehouse.repository";

export default class WarehouseService {
  static async create(data: CreateWarehouseType) {
    return await WarehouseRepository.create(data);
  }

  static async list(query?: ListWarehouseQueryType) {
    const listQuery = {
      page: query?.page || 1,
      limit: query?.limit ?? 10,
      search: query?.search || "",
      sortOrder: query?.sortOrder || "asc",
    } as ListWarehouseQueryType;
    return await WarehouseRepository.list(listQuery);
  }

  static async getById(id: string) {
    return await WarehouseRepository.get(id);
  }

  static async update(id: string, data: UpdateWarehouseType) {
    return await WarehouseRepository.update(id, data);
  }

  static async delete(id: string) {
    return await WarehouseRepository.delete(id);
  }
}
```

---

## Step 6: Controller (Validation + Response Wrapping)

Create `modules/warehouse/controller/warehouse.controller.ts`:

Validates input, calls service, wraps in standardized response.

```ts
import {
  CreateWarehouseType,
  ListWarehouseQueryType,
  UpdateWarehouseType,
} from "../types/warehouse.type";
import WarehouseService from "../service/warehouse.service";
import formatError from "@/lib/formatError";
import Response from "@/lib/response";
import Validation from "@/lib/validation";
import WarehouseValidation from "../validation/warehouse.schema";

export default class WarehouseController {
  static async create(data: CreateWarehouseType) {
    try {
      const validateInput = Validation.validate(WarehouseValidation.CREATE, data);
      if (!validateInput.success) {
        return Response.error("Validation failed", 400, validateInput.errors);
      }
      const result = await WarehouseService.create(validateInput.data as CreateWarehouseType);
      return Response.success("Warehouse created successfully", 201, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }

  static async list(query?: ListWarehouseQueryType) {
    try {
      const result = await WarehouseService.list(query);
      return Response.success("Warehouses retrieved successfully", 200, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }

  static async getById(id: string) {
    try {
      const result = await WarehouseService.getById(id);
      if (!result) {
        return Response.error("Warehouse not found", 404);
      }
      return Response.success("Warehouse retrieved successfully", 200, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }

  static async update(id: string, data: UpdateWarehouseType) {
    try {
      const findWarehouse = await this.getById(id);
      if (findWarehouse.statusCode === 404) {
        return Response.error("Warehouse not found", 404);
      }
      const validateInput = Validation.validate(WarehouseValidation.UPDATE, data);
      if (!validateInput.success) {
        return Response.error("Validation failed", 400, validateInput.errors);
      }
      const result = await WarehouseService.update(id, validateInput.data as UpdateWarehouseType);
      return Response.success("Warehouse updated successfully", 200, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }

  static async delete(id: string) {
    try {
      const findWarehouse = await this.getById(id);
      if (findWarehouse.statusCode === 404) {
        return Response.error("Warehouse not found", 404);
      }
      const result = await WarehouseService.delete(id);
      return Response.success("Warehouse deleted successfully", 200, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }
}
```

---

## Step 7: Interface (Barrel Exports)

Create `modules/warehouse/warehouse.interface.ts`:

```ts
export * as WarehouseActions from "./controller/warehouse.controller";
export * as WarehouseTypes from "./types/warehouse.type";
```

Other modules import from this file, never directly from controller or types.

---

## Step 8: Server Actions

These are the entry points that client forms call. Each handles validation and cache revalidation.

### Create Action

Create `modules/warehouse/actions/create.action.ts`:

```ts
"use server";

import Validation from "@/lib/validation";
import WarehouseValidation from "../validation/warehouse.schema";
import { WarehouseActions } from "../warehouse.interface";
import { revalidatePath } from "next/cache";

export type CreateWarehouseState = {
  success: boolean;
  data?: { name: string; location?: string };
  errors?: { name?: string[]; location?: string[] };
};

export default async function createWarehouseAction(
  _prevState: CreateWarehouseState | undefined,
  data: FormData,
): Promise<CreateWarehouseState> {
  const input = Object.fromEntries(data.entries());
  const result = Validation.validate(WarehouseValidation.CREATE, input);
  if (!result.success || !result.data) {
    return { success: false, errors: result.errors };
  }
  const create = await WarehouseActions.default.create(result.data);
  if (!create.success) {
    return { success: false, errors: { name: ["Failed to create warehouse"] } };
  }
  revalidatePath("/warehouse");
  return { ...create } as CreateWarehouseState;
}
```

### Update Action

Create `modules/warehouse/actions/update.action.ts`:

```ts
"use server";

import Validation from "@/lib/validation";
import WarehouseValidation from "../validation/warehouse.schema";
import { WarehouseActions } from "../warehouse.interface";
import { revalidatePath } from "next/cache";

export type UpdateWarehouseState = {
  success: boolean;
  data?: { name: string; location?: string };
  errors?: { name?: string[]; location?: string[] };
};

export default async function updateWarehouseAction(
  _prevState: UpdateWarehouseState | undefined,
  formData: FormData,
): Promise<UpdateWarehouseState> {
  const id = formData.get("id") as string;
  if (!id) {
    return { success: false, errors: { name: ["Warehouse ID is required"] } };
  }
  const input = Object.fromEntries(formData.entries());
  delete input.id;

  const result = Validation.validate(WarehouseValidation.UPDATE, input);
  if (!result.success || !result.data) {
    return { success: false, errors: result.errors };
  }
  const update = await WarehouseActions.default.update(id, result.data);
  if (!update.success) {
    return { success: false, errors: { name: ["Failed to update warehouse"] } };
  }
  revalidatePath("/warehouse");
  return { ...update } as UpdateWarehouseState;
}
```

### Delete Action

Create `modules/warehouse/actions/delete.action.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { WarehouseActions } from "../warehouse.interface";

type DeleteWarehouseState = {
  success: boolean;
  errors?: { name?: string[] };
};

export default async function deleteWarehouseAction(id: string) {
  const result = await WarehouseActions.default.delete(id);
  revalidatePath("/warehouse");
  return result as DeleteWarehouseState;
}
```

---

## Step 9: Server Page (Data Fetching)

Create `app/(protected)/warehouse/page.tsx`:

This is a **server component** that reads URL search params and fetches data.

```tsx
import { Suspense } from "react";
import Warehouse from "@/modules/warehouse/ui/Warehouse";
import { WarehouseActions, WarehouseTypes } from "@/modules/warehouse/warehouse.interface";
import type { PagingType } from "@/lib/types";

async function WarehousePage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    sort?: "asc" | "desc";
    search?: string;
    limit?: string;
  }>;
}) {
  const params = await searchParams;
  const query = {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 10,
    sortOrder: params.sort || "asc",
    search: params.search || "",
  };
  const result = (await WarehouseActions.default.list(query)) as {
    data: { items: WarehouseTypes.WarehouseType[]; paging: PagingType };
  };

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <span>Loading...</span>
        </div>
      }
    >
      <Warehouse
        data={{
          warehouses: result?.data?.items ?? [],
          paging: result?.data?.paging ?? {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
          },
        }}
      />
    </Suspense>
  );
}

export default WarehousePage;
```

**How it works:**
1. `searchParams` comes from the URL (`?page=2&sort=desc&search=office`)
2. The server calls the controller directly (no HTTP fetch, it runs in-process)
3. Data is passed as props to the client component

---

## Step 10: UI Components

### Main List Component

Create `modules/warehouse/ui/Warehouse.tsx`:

This is the **client component** that handles search, sort, pagination state and renders the toolbar + table + pagination.

```tsx
"use client";

import { useState } from "react";
import { WarehouseTypes } from "../warehouse.interface";
import type { PagingType } from "@/lib/types";
import useListParams from "@/modules/shared/hooks/useListParams";
import SearchBar from "@/modules/shared/components/SearchBar";
import SortButton from "@/modules/shared/components/SortButton";
import PaginationControls from "@/modules/shared/components/PaginationControls";
import CreateDialog from "./components/CreateDialog";
import UpdateDialog from "./components/UpdateDialog";
import WarehouseTable from "./components/WarehouseTable";

export default function Warehouse({
  data,
}: {
  data: {
    warehouses: WarehouseTypes.WarehouseType[];
    paging: PagingType;
  };
}) {
  const { sort, search, onSearch, toggleSort, goToPage } = useListParams({
    basePath: "/warehouse",
  });

  const { warehouses, paging } = data;

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [warehouseToEdit, setWarehouseToEdit] =
    useState<WarehouseTypes.WarehouseType | null>(null);

  return (
    <>
      {showCreateDialog && (
        <CreateDialog onClose={() => setShowCreateDialog(false)} />
      )}
      {warehouseToEdit && (
        <UpdateDialog
          warehouse={warehouseToEdit}
          onClose={() => setWarehouseToEdit(null)}
        />
      )}
      <div
        id="overlay"
        className={`fixed inset-0 z-99 bg-black/50 ${showCreateDialog || warehouseToEdit ? "block" : "hidden"}`}
        onClick={() => {
          setShowCreateDialog(false);
          setWarehouseToEdit(null);
        }}
      ></div>
      <div className={`flex flex-col gap-4 p-4`}>
        <h1 className="text-2xl font-bold">Warehouses</h1>
        <div className="flex items-center gap-3 rounded-lg bg-gray-800 p-4">
          <SearchBar
            value={search}
            onChange={onSearch}
            placeholder="Search by name..."
          />
          <SortButton sort={sort} onToggle={toggleSort} />
          <button
            onClick={() => setShowCreateDialog(true)}
            className="cursor-pointer rounded-md bg-gray-600 px-3 py-2 text-sm text-white hover:bg-gray-500"
          >
            Add Warehouse
          </button>
        </div>
        <WarehouseTable
          warehouses={warehouses}
          onEdit={(w) => setWarehouseToEdit(w)}
        />
        <PaginationControls
          currentPage={paging.currentPage}
          totalPages={paging.totalPages}
          onPageChange={goToPage}
        />
      </div>
    </>
  );
}
```

**What this component does:**
- `useListParams` manages search, sort, and pagination state via URL params
- `useState` manages dialog visibility
- Renders: toolbar (search + sort + add button) → table → pagination
- The overlay shows/hides when dialogs are open

### Table Component

Create `modules/warehouse/ui/components/WarehouseTable.tsx`:

```tsx
"use client";
import deleteWarehouseAction from "../../actions/delete.action";
import { WarehouseTypes } from "../../warehouse.interface";

const WarehouseTable = ({
  warehouses,
  onEdit,
}: {
  warehouses: WarehouseTypes.WarehouseType[];
  onEdit: (warehouse: WarehouseTypes.WarehouseType) => void;
}) => {
  return (
    <div className="overflow-hidden rounded-lg bg-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="px-4 py-3 text-left font-medium text-gray-400">
              Name
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">
              Location
            </th>
            <th className="px-4 py-3 text-center font-medium text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {warehouses.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                No warehouses yet
              </td>
            </tr>
          ) : (
            warehouses.map((w) => (
              <tr
                key={w.id}
                className="border-b border-gray-700/50 hover:bg-gray-600"
              >
                <td className="px-4 py-3 text-white">{w.name}</td>
                <td className="px-4 py-3 text-gray-400">
                  {w.location || "-"}
                </td>
                <td className="px-4 py-3 text-center text-xs font-bold">
                  <button
                    onClick={() => onEdit(w)}
                    className="cursor-pointer rounded-md bg-slate-700 px-3 py-1 text-white hover:bg-slate-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteWarehouseAction(w.id)}
                    className="ml-2 cursor-pointer rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WarehouseTable;
```

### Create Dialog

Create `modules/warehouse/ui/components/CreateDialog.tsx`:

```tsx
import { useEffect } from "react";
import { useActionState } from "react";
import createWarehouseAction, {
  CreateWarehouseState,
} from "../../actions/create.action";

const initialState: CreateWarehouseState = { success: false, errors: {} };

const CreateDialog = ({ onClose }: { onClose: () => void }) => {
  const [state, action, isPending] = useActionState(
    createWarehouseAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state.success, onClose]);

  return (
    <form
      className="absolute top-1/2 left-1/2 z-100 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-lg bg-gray-800 p-8 shadow-lg"
      action={action}
    >
      <p className="text-lg font-semibold">Add Warehouse</p>
      <div id="name" className="w-full">
        {state?.errors?.name?.[0] && (
          <p className="mb-2 text-xs text-red-500">{state.errors.name[0]}</p>
        )}
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Warehouse Name"
          defaultValue={state?.data?.name || ""}
          className={`rounded-md bg-gray-700 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400 ${
            state?.errors?.name?.[0]
              ? "border border-red-500 focus:ring-2 focus:ring-red-500"
              : "focus:ring-2 focus:ring-blue-500"
          } w-full`}
        />
      </div>
      <div id="location">
        {state?.errors?.location?.[0] && (
          <p className="mb-2 text-xs text-red-500">
            {state.errors.location[0]}
          </p>
        )}
        <input
          type="text"
          name="location"
          id="location"
          placeholder="Location"
          defaultValue={state?.data?.location || ""}
          className={`rounded-md bg-gray-700 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400 ${
            state?.errors?.location?.[0]
              ? "border border-red-500 focus:ring-2 focus:ring-red-500"
              : "focus:ring-2 focus:ring-blue-500"
          } w-full`}
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="cursor-pointer rounded-md bg-slate-600 px-3 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create Warehouse"}
      </button>
    </form>
  );
};

export default CreateDialog;
```

### Update Dialog

Create `modules/warehouse/ui/components/UpdateDialog.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { WarehouseTypes } from "@/modules/warehouse/warehouse.interface";
import updateWarehouseAction, {
  UpdateWarehouseState,
} from "@/modules/warehouse/actions/update.action";

const initialState: UpdateWarehouseState = { success: false, errors: {} };

const UpdateDialog = ({
  warehouse,
  onClose,
}: {
  warehouse: WarehouseTypes.WarehouseType;
  onClose: () => void;
}) => {
  const [state, action, isPending] = useActionState(
    updateWarehouseAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state.success, onClose]);

  return (
    <form
      className="absolute top-1/2 left-1/2 z-100 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-lg bg-gray-800 p-8 shadow-lg"
      action={action}
    >
      <p className="text-lg font-semibold">Edit Warehouse</p>

      <input type="hidden" name="id" value={warehouse.id} />

      <div id="name" className="w-full">
        {state?.errors?.name?.[0] && (
          <p className="mb-2 text-xs text-red-500">{state.errors.name[0]}</p>
        )}
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Warehouse Name"
          defaultValue={state?.data?.name ?? warehouse.name}
          className={`rounded-md bg-gray-700 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400 ${
            state?.errors?.name?.[0]
              ? "border border-red-500 focus:ring-2 focus:ring-red-500"
              : "focus:ring-2 focus:ring-blue-500"
          } w-full`}
        />
      </div>

      <div id="location">
        {state?.errors?.location?.[0] && (
          <p className="mb-2 text-xs text-red-500">
            {state.errors.location[0]}
          </p>
        )}
        <input
          type="text"
          name="location"
          id="location"
          placeholder="Location"
          defaultValue={state?.data?.location ?? warehouse.location ?? ""}
          className={`rounded-md bg-gray-700 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400 ${
            state?.errors?.location?.[0]
              ? "border border-red-500 focus:ring-2 focus:ring-red-500"
              : "focus:ring-2 focus:ring-blue-500"
          } w-full`}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="cursor-pointer rounded-md bg-slate-600 px-3 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {isPending ? "Updating..." : "Update Warehouse"}
      </button>
    </form>
  );
};

export default UpdateDialog;
```

**Difference from CreateDialog:**
- Has a hidden `<input name="id">` so the update action knows which record to update
- Pre-fills fields with `defaultValue={state?.data?.name ?? warehouse.name}` (tries server state first, falls back to prop)

---

## How Data Flows

### Reading data (list with search, sort, pagination):

```
User types in search bar
  → useListParams updates URL (?search=office&sort=desc&page=2)
    → Next.js re-renders the server page (page.tsx)
      → page.tsx reads searchParams, calls WarehouseActions.default.list(query)
        → Controller → Service → Repository → Prisma → PostgreSQL
      → Returns { items, paging } as props
    → Client component re-renders with new data
```

### Writing data (create, update, delete):

```
User fills form and clicks Submit
  → useActionState calls the server action (create/update/delete.action.ts)
    → Action validates input with Zod
    → Calls controller method through the interface
      → Controller validates again → Service → Repository → Prisma → PostgreSQL
    → revalidatePath("/warehouse") tells Next.js to re-fetch server data
    → Returns { success, errors? } to the form
      → On success: useEffect closes the dialog, revalidated page shows fresh data
      → On error: errors display next to form fields
```

---

## Quick Reference: What Each Layer Does

| Layer | File | Responsibility |
|-------|------|---------------|
| **Schema** | `prisma/model/*.prisma` | Database table definition |
| **Validation** | `validation/*.schema.ts` | Zod rules for input (what's required, max length, etc.) |
| **Types** | `types/*.type.ts` | TypeScript types derived from Zod + Prisma |
| **Repository** | `repository/*.repository.ts` | Pure database queries (Prisma calls only) |
| **Service** | `service/*.service.ts` | Business logic, default values, orchestration |
| **Controller** | `controller/*.controller.ts` | Validates input, calls service, wraps in Response |
| **Interface** | `*.interface.ts` | Barrel exports for other modules to import |
| **Actions** | `actions/*.action.ts` | Server Actions called by client forms |
| **Server Page** | `app/(protected)/*/page.tsx` | Reads URL params, fetches data, passes to client |
| **UI** | `ui/*.tsx` | Client components that render the page |
| **Shared** | `modules/shared/*` | Reusable hook and components (SearchBar, SortButton, PaginationControls) |

---

## Checklist for New Module

- [ ] Prisma schema + migration
- [ ] Validation schema (CREATE + UPDATE)
- [ ] Types (CreateType, UpdateType, ModelType, ListQueryType)
- [ ] Repository (create, list, get, update, delete)
- [ ] Service (wrap repository with defaults)
- [ ] Controller (validate + respond)
- [ ] Interface (barrel exports)
- [ ] Server actions (create, update, delete)
- [ ] Server page (reads searchParams, fetches data)
- [ ] UI components (list page, table, create dialog, update dialog)
