"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, X, Loader2, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CellarFiltersProps {
    types: string[];
    regions: string[];
    appellations: string[];
    cepages: string[];
    lieuxAchat: string[];
    millesimes: number[];
    currentSearch?: string;
    currentType?: string;
    currentRegion?: string;
    currentAppellation?: string;
    currentCepage?: string;
    currentLieuAchat?: string;
    currentMillesime?: string;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

export function CellarFilters({
    types,
    regions,
    appellations,
    cepages,
    lieuxAchat,
    millesimes,
    currentSearch,
    currentType,
    currentRegion,
    currentAppellation,
    currentCepage,
    currentLieuAchat,
    currentMillesime,
}: CellarFiltersProps) {
    const router = useRouter();
    const [showFilters, setShowFilters] = useState(false);
    const [search, setSearch] = useState(currentSearch || "");
    const [isPending, startTransition] = useTransition();
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const debouncedSearch = useDebounce(search, 300);

    // Auto-search on debounced value change
    useEffect(() => {
        if (debouncedSearch !== currentSearch) {
            updateFilters({ search: debouncedSearch || undefined });
        }
    }, [debouncedSearch]);

    const updateFilters = useCallback((params: Record<string, string | undefined>) => {
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
    }, [router]);

    const clearFilters = () => {
        setSearch("");
        startTransition(() => {
            const url = new URL(window.location.href);
            const tab = url.searchParams.get("tab");
            router.push(tab ? `/cellar?tab=${tab}` : "/cellar");
        });
    };

    const hasActiveFilters = currentSearch || currentType || currentRegion || currentAppellation || currentCepage || currentLieuAchat || currentMillesime;
    const activeFiltersCount = [currentType, currentRegion, currentAppellation, currentCepage, currentLieuAchat, currentMillesime].filter(Boolean).length;

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const FilterSection = ({
        title,
        id,
        items,
        currentValue,
        paramName,
        maxVisible = 6
    }: {
        title: string;
        id: string;
        items: (string | number)[];
        currentValue?: string;
        paramName: string;
        maxVisible?: number;
    }) => {
        const isExpanded = expandedSection === id;
        const displayItems = isExpanded ? items : items.slice(0, maxVisible);
        const hasMore = items.length > maxVisible;

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
            >
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
                    {hasMore && (
                        <button
                            onClick={() => toggleSection(id)}
                            className="text-xs text-primary flex items-center gap-1 hover:underline"
                        >
                            {isExpanded ? "Moins" : `+${items.length - maxVisible}`}
                            <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", isExpanded && "rotate-180")} />
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {displayItems.map((item) => (
                        <motion.button
                            key={String(item)}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateFilters({ [paramName]: currentValue === String(item) ? undefined : String(item) })}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                                currentValue === String(item)
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            {item}
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        );
    };

    return (
        <div className="space-y-3">
            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Rechercher un vin..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-10 h-11 bg-muted/50 border-0 rounded-xl text-base"
                    />
                    {(isPending || search !== debouncedSearch) && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
                    )}
                    {search && !isPending && search === debouncedSearch && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
                <Button
                    variant={showFilters ? "default" : "outline"}
                    size="icon"
                    onClick={() => setShowFilters(!showFilters)}
                    className="relative h-11 w-11 rounded-xl shrink-0"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    {activeFiltersCount > 0 && !showFilters && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg"
                        >
                            {activeFiltersCount}
                        </motion.span>
                    )}
                </Button>
            </div>

            {/* Active Filters Display */}
            <AnimatePresence>
                {hasActiveFilters && !showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-1.5 overflow-hidden"
                    >
                        {currentType && (
                            <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1 rounded-full">
                                {currentType}
                                <button onClick={() => updateFilters({ type: undefined })} className="ml-1 hover:bg-foreground/10 rounded-full p-0.5">
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        )}
                        {currentRegion && (
                            <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1 rounded-full">
                                {currentRegion}
                                <button onClick={() => updateFilters({ region: undefined })} className="ml-1 hover:bg-foreground/10 rounded-full p-0.5">
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        )}
                        {currentAppellation && (
                            <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1 rounded-full">
                                {currentAppellation}
                                <button onClick={() => updateFilters({ appellation: undefined })} className="ml-1 hover:bg-foreground/10 rounded-full p-0.5">
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        )}
                        {currentCepage && (
                            <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1 rounded-full">
                                {currentCepage}
                                <button onClick={() => updateFilters({ cepage: undefined })} className="ml-1 hover:bg-foreground/10 rounded-full p-0.5">
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        )}
                        {currentLieuAchat && (
                            <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1 rounded-full">
                                {currentLieuAchat}
                                <button onClick={() => updateFilters({ lieuAchat: undefined })} className="ml-1 hover:bg-foreground/10 rounded-full p-0.5">
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        )}
                        {currentMillesime && (
                            <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1 rounded-full">
                                {currentMillesime}
                                <button onClick={() => updateFilters({ millesime: undefined })} className="ml-1 hover:bg-foreground/10 rounded-full p-0.5">
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        )}
                        <button
                            onClick={clearFilters}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
                        >
                            Tout effacer
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

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
                        <div className="pt-2 pb-4 space-y-5 max-h-[55vh] overflow-y-auto">
                            <FilterSection
                                title="Type"
                                id="type"
                                items={types}
                                currentValue={currentType}
                                paramName="type"
                            />

                            <FilterSection
                                title="Région"
                                id="region"
                                items={regions}
                                currentValue={currentRegion}
                                paramName="region"
                            />

                            <FilterSection
                                title="Appellation"
                                id="appellation"
                                items={appellations}
                                currentValue={currentAppellation}
                                paramName="appellation"
                            />

                            <FilterSection
                                title="Cépage"
                                id="cepage"
                                items={cepages}
                                currentValue={currentCepage}
                                paramName="cepage"
                            />

                            <FilterSection
                                title="Lieu d'achat"
                                id="lieuAchat"
                                items={lieuxAchat}
                                currentValue={currentLieuAchat}
                                paramName="lieuAchat"
                            />

                            <FilterSection
                                title="Millésime"
                                id="millesime"
                                items={millesimes}
                                currentValue={currentMillesime}
                                paramName="millesime"
                                maxVisible={10}
                            />

                            {hasActiveFilters && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="pt-2"
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="text-muted-foreground w-full"
                                        disabled={isPending}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Effacer tous les filtres
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
