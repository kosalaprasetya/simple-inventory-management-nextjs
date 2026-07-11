# Helpers & Shared Utilities Guide

This document explains every helper in `lib/` and `modules/shared/` — what each does, why it exists, how the code works, and how they connect to form the backbone of the application.

---

## Big Picture

```
modules/          ← Business logic (each module calls lib/ helpers)
  │
  ▼
lib/              ← Infrastructure layer (database, auth, validation, responses)
  │
  ▼
Prisma + PostgreSQL   ← Database
```

The `lib/` directory is the **foundation** every module builds on. It has zero dependencies on `modules/` — the dependency flows one way: modules → lib. This makes it the most reusable part of the codebase.

The helpers fall into 4 categories:

| Category | Files | Purpose |
|----------|-------|---------|
| **Database** | `db.ts` | Connect to PostgreSQL |
| **Auth** | `jwt.ts`, `bcrypt.ts`, `session.ts`, `dataAccess.ts` | Login, session, guards |
| **Validation & Responses** | `validation.ts`, `response.ts`, `formatError.ts` | Input checking, output formatting |
| **Shared Types & UI** | `types.ts`, `modules/shared/*` | Contracts and reusable components |

---

## 1. Database Layer

### `lib/db.ts` — Prisma Client Singleton

**What it does:** Creates a single PrismaClient instance that all repositories share.

**Why it exists:** In development, Next.js hot-reloads modules on every file change. Without a singleton, each reload creates a new database connection, eventually exhausting PostgreSQL's connection limit. The global cache prevents this.

**How it works:**

```ts
// 1. Create the PostgreSQL adapter with the connection string
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// 2. Check if a client already exists on the global object
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

// 3. In development, save it to global so hot-reload reuses it
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
```

**The flow:**
```
First request → no global client → create new PrismaClient → save to global
Second request → global exists → reuse it (no new connection)
Hot reload → module re-executes → global still has the old client → reuse it
```

**Who uses it:** Every repository file (`category.repository.ts`, `item.repository.ts`, `user.repository.ts`) imports `db` and calls `db.category.findMany()`, `db.item.create()`, etc.

---

## 2. Auth Layer

The auth system has 4 files that work in a chain:

```
login.action.ts
  → Bcrypt.compare()          ← bcrypt.ts: check password
  → createSession({ userId }) ← session.ts: sign JWT + set cookie
      → jwt.sign()            ← jwt.ts: create the token

Every protected page
  → getUser()                 ← dataAccess.ts: verify session
      → verifySession()       ← session.ts: read cookie + decode JWT
          → jwt.verify()      ← jwt.ts: validate the token
      → UserActions.default.getUserById()  ← fetch user from DB
```

### `lib/bcrypt.ts` — Password Hashing

**What it does:** Wraps the `bcryptjs` library with two methods: `hash` and `compare`.

**How it works:**

```ts
// Hash: turns "mypassword" into "$2a$10$N9qo8uLOickgx2ZMRZoMy..."
// The hash includes a random salt, so the same password produces different hashes
static async hash(password: string, saltRounds = 10) {
  return await bcrypt.hash(password, saltRounds);
}

// Compare: checks if "mypassword" matches the stored hash
// Returns true/false — never reveals what the actual password was
static async compare(password: string, hashed: string) {
  return await bcrypt.compare(password, hashed);
}
```

**Who uses it:**
- `user.service.ts` calls `Bcrypt.hash()` when creating or updating a user
- `login.action.ts` calls `Bcrypt.compare()` to verify the login password

### `lib/jwt.ts` — JWT Token Signing

**What it does:** Creates and verifies JSON Web Tokens using a secret key from `.env`.

**How it works:**

```ts
const jwtSecret = process.env.JWT_SECRET;

// Sign: takes an object like { userId: "abc-123" } and returns a long string
// That string is the token — it encodes the data + an expiration + a signature
static sign(payload: object) {
  return jwt.sign(payload, jwtSecret);
}

// Verify: takes a token string, checks the signature, returns the original object
// If the token is tampered with or expired, returns null
static verify(token: string) {
  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    return null;  // Invalid or expired token
  }
}
```

