"use client";

import React from "react";
import Link from "next/link";
import { ProfileDropdown } from "./ProfileDropdown";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

export interface DashboardHeaderProps {
  title?: string;
  onMobileSidebarToggle?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = "Dashboard Overview",
  onMobileSidebarToggle,
}) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xs px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile sidebar toggle + Page Title */}
        <div className="flex items-center gap-3">
          {onMobileSidebarToggle && (
            <button
              onClick={onMobileSidebarToggle}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Logo preview in mobile */}
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
              RN
            </div>
          </Link>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
              {title}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Welcome back, <span className="font-semibold text-slate-700">{user?.name || "User"}</span>
            </p>
          </div>
        </div>

        {/* Right: Role indicator badge, Quick Actions & Profile Dropdown */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Badge status={user?.role || "TENANT"} />
          </div>

          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};
