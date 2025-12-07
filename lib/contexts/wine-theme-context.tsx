"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type WineTheme = "classic" | "vibrant" | "elegant" | "natural";

export interface WineThemeColors {
    Rouge: string;
    Blanc: string;
    "Blanc moelleux": string;
    "Blanc effervescent": string;
    Rosé: string;
    addButton: {
        from: string;
        to: string;
        shadow: string;
    };
}

const themes: Record<WineTheme, WineThemeColors> = {
    classic: {
        Rouge: "bg-red-600/80 text-white hover:bg-red-600",
        Blanc: "bg-amber-100 text-amber-900 hover:bg-amber-200",
        "Blanc moelleux": "bg-amber-200 text-amber-900 hover:bg-amber-300",
        "Blanc effervescent": "bg-yellow-100 text-yellow-900 hover:bg-yellow-200",
        Rosé: "bg-pink-200 text-pink-900 hover:bg-pink-300",
        addButton: {
            from: "from-purple-500",
            to: "to-pink-500",
            shadow: "shadow-purple-500/30",
        },
    },
    vibrant: {
        Rouge: "bg-rose-600/90 text-white hover:bg-rose-600",
        Blanc: "bg-yellow-200 text-yellow-900 hover:bg-yellow-300",
        "Blanc moelleux": "bg-amber-300 text-amber-950 hover:bg-amber-400",
        "Blanc effervescent": "bg-cyan-200 text-cyan-900 hover:bg-cyan-300",
        Rosé: "bg-fuchsia-300 text-fuchsia-900 hover:bg-fuchsia-400",
        addButton: {
            from: "from-rose-500",
            to: "to-orange-500",
            shadow: "shadow-rose-500/40",
        },
    },
    elegant: {
        Rouge: "bg-rose-800/90 text-white hover:bg-rose-800",
        Blanc: "bg-stone-200 text-stone-900 hover:bg-stone-300",
        "Blanc moelleux": "bg-amber-100 text-amber-950 hover:bg-amber-200",
        "Blanc effervescent": "bg-slate-200 text-slate-900 hover:bg-slate-300",
        Rosé: "bg-rose-200 text-rose-950 hover:bg-rose-300",
        addButton: {
            from: "from-indigo-600",
            to: "to-purple-600",
            shadow: "shadow-indigo-500/30",
        },
    },
    natural: {
        Rouge: "bg-red-700/85 text-white hover:bg-red-700",
        Blanc: "bg-stone-100 text-stone-800 hover:bg-stone-200",
        "Blanc moelleux": "bg-amber-50 text-amber-900 hover:bg-amber-100",
        "Blanc effervescent": "bg-yellow-50 text-yellow-900 hover:bg-yellow-100",
        Rosé: "bg-pink-100 text-pink-800 hover:bg-pink-200",
        addButton: {
            from: "from-emerald-600",
            to: "to-teal-600",
            shadow: "shadow-emerald-500/30",
        },
    },
};

interface WineThemeContextType {
    theme: WineTheme;
    colors: WineThemeColors;
    setTheme: (theme: WineTheme) => void;
}

const WineThemeContext = createContext<WineThemeContextType | undefined>(undefined);

export function WineThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<WineTheme>("classic");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem("wine-theme") as WineTheme | null;
        if (savedTheme && themes[savedTheme]) {
            setThemeState(savedTheme);
        }
    }, []);

    const setTheme = (newTheme: WineTheme) => {
        setThemeState(newTheme);
        localStorage.setItem("wine-theme", newTheme);
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <WineThemeContext.Provider value={{ theme, colors: themes[theme], setTheme }}>
            {children}
        </WineThemeContext.Provider>
    );
}

export function useWineTheme() {
    const context = useContext(WineThemeContext);
    if (context === undefined) {
        throw new Error("useWineTheme must be used within a WineThemeProvider");
    }
    return context;
}