**The token lifecycle:**
```
Login → sign({ userId: "abc" }) → "eyJhbGciOiJIUzI1NiIs..."
That string is stored in a cookie.
Every request → verify("eyJhbGciOiJIUzI1NiIs...") → { userId: "abc" }
```

### `lib/session.ts` — Cookie-Based Session Management

**What it does:** Creates and reads JWT sessions stored in httpOnly cookies.

**How it works:**

**Creating a session (login):**
```ts
static async createSession(payload: object) {
  // 1. Sign the JWT (e.g., { userId: "abc" } → "Bearer eyJhbG...")
  const token = `Bearer ${jwt.sign(payload)}`;

  // 2. Set it as an httpOnly cookie (JavaScript can't read it, only the server can)
  cookieStore.set("access_token", token, {
    httpOnly: true,  // Not accessible via document.cookie (XSS protection)
    secure: true,    // Only sent over HTTPS
  });

  // 3. Redirect to dashboard
  redirect("/dashboard");
}
```

**Verifying a session (every protected page):**
```ts
static async verifySession() {
  // 1. Read the cookie
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;  // No cookie = not logged in

  // 2. Split "Bearer eyJhbG..." into ["Bearer", "eyJhbG..."]
  const [bearer, accessToken] = token.split(" ");
  if (bearer !== "Bearer" || !accessToken) return null;

  // 3. Verify the JWT signature
  const decoded = jwt.verify(accessToken);
  if (!decoded || typeof decoded !== "object" || !("userId" in decoded))
    return null;

  // 4. Return the payload (e.g., { userId: "abc" })
  return decoded;
}
```

**Why `"Bearer "` prefix:** It's a convention. The cookie stores `"Bearer eyJhbG..."` so the server can distinguish JWT tokens from other cookie values.

### `lib/dataAccess.ts` — Auth Guards

**What it does:** Two guard functions that protect pages and enforce role-based access.

**`getUser()` — authentication guard:**
```ts
export async function getUser() {
  // 1. Decode the JWT from the cookie
  const verifiedSession = await verifySession();

  // 2. Look up the user in the database by their ID
  const user = await userController.getUserById(verifiedSession?.userId);

  // 3. If user not found (bad token, deleted account), force logout
  if (!user.success) redirect('/auth/logout');

  // 4. Return the full user object (with role, name, email, etc.)
  return user;
}
```

**`verifyRole()` — authorization guard:**
```ts
export async function verifyRole(requiredRole: string) {
  // 1. First check if the user is logged in
  const user = await getUser();

  // 2. Then check if they have the required role
  if (user.data.role !== requiredRole) {
    return redirect('/dashboard');  // Logged in but wrong role
  }

  return user.data;
}
```

**How they're used:**
- `(protected)/layout.tsx` calls `getUser()` on every request — if it fails, the user is redirected to logout
- `users/page.tsx` calls `verifyRole("admin")` — non-admins get redirected to dashboard

---

## 3. Validation & Responses

### `lib/validation.ts` — Zod Validation Wrapper

**What it does:** Takes a Zod schema and raw data, returns a clean `{ success, data?, errors? }` result.

**Why it exists:** Zod's raw `safeParse` returns a complex result object. This wrapper flattens it into a simple shape that forms can directly consume.

**How it works:**

```ts
static validate<TSchema>(schema: TSchema, data: unknown) {
  // 1. Try to parse the data against the schema
  const result = schema.safeParse(data);

  // 2. If it fails, flatten the errors into field-level arrays
  //    e.g., { name: ["Name is required"], email: ["Invalid email"] }
  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  // 3. If it passes, return the typed, validated data
  return {
    success: true,
    data: result.data,  // Already typed by Zod (e.g., { name: string, email: string })
  };
}
```

**Example:**
```ts
const schema = z.object({ name: z.string().min(1) });
const result = Validation.validate(schema, { name: "" });
// → { success: false, errors: { name: ["Name is required"] } }

const result2 = Validation.validate(schema, { name: "Office" });
// → { success: true, data: { name: "Office" } }
```

