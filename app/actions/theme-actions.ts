"use server";

import { setTheme, type Theme } from "@/lib/theme";
import { revalidatePath } from "next/cache";

export async function changeTheme(theme: Theme) {
    await setTheme(theme);
    revalidatePath("/", "layout");
    return { success: true };
}
