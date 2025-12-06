"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, X, Loader2, ChevronDown } from "lucide-react";
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
            const url = new URL(window.location.href);
            // Keep only the tab parameter
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
        maxVisible = 8
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
            <div>
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    {hasMore && (
                        <button
                            onClick={() => toggleSection(id)}
                            className="text-xs text-primary flex items-center gap-1"
                        >
                            {isExpanded ? "Moins" : `+${items.length - maxVisible}`}
                            <ChevronDown className={cn("w-3 h-3 transition-transform", isExpanded && "rotate-180")} />
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {displayItems.map((item) => (
                        <Badge
                            key={String(item)}
                            variant={currentValue === String(item) ? "default" : "outline"}
                            className="cursor-pointer text-xs"
                            onClick={() => updateFilters({ [paramName]: currentValue === String(item) ? undefined : String(item) })}
                        >
                            {item}
                        </Badge>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Rechercher..."
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
                    {activeFiltersCount > 0 && !showFilters && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                            {activeFiltersCount}
                        </span>
                    )}
                </Button>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && !showFilters && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {currentType && (
                        <Badge variant="secondary" className="gap-1">
                            {currentType}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ type: undefined })} />
                        </Badge>
                    )}
                    {currentRegion && (
                        <Badge variant="secondary" className="gap-1">
                            {currentRegion}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ region: undefined })} />
                        </Badge>
                    )}
                    {currentAppellation && (
                        <Badge variant="secondary" className="gap-1">
                            {currentAppellation}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ appellation: undefined })} />
                        </Badge>
                    )}
                    {currentCepage && (
                        <Badge variant="secondary" className="gap-1">
                            {currentCepage}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ cepage: undefined })} />
                        </Badge>
                    )}
                    {currentLieuAchat && (
                        <Badge variant="secondary" className="gap-1">
                            {currentLieuAchat}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ lieuAchat: undefined })} />
                        </Badge>
                    )}
                    {currentMillesime && (
                        <Badge variant="secondary" className="gap-1">
                            {currentMillesime}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ millesime: undefined })} />
                        </Badge>
                    )}
                </div>
            )}

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
                        <div className="pt-4 space-y-4 max-h-[60vh] overflow-y-auto">
                            {/* Type Filters */}
                            <FilterSection
                                title="Type"
                                id="type"
                                items={types}
                                currentValue={currentType}
                                paramName="type"
                            />

                            {/* Region Filters */}
                            <FilterSection
                                title="Région"
                                id="region"
                                items={regions}
                                currentValue={currentRegion}
                                paramName="region"
                            />

                            {/* Appellation Filters */}
                            <FilterSection
                                title="Appellation"
                                id="appellation"
                                items={appellations}
                                currentValue={currentAppellation}
                                paramName="appellation"
                            />

                            {/* Cépage Filters */}
                            <FilterSection
                                title="Cépage"
                                id="cepage"
                                items={cepages}
                                currentValue={currentCepage}
                                paramName="cepage"
                            />

                            {/* Lieu d'achat Filters */}
                            <FilterSection
                                title="Lieu d'achat"
                                id="lieuAchat"
                                items={lieuxAchat}
                                currentValue={currentLieuAchat}
                                paramName="lieuAchat"
                            />

                            {/* Millésime Filters */}
                            <FilterSection
                                title="Millésime"
                                id="millesime"
                                items={millesimes}
                                currentValue={currentMillesime}
                                paramName="millesime"
                                maxVisible={12}
                            />

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
                                    Effacer tous les filtres
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
