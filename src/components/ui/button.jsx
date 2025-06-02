import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import SpinnerCommon from "../Common/SpinnerCommon";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground cursor-pointer shadow hover:bg-primary/90",
        destructive:
          "bg-destructive border border-destructive cursor-pointer text-destructive-foreground shadow-sm hover:bg-transparent hover:text-destructive transition-all duration-200",
        "hover-outline-destructive":
          "bg-transparent border border-destructive cursor-pointer text-destructive shadow-sm hover:bg-accent transition-all duration-200",
        outline:
          "border border-input bg-background shadow-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
        "outline-blue":
          "border border-primary-custom bg-background cursor-pointer shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground cursor-pointer shadow-sm hover:bg-secondary/80",
        gray: "bg-gray-400 text-gray-500 cursor-pointer shadow-sm hover:bg-gray-600/80",
        ghost: "hover:bg-accent cursor-pointer hover:text-accent-foreground",
        link: "text-primary underline-offset-4 cursor-pointer hover:underline",
        "hover-blue-full":
          "px-4 py-2 w-full bg-primary-custom border cursor-pointer border-primary-custom rounded-full text-white transition-all duration-200 hover:bg-blue-700 ",
        "hover-blue-loader-fit":
          "px-4 py-2 w-fit bg-white border cursor-pointer border-primary-custom rounded-full text-white transition-all duration-200 ",
        "hover-blue-loader-full":
          "px-4 py-2 w-full bg-white border cursor-pointer border-primary-custom rounded-full text-white transition-all duration-200 ",
        "hover-blue-fit":
          "px-4 py-2 w-fit bg-primary-custom border cursor-pointer border-primary-custom rounded-full text-white transition-all duration-200 hover:bg-blue-700 ",
        "hover-outline-blue":
          "border border-primary-custom bg-background cursor-pointer shadow-sm hover:bg-accent hover:text-accent-foreground",
        "hover-outline-purple":
          "!px-3 !py-1 w-fit rounded-full border-[1.5px] cursor-pointer border-purple-400 text-purple-700  hover:bg-purple-600 hover:border-purple-600 hover:text-white transition-all duration-200",
        "hover-outline-gray":
          "!px-3 !py-1 w-fit rounded-full border-[1.5px] cursor-pointer border-pgrayurple-400 text-gray-700  hover:bg-gray-600 hover:border-gray-600 hover:text-white transition-all duration-200",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-full px-3 text-xs",
        lg: "h-10 rounded-full px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  (
    {
      children,
      className,
      loaderStyle = "",
      variant,
      size,
      isLoading = false,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // const isLoadingVariant = isLoading
    //   ? variant?.includes("hover-blue-fit") || variant?.includes("destructive")
    //     ? "hover-blue-loader-fit"
    //     : "hover-blue-loader-full"
    //   : variant;
    return (
      <Comp
        className={cn(buttonVariants({ variant: variant, size, className }))}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
