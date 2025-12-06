"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Wine, Calendar, MapPin, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { WineTypeBadge } from "@/components/ui/wine-type-badge";
import { Rating } from "@/components/ui/rating";
import { cn } from "@/lib/utils";

interface WineCardProps {
    id: number;
    domaine: string;
    designation?: string | null;
    millesime?: number | null;
    type?: string | null;
    region?: string | null;
    appellation?: string | null;
    nombre: number;
    debutApogee?: number | null;
    finApogee?: number | null;
    rating?: number | null;
    index?: number;
}

export function WineCard({
    id,
    domaine,
    designation,
    millesime,
    type,
    region,
    appellation,
    nombre,
    debutApogee,
    finApogee,
    rating,
    index = 0,
}: WineCardProps) {
    const currentYear = new Date().getFullYear();

    // Determine drinking window status
    const getDrinkWindowStatus = () => {
        if (!debutApogee && !finApogee) return null;
        if (finApogee && currentYear > finApogee) return { label: "Past Peak", color: "text-red-400" };
        if (debutApogee && currentYear < debutApogee) return { label: "Keep", color: "text-blue-400" };
        return { label: "Drink Now", color: "text-green-400" };
    };

    const drinkStatus = getDrinkWindowStatus();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Link href={`/cellar/${id}`}>
                <GlassCard className="p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] cursor-pointer group">
                    <div className="flex items-start justify-between gap-3">
                        {/* Wine Icon */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                            <Wine className="w-6 h-6 text-purple-300" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-foreground truncate">
                                        {domaine}
                                    </h3>
                                    {designation && (
                                        <p className="text-sm text-muted-foreground truncate">
                                            {designation}
                                        </p>
                                    )}
                                </div>
                                {millesime && (
                                    <span className="text-lg font-bold text-foreground/80 ml-2">
                                        {millesime}
                                    </span>
                                )}
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                {type && <WineTypeBadge type={type} className="text-xs" />}
                                {region && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {region}
                                    </span>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-3">
                                    {/* Stock */}
                                    <span className={cn(
                                        "text-sm font-medium",
                                        nombre === 0 ? "text-red-400" : nombre <= 2 ? "text-amber-400" : "text-green-400"
                                    )}>
                                        {nombre} bottle{nombre !== 1 ? "s" : ""}
                                    </span>

                                    {/* Drink Window */}
                                    {drinkStatus && (
                                        <span className={cn("text-xs font-medium", drinkStatus.color)}>
                                            {drinkStatus.label}
                                        </span>
                                    )}
                                </div>

                                {/* Rating */}
                                {rating && <Rating value={rating} size="sm" />}
                            </div>
                        </div>

                        {/* Arrow */}
                        <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-foreground/70 transition-colors flex-shrink-0" />
                    </div>
                </GlassCard>
            </Link>
        </motion.div>
    );
}
