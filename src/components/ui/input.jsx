import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        // "flex h-9 custom-input-field w-full md:text-sm",
        "flex h-10 w-full !px-4 !rounded-full border custom-input-field border-input bg-background px-3 py-2 text-sm ring-offset-background",
        // "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        props["aria-invalid"] && "border-destructive ring-destructive", // 👈 this line
        // "flex h-9 custom-input-field w-full md:text-sm",
        // "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
const InputPassword = React.forwardRef(
  ({ className, type = "text", icon, iconOnClick, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-9 !px-4 !rounded-full custom-input-field w-full md:text-sm pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {icon && (
          <button
            type="button"
            onClick={iconOnClick}
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-500"
          >
            {icon}
          </button>
        )}
      </div>
    );
  }
);

InputPassword.displayName = "InputPassword";

Input.displayName = "Input";

export { Input, InputPassword };
