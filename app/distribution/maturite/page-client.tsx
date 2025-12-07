"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { GlassCard } from "@/components/ui/glass-card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

const maturityChartConfig = {
    keep: { label: "À Garder", color: "hsl(217, 91%, 60%)" },
    peak: { label: "À Boire", color: "hsl(142, 71%, 45%)" },
    old: { label: "Passé", color: "hsl(25, 95%, 53%)" },
} satisfies ChartConfig;

interface MaturiteDistributionClientProps {
    maturityByYear: Array<{ year: number; label: string; keep: number; peak: number; old: number; total: number }>;
    currentMaturity: { keep: number; drink: number; drinkWait: number; old: number };
}

export default function MaturiteDistributionClient({ maturityByYear, currentMaturity }: MaturiteDistributionClientProps) {
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-background to-background" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                
                <div className="relative px-5 pt-14 pb-6">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Retour</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Maturité</h1>
                            <p className="text-sm text-muted-foreground">Évolution sur 10 ans</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Status Cards */}
            <div className="px-5 mt-6">
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <Link href="/cellar?maturity=keep">
                        <GlassCard className="p-4 text-center hover:bg-white/5 transition-all active:scale-[0.98] cursor-pointer">
                            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                            </div>
                            <p className="text-2xl font-bold">{currentMaturity.keep}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">À Garder</p>
                        </GlassCard>
                    </Link>

                    <Link href="/cellar?maturity=drink">
                        <GlassCard className="p-4 text-center hover:bg-white/5 transition-all active:scale-[0.98] cursor-pointer">
                            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                            </div>
                            <p className="text-2xl font-bold">{currentMaturity.drink}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">À Boire</p>
                        </GlassCard>
                    </Link>

                    <Link href="/cellar?maturity=old">
                        <GlassCard className="p-4 text-center hover:bg-white/5 transition-all active:scale-[0.98] cursor-pointer">
                            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                            </div>
                            <p className="text-2xl font-bold">{currentMaturity.old}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Passé</p>
                        </GlassCard>
                    </Link>
                </div>
            </div>

            {/* Evolution Chart */}
            <div className="px-5 mt-6 pb-8">
                <GlassCard className="p-4">
                    <div className="mb-4">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            Évolution de la maturité
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Projection sur {maturityByYear.length} ans ({currentYear} - {currentYear + maturityByYear.length - 1})
                        </p>
                    </div>
                    <ChartContainer config={maturityChartConfig} className="h-[400px] w-full">
                        <AreaChart data={maturityByYear} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="fillKeep" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="fillPeak" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="fillOld" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0.1} />
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
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                fontSize={11}
                            />
                            <ChartTooltip 
                                content={<ChartTooltipContent />}
                                formatter={(value: number, name: string) => [
                                    `${value} bouteilles`,
                                    maturityChartConfig[name as keyof typeof maturityChartConfig]?.label || name
                                ]}
                            />
                            <Area
                                type="monotone"
                                dataKey="keep"
                                stackId="1"
                                stroke="hsl(217, 91%, 60%)"
                                fill="url(#fillKeep)"
                                fillOpacity={0.6}
                                strokeWidth={2}
                            />
                            <Area
                                type="monotone"
                                dataKey="peak"
                                stackId="1"
                                stroke="hsl(142, 71%, 45%)"
                                fill="url(#fillPeak)"
                                fillOpacity={0.6}
                                strokeWidth={2}
                            />
                            <Area
                                type="monotone"
                                dataKey="old"
                                stackId="1"
                                stroke="hsl(25, 95%, 53%)"
                                fill="url(#fillOld)"
                                fillOpacity={0.6}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ChartContainer>
                </GlassCard>
            </div>
        </div>
    );
}
