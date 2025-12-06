"use client";

import { useState } from "react";
import { Wine, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/app/actions/auth-actions";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const { themeConfig } = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsPending(true);

        try {
            const result = await login(email, password);

            if (result && !result.success) {
                setError(result.error || "Identifiants incorrects");
                setIsPending(false);
            }
            // If success, the redirect will happen from the server action
        } catch (err: any) {
            // Ignore Next.js redirect errors (they're expected for successful logins)
            if (err?.digest?.startsWith("NEXT_REDIRECT")) {
                return;
            }
            setError("Une erreur s'est produite");
            setIsPending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Background effects */}
            <div className={cn("absolute inset-0 bg-gradient-to-br", themeConfig.gradient)} />
            <div className={cn("absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl", themeConfig.glowBg1)} />
            <div className={cn("absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl", themeConfig.glowBg2)} />

            <div className="relative w-full max-w-md">
                <GlassCard className="p-8">
                    {/* Logo/Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4", themeConfig.accent1)}>
                            <Wine className={cn("w-8 h-8", themeConfig.icon)} />
                        </div>
                        <h1
                            className={cn("text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent", themeConfig.primary)}
                            style={{ textShadow: `0 0 40px ${themeConfig.glow}` }}
                        >
                            Tanin
                        </h1>
                        <p className="text-muted-foreground mt-2">Connectez-vous à votre cave</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="manu@example.com"
                                required
                                disabled={isPending}
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                                Mot de passe
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                disabled={isPending}
                                className="h-11"
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isPending}
                            className={cn("w-full h-11 bg-gradient-to-r", themeConfig.accent2, `hover:${themeConfig.accentHover}`)}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Connexion...
                                </>
                            ) : (
                                "Se connecter"
                            )}
                        </Button>
                    </form>
                </GlassCard>
            </div>
        </div>
    );
}
