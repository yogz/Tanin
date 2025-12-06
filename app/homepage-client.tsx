"use client";

import { MapPin, Tag, Grape, ChevronRight, Sparkles, Wine, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Label, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

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
    peak: number;
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
}

// Chart Configs
const maturityChartConfig = {
    keep: { label: "À Garder", color: "hsl(217, 91%, 60%)" },
    peak: { label: "À Boire", color: "hsl(142, 71%, 45%)" },
    old: { label: "Passé", color: "hsl(25, 95%, 53%)" },
} satisfies ChartConfig;

const regionChartConfig = {
    count: { label: "Bouteilles", color: "hsl(262, 83%, 58%)" },
} satisfies ChartConfig;

const appellationChartConfig = {
    count: { label: "Bouteilles", color: "hsl(330, 81%, 60%)" },
} satisfies ChartConfig;

const cepageChartConfig = {
    count: { label: "Bouteilles", color: "hsl(187, 85%, 53%)" },
} satisfies ChartConfig;

const vintageChartConfig = {
    count: { label: "Bouteilles", color: "hsl(262, 83%, 58%)" },
} satisfies ChartConfig;

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
}: HomepageClientProps) {
    const router = useRouter();
    const sortedVintages = [...vintages].sort((a, b) => a.year - b.year);

    const maturityData = [
        { name: "keep", value: maturity.keep, fill: "hsl(217, 91%, 60%)" },
        { name: "peak", value: maturity.peak, fill: "hsl(142, 71%, 45%)" },
        { name: "old", value: maturity.old, fill: "hsl(25, 95%, 53%)" },
    ];

    const totalMaturity = maturity.keep + maturity.peak + maturity.old;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen"
        >
            {/* Hero Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-background to-background" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />

                <motion.div variants={itemVariants} className="relative px-5 pt-14 pb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1
                                className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
                                style={{ textShadow: '0 0 40px rgba(139, 92, 246, 0.3)' }}
                            >
                                Tanin
                            </h1>
                            <p className="text-muted-foreground mt-1">Votre cave, sublimée</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center backdrop-blur-sm border border-white/10">
                            <Wine className="w-7 h-7 text-purple-400" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="px-5 -mt-1">
                <div className="grid grid-cols-3 gap-3">
                    <Link href="/cellar">
                        <GlassCard className="p-4 text-center hover:bg-white/5 transition-all active:scale-[0.98] cursor-pointer">
                            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <Wine className="w-5 h-5 text-purple-400" />
                            </div>
                            <p className="text-2xl font-bold">{stats.totalBottles}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Bouteilles</p>
                        </GlassCard>
                    </Link>

                    <Link href="/cellar?maturity=peak">
                        <GlassCard className="p-4 text-center hover:bg-white/5 transition-all active:scale-[0.98] cursor-pointer">
                            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-green-400" />
                            </div>
                            <p className="text-2xl font-bold">{maturity.peak}</p>
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

            {/* Maturity Chart */}
            <motion.div variants={itemVariants} className="px-5 mt-6">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Maturité</h2>

                <GlassCard className="p-4">
                    <div className="flex items-center gap-4">
                        <ChartContainer config={maturityChartConfig} className="w-32 h-32">
                            <PieChart>
                                <Pie
                                    data={maturityData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={35}
                                    outerRadius={50}
                                    strokeWidth={2}
                                    stroke="hsl(var(--background))"
                                >
                                    {maturityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                    <Label
                                        content={({ viewBox }) => {
                                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                return (
                                                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-xl font-bold">
                                                            {totalMaturity}
                                                        </tspan>
                                                    </text>
                                                );
                                            }
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>

                        <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                    <span className="text-sm">À Garder</span>
                                </div>
                                <span className="font-semibold">{maturity.keep}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                    <span className="text-sm">À Boire</span>
                                </div>
                                <span className="font-semibold">{maturity.peak}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                                    <span className="text-sm">Passé</span>
                                </div>
                                <span className="font-semibold">{maturity.old}</span>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Vintage Distribution */}
            <motion.div variants={itemVariants} className="px-5 mt-6">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Millésimes</h2>

                <GlassCard className="p-4">
                    <ChartContainer config={vintageChartConfig} className="h-40 w-full">
                        <BarChart data={sortedVintages} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <XAxis
                                dataKey="year"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                fontSize={10}
                                tickFormatter={(value) => `'${String(value).slice(-2)}`}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar
                                dataKey="count"
                                fill="var(--color-count)"
                                radius={[4, 4, 0, 0]}
                                className="cursor-pointer"
                                onClick={(data) => {
                                    if (data && data.year) {
                                        router.push(`/cellar?millesime=${data.year}`);
                                    }
                                }}
                            />
                        </BarChart>
                    </ChartContainer>
                </GlassCard>
            </motion.div>

            {/* Distribution Charts */}
            <motion.div variants={itemVariants} className="px-5 mt-6 space-y-4">
                {/* Regions */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Régions</h2>
                    </div>
                    <GlassCard className="p-4">
                        <ChartContainer config={regionChartConfig} className="h-[180px] w-full !aspect-auto">
                            <BarChart data={byRegion.slice(0, 5)} layout="vertical" margin={{ left: 80, right: 20 }}>
                                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={80} fontSize={11} />
                                <XAxis type="number" hide />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar
                                    dataKey="count"
                                    fill="var(--color-count)"
                                    radius={[0, 4, 4, 0]}
                                    className="cursor-pointer"
                                    onClick={(data) => {
                                        if (data && data.name) {
                                            router.push(`/cellar?region=${encodeURIComponent(data.name)}`);
                                        }
                                    }}
                                />
                            </BarChart>
                        </ChartContainer>
                    </GlassCard>
                </div>

                {/* Appellations */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4 text-pink-400" />
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Appellations</h2>
                    </div>
                    <GlassCard className="p-4">
                        <ChartContainer config={appellationChartConfig} className="h-[180px] w-full !aspect-auto">
                            <BarChart data={byAppellation.slice(0, 5)} layout="vertical" margin={{ left: 90, right: 20 }}>
                                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={90} fontSize={11} />
                                <XAxis type="number" hide />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar
                                    dataKey="count"
                                    fill="var(--color-count)"
                                    radius={[0, 4, 4, 0]}
                                    className="cursor-pointer"
                                    onClick={(data) => {
                                        if (data && data.name) {
                                            router.push(`/cellar?appellation=${encodeURIComponent(data.name)}`);
                                        }
                                    }}
                                />
                            </BarChart>
                        </ChartContainer>
                    </GlassCard>
                </div>

                {/* Cépages */}
                <div className="pb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <Grape className="w-4 h-4 text-cyan-400" />
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Cépages</h2>
                    </div>
                    <GlassCard className="p-4">
                        <ChartContainer config={cepageChartConfig} className="h-[180px] w-full !aspect-auto">
                            <BarChart data={byCepage.slice(0, 5)} layout="vertical" margin={{ left: 80, right: 20 }}>
                                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={80} fontSize={11} />
                                <XAxis type="number" hide />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar
                                    dataKey="count"
                                    fill="var(--color-count)"
                                    radius={[0, 4, 4, 0]}
                                    className="cursor-pointer"
                                    onClick={(data) => {
                                        if (data && data.name) {
                                            router.push(`/cellar?cepage=${encodeURIComponent(data.name)}`);
                                        }
                                    }}
                                />
                            </BarChart>
                        </ChartContainer>
                    </GlassCard>
                </div>
            </motion.div>
        </motion.div>
    );
}
