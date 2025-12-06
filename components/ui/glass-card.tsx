"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    intensity?: "light" | "medium" | "heavy";
}

export function GlassCard({
    children,
    className,
    intensity = "medium",
    ...props
}: GlassCardProps) {
    const intensityClasses = {
        light: "bg-white/5 backdrop-blur-sm",
        medium: "bg-white/10 backdrop-blur-md",
        heavy: "bg-white/20 backdrop-blur-xl",
    };

    return (
        <div
            className={cn(
                "rounded-2xl border border-white/10 shadow-lg",
                intensityClasses[intensity],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
