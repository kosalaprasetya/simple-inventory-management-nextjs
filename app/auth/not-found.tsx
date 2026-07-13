import Link from "next/link";
import { Package, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative mx-auto max-w-md text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="relative">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400">
          <Package className="h-4 w-4" />
          <span>InventoSys</span>
        </div>
        <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-blue-500">
          404
        </h1>
        <h2 className="mb-4 text-2xl font-bold">Page not found</h2>
        <p className="text-foreground/60 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-xs transition hover:bg-blue-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
