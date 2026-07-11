# Troubleshooting

This document covers common errors and how to fix them.

---

## Server Component Errors

### "Functions cannot be passed directly to Client Components"

**Error:**
```
Functions cannot be passed directly to Client Components unless you
explicitly expose it by marking it with "use server".
```

**Cause:** You're passing a React component (like a lucide-react icon) as a prop from a Server Component to a Client Component. React components have methods and can't be serialized.

**Fix:** Move the component definitions into the Client Component, not in the Server Component.

```tsx
// WRONG — Server Component passes icon components as props:
// layout.tsx (Server)
const menuItems = [
  { label: "Dashboard", icon: House },  // ✗ House is a React component
];
<Sidebar menuItems={menuItems} />

// CORRECT — Define menu items inside the Client Component:
// Sidebar.tsx (Client)
import { House, Package } from "lucide-react";
const menuItems = [
  { label: "Dashboard", icon: House },  // ✓ Defined in client code
];
```

### "Only plain objects can be passed to Client Components"

**Error:**
```
Only plain objects can be passed to Client Components from Server Components.
Classes or other objects with methods are not supported.
```

**Cause:** Same as above — you're passing objects with methods (like React components) across the server/client boundary.

**Fix:** Same fix — define the data inside the Client Component.

---

## Prisma Errors

### "Cannot find module @prisma/client"

**Fix:**
```bash
npx prisma generate
```

This regenerates the Prisma client after schema changes.

### "Table does not exist" or "relation does not exist"

**Fix:**
```bash
npx prisma migrate dev
```

This runs any pending migrations against your database.

### "Unique constraint failed on the fields: (`email`)"

**Cause:** You're trying to create a user with an email that already exists.

**Fix:** Use a different email, or check if the user already exists.

### "Foreign key constraint failed"

**Cause:** You're trying to create an item with a `user_id` or `category_id` that doesn't exist in the database.

**Fix:** Make sure the referenced user/category exists before creating the item.

---

## Authentication Errors

### Redirected to logout immediately after login

**Check:**
1. Is `JWT_SECRET` set in `.env`?
2. Is the cookie being set? (Browser DevTools → Application → Cookies → look for `access_token`)
3. Is `NODE_ENV=development`? (The app uses different cookie settings for dev vs production)

### "Invalid token" or session expired

**Cause:** The JWT token in the cookie is invalid or expired.

**Fix:**
1. Clear the cookie manually (Browser DevTools → Application → Cookies → delete `access_token`)
2. Log in again

### Can't access /users page

**Cause:** Your user account has the "user" role, not "admin".

**Fix:**
```sql
-- In PostgreSQL:
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

---

## Form Errors

### Form submissions not working

**Check:**
1. Does the action have `"use server"` at the top?
2. Is the form using `action={action}` (not `onSubmit`)?
3. Are input `name` attributes matching the Zod schema field names?

### Errors not displaying

**Check:**
1. Is the state type defined with optional error fields? `errors?: { name?: string[] }`
2. Is the error display checking the right path? `state?.errors?.name?.[0]`

### Form submits but data doesn't save

**Check:**
1. Is `revalidatePath()` called after the mutation?
2. Check the server console for errors
3. Verify the Prisma query in the repository

---

## Search / Pagination Not Working

### Search doesn't filter results

**Check:**
1. Is `useListParams` configured with the correct `basePath`?
2. Does the repository's `list()` method handle the `search` parameter?
3. Is the `where` clause being built correctly?

### Pagination buttons don't work

**Check:**
1. Is `goToPage` passed to `PaginationControls`?
2. Is the server page reading `searchParams.page`?
3. Is the repository using `skip` and `take` correctly?

### URL doesn't update when searching

**Check:**
1. Is the `onSearch` function from `useListParams` being used?
2. Is `router.replace()` being called (not `router.push()`)?

---

## Build Errors

### TypeScript errors after adding a Prisma model

**Fix:**
```bash
npx prisma generate
```

### "Module not found" errors

**Fix:**
```bash
bun install
```

### Build fails with " Hydration mismatch"

**Cause:** Server-rendered HTML doesn't match client-rendered HTML. Usually caused by using `Date.now()` or `Math.random()` in rendering, or browser extensions modifying the DOM.

**Fix:** Wrap the affected component in `<Suspense>` or use `useEffect` for client-only rendering.

---

## Development Server Issues

### Server won't start

**Check:**
1. Is PostgreSQL running?
2. Is `DATABASE_URL` correct in `.env`?
3. Is port 3000 available?

### Changes not appearing

**Fix:** Hard refresh the browser (Ctrl+Shift+R) or clear the `.next` cache:
```bash
rm -rf .next
bun run dev
```

### "Unhandled Runtime Error" in the browser

**Check:**
1. Look at the error message — it usually tells you exactly what's wrong
2. Check the server terminal for more details
3. Most common: undefined variable, missing import, wrong prop type

---

## Quick Reference: Common Commands

| Problem | Command |
|---------|---------|
| Schema changed but types are stale | `npx prisma generate` |
| Tables don't exist in database | `npx prisma migrate dev` |
| Dependencies missing | `bun install` |
| Cache issues | `rm -rf .next && bun run dev` |
| Lint errors | `bun run lint` |
| TypeScript errors | `npx tsc --noEmit` |
| Browse database | `npx prisma studio` |

---

## Still Stuck?

1. Check the error message carefully — it usually tells you what's wrong
2. Look at the server terminal output
3. Search the error message online
4. Check if similar code works in another module (copy from a working module)
5. Read the relevant documentation:
   - [Getting Started](./getting-started.md) — Setup issues
   - [Architecture](./architecture.md) — Structure questions
   - [Data Flow](./data-flow.md) — Data movement questions
   - [Backend](./backend.md) — Server-side patterns
   - [Client Side](./client-side.md) — UI component patterns
