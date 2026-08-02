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
  CreditCard,
  ArrowRight,
  Sparkles,
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
  const [isLoading, setIsLoading] = useState(true);

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
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (location) params.append("location", location);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (propertyType) params.append("type", propertyType);
      if (categoryId) params.append("categoryId", categoryId);

      const queryString = params.toString();
      const endpoint = `/properties${queryString ? `?${queryString}` : ""}`;
      const res = await fetchApi(endpoint);

      console.log(res);
console.log(res.data);
console.log(res.data.id);

      if (res.data && Array.isArray(res.data)) {
        setProperties(res.data);
      } else {
        setProperties([]);
      }
    } catch (err) {
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, location, minPrice, maxPrice, propertyType, categoryId]);

  useEffect(() => {
    fetchApi("/categories")
      .then((res) => {
        if (res.data) setCategories(res.data);
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
  };

  const getValidImage = (property: PropertyItem) => {
    if (property.images && property.images.length > 0 && property.images[0] && property.images[0].startsWith("http")) {
      return property.images[0];
    }
    return "";
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans select-none">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Marketplace Listings</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Explore Rental Properties
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            Find your next apartment, studio, villa, or home with verified landlord listings and real-time checkout payment options.
          </p>
        </div>
      </section>

      {/* Main Grid & Filters Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <Card className="p-5 sticky top-20 shadow-sm border-slate-200/80 rounded-3xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-600" />
                  <span>Filter Listings</span>
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Reset All
                </button>
              </div>

              <div className="space-y-4 pt-4">
                <Input
                  label="Search Keyword"
                  placeholder="Title, Loft, Ocean..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <Input
                  label="City / Location"
                  placeholder="e.g. New York, Miami"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />

                <Select
                  label="Property Type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  placeholder="All Property Types"
                  options={[
                    { value: "Apartment", label: "Apartment" },
                    { value: "Loft", label: "Loft" },
                    { value: "Villa", label: "Villa" },
                    { value: "Studio", label: "Studio" },
                    { value: "House", label: "House" },
                  ]}
                />

                {categories.length > 0 && (
                  <Select
                    label="Category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    placeholder="All Categories"
                    options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  />
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Monthly Rent ($)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min $"
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <Input
                      placeholder="Max $"
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Properties Grid */}
          <section className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">
                Showing <span className="font-bold text-slate-900">{properties.length}</span> rental properties
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="overflow-hidden rounded-3xl">
                    <Skeleton className="h-48 w-full rounded-none" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <Card className="p-12 text-center space-y-4 rounded-3xl border-slate-200">
                <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Properties Found</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search criteria or resetting filters to view all available listings.
                </p>
                <Button variant="outline" onClick={handleResetFilters} className="font-bold text-xs">
                  Clear Search Filters
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {properties.map((property, idx) => (
                  <Card
                    key={property.id}
                    className="group hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden rounded-3xl border-slate-200/90"
                  >
                    <div>
                      {/* Property Image Header */}
                      <div className="relative h-48 w-full bg-slate-200 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getValidImage(property)}
                          alt={property.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge status={property.status} />
                        </div>
                        <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white backdrop-blur-xs px-3 py-1 rounded-xl text-sm font-black shadow-md">
                          ${Number(property.rentPrice).toLocaleString()}
                          <span className="text-xs font-normal text-slate-300">/mo</span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
                          <span>{property.propertyType || "Apartment"}</span>
                          <span>•</span>
                          <span>{property.city || "Location N/A"}</span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
                          {property.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {property.description}
                        </p>

                        {/* Specs */}
                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-3 border-t border-slate-100">
                          <span className="flex items-center gap-1.5">
                            <Bed className="h-3.5 w-3.5 text-blue-600" />
                            <span>{property.bedrooms || 2} Bed</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Bath className="h-3.5 w-3.5 text-blue-600" />
                            <span>{property.bathrooms || 1} Bath</span>
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            <span>{property.address || property.city || "Location"}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="p-5 pt-0">
                      <Link href={`/properties/${property.id}`} className="block">
                        <Button variant="primary" className="w-full justify-between font-bold bg-blue-600 hover:bg-blue-700 rounded-2xl">
                          <span>View Details & Request</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
