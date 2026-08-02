"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/lib/api";
import {
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  XCircle,
  Building2,
  Clock,
} from "@/components/ui/icons";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";
  const rentalRequestId = searchParams.get("rental_request_id") || "";
  const [isConfirming, setIsConfirming] = useState(true);
  const [amount, setAmount] = useState<string>("...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId && !rentalRequestId) {
        setError("Missing payment session information.");
        setIsConfirming(false);
        return;
      }

      try {
        const response = await fetchApi("/payments/confirm", {
          method: "POST",
          body: JSON.stringify({
            sessionId,
            rentalRequestId,
          }),
        });

        if (response.data?.payment?.amount) {
          setAmount(Number(response.data.payment.amount).toLocaleString());
        } else {
          setAmount("—");
        }
      } catch (err: any) {
        console.error("Payment confirmation error:", err);
        setError(err?.message || "Failed to confirm payment with backend server.");
      } finally {
        setIsConfirming(false);
      }
    };

    confirmPayment();
  }, [sessionId, rentalRequestId]);

  /* Loading State */
  if (isConfirming) {
    return (
      <Card className="shadow-2xl border-blue-100 rounded-3xl text-center max-w-lg mx-auto bg-white p-8 overflow-hidden">
        <CardContent className="space-y-6 pt-4">
          <div className="relative mx-auto h-20 w-20 flex items-center justify-center rounded-3xl bg-blue-50 text-blue-600 shadow-inner">
            <svg
              className="animate-spin h-10 w-10 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-80"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase tracking-wider border border-blue-200">
              <Clock className="h-3.5 w-3.5 text-blue-600 animate-spin" />
              <span>Verifying Stripe Session</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Confirming Payment...
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Please wait while we verify your transaction signatures with Stripe and update your rental lease status.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  /* Error State */
  if (error) {
    return (
      <Card className="shadow-2xl border-rose-100 rounded-3xl text-center max-w-lg mx-auto bg-white p-8 overflow-hidden">
        <CardContent className="space-y-6 pt-4">
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-3xl bg-rose-50 text-rose-600 shadow-inner">
            <XCircle className="h-10 w-10 text-rose-600" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-extrabold uppercase tracking-wider border border-rose-200">
              <span>Verification Alert</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Payment Confirmation Issue
            </h2>
            <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100 font-medium">
              {error}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 text-left space-y-1.5">
            <p className="font-bold text-amber-950">Suggested Actions:</p>
            <ul className="list-disc list-inside space-y-1 text-amber-800">
              {sessionId ? <li className="truncate">Session ID: {sessionId}</li> : null}
              <li>Check your email inbox for a Stripe receipt</li>
              <li>Refresh this page or view your Tenant Dashboard</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/dashboard/tenant" className="w-full">
              <Button variant="primary" className="w-full py-3.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-2xl">
                Go to Tenant Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  /* Success State */
  return (
    <Card className="shadow-2xl border-emerald-100 rounded-3xl text-center max-w-lg mx-auto bg-white overflow-hidden">
      {/* Top Banner Accent */}
      <div className="h-3 w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-emerald-600" />

      <CardHeader className="pt-8 pb-4 space-y-4 px-8">
        <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-100">
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold uppercase tracking-wider border border-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Transaction Verified</span>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Payment Successful! 🎉
          </CardTitle>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            Your rental booking payment has been verified. Your lease status is now active.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pb-10 px-8">
        {/* Total Amount Display */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-md space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
            Total Amount Paid
          </span>
          <div className="text-3xl font-black text-emerald-400">
            ${amount} <span className="text-xs font-normal text-slate-300">USD</span>
          </div>
        </div>

        {/* Digital Receipt Spec Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2.5 text-left">
          {sessionId && (
            <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 font-semibold">Stripe Session:</span>
              <span className="font-mono text-[11px] text-slate-800 truncate max-w-[200px]" title={sessionId}>
                {sessionId}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-semibold">Payment Status:</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 text-[11px]">
              <CheckCircle2 className="h-3 w-3" /> COMPLETED
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-semibold">Lease Status:</span>
            <span className="inline-flex items-center gap-1 text-blue-600 font-extrabold bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200 text-[11px]">
              <Building2 className="h-3 w-3" /> ACTIVE LEASE
            </span>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Verified Stripe 256-Bit Encrypted Receipt</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/dashboard/tenant" className="w-full">
            <Button
              variant="primary"
              className="w-full py-3.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl gap-2 shadow-lg shadow-emerald-500/20"
            >
              <span>Go to Tenant Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/properties" className="w-full">
            <Button
              variant="outline"
              className="w-full py-3.5 text-xs font-bold border-slate-200 rounded-2xl"
            >
              <span>Browse Properties</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-900 font-sans">
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
