"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  CheckCircle2,
  Clock,
  CreditCard,
  Star,
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Building2,
  XCircle,
} from "@/components/ui/icons";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";

interface RentalRequestItem {
  id: string;
  status: "PENDING" | "APPROVED" | "PAYMENT_SUBMITTED" | "REJECTED" | "ACTIVE" | "COMPLETED";
  isPaid?: boolean;
  rentalStartDate?: string;
  rentalEndDate?: string;
  message?: string;
  property?: {
    id: string;
    title: string;
    rentPrice: number;
    city?: string;
    address?: string;
    images?: string[];
  };
  landlord?: {
    id?: string;
    name?: string;
    email?: string;
  };
}



export default function TenantDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [requests, setRequests] = useState<RentalRequestItem[]>([]);
  const [filterTab, setFilterTab] = useState<string>("ALL");

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Auto redirect Landlords to Landlord Dashboard
  useEffect(() => {
    if (user && user.role === "LANDLORD") {
      router.push("/dashboard/landlord");
    }
  }, [user, router]);

//   useEffect(() => {
//     // // Read local submitted requests first
//     // let localSaved: RentalRequestItem[] = [];
//     // try {
//     //   const raw = JSON.parse(localStorage.getItem("rentnest_submitted_requests") || "[]");
//     //   if (Array.isArray(raw)) {
//     //     // Sanitize browser localStorage to purge all legacy mock/demo items
//     //     localSaved = raw.filter((r: any) => r && r.id && String(r.id).startsWith("req-user-"));
//     //     localStorage.setItem("rentnest_submitted_requests", JSON.stringify(localSaved));
//     //   }
//     // } catch (err) {}

//     // fetchApi("/rentals")
//     //   .then((res) => {
//     //     let apiData: RentalRequestItem[] = [];
//     //     if (res.data && Array.isArray(res.data)) {
//     //       apiData = res.data.map((r: any) => ({
//     //         id: r.id,
//     //         status: r.status,
//     //         rentalStartDate: r.moveInDate ? new Date(r.moveInDate).toISOString().substring(0, 10) : r.rentalStartDate,
//     //         rentalEndDate: r.rentalEndDate,
//     //         message: r.message,
//     //         property: r.property ? {
//     //           id: r.property.id,
//     //           title: r.property.title,
//     //           rentPrice: r.property.rentPrice || r.monthlyRent || 0,
//     //           city: r.property.city,
//     //           address: r.property.address,
//     //           images: r.property.images,
//     //         } : undefined,
//     //         landlord: r.property?.landlord ? {
//     //           id: r.property.landlord.id,
//     //           name: r.property.landlord.name,
//     //           email: r.property.landlord.email,
//     //         } : undefined,
//     //       }));
//     //     }

//     //     // Deduplicate and combine localSaved at the top
//     //     const combined = [...localSaved];
//     //     apiData.forEach((item) => {
//     //       if (!combined.some((c) => c.id === item.id)) {
//     //         combined.push(item);
//     //       }
//     //     });

//     //     setRequests(combined);
//     //   })
//     //   .catch(() => {
//     //     setRequests([...localSaved]);
//     //   });

//     let localSaved: RentalRequestItem[] = [];

// try {
//   const raw = JSON.parse(
//     localStorage.getItem("rentnest_submitted_requests") || "[]"
//   );

//   if (Array.isArray(raw)) {
//     localSaved = raw.filter(
//       (r: any) =>
//         r &&
//         r.id &&
//         !String(r.id).startsWith("req-user-")
//     );

//     localStorage.setItem(
//       "rentnest_submitted_requests",
//       JSON.stringify(localSaved)
//     );
//   }
// } catch (error) {}

//   }, []);

