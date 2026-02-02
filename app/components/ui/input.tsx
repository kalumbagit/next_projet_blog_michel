import * as React from "react";
import { clsx } from "clsx";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={clsx(
        // layout
        "flex h-10 w-full rounded-md px-3 py-2 text-sm",

        // colors (dark UI)
        "bg-zinc-900 text-zinc-100 border border-zinc-700",
        "placeholder:text-zinc-400",

        // focus
        "focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500",

        // file input support
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-100",

        // disabled
        "disabled:cursor-not-allowed disabled:opacity-50",

        // smooth UX
        "transition-colors duration-200",

        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
