"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProfileDropdown } from "./ProfileDropdown";
import { useAuth } from "@/context/AuthContext";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Rent<span className="text-blue-600">Nest</span>
            </span>
          </div>
        </Link>

        {/* Dynamic Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
          >
            Home
          </Link>

          <Link
            href="/properties"
            className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
          >
            Explore Listings
          </Link>

          {user?.role === "TENANT" && (
            <Link
              href="/dashboard/tenant"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              My Rentals
            </Link>
          )}

          {user?.role === "LANDLORD" && (
            <>
              <Link
                href="/dashboard/landlord"
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/landlord/properties/new"
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
              >
                List Property
              </Link>
            </>
          )}

          {user?.role === "ADMIN" && (
            <Link
              href="/dashboard/admin"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Right Action & Profile Avatar Dropdown */}
        <div className="flex items-center gap-4">
          <ProfileDropdown />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Dynamic Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
          >
            Home
          </Link>
          <Link
            href="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
          >
            Explore Listings
          </Link>

          {user?.role === "TENANT" && (
            <Link
              href="/dashboard/tenant"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
            >
              My Rentals
            </Link>
          )}

          {user?.role === "LANDLORD" && (
            <>
              <Link
                href="/dashboard/landlord"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Landlord Dashboard
              </Link>
              <Link
                href="/dashboard/landlord/properties/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                List Property
              </Link>
            </>
          )}

          {user?.role === "ADMIN" && (
            <Link
              href="/dashboard/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
            >
              Admin Panel
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
