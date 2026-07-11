# Client Side

This document explains how UI components work: the Server → Client handoff, forms, dialogs, and shared components.

---

## Server → Client Data Handoff

The most important concept: **data flows from server to client via props**.

```
Server Component (page.tsx)
  │
  │ Fetches data from database
  │ Passes it as props
  ▼
Client Component (Category.tsx)
  │
  │ Receives data, renders UI
  │ Handles user interactions
  │ Calls server actions for mutations
  ▼
Server Action (create.action.ts)
  │
  │ Saves data to database
  │ Calls revalidatePath()
  ▼
Server Component re-fetches fresh data
```

### Example

```tsx
// SERVER: app/(protected)/category/page.tsx
// This runs on the server — no "use client" directive

async function CategoryPage({ searchParams }) {
  const params = await searchParams;
  
  // Fetch data from database (runs on server)
  const result = await CategoryAction.default.getCategories(query);
  
  // Pass data as props to client component
  return (
    <Category
      data={{
        categories: result.data.items,
        paging: result.data.paging,
      }}
    />
  );
}
```

```tsx
// CLIENT: modules/category/ui/Category.tsx
"use client";  // ← This runs in the browser

function Category({ data }) {
  const { categories, paging } = data;  // ← Data from server
  
  // Handle user interactions, render UI
  return (
    <div>
      <SearchBar ... />
      <CategoryTable categories={categories} />
      <PaginationControls currentPage={paging.currentPage} ... />
    </div>
  );
}
```

---

## The useActionState Pattern

Every form in the app uses React 19's `useActionState` hook.

### The Pattern

```tsx
"use client";
import { useActionState, useEffect } from "react";
import createCategoryAction, { CreateCategoryState } from "../actions/create.action";

// 1. Define initial state
const initialState: CreateCategoryState = { success: false, errors: {} };

function CreateDialog({ onClose }) {
  // 2. Hook up the server action
  const [state, action, isPending] = useActionState(createCategoryAction, initialState);

  // 3. Auto-close on success
  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state.success, onClose]);

  // 4. Render form
  return (
    <form action={action}>
      {/* 5. Show errors */}
      {state?.errors?.label?.[0] && (
        <p className="text-red-500">{state.errors.label[0]}</p>
      )}
      
      {/* 6. Input with error styling */}
      <input
        name="label"
        className={state?.errors?.label?.[0]
          ? "border border-red-500 ..."
          : "focus:ring-2 focus:ring-blue-500 ..."
        }
      />
      
      {/* 7. Submit button with loading state */}
      <button disabled={isPending}>
        {isPending ? "Creating..." : "Create Category"}
      </button>
    </form>
  );
}
```

### How It Works Step by Step

```
1. User fills form, clicks Submit
2. useActionState sends FormData to the server action
3. isPending becomes true (button shows "Creating...")
4. Server action runs (validates, saves to database)
5. Server action returns { success: true } or { success: false, errors: {...} }
6. state updates with the result
7. If success: useEffect closes the dialog
8. If error: errors display next to form fields
9. isPending becomes false
```

---

## The Form Pattern

Every form follows the same structure:

```tsx
// State type — defines what the action returns
export type CreateItemState = {
  success: boolean;
  data?: { name: string; stock: number; ... };
  errors?: { name?: string[]; stock?: string[]; ... };
};

// Initial state
const initialState: CreateItemState = { success: false, errors: {} };

// In the component:
const [state, action, isPending] = useActionState(serverAction, initialState);

return (
  <form action={action}>
    {/* Error display */}
    {state?.errors?.fieldName?.[0] && (
      <p className="text-xs text-red-500">{state.errors.fieldName[0]}</p>
    )}
    
    {/* Input with conditional error styling */}
    <input
      name="fieldName"
      className={`... ${state?.errors?.fieldName?.[0] ? "error-classes" : "normal-classes"}`}
    />
    
    {/* Submit button */}
    <button type="submit" disabled={isPending}>
      {isPending ? "Saving..." : "Save"}
    </button>
  </form>
);
```

---

## The Dialog Pattern

Dialogs (modals) are used for create and update operations.

### How It Works

