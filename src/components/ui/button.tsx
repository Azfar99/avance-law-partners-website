import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import "./button.css"

export const buttonVariants = cva(
  "firm-button",
  {
    variants: {
      variant: {
        gold: "firm-button--brass",
        "outline-dark": "firm-button--ink",
        "outline-light": "firm-button--outline",
        ghost: "firm-button--ghost",
      },
      size: {
        md: "",
        lg: "firm-button--large",
        icon: "firm-button--icon",
      },
    },
    defaultVariants: {
      variant: "gold",
      size: "md",
    },
  },
)

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button"

  return (
    <Component
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
