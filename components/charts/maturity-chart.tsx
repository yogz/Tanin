"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Label } from "recharts";
import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";

const maturityChartConfig = {
    keep: { label: "À Garder", color: "hsl(217, 91%, 60%)" },
    drink: { label: "À Boire", color: "hsl(142, 71%, 45%)" },
    drinkWait: { label: "À Boire / Attendre", color: "hsl(45, 93%, 47%)" },
    old: { label: "Passé", color: "hsl(25, 95%, 53%)" },
} satisfies ChartConfig;

interface MaturityChartProps {
    maturity: {
        keep: number;
        drink: number;
        drinkWait: number;
        old: number;
    };
}

export const MaturityChart = memo(function MaturityChart({ maturity }: MaturityChartProps) {
    const router = useRouter();
    const maturityData = [
        { name: "keep", value: maturity.keep, fill: "hsl(217, 91%, 60%)" },
        { name: "drink", value: maturity.drink, fill: "hsl(142, 71%, 45%)" },
        { name: "drinkWait", value: maturity.drinkWait, fill: "hsl(45, 93%, 47%)" },
        { name: "old", value: maturity.old, fill: "hsl(25, 95%, 53%)" },
    ];

    const totalMaturity = maturity.keep + maturity.drink + maturity.drinkWait + maturity.old;

    return (
        <div className="px-5 mt-6">
            <Link href="/distribution/maturite">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 cursor-pointer hover:opacity-80 transition-opacity">Maturité</h2>
            </Link>

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
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.fill}
                                        className="cursor-pointer"
                                        onClick={() => {
                                            const maturityMap: Record<string, string> = {
                                                'keep': 'keep',
                                                'drink': 'drink',
                                                'drinkWait': 'drinkWait',
                                                'old': 'old'
                                            };
                                            const maturity = maturityMap[entry.name];
                                            if (maturity) {
                                                router.push(`/cellar?maturity=${maturity}`);
                                            }
                                        }}
                                    />
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

                    <div className="flex-1 space-y-2">
                        <Link href="/cellar?maturity=keep">
                            <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity p-2 -m-2 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                    <span className="text-sm">À Garder</span>
                                </div>
                                <span className="font-semibold">{maturity.keep}</span>
                            </div>
                        </Link>
                        <Link href="/cellar?maturity=drink">
                            <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity p-2 -m-2 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                    <span className="text-sm">À Boire</span>
                                </div>
                                <span className="font-semibold">{maturity.drink}</span>
                            </div>
                        </Link>
                        <Link href="/cellar?maturity=drinkWait">
                            <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity p-2 -m-2 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "hsl(45, 93%, 47%)" }} />
                                    <span className="text-sm">À Boire / Attendre</span>
                                </div>
                                <span className="font-semibold">{maturity.drinkWait}</span>
                            </div>
                        </Link>
                        <Link href="/cellar?maturity=old">
                            <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity p-2 -m-2 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                                    <span className="text-sm">Passé</span>
                                </div>
                                <span className="font-semibold">{maturity.old}</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
});
