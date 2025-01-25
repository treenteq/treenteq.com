"use client";

import { Button } from "./button";
import { type ButtonProps } from "./button";

export function CustomButton({ className, ...props }: ButtonProps) {
    return (
        <Button
            className={`bg-[#00A340] hover:bg-gray-800 text-white ${className}`}
            {...props}
        />
    );
}
