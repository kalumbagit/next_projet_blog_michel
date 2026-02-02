import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const buttonVariants = cva(
  // base
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-900 text-zinc-50 hover:bg-zinc-800",

        destructive:
          "bg-red-600 text-white hover:bg-red-500",

        outline:
          "border border-zinc-800 bg-transparent text-zinc-100 hover:bg-zinc-800",

        secondary:
          "bg-zinc-800 text-zinc-50 hover:bg-zinc-700",

        ghost:
          "text-zinc-100 hover:bg-zinc-800",

        link:
          "text-zinc-100 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={clsx(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
