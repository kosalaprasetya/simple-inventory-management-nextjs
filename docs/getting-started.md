# Getting Started

This guide walks you through setting up the project from scratch and running it locally.

---

## Prerequisites

Before you begin, make sure you have these installed:

| Tool | Why You Need It | Check Version |
|------|----------------|---------------|
| **Node.js** (18+) | JavaScript runtime | `node -v` |
| **Bun** | Package manager and dev server | `bun -v` |
| **PostgreSQL** (14+) | Database | `psql --version` |

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd inventory-management-system
```

---

## 2. Install Dependencies

```bash
bun install
```

This reads `package.json` and installs all required packages into `node_modules/`.

---

## 3. Environment Variables

The app needs two environment variables. Copy the example and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and configure:

```env
# PostgreSQL connection string
# Format: postgresql://username:password@localhost:5432/database_name
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inventory-management-system-db"

# Secret key for JWT tokens (any random string works)
# Used to sign and verify login tokens
JWT_SECRET="your-secret-key-here"
```

**What each variable does:**

- `DATABASE_URL` — Tells Prisma how to connect to your PostgreSQL database. Change `username`, `password`, and `database_name` to match your local PostgreSQL setup.
- `JWT_SECRET` — A secret string used to sign login tokens. If someone guesses this, they can forge login sessions. Use a long random string in production.

---

## 4. Database Setup

### Create the database

Connect to PostgreSQL and create the database:

```bash
# Using psql
psql -U postgres -c "CREATE DATABASE \"inventory-management-system-db\";"
```

Or use a GUI tool like pgAdmin to create a database named `inventory-management-system-db`.

### Run migrations

This creates the tables (users, items, categories) in your database:

```bash
npx prisma migrate dev
```

**What this does:**
1. Reads the schema files in `prisma/model/`
2. Generates SQL migration files
3. Runs them against your database
4. Generates the Prisma client (TypeScript types for your tables)

You should see output like:
```
Environment variables loaded from .env
Datasource "db": PostgreSQL database

✓ Running migrations
✓ Generated Prisma Client
```

---

## 5. Run the App

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the landing page.

---

## 6. Create Your First Account

1. Click **Register** (or go to `/auth/register`)
2. Fill in your name, email, and password
3. You'll be redirected to the login page
4. Log in with your new account

### Making Yourself an Admin

By default, new users have the "user" role. To make yourself an admin:

```bash
psql -U postgres -d inventory-management-system-db -c "UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';"
```

Or use pgAdmin to change the `role` column in the `users` table from `"user"` to `"admin"`.

Admin users can access the **Users** management page.

---

## 7. Project Structure

Here's where things live:

```
inventory-management-system/
├── app/                    # Pages and routes (Next.js App Router)
│   ├── auth/               # Login, register, logout
│   ├── (protected)/        # Pages that require login
│   │   ├── dashboard/      # Dashboard page
│   │   ├── category/       # Category list
│   │   ├── items/          # Items list
│   │   ├── users/          # User management (admin only)
│   │   └── profile/        # Edit own profile
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── modules/                # Business logic (one folder per feature)
│   ├── auth/               # Authentication
│   ├── user/               # User management
│   ├── item/               # Inventory items
│   ├── category/           # Categories
│   ├── dashboard/          # Sidebar and dashboard
│   ├── homepage/           # Landing page
│   └── shared/             # Reusable components and hooks
├── lib/                    # Shared utilities
│   ├── db.ts               # Database connection
│   ├── session.ts          # Login sessions
│   ├── jwt.ts              # Token signing
│   ├── bcrypt.ts           # Password hashing
│   ├── validation.ts       # Input validation
│   └── response.ts         # API responses
├── prisma/                 # Database schema
│   ├── model/              # Table definitions
│   └── migrations/         # Database changes
├── docs/                   # This documentation
└── .env                    # Environment variables (not in git)
```

---

## Common Commands

| Command | What It Does |
|---------|-------------|
| `bun run dev` | Start the development server |
| `bun run build` | Build for production |
| `bun run start` | Start the production server |
| `bun run lint` | Check for code errors |
| `npx prisma migrate dev` | Run database migrations |
| `npx prisma generate` | Regenerate Prisma client (after schema changes) |
| `npx prisma studio` | Open database browser |

---

## Next Steps

- [Architecture](./architecture.md) — Understand how the app is organized
- [Data Flow](./data-flow.md) — See how data moves through the system
- [How to Develop a Module](./how-to-develop-module.md) — Build your first feature
