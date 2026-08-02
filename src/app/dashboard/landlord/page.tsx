"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  DollarSign,
  Clock,
  Plus,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  CreditCard,
} from "@/components/ui/icons";

interface IncomingRequest {
  id: string;
  tenantName: string;
  tenantEmail: string;
  propertyTitle: string;
  price: number;
  requestDate: string;
  status:
    | "PENDING"
    | "APPROVED"
    | "PAYMENT_SUBMITTED"
    | "REJECTED"
    | "ACTIVE"
    | "COMPLETED";
}

export default function LandlordDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [filterTab, setFilterTab] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto redirect Tenants to Tenant Dashboard
  useEffect(() => {
    if (user && user.role === "TENANT") {
      router.push("/dashboard/tenant");
    }
  }, [user, router]);

  useEffect(() => {
    // Read locally submitted tenant requests
    let localTenantRequests: any[] = [];
    try {
      const raw = JSON.parse(
        localStorage.getItem("rentnest_submitted_requests") || "[]",
      );
      if (Array.isArray(raw)) {
        // Sanitize browser localStorage to purge all legacy mock/demo items
        localTenantRequests = raw.filter(
          (r: any) => r && r.id && String(r.id).startsWith("req-user-"),
        );
        localStorage.setItem(
          "rentnest_submitted_requests",
          JSON.stringify(localTenantRequests),
        );
      }
    } catch (err) {}

    const formattedLocal: IncomingRequest[] = localTenantRequests.map(
      (r: any) => ({
        id: r.id,
        tenantName: r.tenantName || "Applicant Tenant",
        tenantEmail: r.tenantEmail || "",
        propertyTitle: r.property?.title || "Rental Property",
        price: Number(r.property?.rentPrice || 0),
        requestDate: r.rentalStartDate || "",
        status: r.status || "PENDING",
      }),
    );

    fetchApi("/landlord/properties/requests")
      .then((res) => {
        let apiData: IncomingRequest[] = [];
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          apiData = res.data.map((r: any) => ({
            id: r.id,
            tenantName: r.tenant?.name || "Applicant",
            tenantEmail: r.tenant?.email || "",
            propertyTitle: r.property?.title || "Property",
            price: r.property?.rentPrice || 0,
            requestDate: r.rentalStartDate || "",
            status: r.status,
          }));
        }

        const combined = [...formattedLocal];
        apiData.forEach((item) => {
          if (!combined.some((c) => c.id === item.id)) {
            combined.push(item);
          }
        });

        setRequests(combined);
      })
      .catch(() => {
        setRequests([...formattedLocal]);
      });
  }, []);

  const handleUpdateStatus = async (
    id: string,
    newStatus: "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED",
  ) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    );

    // Update in localStorage so Tenant Dashboard immediately syncs!
    try {
      const localSaved = JSON.parse(
        localStorage.getItem("rentnest_submitted_requests") || "[]",
      );
      const updatedLocal = localSaved.map((r: any) =>
        r.id === id ? { ...r, status: newStatus } : r,
      );
      localStorage.setItem(
        "rentnest_submitted_requests",
        JSON.stringify(updatedLocal),
      );
    } catch (err) {}

    const messageText =
      newStatus === "APPROVED"
        ? "Application approved! Tenant can now pay."
        : newStatus === "ACTIVE"
          ? "Payment confirmed! Lease is now ACTIVE."
          : newStatus === "COMPLETED"
            ? "Lease completed successfully."
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
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const totalEarnings = requests
    .filter(
      (r) =>
        r.status === "ACTIVE" ||
        r.status === "COMPLETED" ||
        r.status === "PAYMENT_SUBMITTED",
    )
    .reduce((sum, r) => sum + (Number(r.price) || 0), 0);
  const totalProperties = new Set(
    requests.map((r) => r.propertyTitle).filter(Boolean),
  ).size;
  const pendingRequests = requests.filter(
    (r) => r.status === "PENDING" || r.status === "PAYMENT_SUBMITTED",
  ).length;

  const filteredRequests = requests.filter((r) => {
    if (filterTab === "PENDING") return r.status === "PENDING";
    if (filterTab === "APPROVED") return r.status === "APPROVED";
    if (filterTab === "PAYMENT_SUBMITTED")
      return r.status === "PAYMENT_SUBMITTED";
    if (filterTab === "ACTIVE") return r.status === "ACTIVE";
    return true;
  });

  return (
    <DashboardLayout title="Landlord Overview">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 font-bold" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Sleek Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-blue-200 border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-blue-300" />
              <span>Landlord Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.name ? user.name.split(" ")[0] : "Landlord"}
            </h2>
            <p className="text-sm text-blue-100/90 leading-relaxed font-normal">
              Manage your listed rental properties, evaluate incoming tenant
              applications, and confirm payments.
            </p>
          </div>

          <Link href="/dashboard/landlord/properties/new">
            <Button
              variant="primary"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 shadow-lg shadow-emerald-900/30 gap-2 shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Add Property Listing</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Modern Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Stat 1: Total Earnings */}
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white p-6 border border-emerald-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-full border border-emerald-200/50">
              Total Earnings (Est.)
            </span>
            <div className="h-11 w-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">
              ${totalEarnings.toLocaleString()}
            </h3>
          </div>
          <div className="mt-3 pt-3 border-t border-emerald-100/80 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Verified Revenue</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-600">
              Active
            </span>
          </div>
        </div>

        {/* Stat 2: Listed Properties */}
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-white p-6 border border-blue-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-2.5 py-1 rounded-full border border-blue-200/50">
              My Listed Properties
            </span>
            <div className="h-11 w-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">
              {totalProperties}
            </h3>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-100/80 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span>Active Marketplace</span>
            </span>
            <span className="text-[11px] font-semibold text-blue-600">
              Live
            </span>
          </div>
        </div>

        {/* Stat 3: Pending Approvals */}
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white p-6 border border-amber-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-full border border-amber-200/50">
              Action Items Needed
            </span>
            <div className="h-11 w-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-110 transition-transform">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">
              {pendingRequests}
            </h3>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-100/80 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <Clock className="h-4 w-4 text-amber-600" />
              <span>Pending Action</span>
            </span>
            <span className="text-[11px] font-semibold text-amber-600">
              In Review
            </span>
          </div>
        </div>
      </div>

      {/* Incoming Requests Table Section */}
      <Card className="shadow-md border-slate-200/80 overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <CardTitle className="text-xl">
              Incoming Rental Applications & Payments
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              Approve tenant applications and confirm payment receipts to
              activate leases.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(["ALL", "PENDING", "APPROVED", "ACTIVE", "COMPLETED"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterTab === tab
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab === "ALL" ? "All Requests" : tab}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No Rental Applications Received
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                There are currently no incoming rental applications matching
                your status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">Applicant Tenant</th>
                    <th className="py-4 px-6">Property Title</th>
                    <th className="py-4 px-6">Monthly Price</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">
                      Landlord Action CTA
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Applicant Info */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">
                          {req.tenantName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {req.tenantEmail}
                        </div>
                      </td>

                      {/* Property Title */}
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {req.propertyTitle}
                      </td>

                      {/* Rent Price */}
                      <td className="py-4 px-6 font-black text-slate-900 text-base">
                        ${req.price.toLocaleString()}
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
                          // <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                          //   <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          //   <span>Lease Active</span>
                          // </span>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() =>
                              handleUpdateStatus(req.id, "COMPLETED")
                            }
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-1.5 shadow-md"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Mark as Completed ✅</span>
                          </Button>
                          ) : req.status === "COMPLETED" ? (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold">
    <CheckCircle2 className="h-3.5 w-3.5 text-slate-600" />
    <span>Lease Completed </span>
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
