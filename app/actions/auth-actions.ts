"use server";

import { login as authLogin, logout as authLogout } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function login(email: string, password: string) {
    const result = await authLogin(email, password);

    if (result.success) {
        redirect("/");
    }

    return result;
}

export async function logout() {
    await authLogout();
    redirect("/login");
}
