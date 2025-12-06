"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Wine, Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { updateStock, drinkWine } from "@/app/actions/wine-actions";
import { cn } from "@/lib/utils";

interface WineActionsProps {
    wineId: number;
    currentStock: number;
    drinkStatus: {
        label: string;
        color: string;
        bg: string;
    } | null;
    debutApogee?: number | null;
    finApogee?: number | null;
}

export function WineActions({
    wineId,
    currentStock,
    drinkStatus,
    debutApogee,
    finApogee,
}: WineActionsProps) {
    const router = useRouter();
    const [stock, setStock] = useState(currentStock);
    const [isPending, startTransition] = useTransition();
    const [isDrinking, setIsDrinking] = useState(false);

    const handleUpdateStock = async (delta: number) => {
        startTransition(async () => {
            const result = await updateStock(wineId, delta);
            if (result.success && result.newCount !== undefined) {
                setStock(result.newCount);
                router.refresh();
            }
        });
    };

    const handleDrinkOne = async () => {
        if (stock <= 0) return;
        setIsDrinking(true);
        startTransition(async () => {
            const result = await drinkWine(wineId);
            if (result.success && result.newCount !== undefined) {
                setStock(result.newCount);
                router.refresh();
            }
            setIsDrinking(false);
        });
    };

    return (
        <>
            {/* Stock Card */}
            <GlassCard className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">In Stock</p>
                        <p className="text-3xl font-bold">{stock} bottle{stock !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => handleUpdateStock(-1)}
                            disabled={isPending || stock <= 0}
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Minus className="w-4 h-4" />}
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => handleUpdateStock(1)}
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>
                {drinkStatus && (
                    <div className={`mt-3 px-3 py-2 rounded-lg ${drinkStatus.bg}`}>
                        <span className={`text-sm font-medium ${drinkStatus.color}`}>
                            {drinkStatus.label}
                            {debutApogee && finApogee && (
                                <span className="text-muted-foreground ml-1">
                                    ({debutApogee} - {finApogee})
                                </span>
                            )}
                        </span>
                    </div>
                )}
            </GlassCard>

            {/* Actions at bottom */}
            <div className="grid grid-cols-2 gap-3 pb-8">
                <Button variant="outline" className="h-12">
                    Edit Wine
                </Button>
                <Button
                    className={cn(
                        "h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
                        stock <= 0 && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={handleDrinkOne}
                    disabled={isDrinking || stock <= 0}
                >
                    {isDrinking ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Wine className="w-4 h-4 mr-2" />
                    )}
                    {stock <= 0 ? "No bottles" : "Drink One"}
                </Button>
            </div>
        </>
    );
}
