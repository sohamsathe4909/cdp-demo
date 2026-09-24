import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export function Avatar({ className, src, alt, fallback = "U", ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 select-none items-center justify-center overflow-hidden rounded-full border border-black/[0.07] bg-[#e5ece6] font-semibold text-[#395345]",
        className,
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt || "Avatar"} className="h-full w-full object-cover" />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
}

export function AvatarFallback({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-xs font-semibold tracking-wider", className)}>
      {children}
    </span>
  );
}
