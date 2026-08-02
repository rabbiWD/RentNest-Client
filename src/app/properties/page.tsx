"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  MapPin,
  Bed,
  Bath,
  Building2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  DollarSign,
  Star,
  Users,
} from "@/components/ui/icons";

export interface PropertyItem {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  rentPrice: number | string;
  amenities: string[];
  images: string[];
  status: string;
  landlord?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  category?: {
    id: string;
    name: string;
  };
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [total, setTotal] = useState(0);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (location) params.append("location", location);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (propertyType) params.append("type", propertyType);
      if (categoryId) params.append("categoryId", categoryId);

      const queryString = params.toString();
      const endpoint = `/properties${queryString ? `?${queryString}` : ""}`;
      const res = await fetchApi(endpoint);

      if (res.data && Array.isArray(res.data)) {
        setProperties(res.data);
      } else {
        setProperties([]);
      }

      if (res.meta) {
        setTotal(res.meta.total);
      } else if (res.data && Array.isArray(res.data)) {
        setTotal(res.data.length);
      }
    } catch (err) {
      setProperties([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchTerm, location, minPrice, maxPrice, propertyType, categoryId]);

  useEffect(() => {
    // Fetch actual categories from DB
    fetchApi("/categories")
      .then((res) => {
        if (res.data) setCategories(res.data);
      })
      .catch(() => {});

    // Fetch actual property types dynamically from DB properties
    fetchApi("/properties?limit=100")
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          const types = Array.from(
            new Set(
              res.data
                .map((p: PropertyItem) => p.propertyType)
                .filter((t: string | undefined): t is string => Boolean(t && t.trim()))
            )
          );
          if (types.length > 0) {
            setAvailableTypes(types);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchProperties]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setPropertyType("");
    setCategoryId("");
    setPage(1);
  };

  const getValidImage = (property: PropertyItem) => {
    return property.images?.[0] || "";
  };

  const activeFilterCount =
    (searchTerm ? 1 : 0) +
    (location ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (propertyType ? 1 : 0) +
    (categoryId ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="h-4 w-4 animate-pulse text-blue-400" />
            <span>Verified Rental Marketplace</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                Find Your Ideal Nest
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                Discover verified apartments, luxury villas, modern studios, and family homes with instant landlord booking requests and automated payment options.
              </p>
            </div>

            {/* Quick Type Filter Chips */}
            {availableTypes.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-center lg:justify-end">
                {["All", ...availableTypes].map((t) => {
                  const isSelected = (t === "All" && !propertyType) || propertyType === t;
                  return (
                    <button
                      key={t}
                      onClick={() => {
                        setPropertyType(t === "All" ? "" : t);
                        setPage(1);
                      }}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                          : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Grid & Filters Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <Card className="p-6 sticky top-24 shadow-sm hover:shadow-md border-slate-200/90 rounded-3xl bg-white/90 backdrop-blur-md transition-all">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <Search className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Filter Properties</h3>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    Reset ({activeFilterCount})
                  </button>
                )}
              </div>

              <div className="space-y-4 pt-4">
                <Input
                  label="Search Keywords"
                  placeholder="e.g. Modern Loft, Ocean View..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                />

                <Input
                  label="City / Location"
                  placeholder="e.g. New York, Miami, Austin"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setPage(1);
                  }}
                />

                {availableTypes.length > 0 && (
                  <Select
                    label="Property Type"
                    value={propertyType}
                    onChange={(e) => {
                      setPropertyType(e.target.value);
                      setPage(1);
                    }}
                    placeholder="All Property Types"
                    options={availableTypes.map((t) => ({ value: t, label: t }))}
                  />
                )}

                {categories.length > 0 && (
                  <Select
                    label="Category"
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      setPage(1);
                    }}
                    placeholder="All Categories"
                    options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  />
                )}

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Price Range ($ / Month)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min $"
                      type="number"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value);
                        setPage(1);
                      }}
                    />
                    <Input
                      placeholder="Max $"
                      type="number"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleResetFilters}
                    className="w-full text-xs font-bold py-2.5 rounded-xl border-dashed border-slate-300 text-slate-600 hover:text-slate-900"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </Card>
          </aside>

          {/* Properties Grid Section */}
          <section className="lg:col-span-3 space-y-6">
            {(() => {
              const totalPages = Math.max(1, Math.ceil(total / limit));
              const startCount = total > 0 ? (page - 1) * limit + 1 : 0;
              const endCount = Math.min(page * limit, total);

              return (
                <>
                  {/* Top Bar Info & Page Limit Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <p className="text-xs sm:text-sm font-semibold text-slate-600">
                      Showing{" "}
                      <span className="font-bold text-slate-900">
                        {startCount} - {endCount}
                      </span>{" "}
                      of <span className="font-bold text-blue-600">{total}</span> verified listings
                    </p>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500">Show per page:</span>
                      <select
                        value={limit}
                        onChange={(e) => {
                          setLimit(Number(e.target.value));
                          setPage(1);
                        }}
                        className="text-xs font-bold bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs transition-all"
                      >
                        <option value={6}>6 items</option>
                        <option value={10}>10 items</option>
                        <option value={16}>16 items</option>
                      </select>
                    </div>
                  </div>

                  {/* Cards Display */}
                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="overflow-hidden rounded-3xl border-slate-200/80">
                          <Skeleton className="h-52 w-full rounded-none" />
                          <div className="p-6 space-y-4">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-10 w-full rounded-xl" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : properties.length === 0 ? (
                    <Card className="p-14 text-center space-y-5 rounded-3xl border-dashed border-2 border-slate-300 bg-white/50">
                      <div className="h-16 w-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                        <Building2 className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-slate-900">No Properties Found</h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto">
                          We couldn&apos;t find any rental properties matching your current criteria. Try clearing filters or searching another keyword.
                        </p>
                      </div>
                      <Button
                        variant="primary"
                        onClick={handleResetFilters}
                        className="font-bold text-xs px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700"
                      >
                        Reset Search Filters
                      </Button>
                    </Card>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {properties.map((property, idx) => (
                          <Card
                            key={property.id}
                            className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white"
                          >
                            <div>
                              {/* Property Image Container */}
                              <div className="relative h-52 w-full bg-slate-950 overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={getValidImage(property)}
                                  alt={property.title}
                                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                                {/* Status Badge */}
                                <div className="absolute top-3.5 left-3.5">
                                  <Badge status={property.status} />
                                </div>

                                {/* Price Tag Badge */}
                                <div className="absolute bottom-3.5 right-3.5 bg-slate-950/90 text-white backdrop-blur-md px-3.5 py-1.5 rounded-2xl text-sm font-black shadow-lg border border-white/10 flex items-center gap-1">
                                  <span className="text-emerald-400 font-extrabold">$</span>
                                  <span>{Number(property.rentPrice).toLocaleString()}</span>
                                  <span className="text-[10px] font-normal text-slate-300 uppercase tracking-wider">
                                    /mo
                                  </span>
                                </div>
                              </div>

                              {/* Content Body */}
                              <div className="p-6 space-y-3.5">
                                <div className="flex items-center justify-between text-xs font-bold text-blue-600 uppercase tracking-wider">
                                  <span className="bg-blue-50 px-2.5 py-1 rounded-lg">
                                    {property.propertyType || "Apartment"}
                                  </span>
                                  <span className="text-slate-400 font-semibold truncate max-w-[140px]">
                                    {property.city || "Location N/A"}
                                  </span>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
                                  {property.title}
                                </h3>

                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                                  {property.description}
                                </p>

                                {/* Specs Bar */}
                                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 pt-3.5 border-t border-slate-100">
                                  <span className="flex items-center gap-1.5">
                                    <Bed className="h-4 w-4 text-blue-600" />
                                    <span>{property.bedrooms || 2} Bed</span>
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <Bath className="h-4 w-4 text-blue-600" />
                                    <span>{property.bathrooms || 1} Bath</span>
                                  </span>
                                  <span className="flex items-center gap-1 truncate max-w-[120px]">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    <span className="truncate">{property.address || property.city || "Location"}</span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Footer Action */}
                            <div className="p-6 pt-0">
                              <Link href={`/properties/${property.id}`} className="block">
                                <Button
                                  variant="primary"
                                  className="w-full justify-between font-bold bg-slate-900 hover:bg-blue-600 text-white rounded-2xl py-3 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300"
                                >
                                  <span>View Details & Book</span>
                                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                              </Link>
                            </div>
                          </Card>
                        ))}
                      </div>

                      {/* Bottom Pagination Bar (1, 2, 3...) */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t border-slate-200/90">
                        <p className="text-xs font-semibold text-slate-500">
                          Page <span className="font-bold text-slate-900">{page}</span> of{" "}
                          <span className="font-bold text-slate-900">{totalPages}</span> ({total} properties)
                        </p>

                        <div className="flex items-center gap-2 flex-wrap justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={page <= 1 || isLoading}
                            onClick={() => {
                              setPage((prev) => Math.max(prev - 1, 1));
                              window.scrollTo({ top: 300, behavior: "smooth" });
                            }}
                            className="flex items-center gap-1 rounded-xl font-bold text-xs h-9 px-3 border-slate-200"
                          >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Prev</span>
                          </Button>

                          {(() => {
                            const pages: (number | string)[] = [];
                            const maxVisible = 5;

                            if (totalPages <= maxVisible + 2) {
                              for (let i = 1; i <= totalPages; i++) pages.push(i);
                            } else {
                              pages.push(1);
                              if (page > 3) pages.push("...");

                              const start = Math.max(2, page - 1);
                              const end = Math.min(totalPages - 1, page + 1);

                              for (let i = start; i <= end; i++) {
                                if (!pages.includes(i)) pages.push(i);
                              }

                              if (page < totalPages - 2) pages.push("...");
                              pages.push(totalPages);
                            }

                            return pages.map((pageNum, idx) =>
                              typeof pageNum === "number" ? (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setPage(pageNum);
                                    window.scrollTo({ top: 300, behavior: "smooth" });
                                  }}
                                  className={`h-9 w-9 rounded-xl text-xs font-bold transition-all ${
                                    page === pageNum
                                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-500/30 scale-105"
                                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              ) : (
                                <span key={idx} className="px-1 text-slate-400 font-bold text-xs select-none">
                                  ...
                                </span>
                              )
                            );
                          })()}

                          <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPages || isLoading}
                            onClick={() => {
                              setPage((prev) => Math.min(prev + 1, totalPages));
                              window.scrollTo({ top: 300, behavior: "smooth" });
                            }}
                            className="flex items-center gap-1 rounded-xl font-bold text-xs h-9 px-3 border-slate-200"
                          >
                            <span className="hidden sm:inline">Next</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              );
            })()}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
