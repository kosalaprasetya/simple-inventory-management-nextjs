# Data Flow

This document explains how data moves through the system — from a user clicking a button to data being saved in the database, and back again.

---

## The Two Directions

Data flows in two directions:

1. **Reading data** — Database → Server → Browser (showing a list of items)
2. **Writing data** — Browser → Server → Database (creating a new item)

---

## Reading Data (Server → Client)

When a user visits a page, here's exactly what happens:

```
1. User visits /category?search=food&page=2
                    │
2. Next.js finds the route:
   app/(protected)/category/page.tsx
                    │
3. The layout runs first (app/(protected)/layout.tsx):
   → Calls getUser() to check if logged in
   → If not logged in → redirect to /auth/logout
   → If logged in → render sidebar + children
                    │
4. The page component runs (category/page.tsx):
   → Reads searchParams: { search: "food", page: "2" }
   → Calls CategoryAction.default.getCategories(query)
                    │
5. The controller runs (category.controller.ts):
   → Calls CategoryService.listCategories(query)
                    │
6. The service runs (category.service.ts):
   → Applies defaults: page=2, limit=10, search="food"
   → Calls CategoryRepository.list(query)
                    │
7. The repository runs (category.repository.ts):
   → Prisma query:
     SELECT * FROM categories
     WHERE label ILIKE '%food%'
     ORDER BY label ASC
     LIMIT 10 OFFSET 10
   → Counts total: SELECT COUNT(*) FROM categories WHERE ...
   → Returns { items: [...], paging: { currentPage: 2, totalPages: 5, totalItems: 47 } }
                    │
8. Data flows back up:
   Repository → Service → Controller → Page → Client Component
                    │
9. Category.tsx renders:
   → Search bar shows "food"
   → Table shows 10 categories matching "food"
   → Pagination shows "Page 2 of 5"
```

---

## Writing Data (Client → Server → Database)

When a user submits a form, here's what happens:

```
1. User fills out the "Add Category" form and clicks Submit
                    │
2. useActionState calls the server action:
   createCategoryAction(prevState, formData)
                    │
3. The action runs (create.action.ts):
   → Extracts form data: { label: "Office Supplies", description: "..." }
   → Validates with Zod:
     - Is label present? ✓
     - Is label under 100 chars? ✓
   → If validation fails → return { success: false, errors: { label: ["..."] } }
                    │
4. Action calls the controller:
   CategoryAction.default.createCategory(validatedData)
                    │
5. Controller validates again (defense in depth):
   → Same Zod check
   → Calls CategoryService.createCategory(data)
                    │
6. Service calls the repository:
   → CategoryRepository.create(data)
                    │
7. Repository runs Prisma:
   → INSERT INTO categories (id, label, description, createdAt, updatedAt)
   → VALUES ('uuid', 'Office Supplies', '...', now(), now())
                    │
8. Database confirms: row inserted
                    │
9. Controller wraps result:
   → Response.success("Category created successfully", 201, newCategory)
   → Returns { success: true, statusCode: 201, message: "...", data: {...} }
                    │
10. Action does two things:
    → revalidatePath("/category") — tells Next.js to re-fetch fresh data
    → Returns { success: true } to the form
                    │
11. The form receives the result:
    → state.success becomes true
    → useEffect detects state.success → calls onClose()
    → Dialog closes
                    │
12. Because of revalidatePath:
    → Next.js re-renders category/page.tsx
    → Fresh data is fetched from database
    → New category appears in the list
```

---

## How Search Works

```
User types "food" in search bar
        │
        ▼
onSearch() is called
        │
        ▼
Debounce timer starts (800ms)
        │
        ▼
User stops typing for 800ms
        │
        ▼
router.replace("/category?search=food&sort=asc&page=1")
        │
        ▼
URL changes → Next.js re-renders the server page
        │
        ▼
Server page reads searchParams: { search: "food" }
        │
        ▼
Controller → Service → Repository
        │
        ▼
SQL: WHERE label ILIKE '%food%'
        │
        ▼
Results appear in the table
```

**Why the 800ms delay?** Without it, every keystroke would trigger a database query. Typing "food" would fire 4 queries ("f", "fo", "foo", "food"). The debounce waits until you stop typing, then fires one query.

---

## How Pagination Works

```
Total items in database: 47
Items per page: 10

Page 1: items 1-10    → skip=0,  take=10
Page 2: items 11-20   → skip=10, take=10
Page 3: items 21-30   → skip=20, take=10
Page 4: items 31-40   → skip=30, take=10
Page 5: items 41-47   → skip=40, take=10

Total pages: Math.ceil(47 / 10) = 5
```

**The math:**
```
skip = (page - 1) × limit
take = limit

For page 3, limit 10:
skip = (3 - 1) × 10 = 20
take = 10
→ "Skip the first 20 rows, give me the next 10"
```

**In Prisma:**
```ts
db.category.findMany({
  skip: 20,    // Skip first 20 rows
  take: 10,    // Take next 10 rows
  orderBy: { label: "asc" },
  where: { ... }
});
```

---

## How Filter Works

Filtering narrows results by a specific field value (e.g., show only "admin" users). It uses the same URL-as-state pattern as search and sort, via the `setExtraParam` function from `useListParams`.

### The Flow

