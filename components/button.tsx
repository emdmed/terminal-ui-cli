import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-[1.1rem] text-primary-foreground hover:outline-1 hover:outline-offset-1 hover:outline hover:outline-primary hover:outline-double rounded-0",
        destructive:
          "bg-destructive  text-[1.1rem] text-background shadow-sm hover:outline-1 hover:outline-offset-1 hover:outline hover:outline-destructive hover:outline-double",
        outline:
          "border  text-[1.1rem] border-primary text-foreground shadow-sm hover:outline-1 hover:outline-offset-1 hover:outline hover:outline-primary hover:outline-double",
        secondary:
          "bg-secondary  text-[1.1rem] text-foreground shadow-sm hover:outline-1 hover:outline-offset-1 hover:outline hover:outline-secondary hover:outline-double",
        ghost: " text-[1.1rem] hover:bg-primary hover:text-background text-primary hover:outline-1 hover:outline-offset-1 hover:outline hover:outline-primary hover:outline-double",
        link: " text-[1.1rem] text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
