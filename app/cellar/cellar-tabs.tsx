"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { Wine, History } from "lucide-react";

interface CellarTabsProps {
    inStockCount: number;
    consumedCount: number;
    currentTab: "current" | "consumed";
}

export function CellarTabs({ inStockCount, consumedCount, currentTab }: CellarTabsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleTabChange = (tab: "current" | "consumed") => {
        const params = new URLSearchParams(searchParams.toString());
        if (tab === "consumed") {
            params.set("tab", "consumed");
        } else {
            params.delete("tab");
        }
        startTransition(() => {
            router.push(`/cellar?${params.toString()}`);
        });
    };

    return (
        <div className="flex gap-1 p-1 bg-muted/50 rounded-lg mb-3">
            <button
                onClick={() => handleTabChange("current")}
                className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                    currentTab === "current"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    isPending && "opacity-50"
                )}
                disabled={isPending}
            >
                <Wine className="w-4 h-4" />
                <span>En cave</span>
                <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full",
                    currentTab === "current" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                    {inStockCount}
                </span>
            </button>
            <button
                onClick={() => handleTabChange("consumed")}
                className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                    currentTab === "consumed"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    isPending && "opacity-50"
                )}
                disabled={isPending}
            >
                <History className="w-4 h-4" />
                <span>Bues</span>
                <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full",
                    currentTab === "consumed" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                    {consumedCount}
                </span>
            </button>
        </div>
    );
}
