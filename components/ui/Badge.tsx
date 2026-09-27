import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border border-ink/10 bg-paper px-3 py-1 text-xs font-medium text-ink-soft",
        className
      )}
      {...props}
    />
  );
}
