"use client";

import { createContext, useContext } from "react";
import { type Theme, THEMES } from "@/lib/theme-config";

const ThemeContext = createContext<{
    theme: Theme;
    themeConfig: typeof THEMES[Theme];
}>({
    theme: "purple",
    themeConfig: THEMES.purple,
});

export function ThemeProvider({
    theme,
    children,
}: {
    theme: Theme;
    children: React.ReactNode;
}) {
    return (
        <ThemeContext.Provider value={{ theme, themeConfig: THEMES[theme] }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
