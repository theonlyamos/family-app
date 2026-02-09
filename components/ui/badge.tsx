import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground [a&]:hover:bg-primary/90 [a&]:hover:shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-border text-foreground [a&]:hover:bg-secondary",
        ghost: "[a&]:hover:bg-secondary",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
        // Warm custom variants
        sage: "bg-[oklch(0.94_0.02_145)] text-[oklch(0.35_0.06_145)] [a&]:hover:bg-[oklch(0.92_0.03_145)]",
        terracotta:
          "bg-[oklch(0.94_0.06_45)] text-[oklch(0.45_0.12_45)] [a&]:hover:bg-[oklch(0.92_0.08_45)]",
        gold: "bg-[oklch(0.95_0.04_85)] text-[oklch(0.40_0.08_85)] [a&]:hover:bg-[oklch(0.93_0.06_85)]",
        blue: "bg-[oklch(0.94_0.02_250)] text-[oklch(0.35_0.06_250)] [a&]:hover:bg-[oklch(0.92_0.03_250)]",
        rose: "bg-[oklch(0.94_0.03_15)] text-[oklch(0.40_0.10_15)] [a&]:hover:bg-[oklch(0.92_0.05_15)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
