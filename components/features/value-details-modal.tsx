"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wine, TrendingUp, Euro, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { WineTypeBadge } from "@/components/ui/wine-type-badge";
import { getValueDetails } from "@/app/actions/wine-actions";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ValueDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ValueDetails = Awaited<ReturnType<typeof getValueDetails>>;

export function ValueDetailsModal({ isOpen, onClose }: ValueDetailsModalProps) {
    const [data, setData] = useState<ValueDetails | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && !data) {
            setLoading(true);
            getValueDetails()
                .then(setData)
                .finally(() => setLoading(false));
        }
    }, [isOpen, data]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-hidden rounded-t-3xl bg-background border-t border-border"
                    >
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-2">
                            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-5 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-amber-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Valeur de la Cave</h2>
                                    <p className="text-xs text-muted-foreground">Bouteilles en stock uniquement</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-5 pb-8 overflow-y-auto max-h-[calc(85vh-100px)]">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : data ? (
                                <div className="space-y-6">
                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <GlassCard className="p-3 text-center">
                                            <p className="text-2xl font-bold text-amber-400">
                                                {data.summary.totalValue.toLocaleString("fr-FR")}€
                                            </p>
                                            <p className="text-[10px] text-muted-foreground uppercase">Total</p>
                                        </GlassCard>
                                        <GlassCard className="p-3 text-center">
                                            <p className="text-2xl font-bold">{data.summary.totalBottles}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">Bouteilles</p>
                                        </GlassCard>
                                        <GlassCard className="p-3 text-center">
                                            <p className="text-2xl font-bold">{data.summary.avgPrice}€</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">Prix moy.</p>
                                        </GlassCard>
                                    </div>

                                    {/* By Type */}
                                    {data.byType.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                                Par type
                                            </h3>
                                            <GlassCard className="divide-y divide-border/50">
                                                {data.byType.map((item) => (
                                                    <div key={item.type} className="flex items-center justify-between p-3">
                                                        <div className="flex items-center gap-2">
                                                            <WineTypeBadge type={item.type} />
                                                            <span className="text-sm text-muted-foreground">
                                                                {item.count} btl
                                                            </span>
                                                        </div>
                                                        <span className="font-semibold">
                                                            {item.value.toLocaleString("fr-FR")}€
                                                        </span>
                                                    </div>
                                                ))}
                                            </GlassCard>
                                        </div>
                                    )}

                                    {/* Top Wines */}
                                    {data.topWines.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                                Vins les plus précieux
                                            </h3>
                                            <div className="space-y-2">
                                                {data.topWines.slice(0, 10).map((wine, index) => (
                                                    <Link key={wine.id} href={`/cellar/${wine.id}`} onClick={onClose}>
                                                        <GlassCard className="p-3 flex items-center gap-3 active:scale-[0.98] transition-transform">
                                                            <div className={cn(
                                                                "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold",
                                                                index === 0 ? "bg-amber-500/20 text-amber-400" :
                                                                index === 1 ? "bg-gray-400/20 text-gray-400" :
                                                                index === 2 ? "bg-orange-600/20 text-orange-500" :
                                                                "bg-muted text-muted-foreground"
                                                            )}>
                                                                {index + 1}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium truncate text-sm">
                                                                    {wine.domaine}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground truncate">
                                                                    {wine.designation} {wine.millesime && `· ${wine.millesime}`}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-semibold text-sm">
                                                                    {wine.totalValue.toLocaleString("fr-FR")}€
                                                                </p>
                                                                <p className="text-[10px] text-muted-foreground">
                                                                    {wine.nombre} × {Number(wine.prixAchat).toLocaleString("fr-FR")}€
                                                                </p>
                                                            </div>
                                                            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                                                        </GlassCard>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {data.topWines.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Euro className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                            <p>Aucun prix d'achat renseigné</p>
                                            <p className="text-sm">Ajoutez des prix à vos vins pour voir la valeur</p>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
