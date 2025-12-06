"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Tag, Grape } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { GlassCard } from "@/components/ui/glass-card";

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

interface DistributionChartsProps {
    vintages: Array<{ year: number; count: number }>;
    byRegion: Array<{ name: string; count: number }>;
    byAppellation: Array<{ name: string; count: number }>;
    byCepage: Array<{ name: string; count: number }>;
}

export const DistributionCharts = memo(function DistributionCharts({ vintages, byRegion, byAppellation, byCepage }: DistributionChartsProps) {
    const router = useRouter();
    const sortedVintages = [...vintages].sort((a, b) => a.year - b.year);

    return (
        <div className="px-5 mt-6 space-y-4">
            {/* Vintage Distribution */}
            <div>
                <Link href="/distribution/vintages">
                    <div className="flex items-center gap-2 mb-3 cursor-pointer hover:opacity-80 transition-opacity">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Millésimes</h2>
                        {vintages.length > 5 && (
                            <span className="text-xs text-muted-foreground ml-auto">
                                {vintages.length} au total
                            </span>
                        )}
                    </div>
                </Link>

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
            </div>

            {/* Regions */}
            <div>
                <Link href="/distribution/regions">
                    <div className="flex items-center gap-2 mb-3 cursor-pointer hover:opacity-80 transition-opacity">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Régions</h2>
                        {byRegion.length > 5 && (
                            <span className="text-xs text-muted-foreground ml-auto">
                                {byRegion.length} au total
                            </span>
                        )}
                    </div>
                </Link>
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
                <Link href="/distribution/appellations">
                    <div className="flex items-center gap-2 mb-3 cursor-pointer hover:opacity-80 transition-opacity">
                        <Tag className="w-4 h-4 text-pink-400" />
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Appellations</h2>
                        {byAppellation.length > 5 && (
                            <span className="text-xs text-muted-foreground ml-auto">
                                {byAppellation.length} au total
                            </span>
                        )}
                    </div>
                </Link>
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
                <Link href="/distribution/cepages">
                    <div className="flex items-center gap-2 mb-3 cursor-pointer hover:opacity-80 transition-opacity">
                        <Grape className="w-4 h-4 text-cyan-400" />
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Cépages</h2>
                        {byCepage.length > 5 && (
                            <span className="text-xs text-muted-foreground ml-auto">
                                {byCepage.length} au total
                            </span>
                        )}
                    </div>
                </Link>
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
        </div>
    );
});
