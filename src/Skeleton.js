import * as React from "react";
import { cn } from "./utils.js";

const Skeleton = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
});
Skeleton.displayName = "Skeleton";

export { Skeleton };
