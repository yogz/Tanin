"use client";

import { Home, Wine, PlusCircle, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/cellar", icon: Wine, label: "Cellar" },
    { href: "/cellar/add", icon: PlusCircle, label: "Add" },
    { href: "/profile", icon: User, label: "Profile" },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe">
            <div className="mx-auto max-w-md">
                <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl mb-4">
                    <div className="flex items-center justify-around py-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== "/" && pathname.startsWith(item.href));
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="relative flex flex-col items-center p-2 min-w-[60px]"
                                >
                                    <motion.div
                                        whileTap={{ scale: 0.9 }}
                                        className={cn(
                                            "flex flex-col items-center gap-1 transition-colors",
                                            isActive ? "text-primary" : "text-muted-foreground"
                                        )}
                                    >
                                        <div className="relative">
                                            <Icon className="w-6 h-6" />
                                            {isActive && (
                                                <motion.div
                                                    layoutId="nav-indicator"
                                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                        </div>
                                        <span className="text-[10px] font-medium">{item.label}</span>
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