**Who uses it:** Every controller calls `Validation.validate()` before creating or updating. Actions also call it for early client-side validation.

### `lib/response.ts` — Standardized API Responses

**What it does:** Wraps every controller response in a consistent shape: `{ success, statusCode, message, data }`.

**Why it exists:** Without this, each controller would return different shapes, making it harder for client components to handle responses. This guarantees the same structure everywhere.

**How it works:**

```ts
// Success: { success: true, statusCode: 200, message: "Items retrieved", data: [...] }
static success(message, statusCode = 200, data?) {
  return { success: true, statusCode, message, data };
}

// Error: { success: false, statusCode: 400, message: "Validation failed", data: { errors } }
static error(message, statusCode = 500, data?) {
  return { success: false, statusCode, message, data };
}
```

**Who uses it:** Every controller method wraps its return value:
```ts
// In category.controller.ts:
return Response.success("Category created successfully", 201, result);
return Response.error("Validation failed", 400, validateInput.errors);
return Response.error("Category not found", 404);
return Response.error("Error occurred!", 500, errors);
```

### `lib/formatError.ts` — Error Normalization

**What it does:** Takes any error type (ZodError, regular Error, or unknown) and converts it into a uniform `{ success, message, errors }` object.

**How it works:**

```ts
export default function formatError(error: unknown) {
  // ZodError: extract field-level validation messages
  if (error instanceof ZodError) {
    const zodErrors = z.flattenError(error);
    return {
      success: false,
      message: zodErrors.formErrors.join(", ") || "Validation Error!",
      errors: zodErrors.fieldErrors,
    };
  }

  // Regular Error: use the error message
  if (error instanceof Error) {
    return {
      success: false,
      message: error.message || "Unexpected Error!",
      errors: [error],
    };
  }

  // Unknown: generic fallback
  return {
    success: false,
    message: "Unexpected Error!",
    errors: null,
  };
}
```

**Who uses it:** Every controller's `catch` block:
```ts
try {
  // ... business logic
} catch (error) {
  const errors = formatError(error);
  return Response.error("Error occurred!", 500, errors);
}
```

---

## 4. Shared Types

### `lib/types.ts` — Response & Pagination Contracts

**What it does:** Defines the two types used across every module.

**`ResponseType` — the shape every controller returns:**
```ts
export type ResponseType = {
  success: boolean;      // Did it work?
  statusCode: number;    // HTTP-style status (200, 400, 404, 500)
  message: string;       // Human-readable message
  data: unknown;         // The actual payload (varies per endpoint)
};
```

**`PagingType` — the shape every list endpoint returns:**
```ts
export type PagingType = {
  currentPage: number;   // Which page are we on?
  totalPages: number;    // How many pages total?
  totalItems: number;    // How many records total?
};
```

---

## 5. Shared UI Helpers (`modules/shared/`)

These are reused by every list page (Category, Item, User).

### `modules/shared/hooks/useListParams.ts` — URL-Driven State

**What it does:** Manages search, sort, pagination, and extra filter params using the URL. When any param changes, it updates the URL, which triggers the server page to re-fetch data.

**Why it exists:** Every list page needs the same behavior: debounced search, sort toggle, pagination. Before this hook, each module had 50+ lines of identical state logic. Now it's one hook call.

**How it works:**

```ts
const { sort, page, search, onSearch, toggleSort, goToPage, setExtraParam } = useListParams({
  basePath: "/category",           // Which route this controls
  initialExtraParams: { filter: "all" },  // Optional extra URL params
});
```

**The state flow:**
```
User types "office" in search
  → onSearch() called
    → setSearch("office") updates local state
    → Debounce timer starts (800ms)
    → After 800ms: router.replace("/category?search=office&sort=asc&page=1&limit=10")
      → Next.js re-renders the server page with new searchParams
        → Server page calls controller.list({ search: "office", ... })
          → Database query: WHERE name ILIKE '%office%'
        → Fresh data passed as props to client component
```

**Key functions:**

