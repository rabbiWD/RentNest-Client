"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Bed,
  Bath,
  Building2,
  Phone,
  Send,
  Star,
  CheckCircle2,
  ShieldCheck,
} from "@/components/ui/icons";

interface PropertyDetail {
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
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    tenant?: { name: string };
  }>;
}

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchApi(`/properties/${id}`)
      .then((res) => {
        if (res.data) {
          const loadedProp = res.data;
          const validImages =
            loadedProp.images && Array.isArray(loadedProp.images)
              ? loadedProp.images
              : [];

          setProperty({ ...loadedProp, images: validImages });
          setActiveImage(validImages[0] || "");
        } else {
          setProperty(null);
        }
      })
      .catch(() => {
        setProperty(null);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleOpenRequestModal = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/properties/${id}`);
      return;
    }
    setIsRequestModalOpen(true);
  };

  const handleRentalRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    setIsSubmitting(true);

    // const newRequestObj = {
    //   id: `req-user-${Date.now()}`,
    //   status: "PENDING",
    //   rentalStartDate: startDate,
    //   rentalEndDate: endDate,
    //   message: requestMessage,
    //   tenantName: user?.name || "Tenant Applicant",
    //   tenantEmail: user?.email || "",
    //   property: {
    //     id: property?.id || id,
    //     title: property?.title || "Rental Property",
    //     rentPrice: Number(property?.rentPrice || 0),
    //     city: property?.city || "",
    //     address: property?.address || "",
    //     images: property?.images || [],
    //   },
    //   landlord: {
    //     name: property?.landlord?.name || "Property Owner",
    //     email: property?.landlord?.email || "",
    //   },
    // };

    // Save locally for instant persistence
    // try {
    //   const existingSaved = JSON.parse(localStorage.getItem("rentnest_submitted_requests") || "[]");
    //   localStorage.setItem(
    //     "rentnest_submitted_requests",
    //     JSON.stringify([newRequestObj, ...existingSaved])
    //   );
    // } catch (err) {}

    // Send API call
    // try {
    //   await fetchApi("/rentals", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       propertyId: property?.id,
    //       moveInDate: startDate,
    //       duration: 12,
    //       rentalStartDate: startDate,
    //       rentalEndDate: endDate,
    //       message: requestMessage,
    //     }),
    //   });
    // } catch (err: any) {} finally {
    //   setIsSubmitting(false);
    //   setIsRequestModalOpen(false);
    //   setToastNotification("Rental request submitted! Once approved by landlord, pay option will appear on your dashboard.");
    //   setTimeout(() => {
    //     router.push("/dashboard/tenant");
    //   }, 1200);
    // }


    try {
  const res = await fetchApi("/rentals", {
    method: "POST",
    body: JSON.stringify({
      propertyId: property?.id,
      moveInDate: startDate,
      duration: 12,
      rentalStartDate: startDate,
      rentalEndDate: endDate,
      message: requestMessage,
    }),
  });

  // Backend থেকে তৈরি হওয়া RentalRequest
  const createdRequest = res.data;

  const newRequestObj = {
    id: createdRequest.id, // ✅ Database ID
    status: createdRequest.status,
    rentalStartDate: createdRequest.moveInDate,
    rentalEndDate: createdRequest.rentalEndDate,
    message: createdRequest.message,

    property: {
      id: property?.id,
      title: property?.title,
      rentPrice: Number(property?.rentPrice || 0),
      city: property?.city,
      address: property?.address,
      images: property?.images || [],
    },

    landlord: {
      id: property?.landlord?.id,
      name: property?.landlord?.name,
      email: property?.landlord?.email,
    },
  };

  const existing = JSON.parse(
    localStorage.getItem("rentnest_submitted_requests") || "[]"
  );

  localStorage.setItem(
    "rentnest_submitted_requests",
    JSON.stringify([newRequestObj, ...existing])
  );

  setToastNotification(
    "Rental request submitted successfully!"
  );

  setIsRequestModalOpen(false);

  setTimeout(() => {
    router.push("/dashboard/tenant");
  }, 1200);
} catch (err) {
  console.error(err);
} finally {
  setIsSubmitting(false);
}

  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-6 flex-1">
          <Skeleton className="h-96 w-full rounded-3xl" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4 flex-1">
          <h2 className="text-2xl font-bold text-slate-900">Property Listing Not Found</h2>
          <p className="text-slate-500 text-sm">The requested property listing does not exist or has been removed.</p>
          <Link href="/properties">
            <Button variant="primary">Browse All Properties</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans select-none">
      <Navbar />

      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 font-bold" />
          <span className="text-sm font-semibold">{toastNotification}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/properties" className="hover:text-blue-600 transition-colors">Properties</Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">{property.city || "Marketplace"}</span>
          <span>/</span>
          <span className="truncate max-w-xs">{property.title}</span>
        </div>

        {/* Gallery Section */}
        <div className="space-y-3">
          <div className="relative h-[420px] w-full rounded-3xl overflow-hidden bg-slate-200 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage || property.images[0]}
              alt={property.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge status={property.status} />
            </div>
          </div>

          {/* Thumbnail list */}
          {property.images && property.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-20 w-32 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === img ? "border-blue-600 scale-95 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Property Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    {property.propertyType || "Apartment"} • {property.city || "City"}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                    {property.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>{[property.address, property.city].filter(Boolean).join(", ") || "Location N/A"}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-black text-blue-600">
                    ${Number(property.rentPrice).toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold block">/ month</span>
                </div>
              </div>

              {/* Key Specs Bar */}
              <div className="grid grid-cols-3 gap-4 p-5 mt-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs text-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">Bedrooms</span>
                  <div className="inline-flex items-center gap-1.5 text-base font-black text-slate-900">
                    <Bed className="h-4 w-4 text-blue-600" />
                    <span>{property.bedrooms || 2}</span>
                  </div>
                </div>

                <div className="space-y-1 border-x border-slate-100">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">Bathrooms</span>
                  <div className="inline-flex items-center gap-1.5 text-base font-black text-slate-900">
                    <Bath className="h-4 w-4 text-blue-600" />
                    <span>{property.bathrooms || 1}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">Property Type</span>
                  <div className="inline-flex items-center gap-1.5 text-base font-black text-slate-900">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span>{property.propertyType || "Studio"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <Card className="rounded-3xl border-slate-200/80 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-lg">About this Property</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {property.description || "Affordable and comfortable suitable property."}
                </p>
              </CardContent>
            </Card>

            {/* Amenities Card */}
            {property.amenities && property.amenities.length > 0 && (
              <Card className="rounded-3xl border-slate-200/80 shadow-xs">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-lg">Included Amenities</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {property.amenities.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            {property.reviews && property.reviews.length > 0 && (
              <Card className="rounded-3xl border-slate-200/80 shadow-xs">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-lg">Tenant Reviews</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {property.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">
                          {rev.tenant?.name || "Tenant Reviewer"}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span>{rev.rating}/5 Stars</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Action Sidebar Card */}
          <div className="space-y-6">
            <Card className="sticky top-20 shadow-xl border-blue-100 rounded-3xl p-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Rental Terms</span>
                <div className="text-3xl font-black text-slate-900">
                  ${Number(property.rentPrice).toLocaleString()}
                  <span className="text-sm font-semibold text-slate-500"> / month</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Includes full property access, verified landlord lease terms, and instant request submission.
                </p>
              </div>

              {/* Landlord Info Snapshot Card */}
              {property.landlord && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Listed By Landlord
                  </span>
                  <div className="font-bold text-sm text-slate-900">{property.landlord.name}</div>
                  <div className="text-xs text-slate-500">{property.landlord.email}</div>
                  {property.landlord.phone && (
                    <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5 mt-1">
                      <Phone className="h-3.5 w-3.5 text-blue-600" />
                      <span>{property.landlord.phone}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleOpenRequestModal}
                className="w-full py-4 text-base font-bold shadow-lg shadow-blue-500/25 gap-2 bg-blue-600 hover:bg-blue-700 rounded-2xl"
              >
                <span>Request to Rent</span>
                <Send className="h-4 w-4" />
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 text-center">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                <span>Landlord approval required before payment checkout</span>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Request to Rent Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Submit Rental Application"
        description={`Submit application to rent "${property.title}"`}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsRequestModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleRentalRequestSubmit}
              isLoading={isSubmitting}
              className="gap-2 bg-blue-600 hover:bg-blue-700 font-bold"
            >
              <span>Submit Application</span>
              <Send className="h-4 w-4" />
            </Button>
          </>
        }
      >
        <form onSubmit={handleRentalRequestSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Desired Move-In Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="Lease End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Message to Landlord (Optional)"
            placeholder="Introduce yourself, number of occupants, or any questions..."
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            rows={3}
          />
        </form>
      </Modal>

      <Footer />
    </div>
  );
}
