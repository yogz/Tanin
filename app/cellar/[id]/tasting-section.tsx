"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { Rating } from "@/components/ui/rating";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { addTasting } from "@/app/actions/wine-actions";

interface TastingNoteProps {
    tasting: {
        id: number;
        rating: string | null;
        date: string | null;
        comment: string | null;
    };
}

function TastingNote({ tasting }: TastingNoteProps) {
    return (
        <div className="border-b border-white/5 last:border-0 pb-4 last:pb-0">
            <div className="flex items-center justify-between mb-2">
                {tasting.rating && <Rating value={parseFloat(tasting.rating)} size="sm" />}
                {tasting.date && (
                    <span className="text-sm text-muted-foreground">
                        {new Date(tasting.date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                )}
            </div>
            {tasting.comment && <p className="text-sm">{tasting.comment}</p>}
        </div>
    );
}

interface TastingSectionProps {
    wineId: number;
    tastings: {
        id: number;
        rating: string | null;
        date: string | null;
        comment: string | null;
    }[];
}

export function TastingSection({ wineId, tastings }: TastingSectionProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(4);
    const [comment, setComment] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await addTasting(wineId, {
                rating,
                comment,
                date: new Date().toISOString().split('T')[0],
            });
            if (result.success) {
                setOpen(false);
                setComment("");
                setRating(4);
                router.refresh();
            }
        });
    };

    return (
        <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Tasting Notes</h2>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Star className="w-4 h-4 mr-1" />
                            Add Note
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add Tasting Note</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            {/* Rating */}
                            <div>
                                <label className="text-sm text-muted-foreground mb-2 block">Rating</label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setRating(value)}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                className={`w-8 h-8 transition-colors ${value <= rating
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "fill-transparent text-muted-foreground/30"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="text-sm text-muted-foreground mb-2 block">Comment</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Notes on the wine..."
                                    className="w-full h-24 px-3 py-2 rounded-lg bg-muted/50 border-0 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>

                            {/* Submit */}
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Note"
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {tastings.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                    No tasting notes yet
                </p>
            ) : (
                <div className="space-y-4">
                    {tastings.map((tasting) => (
                        <TastingNote key={tasting.id} tasting={tasting} />
                    ))}
                </div>
            )}
        </GlassCard>
    );
}
