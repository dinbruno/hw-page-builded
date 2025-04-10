import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  focusColor?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, focusColor, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
        focusColor && `focus-visible:border-${focusColor} focus-visible:ring-${focusColor}`,
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

export default Input;
