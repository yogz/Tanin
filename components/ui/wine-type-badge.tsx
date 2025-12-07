"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useWineTheme } from "@/lib/contexts/wine-theme-context";

type WineType = "Rouge" | "Blanc" | "Blanc moelleux" | "Blanc effervescent" | "Rosé";

interface WineTypeBadgeProps {
    type: WineType | string;
    className?: string;
}

export function WineTypeBadge({ type, className }: WineTypeBadgeProps) {
    const { colors } = useWineTheme();
    const colorClass = colors[type as keyof typeof colors] || "bg-zinc-200 text-zinc-800";

    return (
        <Badge
            variant="secondary"
            className={cn(
                "font-medium border-0 shadow-sm",
                colorClass,
                className
            )}
        >
            {type}
        </Badge>
    );
}
