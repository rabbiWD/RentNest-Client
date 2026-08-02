"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Home,
  Building2,
  Plus,
  FileText,
  Users,
  ShieldCheck,
  Search,
  ArrowLeft,
  Sparkles,
} from "@/components/ui/icons";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const DashboardSidebar: React.FC<{
  isOpen?: boolean;
  onClose?: () => void;
}> = ({ onClose }) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const role = user?.role || "TENANT";

  const getMenuItems = (currentRole: UserRole): SidebarItem[] => {
    switch (currentRole) {
      case "ADMIN":
        return [
          {
            label: "Admin Overview",
            href: "/dashboard/admin",
            icon: <Home className="h-4 w-4" />,
          },
          {
            label: "User Management",
            href: "/dashboard/admin/users",
            icon: <Users className="h-4 w-4" />,
          },
          {
            label: "Content Moderation",
            href: "/dashboard/admin/moderation",
            icon: <ShieldCheck className="h-4 w-4" />,
          },
          {
            label: "Explore Listings",
            href: "/properties",
            icon: <Search className="h-4 w-4" />,
          },
        ];

      case "LANDLORD":
        return [
          {
            label: "Landlord Overview",
            href: "/dashboard/landlord",
            icon: <Home className="h-4 w-4" />,
          },
          {
            label: "Add New Property",
            href: "/dashboard/landlord/properties/new",
            icon: <Plus className="h-4 w-4" />,
          },
          {
            label: "Incoming Requests",
            href: "/dashboard/landlord/properties/requests",
            icon: <FileText className="h-4 w-4" />,
          },
          {
            label: "Explore Listings",
            href: "/properties",
            icon: <Search className="h-4 w-4" />,
          },
        ];

      case "TENANT":
      default:
        return [
          {
            label: "Dashboard Overview",
            href: "/dashboard/tenant",
            icon: <Home className="h-4 w-4" />,
          },
          {
            label: "Explore Properties",
            href: "/properties",
            icon: <Search className="h-4 w-4" />,
          },
        ];
    }
  };

  const menuItems = getMenuItems(role);

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 font-sans select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-2.5 px-2 py-1 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Rent<span className="text-blue-600">Nest</span>
            </span>
          </div>
        </Link>

        {/* Role Identity Card */}
        <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block leading-none">
                Active Portal
              </span>
              <span className="text-xs font-bold text-slate-900 capitalize">
                {role.toLowerCase()}
              </span>
            </div>
          </div>
          <Badge status={role} />
        </div>

        {/* Sidebar Menu Items */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Navigation Menu
          </span>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        {user && (
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <Avatar src={user.avatarUrl} name={user.name} size="sm" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 truncate">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-500 truncate">
                {user.email}
              </span>
            </div>
          </div>
        )}

        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Main Site</span>
        </Link>
      </div>
    </aside>
  );
};
