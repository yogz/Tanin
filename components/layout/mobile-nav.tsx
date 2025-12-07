"use client";

import { Home, Wine, Plus, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useWineTheme } from "@/lib/contexts/wine-theme-context";

const navItems = [
    { href: "/", icon: Home, label: "Accueil" },
    { href: "/cellar", icon: Wine, label: "Cave" },
    { href: "/cellar/add", icon: Plus, label: "Ajouter", isAction: true },
    { href: "/profile", icon: User, label: "Profil" },
];

export function MobileNav() {
    const pathname = usePathname();
    const { colors } = useWineTheme();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe">
            <div className="mx-auto max-w-md">
                <div className="bg-background/90 backdrop-blur-2xl border border-border/50 rounded-3xl shadow-2xl shadow-black/20 mb-4">
                    <div className="flex items-center justify-around py-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== "/" && pathname.startsWith(item.href));
                            const Icon = item.icon;

                            // Special styling for the "Add" action button
                            if (item.isAction) {
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="relative flex flex-col items-center -mt-6"
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={cn(
                                                "flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br shadow-lg",
                                                colors.addButton.from,
                                                colors.addButton.to,
                                                colors.addButton.shadow
                                            )}
                                        >
                                            <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                                        </motion.div>
                                        <span className="text-[10px] font-medium text-muted-foreground mt-1">
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            }

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="relative flex flex-col items-center py-2 min-w-[64px] min-h-[56px]"
                                >
                                    <motion.div
                                        whileTap={{ scale: 0.85 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                        className="flex flex-col items-center gap-0.5"
                                    >
                                        <div className="relative p-2">
                                            {/* Active background pill */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="nav-pill"
                                                    className="absolute inset-0 bg-primary/15 rounded-xl"
                                                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                                />
                                            )}
                                            <Icon
                                                className={cn(
                                                    "w-6 h-6 relative z-10 transition-colors duration-200",
                                                    isActive ? "text-primary" : "text-muted-foreground"
                                                )}
                                                strokeWidth={isActive ? 2.5 : 2}
                                            />
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-medium transition-colors duration-200",
                                            isActive ? "text-primary" : "text-muted-foreground"
                                        )}>
                                            {item.label}
                                        </span>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
