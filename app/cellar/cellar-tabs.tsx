"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { Wine, History } from "lucide-react";
import { motion } from "framer-motion";

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
        <div className="relative flex p-1 bg-muted/50 rounded-2xl mb-4">
            {/* Animated Background Pill */}
            <motion.div
                layoutId="tab-indicator"
                className="absolute top-1 bottom-1 bg-background rounded-xl shadow-sm"
                style={{
                    left: currentTab === "current" ? "4px" : "50%",
                    width: "calc(50% - 4px)",
                }}
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            />

            {/* Current Tab */}
            <button
                onClick={() => handleTabChange("current")}
                disabled={isPending}
                className={cn(
                    "relative z-10 flex-1 flex flex-col items-center py-3 rounded-xl transition-colors duration-200",
                    isPending && "opacity-50"
                )}
            >
                <div className="flex items-center gap-2 mb-1">
                    <Wine className={cn(
                        "w-4 h-4 transition-colors duration-200",
                        currentTab === "current" ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className={cn(
                        "text-sm font-medium transition-colors duration-200",
                        currentTab === "current" ? "text-foreground" : "text-muted-foreground"
                    )}>
                        En cave
                    </span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className={cn(
                        "text-2xl font-bold transition-colors duration-200",
                        currentTab === "current" ? "text-primary" : "text-muted-foreground"
                    )}>
                        {inStock.bottles}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        btl
                    </span>
                    <span className="text-xs text-muted-foreground/60 ml-1">
                        · {inStock.references} réf
                    </span>
                </div>
            </button>

            {/* Consumed Tab */}
            <button
                onClick={() => handleTabChange("consumed")}
                disabled={isPending}
                className={cn(
                    "relative z-10 flex-1 flex flex-col items-center py-3 rounded-xl transition-colors duration-200",
                    isPending && "opacity-50"
                )}
            >
                <div className="flex items-center gap-2 mb-1">
                    <History className={cn(
                        "w-4 h-4 transition-colors duration-200",
                        currentTab === "consumed" ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className={cn(
                        "text-sm font-medium transition-colors duration-200",
                        currentTab === "consumed" ? "text-foreground" : "text-muted-foreground"
                    )}>
                        Historique
                    </span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className={cn(
                        "text-2xl font-bold transition-colors duration-200",
                        currentTab === "consumed" ? "text-primary" : "text-muted-foreground"
                    )}>
                        {consumed.references}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        vins bus
                    </span>
                </div>
            </button>
        </div>
    );
}
