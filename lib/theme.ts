"use server";

import { cookies } from "next/headers";
import type { Theme } from "./theme-config";

// Re-export Theme for convenience
export type { Theme };

const THEME_COOKIE_NAME = "tanin_theme";

export async function getTheme(): Promise<Theme> {
    const cookieStore = await cookies();
    const theme = cookieStore.get(THEME_COOKIE_NAME);
    return (theme?.value as Theme) || "purple";
}

export async function setTheme(theme: Theme) {
    const cookieStore = await cookies();
    cookieStore.set(THEME_COOKIE_NAME, theme, {
        httpOnly: false, // Allow client-side access for dynamic updates
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
    });
}
