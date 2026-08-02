"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Building2,
  Home,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  Search,
  Calendar,
  ArrowRight,
  FileText,
} from "@/components/ui/icons";

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  status: "ACTIVE" | "BANNED";
  joinedDate?: string;
  createdAt?: string;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchApi("/admin/users")
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          setUsers([]);
        }
      })
      .catch(() => {
        setUsers([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const toggleUserBanStatus = async (userId: string, currentStatus: "ACTIVE" | "BANNED") => {
    const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";

    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    setToastMessage(`Account status updated to ${newStatus}`);

    try {
      await fetchApi(`/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.warn("User status updated locally", err);
    } finally {
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const totalLandlords = users.filter((u) => u.role === "LANDLORD").length;
  const totalTenants = users.filter((u) => u.role === "TENANT").length;
  const totalBanned = users.filter((u) => u.status === "BANNED").length;

  const filteredUsers = users.filter((u) => {
    const matchesTab =
      filterTab === "ALL"
        ? true
        : filterTab === "TENANT"
        ? u.role === "TENANT"
        : filterTab === "LANDLORD"
        ? u.role === "LANDLORD"
        : u.status === "BANNED";

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      u.name.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower) ||
      u.role.toLowerCase().includes(searchLower);

    return matchesTab && matchesSearch;
  });

  return (
    <DashboardLayout title="Admin Moderation Portal">
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
              <span>Platform Security</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Admin Moderation Portal
            </h2>
            <p className="text-sm text-blue-100/90 leading-relaxed font-normal">
              Manage platform user accounts, enforce access policies, and inspect rental property moderation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/dashboard/admin/moderation">
              <Button
                variant="primary"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 shadow-lg shadow-emerald-900/30 gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Content Moderation</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modern Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        {/* Stat 1: Total Users */}
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-white p-5 border border-blue-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-full border border-blue-200/50">
              Total Users
            </span>
            <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{users.length}</h3>
          </div>
          <div className="mt-2 pt-2 border-t border-blue-100/80 flex items-center justify-between text-[11px] text-blue-600 font-semibold">
            <span>Registered Accounts</span>
            <span>Platform</span>
          </div>
        </div>

        {/* Stat 2: Landlords */}
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white p-5 border border-emerald-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full border border-emerald-200/50">
              Landlords
            </span>
            <div className="h-10 w-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalLandlords}</h3>
          </div>
          <div className="mt-2 pt-2 border-t border-emerald-100/80 flex items-center justify-between text-[11px] text-emerald-600 font-semibold">
            <span>Property Owners</span>
            <span>Verified</span>
          </div>
        </div>

        {/* Stat 3: Tenants */}
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-white p-5 border border-indigo-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded-full border border-indigo-200/50">
              Tenants
            </span>
            <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/30 group-hover:scale-110 transition-transform">
              <Home className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalTenants}</h3>
          </div>
          <div className="mt-2 pt-2 border-t border-indigo-100/80 flex items-center justify-between text-[11px] text-indigo-600 font-semibold">
            <span>Active Renters</span>
            <span>Verified</span>
          </div>
        </div>

        {/* Stat 4: Banned Accounts */}
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-white p-5 border border-rose-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded-full border border-rose-200/50">
              Banned Accounts
            </span>
            <div className="h-10 w-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/30 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-black text-rose-600 tracking-tight">{totalBanned}</h3>
          </div>
          <div className="mt-2 pt-2 border-t border-rose-100/80 flex items-center justify-between text-[11px] text-rose-600 font-semibold">
            <span>Access Blocked</span>
            <span>Restricted</span>
          </div>
        </div>
      </div>

      {/* User Management Table Section */}
      <Card className="shadow-md border-slate-200/80 overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-xl">User Account Management</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect registered user accounts, role permissions, and enforce ban/unban moderation policies.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
              {(["ALL", "TENANT", "LANDLORD", "BANNED"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    filterTab === tab
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab === "ALL" ? "All Users" : tab}
                </button>
              ))}
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
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No User Accounts Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No platform users match your search query or role filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">User Account</th>
                    <th className="py-4 px-6">System Role</th>
                    <th className="py-4 px-6">Joined Date</th>
                    <th className="py-4 px-6">Account Status</th>
                    <th className="py-4 px-6 text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* User Account */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} size="md" />
                          <div>
                            <div className="font-bold text-slate-900">{u.name}</div>
                            <div className="text-xs text-slate-500">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* System Role */}
                      <td className="py-4 px-6">
                        <Badge status={u.role} />
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-6 text-xs text-slate-600">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono text-[11px]">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>
                            {u.createdAt
                              ? u.createdAt.substring(0, 10)
                              : u.joinedDate || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6">
                        <Badge status={u.status} />
                      </td>

                      {/* Action Controls */}
                      <td className="py-4 px-6 text-right">
                        {u.role === "ADMIN" ? (
                          <span className="text-xs text-slate-400 italic">Protected System Role</span>
                        ) : u.status === "ACTIVE" ? (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => toggleUserBanStatus(u.id, u.status)}
                            className="bg-rose-600 hover:bg-rose-700 font-bold gap-1 shadow-sm"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Ban User</span>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => toggleUserBanStatus(u.id, u.status)}
                            className="bg-emerald-600 hover:bg-emerald-700 font-bold gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Unban User</span>
                          </Button>
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
