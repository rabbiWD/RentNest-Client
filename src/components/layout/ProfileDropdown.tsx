"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const ProfileDropdown: React.FC = () => {
  const { user, isAuthenticated, logout, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-xl transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/auth/register"
          className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-sm transition-all"
        >
          Register
        </Link>
      </div>
    );
  }

  const getDashboardPath = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "/dashboard/admin";
      case "LANDLORD":
        return "/dashboard/landlord";
      case "TENANT":
      default:
        return "/dashboard/tenant";
    }
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    setIsOpen(false);
    window.location.href = getDashboardPath(newRole);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <Avatar src={user.avatarUrl} name={user.name} size="md" />
        <span className="hidden md:inline-block text-sm font-semibold text-slate-800">
          {user.name.split(" ")[0]}
        </span>
        <svg
          className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white p-3 shadow-xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User Info Header */}
          <div className="flex items-center gap-3 p-2.5 border-b border-slate-100 pb-3">
            <Avatar src={user.avatarUrl} name={user.name} size="lg" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-900 truncate">{user.name}</span>
              <span className="text-xs text-slate-500 truncate">{user.email}</span>
              <div className="mt-1.5">
                <Badge status={user.role} />
              </div>
            </div>
          </div>

          {/* Quick Role Switcher */}
          <div className="py-2.5 border-b border-slate-100 space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-2">
              Switch Role Portal
            </span>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => handleRoleSwitch("TENANT")}
                className={`py-1 text-[11px] font-bold rounded-lg transition-all ${
                  user.role === "TENANT"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tenant
              </button>
              <button
                onClick={() => handleRoleSwitch("LANDLORD")}
                className={`py-1 text-[11px] font-bold rounded-lg transition-all ${
                  user.role === "LANDLORD"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Landlord
              </button>
              <button
                onClick={() => handleRoleSwitch("ADMIN")}
                className={`py-1 text-[11px] font-bold rounded-lg transition-all ${
                  user.role === "ADMIN"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1 py-1">
            <Link
              href={getDashboardPath(user.role)}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>{user.role} Dashboard</span>
            </Link>

            <Link
              href="/properties"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Browse Properties</span>
            </Link>
          </div>

          {/* Logout Divider & Button */}
          <div className="pt-2 border-t border-slate-100 mt-1">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <svg className="h-4 w-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
