
"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Card className="shadow-2xl border-rose-200/80 text-center max-w-lg mx-auto">
          <CardHeader className="pt-8 pb-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-3xl mb-3">
              ✕
            </div>
            <CardTitle className="text-2xl font-extrabold text-slate-900">
              Payment Cancelled or Failed
            </CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              Your payment transaction was not completed. No charges were made to your account.
            </p>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 text-left">
              If you encountered an issue during checkout, you can re-attempt payment at any time from your Tenant Dashboard.
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/dashboard/tenant" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full">
                  Return to My Dashboard
                </Button>
              </Link>
              <Link href="/properties" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full">
                  Explore Properties
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
