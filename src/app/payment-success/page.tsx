"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/lib/api";


function SuccessContent() {
  console.log("RENDER SUCCESS CONTENT");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";
  const rentalRequestId = searchParams.get("rental_request_id") || "";
  const [isConfirming, setIsConfirming] = useState(true);
  const [amount, setAmount] = useState("...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("SUCCESS PAGE LOADED");
    const confirmPayment = async () => {
      if (!sessionId && !rentalRequestId) {
        console.log("sessionId:", sessionId);
console.log("rentalRequestId:", rentalRequestId);
        setError("Missing payment session information");
        setIsConfirming(false);
        return;
      }

      try {
        console.log("CALLING CONFIRM API");
        const response = await fetchApi('/payments/confirm', {
          method: 'POST',
          body: JSON.stringify({
            sessionId,
            rentalRequestId,
          }),
        });

        if (response.data?.payment?.amount) {
          setAmount(response.data.payment.amount.toString());
        } else {
          setAmount("—");
        }
      } catch (err: any) {
        console.error("Payment confirmation error:", err);
        setError(err?.message || "Failed to confirm payment");
      } finally {
        setIsConfirming(false);
      }
    };

    confirmPayment();
  }, [sessionId, rentalRequestId]);

  if (isConfirming) {
    return (
      <Card className="shadow-2xl border-blue-200/80 text-center max-w-lg mx-auto">
        <CardHeader className="pt-8 pb-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-3xl mb-3 animate-pulse">
            ⟳
          </div>
          <CardTitle className="text-2xl font-extrabold text-slate-900">
            Confirming Payment...
          </CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            Please wait while we verify your payment with Stripe.
          </p>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-2xl border-rose-200/80 text-center max-w-lg mx-auto">
        <CardHeader className="pt-8 pb-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-3xl mb-3">
            ⚠
          </div>
          <CardTitle className="text-2xl font-extrabold text-slate-900">
            Payment Confirmation Failed
          </CardTitle>
          <p className="text-sm text-rose-600 mt-1">{error}</p>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 text-left">
            <p className="font-semibold mb-2">What to do next:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Contact support with your session ID: {sessionId}</li>
              <li>Check your email for payment confirmation</li>
              <li>Try refreshing this page</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard/tenant" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-2xl border-emerald-200/80 text-center max-w-lg mx-auto">
      <CardHeader className="pt-8 pb-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-3xl mb-3">
          ✓
        </div>
        <CardTitle className="text-2xl font-extrabold text-slate-900">
          Payment Successful! 
        </CardTitle>
        <p className="text-sm text-slate-500 mt-1">
          Thank you! Your rental payment of <span className="font-bold text-slate-900">${amount}</span> has been processed.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pb-8">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-left space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Transaction ID:</span>
            <span className="font-mono font-semibold text-slate-800">{sessionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Payment Status:</span>
            <span className="font-bold text-emerald-600 uppercase">Completed</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Lease Status:</span>
            <span className="font-bold text-blue-600 uppercase">ACTIVE</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard/tenant" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full">
              Go to Tenant Dashboard
            </Button>
          </Link>
          <Link href="/properties" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              Browse More Listings
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Suspense fallback={<div className="text-center text-slate-400">Loading receipt...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
