# Inventory Management System

A full-stack inventory management application built with Next.js 16, React 19, Prisma 7, and PostgreSQL.

## Features

- **User Management** — Admin creates users, assigns roles (admin/user)
- **Category Management** — CRUD categories with search and sorting
- **Item Management** — Track inventory items with stock levels, linked to categories and users
- **Authentication** — JWT-based login with httpOnly cookies, role-based access control
- **Modular Architecture** — Each feature follows validation → types → repository → service → controller → actions → UI pattern

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, lucide-react |
| Backend | Server Actions, Prisma 7, PostgreSQL |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Validation | Zod |
| Language | TypeScript |

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- [PostgreSQL](https://www.postgresql.org/) running locally

### Setup

```bash
# 1. Install dependencies
bun install

# 2. Configure database
#    Edit .env with your PostgreSQL connection string
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inventory-management-system-db"
JWT_SECRET="your-secret-key"

# 3. Run migrations
bunx prisma migrate dev

# 4. Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bunx prisma migrate dev` | Run database migrations |
| `bunx prisma studio` | Open Prisma database browser |
| `bunx prisma generate` | Regenerate Prisma client |

## Project Structure

```
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Public routes (login)
│   └── (protected)/              # Authenticated routes
│       ├── layout.tsx            # Auth guard + sidebar
│       ├── category/             # Category module routes
│       ├── item/                 # Item module routes
│       └── users/                # User module routes
├── lib/                          # Shared utilities
│   ├── db.ts                     # Prisma client singleton
│   ├── session.ts                # JWT cookie management
│   ├── jwt.ts                    # JWT sign/verify
│   ├── bcrypt.ts                 # Password hashing
│   ├── dataAccess.ts             # Auth guards (getUser, verifyRole)
│   ├── response.ts               # Standardized API responses
│   ├── validation.ts             # Zod validation wrapper
│   ├── formatError.ts            # Error normalization
│   └── types.ts                  # Shared types (PagingType, ResponseType)
├── modules/                      # Feature modules
│   ├── shared/                   # Shared components and hooks
│   │   ├── components/           # SearchBar, SortButton, PaginationControls
│   │   └── hooks/                # useListParams
│   ├── auth/                     # Authentication module
│   ├── user/                     # User management module
│   ├── item/                     # Item management module
│   └── category/                 # Category management module
├── prisma/                       # Database schema
│   └── schema.prisma
└── docs/                         # Documentation
```

## Default Admin Account

After running migrations and seeding, you can log in with:

- **Email:** `admin@gmail.com`
- **Password:** `12345678`

> **Note:** Create this user manually in the database or through the registration flow.

## Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) folder:

| Guide | Description |
|-------|-------------|
| [Documentation Index](./docs/readme.md) | Full documentation index |
| [Getting Started](./docs/getting-started.md) | Detailed setup guide |
| [Architecture](./docs/architecture.md) | Tech stack, directory structure, concepts |
| [Data Flow](./docs/data-flow.md) | How data moves through the system |
| [Authentication](./docs/auth.md) | Login, sessions, roles, security |
| [Modules](./docs/modules.md) | Catalog of all modules |
| [Backend](./docs/backend.md) | Server actions, controllers, services |
| [Client Side](./docs/client-side.md) | UI components, forms, shared components |
| [Conventions](./docs/conventions.md) | Naming rules and code style |
| [Troubleshooting](./docs/troubleshooting.md) | Common errors and fixes |
| [How to Develop a Module](./docs/how-to-develop-module.md) | Step-by-step tutorial |
| [Helpers](./docs/helpers.md) | Utility functions in lib/ |
| [ERD Diagram](./docs/erd/erd.drawio) | Visual database diagram |
