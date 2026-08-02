"use client";

import React, { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShieldCheck,
  Building2,
  FileText,
  Sparkles,
  MapPin,
} from "@/components/ui/icons";

export default function AdminModerationPage() {
  const [activeTab, setActiveTab] = useState<"PROPERTIES" | "RENTALS">("PROPERTIES");
  const [properties, setProperties] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (activeTab === "PROPERTIES") {
      fetchApi("/admin/properties")
        .then((res) => {
          if (res.data && Array.isArray(res.data)) setProperties(res.data);
          else setProperties([]);
        })
        .catch(() => setProperties([]))
        .finally(() => setIsLoading(false));
    } else {
      fetchApi("/admin/rentals")
        .then((res) => {
          if (res.data && Array.isArray(res.data)) setRentals(res.data);
          else setRentals([]);
        })
        .catch(() => setRentals([]))
        .finally(() => setIsLoading(false));
    }
  }, [activeTab]);

  return (
    <DashboardLayout title="Content Moderation">
      <div className="space-y-6">
        {/* Sleek Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
          <div className="relative z-10 space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-blue-200 border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-blue-300" />
              <span>Platform Audit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Content Moderation Portal
            </h2>
            <p className="text-sm text-blue-100/90 leading-relaxed font-normal">
              Inspect global marketplace listings, verified landlord properties, and submitted rental applications.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab("PROPERTIES")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "PROPERTIES"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>All Listed Properties</span>
          </button>
          <button
            onClick={() => setActiveTab("RENTALS")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "RENTALS"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>All Rental Requests</span>
          </button>
        </div>

        {/* Properties View */}
        {activeTab === "PROPERTIES" ? (
          <Card className="shadow-md border-slate-200/80 overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-xl">Platform Listings Overview</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit active properties submitted by landlords across all cities.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 space-y-3">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ) : properties.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">No Properties Listed Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Landlords have not submitted any property listings to the marketplace.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-4 px-6">Property Title</th>
                        <th className="py-4 px-6">Landlord Owner</th>
                        <th className="py-4 px-6">Location</th>
                        <th className="py-4 px-6">Monthly Rent</th>
                        <th className="py-4 px-6">Listing Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {properties.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900">{p.title}</td>
                          <td className="py-4 px-6 text-slate-700">{p.landlord?.name || "Landlord"}</td>
                          <td className="py-4 px-6 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-slate-400" />
                              <span>{p.city || p.address || "N/A"}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-black text-slate-900 text-base">
                            ${Number(p.rentPrice).toLocaleString()}
                            <span className="text-xs font-normal text-slate-400">/mo</span>
                          </td>
                          <td className="py-4 px-6">
                            <Badge status={p.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-md border-slate-200/80 overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-xl">Platform Rental Requests</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit submitted tenant application requests across all listings.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 space-y-3">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ) : rentals.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">No Rental Requests Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    No rental request applications have been submitted by tenants.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-4 px-6">Applicant Tenant</th>
                        <th className="py-4 px-6">Target Property</th>
                        <th className="py-4 px-6">Request Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {rentals.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900">{r.tenant?.name || "Tenant"}</td>
                          <td className="py-4 px-6 text-slate-700">{r.property?.title || "Property"}</td>
                          <td className="py-4 px-6">
                            <Badge status={r.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
