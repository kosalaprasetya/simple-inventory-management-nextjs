# Authentication

This document explains how login, sessions, and role-based access work in the application.

---

## Concepts

Before diving into the code, here are the key concepts:

| Concept | What It Means | In This App |
|---------|--------------|-------------|
| **Authentication** | "Who are you?" — proving your identity | Logging in with email + password |
| **Authorization** | "What can you do?" — checking permissions | Admin vs user roles |
| **Session** | "Proof you're logged in" — stored on the server | JWT token in a cookie |
| **JWT** | A signed token that can't be faked | Contains `{ userId: "abc" }` |
| **bcrypt** | One-way password hashing | Passwords stored as hashes, never plain text |

---

## The Login Flow

```
1. User enters email + password on /auth/login
                    │
2. login.action.ts validates input with Zod
                    │
3. Finds user by email in database:
   SELECT * FROM users WHERE email = 'user@example.com'
                    │
4. If user not found → return error:
   { email: ["Invalid email"], password: ["Invalid password"] }
   (Same error for both — don't reveal which one is wrong)
                    │
5. Compares password with stored hash using bcrypt:
   bcrypt.compare("mypassword", "$2a$10$N9qo8uLO...")
   → Returns true if password matches
                    │
6. If password doesn't match → return same error
                    │
7. Creates a session:
   → Signs a JWT token: jwt.sign({ userId: "abc-123" })
   → Token looks like: "eyJhbGciOiJIUzI1NiIs..."
   → Sets cookie: access_token = "Bearer eyJhbGci..."
   → Cookie options: httpOnly: true, secure: true
                    │
8. Redirects to /dashboard
```

---

## The Session Flow (Every Page Load)

Every time a user visits a protected page, the session is verified:

```
1. User visits /category
                    │
2. (protected)/layout.tsx runs:
   → Calls getUser()
                    │
3. getUser() calls verifySession():
   → Reads the "access_token" cookie
   → Cookie value: "Bearer eyJhbGciOiJIUzI1NiIs..."
   → Splits into ["Bearer", "eyJhbGciOiJIUzI1NiIs..."]
   → Verifies the JWT signature with jwt.verify()
   → Decodes the payload: { userId: "abc-123" }
                    │
4. getUser() looks up the user:
   → Calls UserActions.default.getUserById("abc-123")
   → Finds user in database
                    │
5. If user found → returns user data (name, email, role)
   If user not found → redirects to /auth/logout
                    │
6. Layout renders sidebar based on role:
   → Admin sees: Dashboard, Category, Items, Users
   → User sees: Dashboard, Category, Items
                    │
7. Page component runs, fetches data, renders
```

---

## The Logout Flow

```
1. User clicks "Logout" in sidebar
                    │
2. Browser navigates to GET /auth/logout
                    │
3. route.ts runs:
   → Reads the cookie store
   → Deletes the "access_token" cookie
   → Redirects to /auth/login
                    │
4. User is now logged out
   → No cookie = no session
   → Protected pages redirect to logout
```

---

## Role-Based Access

### Two Roles

| Role | Can Access | Sidebar Shows |
|------|-----------|---------------|
| **user** | Dashboard, Category, Items, Profile | 3 menu items |
| **admin** | Dashboard, Category, Items, Users, Profile | 4 menu items |

### How Roles Are Enforced

**Sidebar (visual restriction):**
```
(protected)/layout.tsx checks role:
  → If role === "admin" → render SidebarAdmin (4 items)
  → Otherwise → render Sidebar (3 items)
```

**Pages (access restriction):**
```
/users/page.tsx calls verifyRole("admin"):
  → If role === "admin" → render the page
  → If role !== "admin" → redirect to /dashboard
```

### How to Make a User an Admin

```sql
-- In PostgreSQL:
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

Or use Prisma Studio (`npx prisma studio`) to edit the `role` column.

---

## Security Details

### Cookie Security

```ts
cookieStore.set("access_token", token, {
  httpOnly: true,  // JavaScript cannot read this cookie
  secure: true,    // Only sent over HTTPS
});
```

- **httpOnly:** Prevents XSS attacks — even if malicious JavaScript runs on the page, it can't steal the token
- **secure:** Prevents man-in-the-middle attacks — token is only sent over HTTPS

### Password Security

```ts
// Hashing (during registration/update):
const hash = await bcrypt.hash(password, 10);
// "10" is the salt rounds — higher = more secure but slower
// Result: "$2a$10$N9qo8uLOickgx2ZMRZoMye..." (one-way, can't reverse)

// Verification (during login):
const isMatch = await bcrypt.compare(password, storedHash);
// Returns true/false — never reveals the actual password
```

### JWT Security

```ts
// Signing:
const token = jwt.sign({ userId: "abc" }, JWT_SECRET);
// Creates a signed token that can't be tampered with

// Verification:
const decoded = jwt.verify(token, JWT_SECRET);
// If someone modifies the token → verification fails → returns null
```

---

## File Reference

| File | Purpose | When It Runs |
|------|---------|-------------|
| `lib/jwt.ts` | Sign and verify JWT tokens | During login and every page load |
| `lib/bcrypt.ts` | Hash and compare passwords | During registration, login, profile update |
| `lib/session.ts` | Create and verify sessions | During login and every page load |
| `lib/dataAccess.ts` | `getUser()` and `verifyRole()` guards | Every protected page |
| `modules/auth/actions/login.action.ts` | Handle login form submission | When user clicks "Login" |
| `modules/auth/actions/register.action.ts` | Handle registration form | When user clicks "Register" |
| `app/auth/logout/route.ts` | Clear session cookie | When user clicks "Logout" |
| `app/(protected)/layout.tsx` | Check auth on every protected page | Every page load |

---

## Adding a New Protected Route

```tsx
// 1. Create a page in (protected)/:
app/(protected)/my-page/page.tsx

// 2. That's it — the layout already checks authentication

// 3. To add role restriction, add this at the top:
import { verifyRole } from "@/lib/dataAccess";

async function MyPage() {
  await verifyRole("admin");  // Non-admins get redirected
  // ... rest of the page
}
```

---

## Next Steps

- [Data Flow](./data-flow.md) — How data moves through the system
- [Backend Patterns](./backend.md) — Server-side code patterns
- [Helpers](./helpers.md) — Detailed explanation of auth utility files
