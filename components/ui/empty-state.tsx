"use client";

import { motion } from "framer-motion";
import { Wine, Search, Plus } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    type: "no-wines" | "no-results" | "no-consumed";
    className?: string;
}

const states = {
    "no-wines": {
        icon: Wine,
        title: "Votre cave est vide",
        description: "Commencez par ajouter votre première bouteille",
        action: {
            label: "Ajouter un vin",
            href: "/cellar/add",
        },
    },
    "no-results": {
        icon: Search,
        title: "Aucun résultat",
        description: "Essayez de modifier vos filtres ou votre recherche",
        action: null,
    },
    "no-consumed": {
        icon: Wine,
        title: "Aucun vin dégusté",
        description: "Les vins que vous aurez bus apparaîtront ici",
        action: null,
    },
};

export function EmptyState({ type, className }: EmptyStateProps) {
    const state = states[type];
    const Icon = state.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex flex-col items-center justify-center py-16 px-8 text-center", className)}
        >
            {/* Animated Icon */}
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.4, delay: 0.1 }}
                className="relative mb-6"
            >
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Icon className="w-12 h-12 text-purple-400/60" strokeWidth={1.5} />
                </div>
                {/* Decorative rings */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 rounded-3xl border border-purple-500/20"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.05, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    className="absolute -inset-2 rounded-[28px] border border-purple-500/10"
                />
            </motion.div>

            {/* Text */}
            <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-semibold text-foreground mb-2"
            >
                {state.title}
            </motion.h3>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-muted-foreground max-w-[240px]"
            >
                {state.description}
            </motion.p>

            {/* Action Button */}
            {state.action && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6"
                >
                    <Link href={state.action.href}>
                        <Button className="rounded-full gap-2">
                            <Plus className="w-4 h-4" />
                            {state.action.label}
                        </Button>
                    </Link>
                </motion.div>
            )}
        </motion.div>
    );
}
