"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface CellarFiltersProps {
    types: string[];
    regions: string[];
    currentSearch?: string;
    currentType?: string;
    currentRegion?: string;
}

export function CellarFilters({
    types,
    regions,
    currentSearch,
    currentType,
    currentRegion,
}: CellarFiltersProps) {
    const router = useRouter();
    const [showFilters, setShowFilters] = useState(false);
    const [search, setSearch] = useState(currentSearch || "");
    const [isPending, startTransition] = useTransition();

    const updateFilters = (params: Record<string, string | undefined>) => {
        const url = new URL(window.location.href);
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                url.searchParams.set(key, value);
            } else {
                url.searchParams.delete(key);
            }
        });
        startTransition(() => {
            router.push(url.pathname + url.search);
        });
    };

    const handleSearch = () => {
        updateFilters({ search: search || undefined });
    };

    const clearFilters = () => {
        setSearch("");
        startTransition(() => {
            router.push("/cellar");
        });
    };

    const hasActiveFilters = currentSearch || currentType || currentRegion;

    return (
        <>
            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search wines..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="pl-9 bg-muted/50 border-0"
                    />
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSearch}
                    disabled={isPending}
                >
                    {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Search className="w-4 h-4" />
                    )}
                </Button>
                <Button
                    variant={showFilters ? "default" : "outline"}
                    size="icon"
                    onClick={() => setShowFilters(!showFilters)}
                    className="relative"
                >
                    <Filter className="w-4 h-4" />
                    {hasActiveFilters && !showFilters && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                    )}
                </Button>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 space-y-4">
                            {/* Type Filters */}
                            <div>
                                <p className="text-sm font-medium mb-2 text-muted-foreground">Type</p>
                                <div className="flex flex-wrap gap-2">
                                    {types.map((type) => (
                                        <Badge
                                            key={type}
                                            variant={currentType === type ? "default" : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => updateFilters({ type: currentType === type ? undefined : type })}
                                        >
                                            {type}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Region Filters */}
                            <div>
                                <p className="text-sm font-medium mb-2 text-muted-foreground">Region</p>
                                <div className="flex flex-wrap gap-2">
                                    {regions.slice(0, 10).map((region) => (
                                        <Badge
                                            key={region}
                                            variant={currentRegion === region ? "default" : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => updateFilters({ region: currentRegion === region ? undefined : region })}
                                        >
                                            {region}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-muted-foreground"
                                    disabled={isPending}
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    Clear all filters
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
