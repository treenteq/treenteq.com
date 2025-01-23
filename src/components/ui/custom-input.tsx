"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const CustomInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-12 w-full rounded-lg bg-[#DEE5C9] px-4 py-2 text-sm ring-offset-background placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00A340] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
CustomInput.displayName = "CustomInput";

export { CustomInput };
