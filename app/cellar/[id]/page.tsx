import { notFound } from "next/navigation";
import { Wine, Calendar, MapPin, Tag, ArrowLeft, Star, Grape, Euro, ShoppingBag, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { WineTypeBadge } from "@/components/ui/wine-type-badge";
import { getWine } from "@/app/actions/wine-actions";
import { WineActions } from "./wine-actions";
import { TastingSection } from "./tasting-section";

interface WineDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function WineDetailPage({ params }: WineDetailPageProps) {
    const { id } = await params;
    const wineId = parseInt(id);

    if (isNaN(wineId)) {
        notFound();
    }

    const wine = await getWine(wineId);

    if (!wine) {
        notFound();
    }

    const currentYear = new Date().getFullYear();
    const getDrinkWindowStatus = () => {
        if (!wine.debutApogee && !wine.finApogee) return null;
        if (wine.finApogee && currentYear > wine.finApogee) return { label: "Passé", color: "text-red-400", bg: "bg-red-400/10" };
        if (wine.debutApogee && currentYear < wine.debutApogee) return { label: "À garder", color: "text-blue-400", bg: "bg-blue-400/10" };
        if (wine.finApogee && currentYear === wine.finApogee) return { label: "À boire", color: "text-green-400", bg: "bg-green-400/10" };
        return { label: "À boire / attendre", color: "text-amber-400", bg: "bg-amber-400/10" };
    };

    const drinkStatus = getDrinkWindowStatus();

    return (
        <div className="min-h-screen pb-8">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-background to-background" />
                <div className="relative px-4 pt-4 pb-8">
                    {/* Back Button */}
                    <Link href="/cellar">
                        <Button variant="ghost" size="sm" className="mb-4 -ml-2">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Retour
                        </Button>
                    </Link>

                    {/* Wine Header */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                            <Wine className="w-8 h-8 text-purple-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold">{wine.domaine}</h1>
                            {wine.designation && (
                                <p className="text-muted-foreground">{wine.designation}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                                {wine.type && <WineTypeBadge type={wine.type} />}
                                {wine.millesime && (
                                    <span className="text-lg font-bold">{wine.millesime}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 -mt-2 space-y-4">
                {/* Stock Card with Actions */}
                <WineActions
                    wineId={wine.id}
                    currentStock={wine.nombre ?? 0}
                    drinkStatus={drinkStatus}
                    debutApogee={wine.debutApogee}
                    finApogee={wine.finApogee}
                />

                {/* Wine Info Card */}
                <GlassCard className="p-4">
                    <h2 className="font-semibold mb-3">Caractéristiques</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {wine.region && (
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Région</p>
                                    <p className="text-sm font-medium">{wine.region}</p>
                                </div>
                            </div>
                        )}
                        {wine.appellation && (
                            <div className="flex items-start gap-2">
                                <Tag className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Appellation</p>
                                    <p className="text-sm font-medium">{wine.appellation}</p>
                                </div>
                            </div>
                        )}
                        {wine.cru && (
                            <div className="flex items-start gap-2">
                                <Star className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Cru</p>
                                    <p className="text-sm font-medium">{wine.cru}</p>
                                </div>
                            </div>
                        )}
                        {wine.cepage && (
                            <div className="flex items-start gap-2">
                                <Grape className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Cépage</p>
                                    <p className="text-sm font-medium">{wine.cepage}</p>
                                </div>
                            </div>
                        )}
                        {wine.note && (
                            <div className="flex items-start gap-2">
                                <BookOpen className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Note guide</p>
                                    <p className="text-sm font-medium">{wine.note}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </GlassCard>

                {/* Purchase Info Card */}
                <GlassCard className="p-4">
                    <h2 className="font-semibold mb-3">Achat</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {wine.prixAchat && (
                            <div className="flex items-start gap-2">
                                <Euro className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Prix d'achat</p>
                                    <p className="text-sm font-medium">{wine.prixAchat} €</p>
                                </div>
                            </div>
                        )}
                        {wine.caConnu && (
                            <div className="flex items-start gap-2">
                                <Euro className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Coût total connu</p>
                                    <p className="text-sm font-medium">{wine.caConnu} €</p>
                                </div>
                            </div>
                        )}
                        {wine.lieuAchat && (
                            <div className="flex items-start gap-2">
                                <ShoppingBag className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Lieu d'achat</p>
                                    <p className="text-sm font-medium">{wine.lieuAchat}</p>
                                </div>
                            </div>
                        )}
                        {wine.dateAchat && (
                            <div className="flex items-start gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Date d'achat</p>
                                    <p className="text-sm font-medium">{new Date(wine.dateAchat).toLocaleDateString("fr-FR")}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    {!wine.prixAchat && !wine.lieuAchat && !wine.dateAchat && !wine.caConnu && (
                        <p className="text-sm text-muted-foreground">Aucune information d'achat</p>
                    )}
                </GlassCard>

                {/* Tasting Notes Section */}
                <TastingSection wineId={wine.id} tastings={wine.tastings} />
            </div>
        </div>
    );
}
