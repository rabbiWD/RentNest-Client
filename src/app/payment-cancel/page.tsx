"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, ArrowRight, Home } from "@/components/ui/icons";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const rentalRequestId = searchParams.get("rental_request_id");

  return (
    <Card className="shadow-2xl border-rose-200/80 text-center max-w-lg mx-auto rounded-3xl bg-white overflow-hidden">
      <CardHeader className="pt-10 pb-4 space-y-3">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 shadow-inner">
          <XCircle className="h-10 w-10 text-rose-600" />
        </div>
        <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">
          Payment Cancelled
        </CardTitle>
        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          Your payment transaction was not completed. No charges were made to your account.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pb-10 px-8">
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 text-left leading-relaxed">
          💡 If you changed your mind or experienced a checkout issue, your rental request remains approved. You can retry payment whenever you are ready.
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {rentalRequestId ? (
            <Link href={`/dashboard/tenant/requests/${rentalRequestId}/pay`} className="w-full sm:w-auto">
              <Button variant="primary" className="w-full bg-blue-600 hover:bg-blue-700 font-bold rounded-2xl py-3 gap-2">
                <span>Try Payment Again</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : null}

          <Link href="/dashboard/tenant" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full font-bold rounded-2xl py-3 gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Dashboard</span>
            </Button>
          </Link>

          <Link href="/properties" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full font-bold rounded-2xl py-3 gap-2">
              <Home className="h-4 w-4" />
              <span>Properties</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Suspense fallback={<div>Loading...</div>}>
          <PaymentCancelContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
