import * as React from "react";
import { clsx } from "clsx";

export type LabelProps =
  React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={clsx(
          "text-sm font-medium leading-none",

          // disabled via htmlFor + input disabled (pattern courant)
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",

          // couleur dark clean
          "text-zinc-200",

          className
        )}
        {...props}
      />
    );
  }
);

Label.displayName = "Label";

export { Label };
