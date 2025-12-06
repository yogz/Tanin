import { getValueDetails } from "@/app/actions/wine-actions";
import { GlassCard } from "@/components/ui/glass-card";
import { WineTypeBadge } from "@/components/ui/wine-type-badge";
import Link from "next/link";
import { ChevronRight, Euro, TrendingUp, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function ValuePage() {
    const data = await getValueDetails();

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
                <div className="px-5 pt-14 pb-4">
                    <Link 
                        href="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Retour</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-amber-400" />
                        </div>
                    <div>
                        <h1 className="text-2xl font-bold">Valeur de la Cave</h1>
                        <p className="text-sm text-muted-foreground">Stock et bouteilles consommées</p>
                    </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-5 py-6 space-y-6">
                {/* Summary Cards - In Stock */}
                <div>
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        En stock
                    </h2>
                    <div className="grid grid-cols-3 gap-3">
                        <GlassCard className="p-4 text-center">
                            <p className="text-2xl font-bold text-amber-400">
                                {data.summary.totalValue.toLocaleString("fr-FR")}€
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Total</p>
                        </GlassCard>
                        <GlassCard className="p-4 text-center">
                            <p className="text-2xl font-bold">{data.summary.totalBottles}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Bouteilles</p>
                        </GlassCard>
                        <GlassCard className="p-4 text-center">
                            <p className="text-2xl font-bold">{data.summary.avgPrice}€</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Prix moy.</p>
                        </GlassCard>
                    </div>
                </div>

                {/* Summary Cards - Consumed */}
                {data.consumed.totalValue > 0 && (
                    <div>
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Déjà bu
                        </h2>
                        <div className="grid grid-cols-3 gap-3">
                            <GlassCard className="p-4 text-center">
                                <p className="text-2xl font-bold text-green-400">
                                    {data.consumed.totalValue.toLocaleString("fr-FR")}€
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Total</p>
                            </GlassCard>
                            <GlassCard className="p-4 text-center">
                                <p className="text-2xl font-bold">{data.consumed.totalBottles}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Bouteilles</p>
                            </GlassCard>
                            <GlassCard className="p-4 text-center">
                                <p className="text-2xl font-bold">{data.consumed.avgPrice}€</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Prix moy.</p>
                            </GlassCard>
                        </div>
                    </div>
                )}

                {/* Grand Total */}
                <GlassCard className="p-4 text-center bg-gradient-to-br from-amber-500/10 to-green-500/10 border-amber-500/20">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Valeur totale</p>
                    <p className="text-3xl font-bold text-foreground">
                        {(data.summary.totalValue + data.consumed.totalValue).toLocaleString("fr-FR")}€
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        {data.summary.totalBottles + data.consumed.totalBottles} bouteilles au total
                    </p>
                </GlassCard>

                {/* By Type - In Stock */}
                {data.byType.length > 0 && (
                    <div>
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Par type (en stock)
                        </h2>
                        <GlassCard className="divide-y divide-border/50">
                            {data.byType.map((item) => (
                                <div key={item.type} className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-3">
                                        <WineTypeBadge type={item.type} />
                                        <span className="text-sm text-muted-foreground">
                                            {item.count} btl
                                        </span>
                                    </div>
                                    <span className="font-semibold">
                                        {item.value.toLocaleString("fr-FR")}€
                                    </span>
                                </div>
                            ))}
                        </GlassCard>
                    </div>
                )}

                {/* By Type - Consumed */}
                {data.byTypeConsumed && data.byTypeConsumed.length > 0 && (
                    <div>
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Par type (déjà bu)
                        </h2>
                        <GlassCard className="divide-y divide-border/50">
                            {data.byTypeConsumed.map((item) => (
                                <div key={item.type} className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-3">
                                        <WineTypeBadge type={item.type} />
                                        <span className="text-sm text-muted-foreground">
                                            {item.count} btl
                                        </span>
                                    </div>
                                    <span className="font-semibold text-green-400">
                                        {item.value.toLocaleString("fr-FR")}€
                                    </span>
                                </div>
                            ))}
                        </GlassCard>
                    </div>
                )}

                {/* Top Wines */}
                {data.topWines.length > 0 && (
                    <div>
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Vins les plus précieux
                        </h2>
                        <div className="space-y-2">
                            {data.topWines.slice(0, 20).map((wine, index) => (
                                <Link key={wine.id} href={`/cellar/${wine.id}`}>
                                    <GlassCard className="p-4 flex items-center gap-3 active:scale-[0.98] transition-transform hover:bg-white/5">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold",
                                            index === 0 ? "bg-amber-500/20 text-amber-400" :
                                            index === 1 ? "bg-gray-400/20 text-gray-400" :
                                            index === 2 ? "bg-orange-600/20 text-orange-500" :
                                            "bg-muted text-muted-foreground"
                                        )}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate text-sm">
                                                {wine.domaine}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {wine.designation} {wine.millesime && `· ${wine.millesime}`}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-sm">
                                                {wine.totalValue.toLocaleString("fr-FR")}€
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {wine.nombre} × {Number(wine.prixAchat).toLocaleString("fr-FR")}€
                                            </p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                                    </GlassCard>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {data.topWines.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <Euro className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="font-medium mb-1">Aucun prix d'achat renseigné</p>
                        <p className="text-sm">Ajoutez des prix à vos vins pour voir la valeur</p>
                    </div>
                )}
            </div>
        </div>
    );
}

