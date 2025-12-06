"use server";

import { setTheme } from "@/lib/theme";
import type { Theme } from "@/lib/theme-config";
import { revalidatePath } from "next/cache";

export async function changeTheme(theme: Theme) {
    await setTheme(theme);
    revalidatePath("/", "layout");
    return { success: true };
}
