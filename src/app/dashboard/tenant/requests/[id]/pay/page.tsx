'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  XCircle,
  ArrowLeft,
  CreditCard,
  Lock,
  ShieldCheck,
  Sparkles,
} from '@/components/ui/icons';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';

export default function StripeCheckoutRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [isRedirecting, setIsRedirecting] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initiateStripeCheckoutSession = async () => {
      try {
        const res = await fetchApi('/payments/create-checkout-session', {
          method: 'POST',
          body: JSON.stringify({
            rentalRequestId: id,
            paymentProvider: 'STRIPE',
          }),
        });

        if (!isMounted) return;

        // backend Response চেক করুন (আপনার API response format অনুযায়ী res.checkoutUrl ও হতে পারে)
        const checkoutResponse = res as {
          data?: { checkoutUrl?: string };
          checkoutUrl?: string;
          url?: string;
        };
        const stripeUrl =
          checkoutResponse.data?.checkoutUrl ||
          checkoutResponse.checkoutUrl ||
          checkoutResponse.url;

        if (stripeUrl) {
          setCheckoutUrl(stripeUrl);
          // সরাসরি আসল Stripe Checkout এ রিডাইরেক্ট করা হচ্ছে
          window.location.href = stripeUrl;
        } else {
          setErrorMessage('Stripe URL পাওয়া যায়নি। ব্যাকএন্ড চেক করুন।');
        }
      } catch (err: any) {
        if (!isMounted) return;
        setErrorMessage(
          err?.message || 'Stripe session তৈরি করতে সমস্যা হয়েছে।'
        );
      } finally {
        if (isMounted) setIsRedirecting(false);
      }
    };

    initiateStripeCheckoutSession();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <DashboardLayout title="Redirecting to Stripe Checkout">
      <div className="max-w-xl mx-auto py-12 space-y-6 text-center">
        <Link
          href="/dashboard/tenant"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Tenant Dashboard</span>
        </Link>

        <Card className="shadow-2xl border-indigo-100 rounded-3xl overflow-hidden bg-white p-8">
          <CardContent className="space-y-6 pt-4">
            {errorMessage ? (
              /* Error State */
              <div className="space-y-4">
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                  <XCircle className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Payment Initialization Failed
                </h2>
                <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">
                  {errorMessage}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full py-3 text-sm font-bold bg-slate-900 text-white rounded-xl"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              /* Loading & Redirect State */
              <>
                <div className="relative mx-auto h-20 w-20 flex items-center justify-center rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 animate-pulse">
                  <CreditCard className="h-10 w-10 text-white" />
                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                    <Lock className="h-3 w-3 text-slate-900" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold uppercase tracking-wider border border-indigo-200">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Stripe Checkout Gateway</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Connecting to Stripe Checkout...
                  </h2>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Redirecting to secure Stripe payment gateway. Please wait...
                  </p>
                </div>

                {checkoutUrl && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 font-mono text-[11px] text-slate-600 truncate max-w-full">
                    🔗 {checkoutUrl}
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    variant="primary"
                    disabled={!checkoutUrl}
                    onClick={() => {
                      if (checkoutUrl) window.location.href = checkoutUrl;
                    }}
                    className="w-full py-3.5 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                  >
                    <span>Click here if not redirected automatically</span>
                    <Lock className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold pt-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>
                    Verified 256-Bit SSL Encrypted Stripe Session Link
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
