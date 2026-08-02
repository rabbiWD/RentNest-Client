import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 px-4 text-center space-y-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 text-4xl shadow-md">
        🔍
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">404 Error</span>
        <h1 className="text-4xl font-extrabold tracking-tight">Page Not Found</h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          The page or property listing you are looking for does not exist or may have been moved.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="primary" size="lg">
            Return to Homepage
          </Button>
        </Link>
        <Link href="/properties">
          <Button variant="outline" size="lg">
            Explore Properties
          </Button>
        </Link>
      </div>
    </div>
  );
}
