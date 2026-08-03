"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const { register, login } = useAuth();

  const [role, setRole] = useState<UserRole>("TENANT");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    profilePhoto: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    setApiError(null);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role,
        phone: formData.phone.trim(),
        profilePhoto: formData.profilePhoto.trim() || undefined,
      });

      setSuccessMessage("Account created successfully! Logging you in...");

      // Auto login user after successful registration
      try {
        const loggedUser = await login(formData.email.trim(), formData.password);
        const dashboard =
          loggedUser.role === "ADMIN"
            ? "/dashboard/admin"
            : loggedUser.role === "LANDLORD"
            ? "/dashboard/landlord"
            : "/dashboard/tenant";

        setTimeout(() => router.push(dashboard), 1200);
      } catch (loginErr) {
        setTimeout(() => router.push("/auth/login?registered=true"), 1500);
      }
    } catch (err: any) {
      setApiError(err.message || "Registration failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Create your <span className="text-blue-600">RentNest</span> Account
            </h1>
            <p className="text-sm text-slate-600">
              Join thousands of tenants, landlords, and property managers today.
            </p>
          </div>

          <Card className="shadow-xl border-slate-200/80">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Select Your Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Role Selection Cards */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("TENANT")}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    role === "TENANT"
                      ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="text-xl mb-1">🔑</div>
                  <div className="font-bold text-xs text-slate-900">Tenant</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">Browse & Rent</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("LANDLORD")}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    role === "LANDLORD"
                      ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="text-xl mb-1">🏢</div>
                  <div className="font-bold text-xs text-slate-900">Landlord</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">List & Manage</div>
                </button>

                {/* <button
                  type="button"
                  onClick={() => setRole("ADMIN")}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    role === "ADMIN"
                      ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="text-xl mb-1">🛡️</div>
                  <div className="font-bold text-xs text-slate-900">Admin</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">Moderator</div>
                </button> */}
              </div>

              {/* Status Alert */}
              {apiError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{apiError}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <span>✅</span>
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    required
                  />
                </div>

                <Input
                  label="Profile Photo URL (Optional)"
                  type="url"
                  name="profilePhoto"
                  placeholder="https://example.com/my-photo.jpg"
                  value={formData.profilePhoto}
                  onChange={handleChange}
                  helperText="Provide an image URL for your profile avatar."
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3 text-base font-bold shadow-lg shadow-blue-500/25 mt-2"
                  isLoading={isLoading}
                >
                  Create Account as {role}
                </Button>
              </form>

              <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
                Already have a RentNest account?{" "}
                <Link href="/auth/login" className="font-bold text-blue-600 hover:underline">
                  Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
