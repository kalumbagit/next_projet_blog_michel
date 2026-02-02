import * as React from "react";
import { clsx } from "clsx";

export type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={clsx(
        // layout
        "flex w-full min-h-[80px] resize-none rounded-md px-3 py-2 text-sm",

        // colors (dark UI clean)
        "bg-zinc-900 text-zinc-100 border border-zinc-700",
        "placeholder:text-zinc-400",

        // focus
        "focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500",

        // disabled
        "disabled:cursor-not-allowed disabled:opacity-50",

        // transition (UX polish ✨)
        "transition-colors duration-200",

        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
