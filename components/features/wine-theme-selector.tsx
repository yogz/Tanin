"use client";

import { Palette, Check } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useWineTheme, WineTheme } from "@/lib/contexts/wine-theme-context";
import { cn } from "@/lib/utils";

const themeOptions: { value: WineTheme; label: string; description: string }[] = [
    {
        value: "classic",
        label: "Classique",
        description: "Palette traditionnelle",
    },
    {
        value: "vibrant",
        label: "Vibrant",
        description: "Couleurs vives et énergiques",
    },
    {
        value: "elegant",
        label: "Élégant",
        description: "Tons raffinés et sophistiqués",
    },
    {
        value: "natural",
        label: "Naturel",
        description: "Nuances douces et organiques",
    },
];

export function WineThemeSelector() {
    const { theme, setTheme } = useWineTheme();

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3 px-1">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                    <p className="font-medium">Thème des couleurs</p>
                    <p className="text-sm text-muted-foreground">Personnalisez les couleurs du vin</p>
                </div>
            </div>

            <GlassCard className="p-4 space-y-2">
                {themeOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={cn(
                            "w-full flex items-center justify-between p-3 rounded-xl transition-colors",
                            "hover:bg-white/5 border-2",
                            theme === option.value
                                ? "border-purple-500/50 bg-purple-500/10"
                                : "border-transparent"
                        )}
                    >
                        <div className="flex-1 text-left">
                            <p className="font-medium text-sm">{option.label}</p>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                        {theme === option.value && (
                            <Check className="w-5 h-5 text-purple-400" />
                        )}
                    </button>
                ))}
            </GlassCard>
        </div>
    );
}