```
User selects "Admin" from the role dropdown
        │
        ▼
setExtraParam("filter", "admin") is called
        │
        ▼
extraParams state updates: { filter: "admin" }
        │
        ▼
Debounce timer starts (800ms)
        │
        ▼
router.replace("/users?search=&sort=asc&page=1&filter=admin")
        │
        ▼
URL changes → Next.js re-renders the server page
        │
        ▼
Server page reads searchParams: { filter: "admin" }
        │
        ▼
Page normalizes: filter === "all" ? "" : filter
("all" means no filter → show everything)
        │
        ▼
Controller → Service → Repository
        │
        ▼
SQL: WHERE role = 'admin'
        │
        ▼
Only admin users appear in the table
```

### Client Side (Component)

The filter is a `<select>` dropdown that calls `setExtraParam`:

```tsx
// modules/user/ui/User.tsx
const { sort, search, onSearch, toggleSort, goToPage, setExtraParam } = useListParams({
  basePath: "/users",
  initialExtraParams: { filter: "all" },  // Default: no filter
});

<select onChange={(e) => setExtraParam("filter", e.target.value)}>
  <option value="all">All Roles</option>
  <option value="admin">Admin</option>
  <option value="user">User</option>
</select>
```

### Server Side (Page)

The page reads the `filter` param from the URL and normalizes it:

```tsx
// app/(protected)/users/page.tsx
const query = {
  filter: sp.filter === "all" ? "" : sp.filter || "",
  // "all" → "" (no filter)
  // "admin" → "admin"
  // undefined → ""
};
```

### Server Side (Repository)

The repository applies the filter as a Prisma `where` clause:

```ts
// modules/user/repository/user.repository.ts
if (filter) {
  where.role = { equals: filter, mode: "insensitive" };
}
```

### How setExtraParam Works Internally

```ts
const setExtraParam = useCallback((key, value) => {
  setExtraParams((prev) => {
    const next = { ...prev, [key]: value };  // Merge into existing params
    // ...debounce + router.replace with all params
    return next;
  });
}, [...]);
```

It merges the new param into the existing `extraParams` state, then pushes a URL with all params (search, sort, page, and any extras).

### Combining Filter + Search + Sort + Pagination

All params coexist in the URL:

```
/users?search=john&sort=asc&page=2&filter=admin
```

Each function from `useListParams` preserves the others:

| Action | URL Result | Resets Page? |
|--------|-----------|-------------|
| `onSearch("john")` | `?search=john&sort=asc&page=1&filter=admin` | Yes |
| `toggleSort()` | `?search=john&sort=desc&page=1&filter=admin` | Yes |
| `setExtraParam("filter","user")` | `?search=john&sort=asc&page=1&filter=user` | Yes |
| `goToPage(3)` | `?search=john&sort=asc&page=3&filter=admin` | No |

### Adding a Filter to Another Module

To add filtering to any list page:

1. **Add `initialExtraParams` to `useListParams`:**
   ```tsx
   const { ..., setExtraParam } = useListParams({
     basePath: "/items",
     initialExtraParams: { filter: "all" },
   });
   ```

2. **Add a `<select>` in the component:**
   ```tsx
   <select onChange={(e) => setExtraParam("filter", e.target.value)}>
     <option value="all">All</option>
     <option value="some-value">Some Value</option>
   </select>
   ```

3. **Read `filter` in the server page:**
   ```tsx
   const query = {
     filter: sp.filter === "all" ? "" : sp.filter || "",
   };
   ```

4. **Apply in the repository:**
   ```ts
   if (filter) {
     where.fieldName = { equals: filter, mode: "insensitive" };
   }
   ```

---

## How Sort Works

```
User clicks "Sort A-Z"
        │
        ▼
toggleSort() flips: "asc" → "desc"
        │
        ▼
router.replace("/category?search=food&sort=desc&page=1")
        │
        ▼
Server re-fetches with: orderBy: { label: "desc" }
        │
        ▼
SQL: ORDER BY label DESC
        │
        ▼
Table shows Z-A order
```

**When you change sort, page resets to 1.** You don't want to be on page 5 when the sort order changes — the data would be different.

---

## How Create/Update/Delete Triggers a Refresh

```
After any mutation (create/update/delete):

1. The action calls revalidatePath("/category")

2. Next.js marks the /category page as "stale"

3. On the next render, Next.js re-fetches the server page

4. Fresh data is fetched from the database

5. The page re-renders with updated data
```

**Without revalidatePath:** The page would show stale data. You'd create a category but it wouldn't appear in the list until you manually refreshed the browser.

---

## Summary Diagram

```
┌──────────────────────────────────────────────────────────┐
│                        READING                           │
│                                                          │
│  URL Change ──→ Server Page ──→ Controller ──→ Service   │
│     ↑                                     │              │
│     │                                     ▼              │
│  useListParams                    Repository ──→ DB      │
│  (debounce)                            │                 │
│     │                                   ▼                │
│     └──── Client Component ←── Props ←── Results         │
│                                                          │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                        WRITING                           │
│                                                          │
│  Form Submit ──→ Server Action ──→ Controller            │
│     │                                    │               │
│     │                                    ▼               │
│     │                              Service ──→ Repository│
│     │                                    │         │     │
│     │                                    ▼         ▼     │
│     │                              revalidatePath  DB    │
│     │                                    │               │
│     │                                    ▼               │
│     └── State ←── Result ←── Response ←── Results       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Next Steps

- [Authentication](./auth.md) — How login and sessions work
- [Backend Patterns](./backend.md) — Deep dive into server-side code
- [Client Side](./client-side.md) — Deep dive into UI components
