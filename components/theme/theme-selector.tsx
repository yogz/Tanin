"use client";

import { useState } from "react";
import { Moon, Check } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { changeTheme } from "@/app/actions/theme-actions";
import { type Theme, THEMES } from "@/lib/theme-config";
import { cn } from "@/lib/utils";

interface ThemeSelectorProps {
    currentTheme: Theme;
}

export function ThemeSelector({ currentTheme }: ThemeSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState(currentTheme);
    const [isPending, setIsPending] = useState(false);

    const handleThemeChange = async (theme: Theme) => {
        setIsPending(true);
        setSelectedTheme(theme);
        await changeTheme(theme);
        setIsPending(false);
        setIsOpen(false);
        // Reload the page to apply theme changes
        window.location.reload();
    };

    return (
        <div className="space-y-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors rounded-2xl"
            >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Moon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 text-left">
                    <p className="font-medium">Apparence</p>
                    <p className="text-sm text-muted-foreground">
                        {THEMES[selectedTheme].name}
                    </p>
                </div>
            </button>

            {isOpen && (
                <div className="space-y-2 pl-4">
                    {(Object.keys(THEMES) as Theme[]).map((theme) => (
                        <button
                            key={theme}
                            onClick={() => handleThemeChange(theme)}
                            disabled={isPending}
                            className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                                selectedTheme === theme
                                    ? "bg-white/10"
                                    : "hover:bg-white/5"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-lg bg-gradient-to-br",
                                THEMES[theme].accent1
                            )} />
                            <div className="flex-1 text-left">
                                <p className="text-sm font-medium">{THEMES[theme].name}</p>
                            </div>
                            {selectedTheme === theme && (
                                <Check className="w-4 h-4 text-green-400" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
