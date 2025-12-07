import { User, Settings, Moon, LogOut, Wine, Star, Bell } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { WineThemeSelector } from "@/components/features/wine-theme-selector";

export default function ProfilePage() {
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
                            <h1 className="text-2xl font-bold">Wine Lover</h1>
                            <p className="text-muted-foreground">wine.lover@example.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="px-4 -mt-2">
                <GlassCard className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold">45</p>
                            <p className="text-xs text-muted-foreground">Bottles</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">23</p>
                            <p className="text-xs text-muted-foreground">Tastings</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">4.2</p>
                            <p className="text-xs text-muted-foreground">Avg Rating</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Settings Menu */}
            <div className="px-4 mt-6 space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground px-1">Settings</h2>

                <WineThemeSelector />

                <GlassCard className="divide-y divide-white/5">
                    <button className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <Wine className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="font-medium">Preferences</p>
                            <p className="text-sm text-muted-foreground">Default regions, currency</p>
                        </div>
                    </button>

                    <button className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-amber-400" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="font-medium">Notifications</p>
                            <p className="text-sm text-muted-foreground">Drinking window reminders</p>
                        </div>
                    </button>

                    <button className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Moon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="font-medium">Appearance</p>
                            <p className="text-sm text-muted-foreground">Dark mode enabled</p>
                        </div>
                    </button>

                    <button className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-zinc-500/20 flex items-center justify-center">
                            <Settings className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="font-medium">Account</p>
                            <p className="text-sm text-muted-foreground">Manage your account</p>
                        </div>
                    </button>
                </GlassCard>

                <div className="pt-4">
                    <Button variant="outline" className="w-full h-12 text-red-400 border-red-400/30 hover:bg-red-400/10">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </div>

                <p className="text-center text-xs text-muted-foreground pt-4">
                    Tanin v1.0.0 • Made with 🍷
                </p>
            </div>
        </div>
    );
}
