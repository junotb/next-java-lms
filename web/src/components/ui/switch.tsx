import * as React from "react";
import { cn } from "@/lib/utils";

export type SwitchProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, disabled, ...props }, ref) => {
    return (
      <label
        className={cn(
          "relative inline-flex items-center cursor-pointer",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            "relative w-11 h-6 rounded-full transition-colors",
            "bg-input peer-checked:bg-primary",
            "peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2 peer-focus:ring-offset-background",
            "after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
            "after:bg-background after:rounded-full after:h-5 after:w-5",
            "after:transition-transform after:shadow-lg",
            "peer-checked:after:translate-x-5",
            className
          )}
        />
      </label>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
