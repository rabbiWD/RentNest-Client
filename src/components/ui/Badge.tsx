import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "completed"
  | "available"
  | "rented"
  | "banned"
  | "info"
  | "default";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  status?: string; // Auto-maps enum string to variant
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  status,
  className,
  ...props
}) => {
  // Determine variant from status string if variant isn't explicitly provided
  let computedVariant: BadgeVariant = variant || "default";

  if (!variant && status) {
    const s = status.toUpperCase();
    if (s === "PENDING") computedVariant = "pending";
    else if (s === "APPROVED") computedVariant = "approved";
    else if (s === "PAYMENT_SUBMITTED") computedVariant = "info";
    else if (s === "REJECTED") computedVariant = "rejected";
    else if (s === "ACTIVE") computedVariant = "active";
    else if (s === "COMPLETED") computedVariant = "completed";
    else if (s === "AVAILABLE") computedVariant = "available";
    else if (s === "RENTED" || s === "RESERVED") computedVariant = "info";
    else if (s === "BANNED") computedVariant = "banned";
  }

  const styles: Record<BadgeVariant, string> = {
    pending:
      "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20",
    approved:
      "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20",
    rejected:
      "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20",
    active:
      "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20",
    completed:
      "bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20",
    available:
      "bg-teal-50 text-teal-700 border-teal-200 ring-teal-500/20",
    rented:
      "bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20",
    banned:
      "bg-rose-100 text-rose-800 border-rose-300 ring-rose-500/20",
    info:
      "bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20",
    default:
      "bg-slate-100 text-slate-800 border-slate-200 ring-slate-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border shadow-2xs transition-all",
        styles[computedVariant],
        className
      )}
      {...props}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
      {children || status}
    </span>
  );
};
