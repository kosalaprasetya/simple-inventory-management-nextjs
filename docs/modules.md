# Module Catalog

This document lists every module in the application, what it does, and where to find its code.

---

## Module Overview

| Module | Purpose | Routes | Admin Only? |
|--------|---------|--------|-------------|
| [auth](#auth) | Login, register, logout | `/auth/login`, `/auth/register`, `/auth/logout` | No |
| [user](#user) | User management | `/users`, `/users/add`, `/users/[id]`, `/profile` | `/users` yes, `/profile` no |
| [item](#item) | Inventory items | `/items` | No |
| [category](#category) | Category labels | `/category` | No |
| [dashboard](#dashboard) | Sidebar navigation | `/dashboard` | No |
| [homepage](#homepage) | Landing page | `/` | No |
| [shared](#shared) | Reusable components | N/A | N/A |

---

## auth

**Purpose:** Handles user registration, login, and logout.

**Routes:**
- `/auth/login` — Login form
- `/auth/register` — Registration form
- `/auth/logout` — Clears session (GET route)

**Key Files:**
| File | What It Does |
|------|-------------|
| `modules/auth/actions/login.action.ts` | Validates credentials, creates session |
| `modules/auth/actions/register.action.ts` | Creates new user account |
| `modules/auth/ui/LoginForm.tsx` | Login form UI |
| `modules/auth/ui/RegisterForm.tsx` | Registration form UI |
| `modules/auth/validation/auth.schema.ts` | Zod schemas for login/register |

**Notes:**
- Registration always creates a "user" role (not admin)
- Login uses bcrypt to compare passwords
- Logout is a GET route that deletes the cookie

---

## user

**Purpose:** Manage user accounts. Admins can create, edit, and delete users. Any user can edit their own profile.

**Routes:**
- `/users` — User list (admin only)
- `/users/add` — Add new user (admin only)
- `/users/[id]` — Edit user (admin only)
- `/profile` — Edit own profile (any logged-in user)

**Key Files:**
| File | What It Does |
|------|-------------|
| `modules/user/controller/user.controller.ts` | CRUD operations |
| `modules/user/service/user.service.ts` | Password hashing, duplicate checks |
| `modules/user/repository/user.repository.ts` | Database queries |
| `modules/user/actions/create.action.ts` | Create user (admin) |
| `modules/user/actions/update.action.ts` | Update user (admin) |
| `modules/user/actions/delete.action.ts` | Delete user (admin) |
| `modules/user/actions/updateProfile.action.ts` | Update own profile |
| `modules/user/ui/User.tsx` | User list with search/filter |
| `modules/user/ui/UserDetail.tsx` | User edit form |
| `modules/user/ui/AddUser.tsx` | Add user form |
| `modules/user/ui/ProfileForm.tsx` | Profile edit form |

**Notes:**
- Passwords are hashed before storage (never stored in plain text)
- The repository uses `omit: { password: true }` to never return passwords
- User list has a role filter (All Roles / Admin / User)
- Items are scoped to users — each user sees only their own items

---

## item

**Purpose:** Manage inventory items. Each item belongs to a user and a category.

**Routes:**
- `/items` — Items list with search, sort, pagination

**Key Files:**
| File | What It Does |
|------|-------------|
| `modules/item/controller/item.controller.ts` | CRUD operations |
| `modules/item/service/item.service.ts` | Business logic |
| `modules/item/repository/item.repository.ts` | Database queries (scoped to user) |
| `modules/item/actions/create.action.ts` | Create item (auto-assigns user_id) |
| `modules/item/actions/update.action.ts` | Update item |
| `modules/item/actions/delete.action.ts` | Delete item |
| `modules/item/actions/fetchCategories.action.ts` | Fetch all categories (for dropdown) |
| `modules/item/actions/fetchCategory.action.ts` | Fetch single category |
| `modules/item/ui/Item.tsx` | Items list page |
| `modules/item/ui/components/ItemsTable.tsx` | Items table |
| `modules/item/ui/components/CreateDialog.tsx` | Create item dialog |
| `modules/item/ui/components/UpdateDialog.tsx` | Update item dialog |

**Notes:**
- Items are scoped to the logged-in user (`user_id` is set automatically)
- The items table fetches categories client-side for the category label lookup
- Items have: name, stock (number), description, category_id

---

## category

**Purpose:** Manage category labels. Categories are global (not scoped to users) and are used to organize items.

**Routes:**
- `/category` — Category list with search, sort, pagination

**Key Files:**
| File | What It Does |
|------|-------------|
| `modules/category/controller/category.controller.ts` | CRUD operations |
| `modules/category/service/category.service.ts` | Business logic |
| `modules/category/repository/category.repository.ts` | Database queries |
| `modules/category/actions/create.action.ts` | Create category |
| `modules/category/actions/update.action.ts` | Update category |
| `modules/category/actions/delete.action.ts` | Delete category |
| `modules/category/ui/Category.tsx` | Category list page |
| `modules/category/ui/components/CategoryTable.tsx` | Category table |
| `modules/category/ui/components/CreateDialog.tsx` | Create category dialog |
| `modules/category/ui/components/UpdateDialog.tsx` | Update category dialog |

**Notes:**
- Category `label` must be unique
- Categories are shared across all users (not scoped)
- Deleting a category does NOT delete items in that category (no cascade)

---

## dashboard

**Purpose:** Sidebar navigation and dashboard pages.

**Routes:**
- `/dashboard` — Dashboard page (admin vs user view)

**Key Files:**
| File | What It Does |
|------|-------------|
| `modules/dashboard/ui/components/sidebar/Sidebar.tsx` | Sidebar navigation (parameterized by role) |
| `modules/dashboard/ui/components/sidebar/SidebarMenuItem.tsx` | Single menu item |
| `modules/dashboard/ui/pages/AdminDashboard.tsx` | Admin dashboard (placeholder) |
| `modules/dashboard/ui/pages/UserDashboard.tsx` | User dashboard (placeholder) |

**Notes:**
- Sidebar accepts `menuItems` prop — admin gets 4 items, user gets 3
- Menu items are defined in `app/(protected)/layout.tsx`
- Dashboard pages are currently placeholders

---

## homepage

**Purpose:** Public landing page shown to unauthenticated visitors.

**Routes:**
- `/` — Landing page

**Key Files:**
| File | What It Does |
|------|-------------|
| `modules/homepage/LandingPage.tsx` | Full landing page (hero, features, about, CTA) |

**Notes:**
- Server component (no "use client")
- Links to `/auth/register` for sign up
- Purely presentational — no data fetching

---

## shared

**Purpose:** Reusable components and hooks used across multiple modules.

**Key Files:**
| File | What It Does |
|------|-------------|
| `modules/shared/hooks/useListParams.ts` | Manages search, sort, pagination via URL |
| `modules/shared/components/SearchBar.tsx` | Reusable search input |
| `modules/shared/components/SortButton.tsx` | Reusable sort toggle |
| `modules/shared/components/PaginationControls.tsx` | Reusable prev/next pagination |

**Notes:**
- Used by Category, Item, and User list pages
- `useListParams` handles debounced search (800ms), sort toggle, and pagination
- All list pages follow the same pattern using these shared pieces

---

## How Modules Connect

```
auth ──→ user (registration creates a user)
user ──→ item (items are scoped to users)
category ──→ item (items belong to categories)
shared ←── category, item, user (shared UI components)
dashboard ←── all (sidebar on every protected page)
```

---

## Next Steps

- [How to Develop a Module](./how-to-develop-module.md) — Build a new module
- [Architecture](./architecture.md) — How modules fit in the overall structure
- [Helpers](./helpers.md) — Utility functions used by all modules
