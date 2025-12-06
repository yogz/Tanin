"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
    value: number;
    maxValue?: number;
    size?: "sm" | "md" | "lg";
    showValue?: boolean;
    className?: string;
}

export function Rating({
    value,
    maxValue = 5,
    size = "md",
    showValue = false,
    className,
}: RatingProps) {
    const sizeClasses = {
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-5 h-5",
    };

    const normalizedValue = Math.min(Math.max(0, value), maxValue);
    const fullStars = Math.floor(normalizedValue);
    const hasHalfStar = normalizedValue % 1 >= 0.5;

    return (
        <div className={cn("flex items-center gap-0.5", className)}>
            {Array.from({ length: maxValue }).map((_, i) => (
                <Star
                    key={i}
                    className={cn(
                        sizeClasses[size],
                        "transition-colors duration-200",
                        i < fullStars
                            ? "fill-amber-400 text-amber-400"
                            : i === fullStars && hasHalfStar
                                ? "fill-amber-400/50 text-amber-400"
                                : "fill-transparent text-muted-foreground/30"
                    )}
                />
            ))}
            {showValue && (
                <span className="ml-1.5 text-sm text-muted-foreground">
                    {value.toFixed(1)}
                </span>
            )}
        </div>
    );
}
