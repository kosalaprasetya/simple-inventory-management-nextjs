import Link from "next/link";
import {
  Package,
  ArrowRight,
  Layers,
  Shield,
  Search,
  Users,
  LogIn,
} from "lucide-react";

const LandingPage = () => {
  return (
    <main className="bg-background text-foreground min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400">
            <Package className="h-4 w-4" />
            <span>Simple inventory management for your business</span>
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
            Take Control of{" "}
            <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Your Inventory
            </span>
          </h1>
          <p className="text-foreground/70 mx-auto mb-10 max-w-2xl text-lg leading-relaxed md:text-xl">
            Track your inventory, organize items by category, and manage stock
            levels — all in one place. Simple, fast, and secure.
          </p>
          <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/register"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-xs transition hover:bg-blue-500 sm:max-w-64"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#features"
              className="border-foreground/20 text-foreground hover:bg-foreground/5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border px-8 py-3 font-semibold transition sm:max-w-64"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative px-6 py-24 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Everything you need to manage your stock
            </h2>
            <p className="text-foreground/70 mt-4 text-lg">
              Powerful features to streamline your inventory workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="group border-foreground/10 bg-foreground/2 rounded-2xl border p-8 transition duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.1)]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Item Management</h3>
              <p className="text-foreground/70 leading-relaxed">
                Add, edit, and delete inventory items with name, stock count,
                description, and category assignment.
              </p>
            </div>

            <div className="group border-foreground/10 bg-foreground/2 rounded-2xl border p-8 transition duration-300 hover:border-amber-500/30 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.1)]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Categories</h3>
              <p className="text-foreground/70 leading-relaxed">
                Organize items into custom categories. Create, rename, or remove
                categories as your inventory grows.
              </p>
            </div>

            <div className="group border-foreground/10 bg-foreground/2 rounded-2xl border p-8 transition duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.1)]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Search & Sort</h3>
              <p className="text-foreground/70 leading-relaxed">
                Find items instantly by name or description. Sort alphabetically
                and filter by category with ease.
              </p>
            </div>

            <div className="group border-foreground/10 bg-foreground/2 rounded-2xl border p-8 transition duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.1)]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">User Management</h3>
              <p className="text-foreground/70 leading-relaxed">
                Admins can manage users — add, edit, or remove accounts and
                assign roles to control access.
              </p>
            </div>

            <div className="group border-foreground/10 bg-foreground/2 rounded-2xl border p-8 transition duration-300 hover:border-purple-500/30 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.1)]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Role-based Access</h3>
              <p className="text-foreground/70 leading-relaxed">
                Two roles — admin and user. Admins have full control, users
                manage their own items and profile.
              </p>
            </div>

            <div className="group border-foreground/10 bg-foreground/2 rounded-2xl border p-8 transition duration-300 hover:border-rose-500/30 hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.1)]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">
                <LogIn className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Authentication</h3>
              <p className="text-foreground/70 leading-relaxed">
                Secure login and registration with encrypted passwords and JWT
                session management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="border-foreground/10 relative border-y px-6 py-24 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(59,130,246,0.06),transparent_50%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row">
          <div className="lg:w-1/2">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Built to{" "}
                <span className="text-blue-400">simplify inventory</span>
              </h2>
              <p className="text-foreground/80 mb-4 text-lg leading-relaxed">
                We started this project to solve a simple problem:{" "}
                <strong>keeping track of stuff shouldn&apos;t be hard</strong>.
                Spreadsheets get messy, and paper lists get lost.
              </p>
              <p className="text-foreground/80 text-lg leading-relaxed">
                This system lets you manage items, categories, and users in a
                clean interface — so you can spend less time organizing and more
                time doing.
              </p>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="border-foreground/20 flex h-72 items-center justify-center rounded-2xl border-2 border-dashed bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)] shadow-inner">
              <div className="text-center">
                <div className="mb-4 flex justify-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                    JD
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                    AK
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    MR
                  </div>
                </div>
                <p className="text-foreground/50 text-sm font-medium">
                  Our Team
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-24 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.1),transparent_50%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Ready to simplify your inventory?
          </h2>
            <p className="text-foreground/70 mx-auto mb-10 max-w-2xl text-lg">
            Create an account and start managing your inventory in minutes.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-xs transition hover:bg-blue-500"
          >
            Get Started Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-foreground/10 border-t px-6 py-12 lg:px-8">
        <div className="mx-auto mb-8 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h4 className="mb-4 text-2xl font-bold tracking-tight">
              InventoSys
            </h4>
            <p className="text-foreground/60 mb-6 max-w-sm">
              Smart inventory management solutions for modern businesses.
            </p>
          </div>

          <div>
            <h4 className="text-foreground/80 mb-4 text-sm font-semibold tracking-wider uppercase">
              Company
            </h4>
            <ul className="text-foreground/60 space-y-3">
              <li>
                <a
                  href="#about-us"
                  className="hover:text-foreground transition"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-foreground transition"
                >
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground/80 mb-4 text-sm font-semibold tracking-wider uppercase">
              Contact
            </h4>
            <ul className="text-foreground/60 space-y-3">
              <li>hello@inventosys.com</li>
              <li>+1 (555) 123-4567</li>
              <li>San Francisco, CA</li>
            </ul>
          </div>
        </div>

        <div className="border-foreground/10 text-foreground/60 mx-auto flex max-w-6xl flex-col items-center justify-between border-t pt-8 text-center text-sm md:flex-row md:text-left">
          <p>
            &copy; {new Date().getFullYear()} InventoSys. All rights reserved.
          </p>
          <div className="mt-4 space-x-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
