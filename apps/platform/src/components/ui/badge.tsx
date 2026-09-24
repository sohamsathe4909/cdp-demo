import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-[#d7d0c4] bg-[#eeebe3] text-[#55605a]",
        secondary:
          "border-[#d7d0c4] bg-[#f5f2eb] text-[#8b634d]",
        outline:
          "border-[#d7d0c4] bg-white text-[#55605a]",
        success:
          "border-[#c9d9cd] bg-[#e9f1ea] text-[#3d604a]",
        warning:
          "border-[#e8d8c8] bg-[#f8efe6] text-[#8b634d]",
        danger:
          "border-red-200 bg-red-50 text-red-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
