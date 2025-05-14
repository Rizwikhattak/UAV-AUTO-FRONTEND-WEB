"use client";
import React from "react";
import { cn } from "@/lib/utils"; // Optional: if you use a classnames helper

const variantMapping = {
  h1: {
    component: "h1",
    className: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  },
  h2: {
    component: "h2",
    className:
      "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  },
  h3: {
    component: "h3",
    className: "scroll-m-20 text-2xl font-semibold tracking-tight",
  },
  h4: {
    component: "h4",
    className: "scroll-m-20 text-xl font-semibold tracking-tight",
  },
  large: {
    component: "div",
    className: "text-lg font-semibold",
  },
  lead: {
    component: "p",
    className: "text-xl text-muted-foreground",
  },
  muted: {
    component: "p",
    className: "text-sm text-muted-foreground",
  },
  p: {
    component: "p",
    className: "leading-7 ",
  },
  small: {
    component: "small",
    className: "text-sm font-normal leading-none",
  },
};

export function Typography({ variant = "p", children, className, ...props }) {
  // Get the component and default classes from our mapping:
  const Component = variantMapping[variant]?.component || "p";
  const defaultClassName = variantMapping[variant]?.className || "";
  // Merge any additional className passed via props
  const combinedClassName = cn(defaultClassName, className);

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
}
