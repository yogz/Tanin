import { cookies } from "next/headers";

const AUTH_USER = {
    email: "manu@example.com",
    name: "Manu",
    password: "LittleFireman75012",
};

const SESSION_COOKIE_NAME = "tanin_session";

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (email === AUTH_USER.email && password === AUTH_USER.password) {
        const cookieStore = await cookies();
        // Create a simple session token
        const sessionToken = Buffer.from(JSON.stringify({ email: AUTH_USER.email, name: AUTH_USER.name })).toString("base64");

        cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return { success: true };
    }

    return { success: false, error: "Identifiants incorrects" };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<{ email: string; name: string } | null> {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionToken) {
        return null;
    }

    try {
        const session = JSON.parse(Buffer.from(sessionToken.value, "base64").toString());
        return session;
    } catch {
        return null;
    }
}
