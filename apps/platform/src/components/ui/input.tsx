import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-[#d7d0c4] bg-[#fbfaf7] px-3.5 py-2 text-sm text-[#1d2823] placeholder:text-[#a8afa9] shadow-xs transition-colors focus-visible:outline-none focus-visible:border-[#557365] focus-visible:ring-2 focus-visible:ring-[#557365]/20 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