```tsx
// Parent component manages dialog state:
function Category() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  return (
    <>
      {/* Overlay — covers the page */}
      <div
        className={`fixed inset-0 bg-black/50 ${
          showCreateDialog || categoryToEdit ? "block" : "hidden"
        }`}
        onClick={() => {
          setShowCreateDialog(false);
          setCategoryToEdit(null);
        }}
      />

      {/* Create dialog */}
      {showCreateDialog && (
        <CreateDialog onClose={() => setShowCreateDialog(false)} />
      )}

      {/* Update dialog */}
      {categoryToEdit && (
        <UpdateDialog category={categoryToEdit} onClose={() => setCategoryToEdit(null)} />
      )}

      {/* Toolbar with "Add" button */}
      <button onClick={() => setShowCreateDialog(true)}>Add Category</button>

      {/* Table with "Edit" button */}
      <CategoryTable onEdit={(cat) => setCategoryToEdit(cat)} />
    </>
  );
}
```

### The Dialog Lifecycle

```
1. User clicks "Add Category"
2. setShowCreateDialog(true) → dialog appears
3. Overlay covers the page (semi-transparent black)
4. Dialog form floats on top (centered)
5. User fills form, clicks Submit
6. Server action saves to database
7. state.success becomes true
8. useEffect calls onClose()
9. setShowCreateDialog(false) → dialog disappears
10. revalidatePath() refreshes the list
```

### Update Dialog Difference

The update dialog is the same as create, with two differences:

1. **Hidden ID field:** `<input type="hidden" name="id" value={item.id} />`
2. **Pre-filled values:** `defaultValue={state?.data?.name ?? item.name}`

---

## URL-as-State

Search, sort, and pagination are stored in the URL, not in React state.

### Why?

- **Shareable:** Copy the URL, send it to someone — they see the same filtered view
- **Bookmarkable:** Save the URL — it loads the same view later
- **Back button works:** Browser history tracks URL changes

### How It Works

```
User types "food" in search bar
        │
        ▼
useListParams.onSearch() debounces (800ms)
        │
        ▼
router.replace("/category?search=food&sort=asc&page=1")
        │
        ▼
URL changes → Next.js re-renders the server page
        │
        ▼
Server page reads searchParams from URL
        │
        ▼
Fresh data fetched and passed to client component
```

### The useListParams Hook

```tsx
const { sort, search, onSearch, toggleSort, goToPage, setExtraParam } = useListParams({
  basePath: "/category",  // Which route this controls
});
```

| Function | What It Does | Resets Page? |
|----------|-------------|-------------|
| `onSearch(e)` | Updates search, debounces 800ms | Yes (→ page 1) |
| `toggleSort()` | Flips asc ↔ desc | Yes (→ page 1) |
| `goToPage(n)` | Navigates to page N | No |
| `setExtraParam(key, value)` | Updates extra URL params (e.g., filter) | Yes (→ page 1) |

---

## Shared Components

All list pages use the same 3 shared components from `modules/shared/`:

### SearchBar

```tsx
<SearchBar
  value={search}           // from useListParams
  onChange={onSearch}      // from useListParams (handles debounce)
  placeholder="Search by name..."
/>
```

### SortButton

```tsx
<SortButton
  sort={sort}              // "asc" or "desc"
  onToggle={toggleSort}    // from useListParams
/>
```

### PaginationControls

```tsx
<PaginationControls
  currentPage={paging.currentPage}   // from server data
  totalPages={paging.totalPages}     // from server data
  onPageChange={goToPage}            // from useListParams
/>
```

---

## Styling Patterns

All components use Tailwind CSS. Here are the common patterns:

### Dark Theme

```tsx
// Backgrounds
bg-gray-800  // Main background (cards, tables)
bg-gray-700  // Input fields
bg-gray-600  // Hover states

// Text
text-white      // Primary text
text-gray-400   // Secondary text (labels, placeholders)
text-gray-500   // Empty states
text-red-500    // Error messages
```

### Buttons

```tsx
// Primary action (e.g., "Add Category")
"cursor-pointer rounded-md bg-gray-600 px-3 py-2 text-sm text-white hover:bg-gray-500"

// Submit (e.g., "Create")
"cursor-pointer rounded-md bg-slate-600 px-3 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"

// Edit
"cursor-pointer rounded-md bg-slate-700 px-3 py-1 text-white hover:bg-slate-800"

// Delete
"cursor-pointer rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700"
```

### Input Fields

```tsx
// Normal
"rounded-md bg-gray-700 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 w-full"

// With error
"rounded-md bg-gray-700 px-3 py-2 text-sm text-white outline-none border border-red-500 focus:ring-2 focus:ring-red-500 w-full"
```

---

## Next Steps

- [Backend Patterns](./backend.md) — Server-side code
- [How to Develop a Module](./how-to-develop-module.md) — Build a complete module
- [Conventions](./conventions.md) — Naming and style rules
