"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApi } from "@/lib/api";
import {
  Search,
  MapPin,
  Building2,
  ShieldCheck,
  CreditCard,
  Star,
  ArrowRight,
  Sparkles,
  Home as HomeIcon,
  CheckCircle2,
} from "@/components/ui/icons";

interface PropertyItem {
  id: string;
  title: string;
  location?: string;
  city?: string;
  address?: string;
  rentPrice: number;
  bedrooms?: number;
  bathrooms?: number;
  status: "AVAILABLE" | "RESERVED" | "RENTED" | "UNAVAILABLE";
  images?: string[];
}

export default function HomePage() {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("ALL");

  useEffect(() => {
    setIsLoading(true);
    fetchApi("/properties")
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setProperties(res.data);
        } else {
          setProperties([]);
        }
      })
      .catch(() => {
        setProperties([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProperties = properties.filter((p) => {
    const matchesCity = cityFilter === "ALL" || (p.city && p.city.toLowerCase() === cityFilter.toLowerCase());
    const matchesSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.city && p.city.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCity && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans select-none">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white py-20 lg:py-28">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span>Rental Property Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            Find & Rent Your Next Home <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">With Confidence</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Browse verified property listings, submit instant rental inquiries, and complete secure checkout payments.
          </p>

          {/* Quick Search Card Bar */}
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl p-3 sm:p-4 rounded-3xl border border-white/15 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search city, neighborhood, or property title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                />
              </div>

              <Link href={`/properties?search=${encodeURIComponent(searchTerm)}`} className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 font-bold px-8 py-3.5 shadow-lg shadow-blue-500/30 gap-2">
                  <span>Search Properties</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listed Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              <Building2 className="h-4 w-4" />
              <span>Available Marketplace</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Listed Properties
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore available homes, apartments, and villas directly listed by landlords.
            </p>
          </div>

          <Link href="/properties">
            <Button variant="outline" className="font-bold text-xs gap-1.5">
              <span>View All Listings ({properties.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Property Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <Skeleton key={n} className="h-80 w-full rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProperties.slice(0, 4).map((property) => (
              <Card
                key={property.id}
                className="group overflow-hidden rounded-3xl border border-slate-200/80 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative h-48 w-full bg-slate-200 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        property.images && property.images.length > 0 && property.images[0]
                          ? property.images[0]
                          : ""
                      }
                      alt={property.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge status={property.status} />
                    </div>
                  </div>

                  {/* Card Content */}
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                      <MapPin className="h-3.5 w-3.5 text-blue-600" />
                      <span>{property.city || "Location N/A"}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {property.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <span>{property.bedrooms || 2} Beds</span>
                      <span>•</span>
                      <span>{property.bathrooms || 2} Baths</span>
                    </div>
                  </CardContent>
                </div>

                {/* Card Footer */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Rent Price</span>
                    <span className="text-lg font-black text-slate-900">
                      ${property.rentPrice.toLocaleString()}
                      <span className="text-xs font-normal text-slate-500">/mo</span>
                    </span>
                  </div>

                  <Link href={`/properties/${property.id}`}>
                    <Button size="sm" variant="primary" className="bg-blue-600 hover:bg-blue-700 font-bold px-3.5 py-1.5 text-xs shadow-md shadow-blue-500/20">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose RentNest Trust Section */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Why Tenants & Landlords Choose RentNest
            </h2>
            <p className="text-sm text-slate-500">
              Built with security, transparent request tracking, and seamless checkout integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/60 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Verified Landlord Listings</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All property listings are inspected by administrators to ensure authentic rental descriptions and pricing.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/60 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Secure Online Checkout</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete approved lease payments instantly using Stripe or SSLCommerz payment gateways.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/60 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Transparent Tenant Reviews</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Active tenants can leave 5-star ratings and written reviews to build trust across the marketplace.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
