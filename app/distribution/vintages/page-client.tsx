"use client";

import { useState, useMemo } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Calendar, ArrowLeft, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

const vintageChartConfig = {
    count: { label: "Bouteilles", color: "hsl(262, 83%, 58%)" },
} satisfies ChartConfig;

export default function VintagesDistributionClient({ byVintage }: { byVintage: Array<{ name: string; count: number }> }) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"chart" | "list">("list");

    const filteredData = useMemo(() => {
        if (!search) return byVintage;
        const searchNum = parseInt(search);
        if (!isNaN(searchNum)) {
            return byVintage.filter(item => item.name.includes(search));
        }
        return byVintage.filter(item => 
            item.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, byVintage]);

    // Sort by year (descending) for list view
    const sortedData = useMemo(() => {
        return [...filteredData].sort((a, b) => {
            const yearA = parseInt(a.name);
            const yearB = parseInt(b.name);
            return yearB - yearA; // Descending order
        });
    }, [filteredData]);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-background to-background" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
                
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
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Millésimes</h1>
                                <p className="text-sm text-muted-foreground">
                                    {filteredData.length} {filteredData.length === byVintage.length ? 'millésimes' : `sur ${byVintage.length}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode("list")}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    viewMode === "list" 
                                        ? "bg-indigo-500/20 text-indigo-400" 
                                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                }`}
                            >
                                Liste
                            </button>
                            <button
                                onClick={() => setViewMode("chart")}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    viewMode === "chart" 
                                        ? "bg-indigo-500/20 text-indigo-400" 
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
                            placeholder="Rechercher un millésime..."
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
                        <ChartContainer config={vintageChartConfig} className="h-[600px] w-full !aspect-auto">
                            <BarChart data={filteredData.sort((a, b) => parseInt(a.name) - parseInt(b.name))} layout="vertical" margin={{ left: 80, right: 20 }}>
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    tickLine={false} 
                                    axisLine={false} 
                                    width={80} 
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
                                            router.push(`/cellar?millesime=${data.name}`);
                                        }
                                    }}
                                />
                            </BarChart>
                        </ChartContainer>
                    </GlassCard>
                ) : (
                    <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
                        {sortedData.length === 0 ? (
                            <GlassCard className="p-8 text-center">
                                <p className="text-muted-foreground">Aucun millésime trouvé</p>
                            </GlassCard>
                        ) : (
                            <div className="grid gap-2">
                                {sortedData.map((item) => (
                                    <GlassCard
                                        key={item.name}
                                        className="p-3 hover:bg-white/5 transition-all active:scale-[0.98] cursor-pointer"
                                        onClick={() => router.push(`/cellar?millesime=${item.name}`)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-sm">{item.name}</span>
                                            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">
                                                {item.count} {item.count === 1 ? 'bouteille' : 'bouteilles'}
                                            </span>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

