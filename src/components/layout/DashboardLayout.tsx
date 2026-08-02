"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { useAuth } from "@/context/AuthContext";

export const DashboardLayout: React.FC<{ children: React.ReactNode; title?: string }> = ({
  children,
  title,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Role Access Control Checks
    if (user) {
      if (pathname.startsWith("/dashboard/admin") && user.role !== "ADMIN") {
        const fallback = user.role === "LANDLORD" ? "/dashboard/landlord" : "/dashboard/tenant";
        router.push(fallback);
      } else if (pathname.startsWith("/dashboard/landlord") && user.role === "TENANT") {
        router.push("/dashboard/tenant");
      }
    }
  }, [user, isAuthenticated, isLoading, pathname, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block sticky top-0 h-screen">
          <DashboardSidebar />
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative z-10 w-64 max-w-full bg-white shadow-xl animate-in slide-in-from-left">
              <DashboardSidebar onClose={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Body */}
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader
            title={title}
            onMobileSidebarToggle={() => setMobileSidebarOpen(true)}
          />
          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
