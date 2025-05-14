import React from "react";
import { cn } from "@/lib/utils";
const SpinnerCommon = ({ className }) => {
  return (
    <div className="flex items-center justify-center py-2">
      <div
        className={cn(
          "h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-custom border-r-transparent",
          className
        )}
      ></div>
    </div>
  );
};

export default SpinnerCommon;
