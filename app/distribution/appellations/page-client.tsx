"use client";

import { useState, useMemo } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Tag, ArrowLeft, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

const appellationChartConfig = {
    count: { label: "Bouteilles", color: "hsl(330, 81%, 60%)" },
} satisfies ChartConfig;

export default function AppellationsDistributionClient({ byAppellation }: { byAppellation: Array<{ name: string; count: number }> }) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"chart" | "list">("list");

    const filteredData = useMemo(() => {
        if (!search) return byAppellation;
        const lowerSearch = search.toLowerCase();
        return byAppellation.filter(item => 
            item.name.toLowerCase().includes(lowerSearch)
        );
    }, [search, byAppellation]);

    // Group by first letter for list view
    const groupedData = useMemo(() => {
        const groups: Record<string, Array<{ name: string; count: number }>> = {};
        filteredData.forEach(item => {
            const firstLetter = item.name.charAt(0).toUpperCase();
            if (!groups[firstLetter]) {
                groups[firstLetter] = [];
            }
            groups[firstLetter].push(item);
        });
        return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
    }, [filteredData]);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-900/40 via-background to-background" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
                
                <div className="relative px-5 pt-14 pb-6">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Retour</span>
                    </Link>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                                <Tag className="w-6 h-6 text-pink-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Appellations</h1>
                                <p className="text-sm text-muted-foreground">
                                    {filteredData.length} {filteredData.length === byAppellation.length ? 'appellations' : `sur ${byAppellation.length}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode("list")}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    viewMode === "list" 
                                        ? "bg-pink-500/20 text-pink-400" 
                                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                }`}
                            >
                                Liste
                            </button>
                            <button
                                onClick={() => setViewMode("chart")}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    viewMode === "chart" 
                                        ? "bg-pink-500/20 text-pink-400" 
                                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                }`}
                            >
                                Graphique
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Rechercher une appellation..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-10 h-11 bg-background/50 border-border/50 rounded-xl"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-5 mt-6 pb-8">
                {viewMode === "chart" ? (
                    <GlassCard className="p-4">
                        <ChartContainer config={appellationChartConfig} className="h-[600px] w-full !aspect-auto">
                            <BarChart data={filteredData} layout="vertical" margin={{ left: 120, right: 20 }}>
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    tickLine={false} 
                                    axisLine={false} 
                                    width={120} 
                                    fontSize={12}
                                />
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
                ) : (
                    <div className="space-y-6 max-h-[calc(100vh-280px)] overflow-y-auto">
                        {groupedData.length === 0 ? (
                            <GlassCard className="p-8 text-center">
                                <p className="text-muted-foreground">Aucune appellation trouvée</p>
                            </GlassCard>
                        ) : (
                            groupedData.map(([letter, items]) => (
                                <div key={letter} className="space-y-2">
                                    <h2 className="text-lg font-bold text-foreground/80 px-2 sticky top-0 bg-background/80 backdrop-blur-sm py-2 -mt-2 z-10">
                                        {letter}
                                    </h2>
                                    <div className="grid gap-2">
                                        {items.map((item) => (
                                            <GlassCard
                                                key={item.name}
                                                className="p-3 hover:bg-white/5 transition-all active:scale-[0.98] cursor-pointer"
                                                onClick={() => router.push(`/cellar?appellation=${encodeURIComponent(item.name)}`)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-sm">{item.name}</span>
                                                    <span className="text-xs font-semibold text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-full">
                                                        {item.count} {item.count === 1 ? 'bouteille' : 'bouteilles'}
                                                    </span>
                                                </div>
                                            </GlassCard>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