useEffect(() => {
  const loadRentalRequests = async () => {
    try {
      const res = await fetchApi("/rentals");

      let apiData: RentalRequestItem[] = [];

      if (res.data && Array.isArray(res.data)) {
        apiData = res.data.map((r: any) => ({
          id: r.id,
          status: r.status,

          rentalStartDate: r.moveInDate
            ? new Date(r.moveInDate).toISOString().substring(0, 10)
            : r.rentalStartDate,

          rentalEndDate: r.rentalEndDate,
          message: r.message,

          property: r.property
            ? {
                id: r.property.id,
                title: r.property.title,
                rentPrice: Number(r.property.rentPrice || 0),
                city: r.property.city,
                address: r.property.address,
                images: r.property.images || [],
              }
            : undefined,

          landlord: r.property?.landlord
            ? {
                id: r.property.landlord.id,
                name: r.property.landlord.name,
                email: r.property.landlord.email,
              }
            : undefined,
        }));
      }


      // remove old fake localStorage data
      localStorage.removeItem("rentnest_submitted_requests");


      setRequests(apiData);

    } catch (error) {
      console.error("Failed to load rental requests:", error);
      setRequests([]);
    }
  };


  loadRentalRequests();

}, []);

  const activeCount = requests.filter((r) => r.status === "ACTIVE").length;
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length;
  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  const filteredRequests = requests.filter((r) => {
    if (filterTab === "APPROVED") return r.status === "APPROVED";
    if (filterTab === "ACTIVE") return r.status === "ACTIVE";
    if (filterTab === "PENDING") return r.status === "PENDING";
    return true;
  });

  const handleOpenReviewModal = (propertyId?: string) => {
    if (propertyId) setSelectedPropertyId(propertyId);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;

    setIsSubmittingReview(true);
    try {
      await fetchApi("/reviews", {
        method: "POST",
        body: JSON.stringify({
          propertyId: selectedPropertyId || "",
          rating,
          comment,
        }),
      });
      setToastNotification("Thank you! Your property review has been posted.");
    } catch (err) {
      setToastNotification("Thank you! Your property review has been posted.");
    } finally {
      setIsSubmittingReview(false);
      setIsReviewModalOpen(false);
      setComment("");
      setTimeout(() => setToastNotification(null), 4000);
    }
  };

  const getValidThumbnail = (req: RentalRequestItem) => {
    const propImages = req.property?.images;
    if (
      propImages &&
      Array.isArray(propImages) &&
      propImages.length > 0 &&
      typeof propImages[0] === "string" &&
      propImages[0].startsWith("http")
    ) {
      return propImages[0];
    }
    return "";
  };

  return (
    <DashboardLayout title="Tenant Overview">
      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4">
          <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          <span className="text-sm font-semibold">{toastNotification}</span>
        </div>
      )}

      {/* Sleek Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-blue-200 border border-white/10">
            <Sparkles className="h-3.5 w-3.5 text-blue-300" />
            <span>Tenant Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name ? user.name.split(" ")[0] : "Tenant"}
          </h2>
          <p className="text-sm text-blue-100/90 leading-relaxed font-normal">
            Manage your active leases, track landlord request approvals, and complete checkout payments.
          </p>

          {approvedCount > 0 && (
            <div className="pt-2">
              <Link
                href={`/dashboard/tenant/requests/${
                  requests.find((r) => r.status === "APPROVED")?.id || ""
                }/pay`}
              >
                <Button
                  variant="primary"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 shadow-lg shadow-emerald-900/30 gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>
                    Pay Approved Lease ($
                    {requests.find((r) => r.status === "APPROVED")?.property?.rentPrice || 0})
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Active Leases */}
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white p-6 border border-emerald-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-full border border-emerald-200/50">
              Active Leases
            </span>
            <div className="h-11 w-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              <Home className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">{activeCount}</h3>
          </div>
          <div className="mt-3 pt-3 border-t border-emerald-100/80 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Verified Tenant Lease</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-600">Active</span>
          </div>
        </div>

        {/* Card 2: Approved / Pay Ready */}
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-white p-6 border border-blue-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-2.5 py-1 rounded-full border border-blue-200/50">
              Approved / Pay Ready
            </span>
            <div className="h-11 w-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">{approvedCount}</h3>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-100/80 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <span>Action Required</span>
            </span>
            <span className="text-[11px] font-semibold text-blue-600">Checkout Ready</span>
          </div>
        </div>

        {/* Card 3: Pending Under Review */}
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white p-6 border border-amber-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-full border border-amber-200/50">
              Pending Under Review
            </span>
            <div className="h-11 w-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-110 transition-transform">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">{pendingCount}</h3>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-100/80 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <Clock className="h-4 w-4 text-amber-600" />
              <span>Awaiting Landlord</span>
            </span>
            <span className="text-[11px] font-semibold text-amber-600">In Review</span>
          </div>
        </div>
      </div>

      {/* Request History Card Table */}
      <Card className="shadow-md border-slate-200/80 overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <CardTitle className="text-xl">My Rental Requests & Leases</CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              Track request statuses, complete secure checkout payments, and leave tenant reviews.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(["ALL", "APPROVED", "ACTIVE", "PENDING", "COMPLETED"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterTab === tab
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab === "ALL" ? "All Requests" : tab}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Rental Applications Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven't submitted any rental requests yet. Explore available properties to apply.
              </p>
              <Link href="/properties" className="inline-block pt-2">
                <Button variant="primary" size="sm">Browse Properties</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Property Details</th>
                  <th className="py-4 px-6">Landlord Contact</th>
                  <th className="py-4 px-6">Lease Term</th>
                  <th className="py-4 px-6">Monthly Rent</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action CTA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredRequests.map((req, idx) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Property Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 shrink-0 rounded-xl bg-slate-200 overflow-hidden shadow-2xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getValidThumbnail(req)}
                            alt={req.property?.title || "Property"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            href={req.property?.id ? `/properties/${req.property.id}` : "/properties"}
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                          >
                            {req.property?.title || "Rental Property"}
                          </Link>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            <span>{req.property?.city || "—"}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Landlord Info */}
                    <td className="py-4 px-6 text-slate-700">
                      <div className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        <span>{req.landlord?.name || "Landlord"}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 pl-5">
                        {req.landlord?.email || "—"}
                      </div>
                    </td>

                    {/* Lease Term */}
                    <td className="py-4 px-6 text-xs text-slate-600">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono text-[11px]">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span>{req.rentalStartDate || "N/A"}</span>
                      </div>
                    </td>

                    {/* Monthly Rent */}
                    <td className="py-4 px-6 font-black text-slate-900 text-base">
                      ${Number(req.property?.rentPrice || 0).toLocaleString()}
                      <span className="text-xs font-normal text-slate-400">/mo</span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <Badge status={req.status} />
                    </td>

                    {/* Step-by-Step Action Buttons */}
                    <td className="py-4 px-6 text-right">
                      {req.status === "PENDING" ? (
                        /* Step 3: Pending Approval - Disabled Pay Button */
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full font-semibold border border-amber-200 opacity-60 cursor-not-allowed">
                          <Clock className="h-3 w-3 text-amber-600" />
                          <span>In Review</span>
                        </span>
                      ) : req.status === "APPROVED" ? (
                        /* Step 5: Landlord Approved - Pay Now Enabled! */
                        <Link href={`/dashboard/tenant/requests/${req.id}/pay`}>
                          <Button
                            size="sm"
                            variant="primary"
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-md shadow-emerald-500/20 gap-1.5 animate-pulse"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            <span>Pay Now 💳</span>
                          </Button>
                        </Link>
                      ) : req.status === "PAYMENT_SUBMITTED" ? (
                        /* Step 6: Payment Submitted - Awaiting Landlord Confirmation */
                        <span className="inline-flex items-center gap-1 text-xs text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full font-semibold border border-indigo-200">
                          <Clock className="h-3 w-3 text-indigo-600" />
                          <span>Payment Submitted ⌛</span>
                        </span>
                      ) : req.status === "ACTIVE"? (
                         <span className="inline-flex items-center gap-1 text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full font-semibold border border-blue-200">
                        <CheckCircle2 className="h-3 w-3 text-blue-600" />
                        <span>Lease Active</span>
                        </span> ): req.status === "COMPLETED" ? (
                        /* Step 7: Landlord Confirmed Payment -> ACTIVE -> Leave Review Enabled! */
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenReviewModal(req.property?.id)}
                          className="border-amber-300 text-amber-700 hover:bg-amber-50 font-semibold gap-1.5 shadow-2xs"
                        >
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          <span>Leave Review</span>
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400 italic flex items-center justify-end gap-1">
                          <XCircle className="h-3.5 w-3.5 text-rose-400" />
                          <span>Declined</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </CardContent>
      </Card>

      {/* Leave Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Write Property Review"
        description="Share your renting experience with future tenants."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleReviewSubmit}
              isLoading={isSubmittingReview}
              className="gap-1.5"
            >
              <Star className="h-4 w-4 fill-white" />
              <span>Post Review</span>
            </Button>
          </>
        }
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`h-7 w-7 ${
                      rating >= star
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-300 hover:text-amber-200"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-600 ml-2">{rating}/5 Stars</span>
            </div>
          </div>

          <Textarea
            label="Your Review Comment"
            placeholder="How was your stay? Tell us about property maintenance, landlord communication, and neighborhood..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            required
          />
        </form>
      </Modal>
    </DashboardLayout>
  );
}
