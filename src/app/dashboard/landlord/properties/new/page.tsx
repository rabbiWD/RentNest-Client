"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

export default function CreatePropertyPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    propertyType: "Apartment",
    bedrooms: "2",
    bathrooms: "1",
    rentPrice: "",
    categoryId: "",
    imagesInput: "",
    amenitiesInput: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchApi("/categories")
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setCategories(res.data);
          if (res.data.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: res.data[0].id }));
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.address || !formData.city || !formData.rentPrice) {
      setError("Please fill in all required fields marked with *");
      return;
    }

    setIsLoading(true);
    setError(null);

    const imagesArray = formData.imagesInput
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const amenitiesArray = formData.amenitiesInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      propertyType: formData.propertyType,
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      rentPrice: Number(formData.rentPrice),
      categoryId: formData.categoryId || undefined,
      images: imagesArray,
      amenities: amenitiesArray,
    };

    try {
      await fetchApi("/landlord/properties", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setToastMessage("Property listed successfully! Redirecting to dashboard...");
      setTimeout(() => router.push("/dashboard/landlord"), 1500);
    } catch (err: any) {
      setError(err?.message || "Failed to create property listing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Add New Property Listing">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in">
          <span className="text-emerald-400 font-bold">✓</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-slate-200/80">
          <CardHeader>
            <CardTitle>Create Rental Property Listing</CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              Provide comprehensive details about your rental property for prospective tenants.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  1. Basic Property Details
                </h4>

                <Input
                  label="Property Title *"
                  name="title"
                  placeholder="e.g. Modern Sunset Heights 2-Bedroom Apartment"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

                <Textarea
                  label="Property Description *"
                  name="description"
                  placeholder="Describe your property layout, special features, surrounding neighborhood, and transportation options..."
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Location & Specs */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  2. Location & Specifications
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Street Address *"
                    name="address"
                    placeholder="e.g. 1420 Ocean Drive, Apt 4B"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="City *"
                    name="city"
                    placeholder="e.g. Miami, New York, Austin"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <Select
                    label="Property Type"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    options={[
                      { value: "Apartment", label: "Apartment" },
                      { value: "House", label: "House" },
                      { value: "Villa", label: "Villa" },
                      { value: "Loft", label: "Loft" },
                      { value: "Studio", label: "Studio" },
                    ]}
                  />

                  <Input
                    label="Bedrooms"
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    min={0}
                  />

                  <Input
                    label="Bathrooms"
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    min={0}
                  />

                  <Input
                    label="Monthly Rent ($) *"
                    type="number"
                    name="rentPrice"
                    placeholder="e.g. 2200"
                    value={formData.rentPrice}
                    onChange={handleChange}
                    required
                  />
                </div>

                {categories.length > 0 && (
                  <Select
                    label="Property Category"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  />
                )}
              </div>

              {/* Images & Amenities */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  3. Media & Amenities
                </h4>

                <Textarea
                  label="Image URLs (Comma separated)"
                  name="imagesInput"
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  rows={2}
                  value={formData.imagesInput}
                  onChange={handleChange}
                  helperText="Paste direct image URLs separated by commas."
                />

                <Input
                  label="Included Amenities (Comma separated)"
                  name="amenitiesInput"
                  placeholder="e.g. Wifi, Swimming Pool, Gym, Parking, Air Conditioning"
                  value={formData.amenitiesInput}
                  onChange={handleChange}
                  helperText="List amenities separated by commas."
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/landlord")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="px-6 py-3 text-sm font-bold shadow-md shadow-blue-500/20"
                  isLoading={isLoading}
                >
                  Publish Listing
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
