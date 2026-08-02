"use client";

import React, { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Calendar,
  MapPin,
  Search,
  MessageSquare,
  FileText,
  CreditCard,
  DollarSign,
} from "@/components/ui/icons";

interface RentalRequestItem {
  id: string;
  status:
    | "PENDING"
    | "APPROVED"
    | "PAYMENT_SUBMITTED"
    | "REJECTED"
    | "ACTIVE"
    | "COMPLETED";
  rentalStartDate?: string;
  rentalEndDate?: string;
  message?: string;
  property?: {
    id: string;
    title: string;
    rentPrice: number;
    city?: string;
  };
  tenant?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export default function LandlordRequestsPage() {
  const [requests, setRequests] = useState<RentalRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchApi("/landlord/properties/requests")
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setRequests(res.data);
        } else {
          setRequests([]);
        }
      })
      .catch(() => {
        setRequests([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleUpdateStatus = async (
    id: string,
    newStatus: "APPROVED" | "REJECTED" | "ACTIVE",
  ) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    );

    const messageText =
      newStatus === "APPROVED"
        ? "Application approved! Tenant can now pay."
        : newStatus === "ACTIVE"
          ? "Payment confirmed! Lease is now ACTIVE."
          : "Application rejected.";

    setToastMessage(messageText);

    try {
      await fetchApi(`/landlord/properties/requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.warn("Status updated locally", err);
    } finally {
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const pendingCount = requests.filter(
    (r) => r.status === "PENDING" || r.status === "PAYMENT_SUBMITTED",
  ).length;

  const filteredRequests = requests.filter((r) => {
    const matchesTab =
      filterTab === "ALL"
        ? true
        : filterTab === "PENDING"
          ? r.status === "PENDING"
          : filterTab === "APPROVED"
            ? r.status === "APPROVED"
            : filterTab === "PAYMENT_SUBMITTED"
              ? r.status === "PAYMENT_SUBMITTED"
              : r.status === "ACTIVE";

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (r.tenant?.name && r.tenant.name.toLowerCase().includes(searchLower)) ||
      (r.tenant?.email && r.tenant.email.toLowerCase().includes(searchLower)) ||
      (r.property?.title &&
        r.property.title.toLowerCase().includes(searchLower));

    return matchesTab && matchesSearch;
  });

  return (
    <DashboardLayout title="Rental Applications">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 font-bold" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-blue-200 border border-white/10">
            <Sparkles className="h-3.5 w-3.5 text-blue-300" />
            <span>Applicant Moderation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Incoming Rental Applications & Payments
          </h2>
          <p className="text-sm text-blue-100/90 leading-relaxed font-normal">
            Evaluate prospective tenant applications, view move-in dates &
            introduction notes, and confirm payments.
          </p>

          {pendingCount > 0 && (
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-bold">
                <Clock className="h-3.5 w-3.5 text-amber-300" />
                <span>
                  {pendingCount} Pending Applications & Payments Awaiting Action
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Applications Table Card */}
      <Card className="shadow-md border-slate-200/80 overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-xl">
                Tenant Applications List
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Review applicant profiles, move-in timelines, and confirm lease
                activation.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tenant or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
              {(["ALL", "PENDING", "APPROVED", "ACTIVE"] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      filterTab === tab
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab === "ALL" ? "All" : tab}
                  </button>
                ),
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No Rental Applications Found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No tenant applications match your current search query or filter
                criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">Applicant Tenant</th>
                    <th className="py-4 px-6">Target Property</th>
                    <th className="py-4 px-6">Requested Dates</th>
                    <th className="py-4 px-6">Monthly Rent</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Tenant Info */}
                      <td className="py-4 px-6 max-w-xs">
                        <div className="flex items-start gap-3">
                          <Avatar
                            name={req.tenant?.name || "Applicant"}
                            size="md"
                          />
                          <div>
                            <div className="font-bold text-slate-900">
                              {req.tenant?.name || "Applicant"}
                            </div>
                            <div className="text-xs text-slate-500">
                              {req.tenant?.email}
                            </div>
                            {req.tenant?.phone && (
                              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                {req.tenant.phone}
                              </div>
                            )}

                            {/* Message Note */}
                            {req.message && (
                              <div className="mt-2 text-xs text-slate-600 bg-slate-100/90 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed relative">
                                <MessageSquare className="h-3 w-3 text-slate-400 inline mr-1" />
                                <span>&quot;{req.message}&quot;</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Target Property */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">
                          {req.property?.title || "Property"}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span>{req.property?.city || "N/A"}</span>
                        </div>
                      </td>

                      {/* Requested Dates */}
                      <td className="py-4 px-6 text-xs text-slate-600">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 font-mono text-[11px]">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>
                            {req.rentalStartDate || "N/A"} to{" "}
                            {req.rentalEndDate || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Rent Price */}
                      <td className="py-4 px-6 font-black text-slate-900 text-base">
                        ${Number(req.property?.rentPrice || 0).toLocaleString()}
                        <span className="text-xs font-normal text-slate-400">
                          /mo
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6">
                        <Badge status={req.status} />
                      </td>

                      {/* Step-by-Step Action Controls */}
                      <td className="py-4 px-6 text-right">
                        {req.status === "PENDING" ? (
                          /* Step 4: Landlord Approves Application */
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() =>
                                handleUpdateStatus(req.id, "APPROVED")
                              }
                              className="bg-emerald-600 hover:bg-emerald-700 font-bold gap-1 shadow-sm text-white"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Approve Application</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() =>
                                handleUpdateStatus(req.id, "REJECTED")
                              }
                              className="bg-rose-600 hover:bg-rose-700 font-bold gap-1 shadow-sm text-white"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Reject</span>
                            </Button>
                          </div>
                        ) : req.status === "APPROVED" ? (
                          /* Step 5: Approved -> Waiting for Tenant to Pay */
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                            <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                            <span>Awaiting Tenant Payment 💳</span>
                          </span>
                        ) : req.status === "PAYMENT_SUBMITTED" ? (
                          /* Step 6: Tenant Paid -> Landlord Confirms Payment Received! */
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleUpdateStatus(req.id, "ACTIVE")}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-bold gap-1.5 text-white shadow-md shadow-emerald-500/20 animate-bounce"
                          >
                            <DollarSign className="h-3.5 w-3.5" />
                            <span>Confirm Payment Received 💰</span>
                          </Button>
                        ) : req.status === "ACTIVE" ? (
                          /* Step 7: Lease is ACTIVE! */
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Lease Active 🟢</span>
                          </span>
                        ) : (
                          <span className="text-xs text-rose-500 italic">
                            Rejected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
