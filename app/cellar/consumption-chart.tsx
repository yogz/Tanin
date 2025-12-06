"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { GlassCard } from "@/components/ui/glass-card";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { TrendingUp } from "lucide-react";

const consumptionChartConfig = {
    count: { label: "Bouteilles", color: "hsl(142, 71%, 45%)" },
} satisfies ChartConfig;

interface ConsumptionChartProps {
    data: Array<{ month: string; label: string; count: number }>;
}

export function ConsumptionChart({ data }: ConsumptionChartProps) {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const lastMonth = data[data.length - 1]?.count || 0;
    const previousMonth = data[data.length - 2]?.count || 0;
    const trend = previousMonth > 0 ? ((lastMonth - previousMonth) / previousMonth) * 100 : 0;

    return (
        <GlassCard className="p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Consommation
                    </h2>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{total}</span>
                        <span className="text-sm text-muted-foreground">bouteilles sur 12 mois</span>
                    </div>
                </div>
                {trend !== 0 && (
                    <div className={`flex items-center gap-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
                        <span className="text-sm font-medium">
                            {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
                        </span>
                    </div>
                )}
            </div>
            <ChartContainer config={consumptionChartConfig} className="h-[200px] w-full">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={11}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                        dataKey="count"
                        type="monotone"
                        fill="url(#fillCount)"
                        fillOpacity={0.4}
                        stroke="var(--color-count)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ChartContainer>
        </GlassCard>
    );
}

