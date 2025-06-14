import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground h-10 px-4 py-2 font-medium transition-all duration-200 ease-in-out hover:shadow-md hover:scale-105",
        destructive:
          "bg-destructive text-destructive-foreground h-10 px-4 py-2 font-medium transition-all duration-200 ease-in-out hover:bg-destructive/90 hover:shadow-md hover:scale-105",
        outline:
          "border border-input bg-background h-10 px-4 py-2 font-medium transition-all duration-200 ease-in-out hover:text-primary hover:bg-primary/10",
        secondary:
          "bg-secondary text-secondary-foreground h-10 px-4 py-2 font-medium transition-all duration-200 ease-in-out hover:bg-secondary/90 hover:shadow-md hover:scale-105",
        ghost: "h-10 px-4 py-2 font-medium transition-colors hover:text-accent-foreground hover:bg-primary/10",
        link: "text-primary underline-offset-4 hover:underline transition-all duration-200",
      },
      size: {
        default: "",
        sm: "h-9 rounded-md px-3 text-xs",
        xs: "h-7 rounded-md px-2 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10 ml-1 transition-colors hover:bg-primary/10",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
      glow: {
        true: "btn-glow",
        false: "",
      },
      animate: {
        true: "animate-fade-in hover:scale-105",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  rounded?: "default" | "full" | "none"
  glow?: boolean
  animate?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded = "default", glow = false, animate = false, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, glow, animate, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
