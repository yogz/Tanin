"use client";

import { ChevronRight, Sparkles, Wine, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/auth/logout-button";
import { useTheme } from "@/components/theme/theme-provider";

// Dynamically import chart components to reduce initial bundle size
const MaturityChart = dynamic(() => import("@/components/charts/maturity-chart").then(mod => ({ default: mod.MaturityChart })), {
    ssr: false,
    loading: () => <div className="px-5 mt-6"><GlassCard className="p-4"><div className="h-32 w-full animate-pulse bg-muted/20 rounded" /></GlassCard></div>
});

const DistributionCharts = dynamic(() => import("@/components/charts/distribution-charts").then(mod => ({ default: mod.DistributionCharts })), {
    ssr: false,
    loading: () => <div className="px-5 mt-6 space-y-4"><div className="h-[600px] animate-pulse bg-muted/20 rounded" /></div>
});

// Types
interface WineSuggestion {
    id: number;
    domaine: string | null;
    designation: string | null;
    appellation: string | null;
    region: string | null;
    millesime: number | null;
    type: string | null;
    nombre: number | null;
}

interface Stats {
    totalBottles: number;
    totalValue: number;
}

interface Maturity {
    keep: number;
    drink: number;
    drinkWait: number;
    old: number;
}

interface VintageData {
    year: number;
    count: number;
}

interface DistributionItem {
    name: string;
    count: number;
}

interface HomepageClientProps {
    stats: Stats;
    suggestions: WineSuggestion[];
    maturity: Maturity;
    vintages: VintageData[];
    byRegion: DistributionItem[];
    byAppellation: DistributionItem[];
    byCepage: DistributionItem[];
    userName?: string;
}

// Chart configs moved to chart components

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function HomepageClient({
    stats,
    suggestions,
    maturity,
    vintages,
    byRegion,
    byAppellation,
    byCepage,
    userName,
}: HomepageClientProps) {
    const { themeConfig } = useTheme();

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen"
        >
            {/* Hero Header */}
            <div className="relative overflow-hidden">
                <div className={cn("absolute inset-0 bg-gradient-to-br", themeConfig.gradient)} />
                <div className={cn("absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl", themeConfig.glowBg1)} />
                <div className={cn("absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl", themeConfig.glowBg2)} />

                <motion.div variants={itemVariants} className="relative px-5 pt-14 pb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1
                                className={cn("text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent", themeConfig.primary)}
                                style={{ textShadow: `0 0 40px ${themeConfig.glow}` }}
                            >
                                Tanin
                            </h1>
                            <p className="text-muted-foreground mt-1">Votre cave, sublimée</p>
                        </div>
                        <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center backdrop-blur-sm border border-white/10", themeConfig.accent1)}>
                            <Wine className={cn("w-7 h-7", themeConfig.icon)} />
                        </div>
                    </div>
                    {userName && (
                        <div className="flex justify-end">
                            <LogoutButton userName={userName} />
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="px-5 -mt-1">
                <div className="grid grid-cols-3 gap-3">
                    <Link href="/cellar">
                        <GlassCard className="p-4 text-center hover:bg-white/5 transition-all active:scale-[0.98] cursor-pointer">
                            <div className={cn("w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br flex items-center justify-center", themeConfig.accent1)}>
                                <Wine className={cn("w-5 h-5", themeConfig.icon)} />
                            </div>
                            <p className="text-2xl font-bold">{stats.totalBottles}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Bouteilles</p>
                        </GlassCard>
                    </Link>

                    <Link href="/cellar?maturity=drink">
                        <GlassCard className="p-4 text-center hover:bg-white/5 transition-all active:scale-[0.98] cursor-pointer">
                            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-green-400" />
                            </div>
                            <p className="text-2xl font-bold">{maturity.drink}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">À Boire</p>
                        </GlassCard>
                    </Link>

                    <Link href="/value">
                        <GlassCard className="p-4 text-center hover:bg-white/5 transition-all active:scale-[0.98] cursor-pointer">
                            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-amber-400" />
                            </div>
                            <p className="text-2xl font-bold">{stats.totalValue > 0 ? `${Math.round(stats.totalValue)}€` : "—"}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Valeur</p>
                        </GlassCard>
                    </Link>
                </div>
            </motion.div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <motion.div variants={itemVariants} className="px-5 mt-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">À Déguster</h2>
                        <Link href="/cellar" className="text-xs text-primary flex items-center gap-1 hover:underline">
                            Voir tout <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="space-y-2">
                        {suggestions.map((wine, index) => (
                            <motion.div
                                key={wine.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                            >
                                <Link href={`/cellar/${wine.id}`}>
                                    <GlassCard className="p-3 flex items-center gap-3 hover:bg-white/5 transition-all active:scale-[0.98]">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                                            <Sparkles className="w-6 h-6 text-green-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{wine.domaine}</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {wine.appellation} {wine.millesime && `· ${wine.millesime}`}
                                            </p>
                                        </div>
                                        <span className="text-[10px] font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full whitespace-nowrap">
                                            À boire
                                        </span>
                                    </GlassCard>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Maturity Chart - Dynamically loaded */}
            <motion.div variants={itemVariants}>
                <MaturityChart maturity={maturity} />
            </motion.div>

            {/* Distribution Charts - Dynamically loaded */}
            <motion.div variants={itemVariants}>
                <DistributionCharts
                    vintages={vintages}
                    byRegion={byRegion}
                    byAppellation={byAppellation}
                    byCepage={byCepage}
                />
            </motion.div>
        </motion.div>
    );
}
