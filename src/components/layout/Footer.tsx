import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Rent<span className="text-blue-500">Nest</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Find & List Rental Properties with Ease. Connecting verified
              landlords and tenants with seamless booking and secure payments.
            </p>
          </div>

          {/* Tenants Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Tenants
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/properties"
                  className="hover:text-white transition-colors"
                >
                  Browse Rentals
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/tenant"
                  className="hover:text-white transition-colors"
                >
                  Rental Requests
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/tenant"
                  className="hover:text-white transition-colors"
                >
                  Payment History
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="hover:text-white transition-colors"
                >
                  Submit Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Landlords Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Landlords
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dashboard/landlord"
                  className="hover:text-white transition-colors"
                >
                  Landlord Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/landlord/properties/new"
                  className="hover:text-white transition-colors"
                >
                  Add New Property
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/landlord/properties/requests"
                  className="hover:text-white transition-colors"
                >
                  Manage Requests
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/landlord"
                  className="hover:text-white transition-colors"
                >
                  Earnings Overview
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dashboard/admin"
                  className="hover:text-white transition-colors"
                >
                  Admin Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="hover:text-white transition-colors"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Terms & Privacy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center md:flex md:items-center md:justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RentNest Inc. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex justify-center space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-slate-400 cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:text-slate-400 cursor-pointer">Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
