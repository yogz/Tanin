"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Wine, Calendar, MapPin, Tag, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { addWine } from "@/app/actions/wine-actions";

const wineTypes = ["Rouge", "Blanc", "Rosé", "Blanc moelleux", "Blanc effervescent"];
const regions = ["Alsace", "Bordeaux", "Bourgogne", "Champagne", "Loire", "Rhône", "Provence", "Languedoc", "Sud-Ouest", "Vallée du Rhône"];

export default function AddWinePage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        domaine: "",
        designation: "",
        millesime: "",
        nombre: "1",
        type: "",
        region: "",
        appellation: "",
        cepage: "",
        debutApogee: "",
        finApogee: "",
        prixAchat: "",
        lieuAchat: "",
        dateAchat: "",
    });

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!formData.domaine.trim()) {
            setError("Producer name is required");
            return;
        }

        startTransition(async () => {
            try {
                const result = await addWine({
                    domaine: formData.domaine,
                    designation: formData.designation || undefined,
                    millesime: formData.millesime ? parseInt(formData.millesime) : undefined,
                    type: formData.type || undefined,
                    region: formData.region || undefined,
                    appellation: formData.appellation || undefined,
                    cepage: formData.cepage || undefined,
                    nombre: parseInt(formData.nombre) || 1,
                    prixAchat: formData.prixAchat || undefined,
                    lieuAchat: formData.lieuAchat || undefined,
                    dateAchat: formData.dateAchat || undefined,
                    debutApogee: formData.debutApogee ? parseInt(formData.debutApogee) : undefined,
                    finApogee: formData.finApogee ? parseInt(formData.finApogee) : undefined,
                });

                if (result.success) {
                    router.push(`/cellar/${result.wineId}`);
                } else {
                    setError("Failed to add wine");
                }
            } catch (err) {
                setError("An error occurred");
            }
        });
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-background to-background" />
                <div className="relative px-4 pt-4 pb-6">
                    <Link href="/cellar">
                        <Button variant="ghost" size="sm" className="mb-4 -ml-2">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back
                        </Button>
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center">
                            <Wine className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Add Wine</h1>
                            <p className="text-sm text-muted-foreground">Add a new bottle to your cellar</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 pb-8 space-y-4"
            >
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Producer */}
                <GlassCard className="p-4">
                    <h2 className="font-semibold mb-3 flex items-center gap-2">
                        <Wine className="w-4 h-4 text-muted-foreground" />
                        Wine Info
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-muted-foreground mb-1 block">Producer / Domaine *</label>
                            <Input
                                placeholder="Château Margaux"
                                value={formData.domaine}
                                onChange={(e) => updateField("domaine", e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground mb-1 block">Name / Cuvée</label>
                            <Input
                                placeholder="Premier Grand Cru Classé"
                                value={formData.designation}
                                onChange={(e) => updateField("designation", e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm text-muted-foreground mb-1 block">Vintage</label>
                                <Input
                                    type="number"
                                    placeholder="2020"
                                    min={1900}
                                    max={2100}
                                    value={formData.millesime}
                                    onChange={(e) => updateField("millesime", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground mb-1 block">Quantity *</label>
                                <Input
                                    type="number"
                                    placeholder="1"
                                    min={1}
                                    value={formData.nombre}
                                    onChange={(e) => updateField("nombre", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Type & Region */}
                <GlassCard className="p-4">
                    <h2 className="font-semibold mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        Classification
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-muted-foreground mb-1 block">Type</label>
                            <Select value={formData.type} onValueChange={(v) => updateField("type", v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {wineTypes.map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground mb-1 block">Region</label>
                            <Select value={formData.region} onValueChange={(v) => updateField("region", v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                                <SelectContent>
                                    {regions.map((region) => (
                                        <SelectItem key={region} value={region}>{region}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground mb-1 block">Appellation</label>
                            <Input
                                placeholder="Margaux"
                                value={formData.appellation}
                                onChange={(e) => updateField("appellation", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground mb-1 block">Grape Varieties</label>
                            <Input
                                placeholder="Cabernet Sauvignon, Merlot"
                                value={formData.cepage}
                                onChange={(e) => updateField("cepage", e.target.value)}
                            />
                        </div>
                    </div>
                </GlassCard>

                {/* Drinking Window */}
                <GlassCard className="p-4">
                    <h2 className="font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        Drinking Window
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm text-muted-foreground mb-1 block">From Year</label>
                            <Input
                                type="number"
                                placeholder="2025"
                                min={1900}
                                max={2100}
                                value={formData.debutApogee}
                                onChange={(e) => updateField("debutApogee", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground mb-1 block">To Year</label>
                            <Input
                                type="number"
                                placeholder="2050"
                                min={1900}
                                max={2100}
                                value={formData.finApogee}
                                onChange={(e) => updateField("finApogee", e.target.value)}
                            />
                        </div>
                    </div>
                </GlassCard>

                {/* Purchase Info */}
                <GlassCard className="p-4">
                    <h2 className="font-semibold mb-3 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        Purchase Details
                    </h2>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm text-muted-foreground mb-1 block">Price (€)</label>
                                <Input
                                    type="number"
                                    placeholder="45.00"
                                    min={0}
                                    step={0.01}
                                    value={formData.prixAchat}
                                    onChange={(e) => updateField("prixAchat", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground mb-1 block">Date</label>
                                <Input
                                    type="date"
                                    value={formData.dateAchat}
                                    onChange={(e) => updateField("dateAchat", e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground mb-1 block">Where bought</label>
                            <Input
                                placeholder="Wine shop, Gift, etc."
                                value={formData.lieuAchat}
                                onChange={(e) => updateField("lieuAchat", e.target.value)}
                            />
                        </div>
                    </div>
                </GlassCard>

                {/* Submit */}
                <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Adding...
                        </>
                    ) : (
                        <>
                            <Wine className="w-4 h-4 mr-2" />
                            Add to Cellar
                        </>
                    )}
                </Button>
            </motion.form>
        </div>
    );
}
