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
  Users,
  CheckCircle2,
  XCircle,
  Sparkles,
  Search,
  Calendar,
  ShieldCheck,
} from "@/components/ui/icons";

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  status: "ACTIVE" | "BANNED";
  createdAt?: string;
}

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
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

  const handleToggleBan = async (userId: string, currentStatus: "ACTIVE" | "BANNED") => {
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
    <DashboardLayout title="User Management">
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
            <span>User Administration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Platform User Management
          </h2>
          <p className="text-sm text-blue-100/90 leading-relaxed font-normal">
            Inspect all registered Tenant and Landlord accounts, verify security credentials, and enforce ban policies.
          </p>
        </div>
      </div>

      {/* User Management Card */}
      <Card className="shadow-md border-slate-200/80 overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-xl">Registered Accounts List</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Filter by tenant or landlord roles, search accounts, and manage moderation status.
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
                      {/* User Info */}
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
                          <span>{u.createdAt ? u.createdAt.substring(0, 10) : "N/A"}</span>
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
                            onClick={() => handleToggleBan(u.id, u.status)}
                            className="bg-rose-600 hover:bg-rose-700 font-bold gap-1 shadow-sm"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Ban User</span>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleToggleBan(u.id, u.status)}
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
