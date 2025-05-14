import { useState } from "react";
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  Warning: {
    icon: AlertTriangle,
    className: "bg-amber-50 text-amber-800 border-amber-200",
    iconClassName: "text-amber-500",
  },
  Error: {
    icon: AlertCircle,
    className: "bg-red-50 text-red-800 border-red-200",
    iconClassName: "text-red-500",
  },
  Info: {
    icon: Info,
    className: "bg-blue-50 text-blue-800 border-blue-200",
    iconClassName: "text-blue-500",
  },
  Success: {
    icon: CheckCircle,
    className: "bg-green-50 text-green-800 border-green-200",
    iconClassName: "text-green-500",
  },
};

export function AlertBanner({
  // title,
  // description,
  message,
  type = "Info",
  className,
  onDismiss,
  closable,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  const {
    icon: Icon,
    className: variantClassName,
    iconClassName,
  } = VARIANTS[type] || VARIANTS.Info;

  return (
    <div
      className={cn(
        "sticky top-0 z-50 w-full border-b px-4 py-3 flex items-center gap-3",
        variantClassName,
        className
      )}
      {...props}
    >
      <Icon className={cn("h-5 w-5 shrink-0", iconClassName)} />
      <div className="flex-1">
        {message && (
          <h5 className="font-medium leading-none tracking-tight">{message}</h5>
        )}
        {/* {title && (
          <h5 className="font-medium leading-none tracking-tight">{title}</h5>
        )}
        {description && (
          <div className="mt-1 text-sm opacity-90">{description}</div>
        )} */}
      </div>
      <div className="sticky top-0 right-4 ">
        {closable && (
          <button
            onClick={handleDismiss}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-md hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/10"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
