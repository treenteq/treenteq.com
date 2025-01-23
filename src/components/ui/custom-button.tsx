"use client";

import { Button } from "./button";
import { type ButtonProps } from "./button";

export function CustomButton({ className, ...props }: ButtonProps) {
    return (
        <Button
            className={`bg-black hover:bg-gray-800 text-white ${className}`}
            {...props}
        />
    );
}
