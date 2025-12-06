import { User } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { getSession } from "@/lib/auth";
import { getProfileStats } from "@/app/actions/wine-actions";
import { getTheme } from "@/lib/theme";
import { LogoutButtonSimple } from "@/components/auth/logout-button-simple";
import { WineThemeSelector } from "@/components/features/wine-theme-selector";
import { ThemeSelector } from "@/components/theme/theme-selector";

export default async function ProfilePage() {
    const session = await getSession();
    const stats = await getProfileStats();
    const theme = await getTheme();
    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-background to-background" />
                <div className="relative px-4 pt-12 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center">
                            <User className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{session?.name || "Utilisateur"}</h1>
                            <p className="text-muted-foreground">{session?.email || "Non connecté"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="px-4 -mt-2">
                <GlassCard className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold">{stats.totalBottles}</p>
                            <p className="text-xs text-muted-foreground">Bouteilles</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.totalTastings}</p>
                            <p className="text-xs text-muted-foreground">Dégustations</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.avgRating}</p>
                            <p className="text-xs text-muted-foreground">Note Moy.</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Settings Menu */}
            <div className="px-4 mt-6 space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground px-1">Paramètres</h2>

                <WineThemeSelector />

                <GlassCard>
                    <ThemeSelector currentTheme={theme} />
                </GlassCard>

                <div className="pt-4">
                    <LogoutButtonSimple />
                </div>

                <p className="text-center text-xs text-muted-foreground pt-4">
                    Tanin v1.0.0 • Made with 🍷
                </p>
            </div>
        </div>
    );
}
