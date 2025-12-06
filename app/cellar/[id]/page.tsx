import { notFound } from "next/navigation";
import { Wine, Calendar, MapPin, Tag, ArrowLeft, Star } from "lucide-react";
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
        if (wine.finApogee && currentYear > wine.finApogee) return { label: "Past Peak", color: "text-red-400", bg: "bg-red-400/10" };
        if (wine.debutApogee && currentYear < wine.debutApogee) return { label: "Keep", color: "text-blue-400", bg: "bg-blue-400/10" };
        return { label: "Drink Now", color: "text-green-400", bg: "bg-green-400/10" };
    };

    const drinkStatus = getDrinkWindowStatus();

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-background to-background" />
                <div className="relative px-4 pt-4 pb-8">
                    {/* Back Button */}
                    <Link href="/cellar">
                        <Button variant="ghost" size="sm" className="mb-4 -ml-2">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back
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

                {/* Details Card */}
                <GlassCard className="p-4">
                    <h2 className="font-semibold mb-3">Details</h2>
                    <div className="space-y-3">
                        {wine.region && (
                            <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Region</p>
                                    <p>{wine.region}</p>
                                </div>
                            </div>
                        )}
                        {wine.appellation && (
                            <div className="flex items-center gap-3">
                                <Tag className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Appellation</p>
                                    <p>{wine.appellation}</p>
                                </div>
                            </div>
                        )}
                        {wine.cru && (
                            <div className="flex items-center gap-3">
                                <Star className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Cru</p>
                                    <p>{wine.cru}</p>
                                </div>
                            </div>
                        )}
                        {wine.cepage && (
                            <div className="flex items-center gap-3">
                                <Wine className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Grape Varieties</p>
                                    <p>{wine.cepage}</p>
                                </div>
                            </div>
                        )}
                        {wine.prixAchat && (
                            <div className="flex items-center gap-3">
                                <Tag className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Purchase Price</p>
                                    <p>€{wine.prixAchat}</p>
                                </div>
                            </div>
                        )}
                        {wine.lieuAchat && (
                            <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Purchased at</p>
                                    <p>{wine.lieuAchat}</p>
                                </div>
                            </div>
                        )}
                        {wine.dateAchat && (
                            <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Purchase Date</p>
                                    <p>{new Date(wine.dateAchat).toLocaleDateString("fr-FR")}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </GlassCard>

                {/* Tasting Notes Section */}
                <TastingSection wineId={wine.id} tastings={wine.tastings} />
            </div>
        </div>
    );
}
