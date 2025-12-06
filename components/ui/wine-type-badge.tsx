"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type WineType = "Rouge" | "Blanc" | "Blanc moelleux" | "Blanc effervescent" | "Rosé";

interface WineTypeBadgeProps {
    type: WineType | string;
    className?: string;
}

const typeColors: Record<string, string> = {
    Rouge: "bg-red-600/80 text-white hover:bg-red-600",
    Blanc: "bg-amber-100 text-amber-900 hover:bg-amber-200",
    "Blanc moelleux": "bg-amber-200 text-amber-900 hover:bg-amber-300",
    "Blanc effervescent": "bg-yellow-100 text-yellow-900 hover:bg-yellow-200",
    Rosé: "bg-pink-200 text-pink-900 hover:bg-pink-300",
};

export function WineTypeBadge({ type, className }: WineTypeBadgeProps) {
    const colorClass = typeColors[type] || "bg-zinc-200 text-zinc-800";

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
