"use client";

import { MapPin, Tag, Grape, ChevronRight, Sparkles, Wine } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Label } from "recharts";

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
    keep: { label: "À Garder", color: "hsl(217, 91%, 60%)" }, // blue-500
    peak: { label: "À Boire", color: "hsl(142, 71%, 45%)" }, // green-500  
    old: { label: "Passé", color: "hsl(25, 95%, 53%)" }, // orange-500
} satisfies ChartConfig;

const regionChartConfig = {
    count: { label: "Bouteilles", color: "hsl(262, 83%, 58%)" }, // violet-500
} satisfies ChartConfig;

const appellationChartConfig = {
    count: { label: "Bouteilles", color: "hsl(330, 81%, 60%)" }, // pink-500
} satisfies ChartConfig;

const cepageChartConfig = {
    count: { label: "Bouteilles", color: "hsl(187, 85%, 53%)" }, // cyan-400
} satisfies ChartConfig;

const vintageChartConfig = {
    count: { label: "Bouteilles", color: "hsl(262, 83%, 58%)" },
} satisfies ChartConfig;

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

    // Prepare maturity data for pie chart
    const maturityData = [
        { name: "keep", value: maturity.keep, fill: "hsl(217, 91%, 60%)" },
        { name: "peak", value: maturity.peak, fill: "hsl(142, 71%, 45%)" },
        { name: "old", value: maturity.old, fill: "hsl(25, 95%, 53%)" },
    ];

    const totalMaturity = maturity.keep + maturity.peak + maturity.old;

    return (
        <div className="min-h-screen">

            {/* ═══════════════════════════════════════════════════════════════════
          HERO: TANIN TITLE
      ═══════════════════════════════════════════════════════════════════ */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-background to-background" />
                <div className="relative px-4 pt-12 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                            <Wine className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-violet-400" style={{ textShadow: '0 0 20px rgba(139, 92, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.4), 0 0 60px rgba(59, 130, 246, 0.3)' }}>Tanin</h1>
                            <p className="text-muted-foreground">Votre cave, sublimée</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Card */}
            <div className="px-4 -mt-2">
                <GlassCard className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold">{stats.totalBottles}</p>
                            <p className="text-xs text-muted-foreground">Bouteilles</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{maturity.peak}</p>
                            <p className="text-xs text-muted-foreground">À Boire</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">€{Math.round(stats.totalValue / 1000)}k</p>
                            <p className="text-xs text-muted-foreground">Valeur</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
          SUGGESTIONS
      ═══════════════════════════════════════════════════════════════════ */}
            <div className="px-4 mt-6 space-y-3">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-sm font-medium text-muted-foreground">À Déguster</h2>
                    <Link href="/cellar" className="text-xs text-primary flex items-center gap-1">
                        Voir tout <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>

                <GlassCard className="divide-y divide-white/5">
                    {suggestions.map((wine) => (
                        <Link
                            key={wine.id}
                            href={`/cellar/${wine.id}`}
                            className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{wine.domaine}</p>
                                <p className="text-sm text-muted-foreground truncate">
                                    {wine.appellation} · {wine.millesime}
                                </p>
                            </div>
                            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                                Apogée
                            </span>
                        </Link>
                    ))}
                </GlassCard>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
          MATURITY PIE CHART
      ═══════════════════════════════════════════════════════════════════ */}
            <div className="px-4 mt-6 space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground px-1">Maturité</h2>

                <GlassCard className="p-4">
                    <ChartContainer config={maturityChartConfig} className="mx-auto aspect-square h-[200px]">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie
                                data={maturityData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={50}
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
                                                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                        {totalMaturity}
                                                    </tspan>
                                                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-xs">
                                                        Bouteilles
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>

                    {/* Legend */}
                    <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-xs text-muted-foreground">À Garder ({maturity.keep})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-xs text-muted-foreground">À Boire ({maturity.peak})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500" />
                            <span className="text-xs text-muted-foreground">Passé ({maturity.old})</span>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
          VINTAGES BAR CHART
      ═══════════════════════════════════════════════════════════════════ */}
            <div className="px-4 mt-6 space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground px-1">Millésimes</h2>

                <GlassCard className="p-4">
                    <ChartContainer config={vintageChartConfig} className="h-48 w-full">
                        <BarChart data={sortedVintages} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                            <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
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
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
          REGIONS HORIZONTAL BAR CHART
      ═══════════════════════════════════════════════════════════════════ */}
            <div className="px-4 mt-6 space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <h2 className="text-sm font-medium text-muted-foreground">Régions <span className="text-primary">({byRegion.length})</span></h2>
                </div>

                <GlassCard className="p-4">
                    <ChartContainer config={regionChartConfig} className="h-[200px] w-full !aspect-auto">
                        <BarChart data={byRegion.slice(0, 6)} layout="vertical" margin={{ left: 80, right: 20 }}>
                            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={80} />
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

            {/* ═══════════════════════════════════════════════════════════════════
          APPELLATIONS HORIZONTAL BAR CHART
      ═══════════════════════════════════════════════════════════════════ */}
            <div className="px-4 mt-6 space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <Tag className="w-4 h-4 text-pink-400" />
                    <h2 className="text-sm font-medium text-muted-foreground">Appellations <span className="text-primary">({byAppellation.length})</span></h2>
                </div>

                <GlassCard className="p-4">
                    <ChartContainer config={appellationChartConfig} className="h-[200px] w-full !aspect-auto">
                        <BarChart data={byAppellation.slice(0, 6)} layout="vertical" margin={{ left: 100, right: 20 }}>
                            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={100} />
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

            {/* ═══════════════════════════════════════════════════════════════════
          CÉPAGES HORIZONTAL BAR CHART
      ═══════════════════════════════════════════════════════════════════ */}
            <div className="px-4 mt-6 mb-24 space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <Grape className="w-4 h-4 text-cyan-400" />
                    <h2 className="text-sm font-medium text-muted-foreground">Cépages <span className="text-primary">({byCepage.length})</span></h2>
                </div>

                <GlassCard className="p-4">
                    <ChartContainer config={cepageChartConfig} className="h-[200px] w-full !aspect-auto">
                        <BarChart data={byCepage.slice(0, 6)} layout="vertical" margin={{ left: 80, right: 20 }}>
                            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={80} />
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

        </div>
    );
}
