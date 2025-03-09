
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "screen flicker flex h-9 w-full rounded-md border-b-primary border-l-background border-e-background border-t-background border bg-transparent px-3 py-1 text-primary shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-primary placeholder:text-muted-foregound focus:outline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
