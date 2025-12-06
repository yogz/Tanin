import { Suspense } from "react";
import { getWines, getUniqueTypes, getUniqueRegions, getWineCounts } from "@/app/actions/wine-actions";
import { WineCard } from "@/components/features/wine/wine-card";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { CellarFilters } from "./cellar-filters";
import { CellarTabs } from "./cellar-tabs";

interface CellarPageProps {
    searchParams: Promise<{
        search?: string;
        type?: string;
        region?: string;
        appellation?: string;
        cepage?: string;
        tab?: string;
    }>;
}

async function WineList({
    search,
    type,
    region,
    appellation,
    cepage,
    inStock,
}: {
    search?: string;
    type?: string;
    region?: string;
    appellation?: string;
    cepage?: string;
    inStock: boolean;
}) {
    const wines = await getWines({ search, type, region, appellation, cepage, inStock, limit: 100 });

    if (wines.length === 0) {
        return (
            <GlassCard className="p-8 text-center">
                <p className="text-muted-foreground">
                    {inStock ? "Aucun vin en cave" : "Aucun vin consommé"}
                </p>
            </GlassCard>
        );
    }

    return (
        <div className="space-y-3">
            {wines.map((wine, index) => (
                <WineCard
                    key={wine.id}
                    id={wine.id}
                    domaine={wine.domaine}
                    designation={wine.designation}
                    millesime={wine.millesime}
                    type={wine.type}
                    region={wine.region}
                    appellation={wine.appellation}
                    nombre={wine.nombre ?? 0}
                    debutApogee={wine.debutApogee}
                    finApogee={wine.finApogee}
                    index={index}
                />
            ))}
            <p className="text-center text-sm text-muted-foreground pt-4">
                {wines.length} vin{wines.length !== 1 ? "s" : ""}
            </p>
        </div>
    );
}

function WineListSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <GlassCard key={i} className="p-4">
                    <div className="flex items-start gap-3">
                        <Skeleton className="w-12 h-12 rounded-xl" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex gap-2">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-20" />
                            </div>
                        </div>
                    </div>
                </GlassCard>
            ))}
        </div>
    );
}

export default async function CellarPage({ searchParams }: CellarPageProps) {
    const params = await searchParams;
    const [types, regions, counts] = await Promise.all([
        getUniqueTypes(),
        getUniqueRegions(),
        getWineCounts(),
    ]);

    const currentTab = params.tab === "consumed" ? "consumed" : "current";
    const inStock = currentTab === "current";

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
                <div className="px-4 pt-4 pb-3">
                    <h1 className="text-2xl font-bold mb-3">Ma Cave</h1>
                    <CellarTabs
                        inStock={counts.inStock}
                        consumed={counts.consumed}
                        currentTab={currentTab}
                    />
                    <CellarFilters
                        types={types}
                        regions={regions}
                        currentSearch={params.search}
                        currentType={params.type}
                        currentRegion={params.region}
                    />
                </div>
            </div>

            {/* Wine List */}
            <div className="px-4 py-4">
                <Suspense fallback={<WineListSkeleton />}>
                    <WineList
                        search={params.search}
                        type={params.type}
                        region={params.region}
                        appellation={params.appellation}
                        cepage={params.cepage}
                        inStock={inStock}
                    />
                </Suspense>
            </div>
        </div>
    );
}
