"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Wine, MapPin, ChevronRight, Minus, Star, Calendar } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { WineTypeBadge } from "@/components/ui/wine-type-badge";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import { updateStock } from "@/app/actions/wine-actions";

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
    updatedAt?: Date | string | null;
    isConsumed?: boolean;
    index?: number;
}

export function WineCard({
    id,
    domaine,
    designation,
    millesime,
    type,
    region,
    nombre: initialNombre,
    debutApogee,
    finApogee,
    updatedAt,
    isConsumed = false,
    index = 0,
}: WineCardProps) {
    const router = useRouter();
    const [nombre, setNombre] = useState(initialNombre);
    const [isPending, startTransition] = useTransition();
    const [showAction, setShowAction] = useState(false);

    const x = useMotionValue(0);
    const background = useTransform(
        x,
        [-100, 0],
        ["hsl(142, 71%, 45%)", "transparent"]
    );
    const actionOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);

    const currentYear = new Date().getFullYear();

    const getDrinkWindowStatus = () => {
        if (!debutApogee && !finApogee) return null;
        if (finApogee && currentYear > finApogee) return { label: "Passé", color: "text-red-400", bg: "bg-red-400/10" };
        if (debutApogee && currentYear < debutApogee) return { label: "À garder", color: "text-blue-400", bg: "bg-blue-400/10" };
        return { label: "À boire", color: "text-green-400", bg: "bg-green-400/10" };
    };

    const drinkStatus = getDrinkWindowStatus();

    const formatConsumedDate = (date: Date | string | null | undefined) => {
        if (!date) return null;
        const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
        if (isNaN(d.getTime())) return null;
        
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        d.setHours(0, 0, 0, 0);
        
        const diffTime = now.getTime() - d.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return "Aujourd'hui";
        if (diffDays === 1) return "Hier";
        if (diffDays < 7) return `Il y a ${diffDays} jours`;
        if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
        }
        if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `Il y a ${months} mois`;
        }
        const years = Math.floor(diffDays / 365);
        return `Il y a ${years} an${years > 1 ? 's' : ''}`;
    };

    const consumedDate = isConsumed && updatedAt ? formatConsumedDate(updatedAt) : null;

    const handleDrink = async () => {
        if (nombre <= 0) return;

        startTransition(async () => {
            const result = await updateStock(id, -1);
            if (result.success && result.newCount !== undefined) {
                setNombre(result.newCount);
            }
        });
    };

    const handleDragEnd = (_: never, info: PanInfo) => {
        if (info.offset.x < -80 && nombre > 0) {
            setShowAction(true);
            handleDrink();
            setTimeout(() => setShowAction(false), 1500);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            className="relative overflow-hidden rounded-2xl"
        >
            {/* Swipe Action Background */}
            <motion.div
                className="absolute inset-0 flex items-center justify-end pr-6 rounded-2xl"
                style={{ background }}
            >
                <motion.div
                    style={{ opacity: actionOpacity }}
                    className="flex items-center gap-2 text-white font-medium"
                >
                    <Minus className="w-5 h-5" />
                    <span>Boire</span>
                </motion.div>
            </motion.div>

            {/* Success feedback */}
            {showAction && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-green-500/90 rounded-2xl z-20"
                >
                    <div className="flex items-center gap-2 text-white font-medium">
                        <Wine className="w-5 h-5" />
                        <span>Santé !</span>
                    </div>
                </motion.div>
            )}

            {/* Card */}
            <motion.div
                drag={nombre > 0 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={{ left: 0.3, right: 0 }}
                onDragEnd={handleDragEnd}
                style={{ x }}
                whileTap={{ cursor: "grabbing" }}
                className="relative z-10"
            >
                <Link href={`/cellar/${id}`}>
                    <GlassCard className={cn(
                        "p-4 transition-all duration-200 active:scale-[0.98] cursor-pointer group",
                        isPending && "opacity-70"
                    )}>
                        <div className="flex items-start gap-3">
                            {/* Wine Icon with Type Color */}
                            <div className={cn(
                                "flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden",
                                type?.toLowerCase().includes("rouge") ? "bg-gradient-to-br from-red-500/30 to-red-700/20" :
                                type?.toLowerCase().includes("blanc") ? "bg-gradient-to-br from-amber-200/40 to-yellow-100/30" :
                                type?.toLowerCase().includes("rosé") ? "bg-gradient-to-br from-pink-300/40 to-rose-200/30" :
                                "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
                            )}>
                                <Wine className={cn(
                                    "w-7 h-7",
                                    type?.toLowerCase().includes("rouge") ? "text-red-400" :
                                    type?.toLowerCase().includes("blanc") ? "text-amber-600" :
                                    type?.toLowerCase().includes("rosé") ? "text-pink-400" :
                                    "text-purple-300"
                                )} />
                                {/* Vintage Badge */}
                                {millesime && (
                                    <div className="absolute -bottom-1 -right-1 bg-background/90 backdrop-blur-sm text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-border/50">
                                        {millesime}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                {/* Header */}
                                <h3 className="font-semibold text-foreground truncate leading-tight">
                                    {domaine}
                                </h3>
                                {designation && (
                                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                                        {designation}
                                    </p>
                                )}

                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                    {type && <WineTypeBadge type={type} className="text-[10px]" />}
                                    {region && (
                                        <span className="text-[11px] text-muted-foreground flex items-center gap-0.5 bg-muted/50 px-1.5 py-0.5 rounded-md">
                                            <MapPin className="w-3 h-3" />
                                            {region}
                                        </span>
                                    )}
                                    {drinkStatus && !isConsumed && (
                                        <span className={cn(
                                            "text-[10px] font-medium px-1.5 py-0.5 rounded-md",
                                            drinkStatus.color,
                                            drinkStatus.bg
                                        )}>
                                            {drinkStatus.label}
                                        </span>
                                    )}
                                    {consumedDate && (
                                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md text-orange-400 bg-orange-400/10 flex items-center gap-0.5">
                                            <Calendar className="w-3 h-3" />
                                            {consumedDate}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Right side: Stock + Arrow */}
                            <div className="flex flex-col items-end justify-between h-full gap-2">
                                {/* Stock Badge */}
                                <div className={cn(
                                    "flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold",
                                    nombre === 0 ? "bg-red-500/10 text-red-400" :
                                    nombre <= 2 ? "bg-amber-500/10 text-amber-400" :
                                    "bg-green-500/10 text-green-400"
                                )}>
                                    <span>{nombre}</span>
                                    <Wine className="w-3.5 h-3.5" />
                                </div>

                                {/* Arrow */}
                                <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
                            </div>
                        </div>
                    </GlassCard>
                </Link>
            </motion.div>
        </motion.div>
    );
}
