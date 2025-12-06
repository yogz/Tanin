"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { Wine, History } from "lucide-react";

interface CellarTabsProps {
    inStock: {
        references: number;
        bottles: number;
    };
    consumed: {
        references: number;
    };
    currentTab: "current" | "consumed";
}

export function CellarTabs({ inStock, consumed, currentTab }: CellarTabsProps) {
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
                    "flex-1 flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-md transition-all",
                    currentTab === "current"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    isPending && "opacity-50"
                )}
                disabled={isPending}
            >
                <div className="flex items-center gap-2">
                    <Wine className="w-4 h-4" />
                    <span className="text-sm font-medium">En cave</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className={cn(
                        "text-lg font-bold",
                        currentTab === "current" ? "text-primary" : "text-muted-foreground"
                    )}>
                        {inStock.bottles}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        bouteilles
                    </span>
                    <span className="text-xs text-muted-foreground/60">
                        ({inStock.references} réf.)
                    </span>
                </div>
            </button>
            <button
                onClick={() => handleTabChange("consumed")}
                className={cn(
                    "flex-1 flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-md transition-all",
                    currentTab === "consumed"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    isPending && "opacity-50"
                )}
                disabled={isPending}
            >
                <div className="flex items-center gap-2">
                    <History className="w-4 h-4" />
                    <span className="text-sm font-medium">Bues</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className={cn(
                        "text-lg font-bold",
                        currentTab === "consumed" ? "text-primary" : "text-muted-foreground"
                    )}>
                        {consumed.references}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        références
                    </span>
                </div>
            </button>
        </div>
    );
}
