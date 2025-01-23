"use client";

import { Input } from "./input";
import type { ComponentProps } from "react";

export function CustomInput({
    className,
    ...props
}: ComponentProps<typeof Input>) {
    return (
        <Input
            className={`border-gray-500 focus:ring-gray-500 ${className}`}
            {...props}
        />
    );
}
