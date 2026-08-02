"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 px-4 text-center space-y-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-3xl">
        ⚠️
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight">Something Went Wrong</h1>
        <p className="text-sm text-slate-600">
          {error.message || "An unexpected application error occurred. Please try again or return home."}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={() => reset()}>
          Try Again 🔄
        </Button>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
