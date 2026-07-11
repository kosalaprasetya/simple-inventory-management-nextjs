# Architecture

This document explains how the Inventory Management System is organized, the technologies used, and the patterns followed.

---

## What This App Is

An inventory management system where users can:
- Manage categories (labels for organizing items)
- Track inventory items with stock counts
- Search, sort, and paginate through lists
- Admins can manage user accounts

---

## Tech Stack

| Technology | Version | What It Does |
|-----------|---------|-------------|
| **Next.js** | 16 | React framework — handles routing, server rendering, and API |
| **React** | 19 | UI library — builds the user interface |
| **TypeScript** | 5 | Adds type safety to JavaScript |
| **Prisma** | 7 | Database ORM — generates type-safe database queries |
| **PostgreSQL** | 14+ | Relational database — stores all data |
| **Zod** | 4 | Input validation — checks form data before saving |
| **Tailwind CSS** | 4 | Utility-first CSS — styles all components |
| **bcryptjs** | 3 | Password hashing — securely stores passwords |
| **jsonwebtoken** | 9 | JWT tokens — manages login sessions |

---

## Directory Structure

```
inventory-management-system/
│
├── app/                    # What users see (routes and pages)
│   ├── auth/               # Public pages (login, register)
│   ├── (protected)/        # Pages that require login
│   ├── layout.tsx          # Root layout (wraps all pages)
│   └── page.tsx            # Landing page (home)
│
├── modules/                # Business logic (the "brain")
│   ├── auth/               # How login works
│   ├── user/               # User management
│   ├── item/               # Inventory items
│   ├── category/           # Categories
│   ├── dashboard/          # Sidebar navigation
│   ├── homepage/           # Landing page content
│   └── shared/             # Code reused across modules
│
├── lib/                    # Infrastructure (the "foundation")
│   ├── db.ts               # Database connection
│   ├── session.ts          # Login sessions
│   ├── jwt.ts              # Token signing
│   ├── bcrypt.ts           # Password hashing
│   ├── validation.ts       # Input validation
│   ├── response.ts         # API response format
│   └── types.ts            # Shared TypeScript types
│
├── prisma/                 # Database (the "memory")
│   ├── model/              # Table definitions
│   └── migrations/         # Database change history
│
└── docs/                   # This documentation
```

---

## The Module Pattern

Every feature (user, item, category) follows the **same folder structure**:

```
modules/<feature>/
  ├── validation/     # What fields are allowed (Zod schemas)
  ├── types/          # TypeScript types
  ├── repository/     # Database queries (Prisma)
  ├── service/        # Business logic
  ├── controller/     # Validation + response wrapping
  ├── actions/        # Server Actions (called by forms)
  ├── ui/             # React components (what users see)
  └── <feature>.interface.ts  # Public exports
```

**Why this pattern?**
- **Consistency** — Every module works the same way, so you always know where to find code
- **Separation** — Each layer has one job (database queries vs business logic vs UI)
- **Scalability** — Adding a new feature means copying a module and changing the fields

**The layers, from bottom to top:**

```
Repository  →  Service  →  Controller  →  Action  →  UI Component
(database)     (logic)     (validate)     (bridge)     (render)
```

---

## Server Components vs Client Components

Next.js has two types of components. Understanding this is critical.

### Server Components (default)

```tsx
// app/(protected)/category/page.tsx
// NO "use client" at the top — this is a Server Component

async function CategoryPage({ searchParams }) {
  const params = await searchParams;
  const result = await CategoryAction.default.getCategories(query);
  return <Category data={result.data} />;
}
```

**What they do:**
- Run on the server only (never sent to the browser)
- Can access the database directly
- Can read cookies and check authentication
- Pass data to client components via props

### Client Components

```tsx
// modules/category/ui/Category.tsx
"use client";  // ← This line makes it a Client Component

import { useState } from "react";

function Category({ data }) {
  const [showDialog, setShowDialog] = useState(false);
  // ... handles clicks, forms, typing
}
```

**What they do:**
- Run in the browser
- Handle user interactions (clicks, forms, typing)
- Use React hooks (useState, useEffect, etc.)
- Receive data from server components as props

### The Rule

```
Server Components fetch data and pass it DOWN
Client Components handle interactions and call actions UP

Server Component (page.tsx)
  │
  │ passes data as props
  ▼
Client Component (Category.tsx)
  │
  │ calls server actions
  ▼
Server Action (create.action.ts)
```

---

## Route Groups

Next.js uses parenthesized folder names as "route groups" — they organize files without affecting the URL:

```
app/
  (protected)/         # This folder name does NOT appear in the URL
    layout.tsx         # Checks authentication
    category/
      page.tsx         # URL is /category, NOT /(protected)/category
```

**Why use them?** The `(protected)/layout.tsx` runs before every page inside it, checking if the user is logged in. If not, it redirects to logout.

---

## How Pages Work

Each page follows this pattern:

```
1. URL: /category?search=food&page=2

2. Next.js finds: app/(protected)/category/page.tsx

3. The (protected)/layout.tsx runs first:
   → Checks if user is logged in
   → Renders sidebar + main content area

4. category/page.tsx runs:
   → Reads searchParams from URL
   → Calls controller to fetch data from database
   → Passes data as props to the client component

5. Category.tsx renders:
   → Shows search bar, sort button, table, pagination
   → User interactions update the URL
   → URL change triggers step 2 again (full circle)
```

---

## Visual Overview

```
┌─────────────────────────────────────────────────────┐
│                    BROWSER                          │
│                                                     │
│  ┌─────────────┐  ┌──────────────────────────────┐  │
│  │   Sidebar   │  │       Main Content           │  │
│  │             │  │                              │  │
│  │  Dashboard  │  │  ┌────────────────────────┐  │  │
│  │  Category   │  │  │  Search  Sort  Add     │  │  │
│  │  Items      │  │  ├────────────────────────┤  │  │
│  │  Users*     │  │  │  Table with data       │  │  │
│  │             │  │  │  from database          │  │  │
│  │  ────────   │  │  │                        │  │  │
│  │  Profile    │  │  ├────────────────────────┤  │  │
│  │  Name       │  │  │  Page 1 of 5  Prev/Next│  │  │
│  │  Email      │  │  └────────────────────────┘  │  │
│  └─────────────┘  └──────────────────────────────┘  │
│                                                     │
│  Client Components (handle clicks, typing, forms)   │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ Server Actions (form submissions)
                       │ URL changes (search, sort, pagination)
                       │
┌──────────────────────▼──────────────────────────────┐
│                    SERVER                           │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │  Server Components (fetch data, check auth)  │   │
│  └──────────────────────────────────────────────┘   │
│                       │                             │
│                       ▼                             │
│  ┌──────────────────────────────────────────────┐   │
│  │  Controllers → Services → Repositories       │   │
│  └──────────────────────────────────────────────┘   │
│                       │                             │
│                       ▼                             │
│  ┌──────────────────────────────────────────────┐   │
│  │  Prisma ORM → PostgreSQL Database            │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Next Steps

- [Data Flow](./data-flow.md) — See exactly how data moves through the system
- [Authentication](./auth.md) — How login and roles work
- [Modules](./modules.md) — What each module does
