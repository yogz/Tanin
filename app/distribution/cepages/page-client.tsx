"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { GlassCard } from "@/components/ui/glass-card";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { Grape, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const cepageChartConfig = {
    count: { label: "Bouteilles", color: "hsl(187, 85%, 53%)" },
} satisfies ChartConfig;

export default function CepagesDistributionClient({ byCepage }: { byCepage: Array<{ name: string; count: number }> }) {
    const router = useRouter();

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 via-background to-background" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
                
                <div className="relative px-5 pt-14 pb-6">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Retour</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                            <Grape className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Cépages</h1>
                            <p className="text-sm text-muted-foreground">{byCepage.length} cépages</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="px-5 mt-6 pb-8">
                <GlassCard className="p-4">
                    <ChartContainer config={cepageChartConfig} className="h-[600px] w-full !aspect-auto">
                        <BarChart data={byCepage} layout="vertical" margin={{ left: 120, right: 20 }}>
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