| Function | What it does |
|----------|-------------|
| `onSearch(e)` | Updates search value, debounces 800ms, resets to page 1 |
| `toggleSort()` | Flips asc↔desc, resets to page 1 |
| `goToPage(n)` | Navigates to page N |
| `setExtraParam(key, value)` | Adds/updates extra URL params (e.g., filter), debounced |
| `buildUrl(search, sort, page, extra)` | Constructs the full URL with all params |

**The debounce mechanism:**
```ts
const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

// Each keystroke clears the previous timer and starts a new one
clearTimeout(debounceTimer.current);
debounceTimer.current = setTimeout(() => {
  router.replace(buildUrl(value, sort, "1", extraParams));
}, 800);
```

This prevents firing a server request on every keystroke. Only the final keystroke (after 800ms of silence) triggers navigation.

### `modules/shared/components/SearchBar.tsx`

**What it does:** A styled text input for search. Pure presentational — the parent provides `value` and `onChange` from `useListParams`.

```tsx
<SearchBar
  value={search}           // from useListParams
  onChange={onSearch}      // from useListParams (handles debounce)
  placeholder="Search by name..."
/>
```

### `modules/shared/components/SortButton.tsx`

**What it does:** A button that toggles between ascending and descending sort. Shows "Sort A-Z" or "Sort Z-A" based on current state.

```tsx
<SortButton
  sort={sort}              // "asc" or "desc" from useListParams
  onToggle={toggleSort}    // from useListParams
/>
```

### `modules/shared/components/PaginationControls.tsx`

**What it does:** Renders "Page X of Y" text with Prev/Next buttons. Disables Prev on page 1 and Next on the last page.

```tsx
<PaginationControls
  currentPage={paging.currentPage}   // from server data
  totalPages={paging.totalPages}     // from server data
  onPageChange={goToPage}            // from useListParams
/>
```

**Behavior:**
- If `totalPages <= 0`, renders nothing (empty state)
- Prev button: `disabled={currentPage <= 1}`
- Next button: `disabled={currentPage >= totalPages}`

---

## How They All Connect

Here's the full flow of a typical operation — listing categories with search:

```
1. User opens /category
   → (protected)/layout.tsx calls getUser() → session.ts → jwt.ts → db query
   → app/(protected)/category/page.tsx reads searchParams, calls controller
   → controller → service → repository → prisma → postgresql
   → Data passed as props to Category.tsx

2. User types "food" in search
   → useListParams.onSearch() debounces, then calls router.replace("/category?search=food&sort=asc&page=1")
   → Next.js re-renders category/page.tsx with new searchParams
   → Same server-side flow, now with search: "food"
   → Fresh data passed to Category.tsx

3. User clicks "Add Category" → fills form → submits
   → useActionState calls createCategoryAction (server action)
   → Action calls Validation.validate() to check input
   → Action calls controller.createCategory()
   → Controller calls Validation.validate() again (defense in depth)
   → Controller calls service.createCategory()
   → Service calls repository.create() → prisma → postgresql
   → Controller wraps result in Response.success(201, result)
   → Action calls revalidatePath("/category") → Next.js re-fetches server data
   → Action returns { success: true } to form
   → useEffect detects state.success → closes dialog
   → Revalidated page shows the new category in the list
```

---

## Quick Reference: Who Imports What

| Helper | Imported By |
|--------|------------|
| `db.ts` | All repositories |
| `bcrypt.ts` | `user.service.ts`, `login.action.ts` |
| `jwt.ts` | `session.ts` only |
| `session.ts` | `dataAccess.ts`, `login.action.ts` |
| `dataAccess.ts` | `(protected)/layout.tsx`, `users/page.tsx`, action files needing current user |
| `validation.ts` | All controllers, all action files |
| `response.ts` | All controllers |
| `formatError.ts` | All controllers |
| `types.ts` | Server pages, client components (for `PagingType`) |
| `useListParams` | All list page components (`Category.tsx`, `Item.tsx`, `User.tsx`) |
| `SearchBar` | All list page components |
| `SortButton` | All list page components |
| `PaginationControls` | All list page components |
