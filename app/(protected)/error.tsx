"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.1),transparent_50%)]" />
      <div className="relative mx-auto max-w-md text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-sm text-red-400">
          <AlertTriangle className="h-4 w-4" />
          <span>Something went wrong</span>
        </div>
        <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-red-500">
          Error
        </h1>
        <h2 className="mb-4 text-2xl font-bold">
          An unexpected error occurred
        </h2>
        <p className="text-foreground/60 mb-8">
          {error.message || "Something went wrong. Please try again."}
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-xs transition hover:bg-blue-500"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="border-foreground/20 text-foreground hover:bg-foreground/5 inline-flex cursor-pointer items-center gap-2 rounded-lg border px-6 py-3 font-semibold transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
