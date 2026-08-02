import React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = "User",
  size = "md",
  className,
  ...props
}) => {
  const getInitials = (n: string) => {
    const parts = n.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg font-bold",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-medium shadow-sm ring-2 ring-white select-none",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={(e) => {
            // Hide image on error to display fallback initials
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      ) : null}
      <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {getInitials(name)}
      </span>
    </div>
  );
};
