"use server";

import { db } from "@/lib/db";
import { wines, tastings } from "@/lib/db/schema";
import { eq, like, or, sql, desc, asc } from "drizzle-orm";

export type WineWithTastings = typeof wines.$inferSelect & {
    tastings: (typeof tastings.$inferSelect)[];
};

export async function getWines(options?: {
    search?: string;
    type?: string;
    region?: string;
    appellation?: string;
    cepage?: string;
    inStock?: boolean; // true = nombre > 0, false = nombre = 0, undefined = all
    limit?: number;
    offset?: number;
}) {
    const { search, type, region, appellation, cepage, inStock, limit = 50, offset = 0 } = options || {};

    // Build where conditions
    const conditions = [];

    if (search) {
        conditions.push(
            or(
                like(wines.domaine, `%${search}%`),
                like(wines.designation, `%${search}%`),
                like(wines.region, `%${search}%`),
                like(wines.appellation, `%${search}%`)
            )
        );
    }

    if (type) {
        conditions.push(eq(wines.type, type));
    }

    if (region) {
        conditions.push(eq(wines.region, region));
    }

    if (appellation) {
        conditions.push(eq(wines.appellation, appellation));
    }

    if (cepage) {
        conditions.push(eq(wines.cepage, cepage));
    }

    if (inStock === true) {
        conditions.push(sql`${wines.nombre} > 0`);
    } else if (inStock === false) {
        conditions.push(sql`${wines.nombre} = 0 OR ${wines.nombre} IS NULL`);
    }

    const result = await db
        .select()
        .from(wines)
        .where(conditions.length > 0 ? sql`${conditions.reduce((a, b) => sql`${a} AND ${b}`)}` : undefined)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(wines.createdAt));

    return result;
}

export async function getWineCounts() {
    const inStockResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(wines)
        .where(sql`${wines.nombre} > 0`);

    const consumedResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(wines)
        .where(sql`${wines.nombre} = 0 OR ${wines.nombre} IS NULL`);

    return {
        inStock: Number(inStockResult[0]?.count) || 0,
        consumed: Number(consumedResult[0]?.count) || 0,
    };
}

export async function getWine(id: number): Promise<WineWithTastings | null> {
    const wineResult = await db
        .select()
        .from(wines)
        .where(eq(wines.id, id))
        .limit(1);

    if (wineResult.length === 0) return null;

    const wine = wineResult[0];
    const wineTastings = await db
        .select()
        .from(tastings)
        .where(eq(tastings.wineId, id))
        .orderBy(desc(tastings.date));

    return { ...wine, tastings: wineTastings };
}

export async function getDashboardStats() {
    const currentYear = new Date().getFullYear();

    // Total bottles
    const totalResult = await db
        .select({ sum: sql<number>`COALESCE(SUM(${wines.nombre}), 0)` })
        .from(wines);

    // Total value
    const valueResult = await db
        .select({ sum: sql<number>`COALESCE(SUM(${wines.prixAchat} * ${wines.nombre}), 0)` })
        .from(wines);

    // Wines at peak (drink now)
    const peakResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(wines)
        .where(
            sql`${wines.debutApogee} <= ${currentYear} AND ${wines.finApogee} >= ${currentYear} AND ${wines.nombre} > 0`
        );

    // By type distribution
    const typeResult = await db
        .select({
            type: wines.type,
            count: sql<number>`COALESCE(SUM(${wines.nombre}), 0)`,
        })
        .from(wines)
        .groupBy(wines.type)
        .orderBy(desc(sql`COALESCE(SUM(${wines.nombre}), 0)`));

    return {
        totalBottles: Number(totalResult[0]?.sum) || 0,
        totalValue: Math.round(Number(valueResult[0]?.sum) || 0),
        drinkNow: Number(peakResult[0]?.count) || 0,
        byType: typeResult.map((r) => ({ type: r.type || "Unknown", count: Number(r.count) })),
    };
}

export async function getWinesToDrink(limit = 5) {
    const currentYear = new Date().getFullYear();

    const result = await db
        .select()
        .from(wines)
        .where(
            sql`${wines.debutApogee} <= ${currentYear} AND ${wines.finApogee} >= ${currentYear} AND ${wines.nombre} > 0`
        )
        .orderBy(asc(wines.finApogee))
        .limit(limit);

    return result;
}

export async function getUniqueRegions() {
    const result = await db
        .selectDistinct({ region: wines.region })
        .from(wines)
        .where(sql`${wines.region} IS NOT NULL AND ${wines.region} != ''`)
        .orderBy(asc(wines.region));

    return result.map((r) => r.region).filter(Boolean) as string[];
}

export async function getUniqueTypes() {
    const result = await db
        .selectDistinct({ type: wines.type })
        .from(wines)
        .where(sql`${wines.type} IS NOT NULL AND ${wines.type} != ''`)
        .orderBy(asc(wines.type));

    return result.map((r) => r.type).filter(Boolean) as string[];
}

export async function getDistributionByRegion() {
    const result = await db
        .select({
            region: wines.region,
            count: sql<number>`COALESCE(SUM(${wines.nombre}), 0)`,
        })
        .from(wines)
        .where(sql`${wines.region} IS NOT NULL AND ${wines.region} != ''`)
        .groupBy(wines.region)
        .orderBy(desc(sql`COALESCE(SUM(${wines.nombre}), 0)`))
        .limit(10);

    return result.map((r) => ({ name: r.region || "Unknown", count: Number(r.count) }));
}

export async function getDistributionByAppellation() {
    const result = await db
        .select({
            appellation: wines.appellation,
            count: sql<number>`COALESCE(SUM(${wines.nombre}), 0)`,
        })
        .from(wines)
        .where(sql`${wines.appellation} IS NOT NULL AND ${wines.appellation} != ''`)
        .groupBy(wines.appellation)
        .orderBy(desc(sql`COALESCE(SUM(${wines.nombre}), 0)`))
        .limit(10);

    return result.map((r) => ({ name: r.appellation || "Unknown", count: Number(r.count) }));
}

export async function getDistributionByCepage() {
    const result = await db
        .select({
            cepage: wines.cepage,
            count: sql<number>`COALESCE(SUM(${wines.nombre}), 0)`,
        })
        .from(wines)
        .where(sql`${wines.cepage} IS NOT NULL AND ${wines.cepage} != ''`)
        .groupBy(wines.cepage)
        .orderBy(desc(sql`COALESCE(SUM(${wines.nombre}), 0)`))
        .limit(10);

    return result.map((r) => ({ name: r.cepage || "Unknown", count: Number(r.count) }));
}

export async function drinkWine(wineId: number) {
    const wine = await db
        .select()
        .from(wines)
        .where(eq(wines.id, wineId))
        .limit(1);

    if (wine.length === 0 || (wine[0].nombre ?? 0) <= 0) {
        return { success: false, error: "No bottles left" };
    }

    await db
        .update(wines)
        .set({ nombre: sql`${wines.nombre} - 1`, updatedAt: new Date() })
        .where(eq(wines.id, wineId));

    return { success: true, newCount: (wine[0].nombre ?? 1) - 1 };
}

export async function updateStock(wineId: number, delta: number) {
    const wine = await db
        .select()
        .from(wines)
        .where(eq(wines.id, wineId))
        .limit(1);

    if (wine.length === 0) {
        return { success: false, error: "Wine not found" };
    }

    const newCount = Math.max(0, (wine[0].nombre ?? 0) + delta);

    await db
        .update(wines)
        .set({ nombre: newCount, updatedAt: new Date() })
        .where(eq(wines.id, wineId));

    return { success: true, newCount };
}

export async function addTasting(wineId: number, data: {
    rating: number;
    comment: string;
    date?: string;
}) {
    const result = await db
        .insert(tastings)
        .values({
            wineId,
            rating: data.rating.toString(),
            comment: data.comment,
            date: data.date || new Date().toISOString().split('T')[0],
        })
        .returning({ id: tastings.id });

    return { success: true, tastingId: result[0].id };
}

export async function getMaturityProfile() {
    const currentYear = new Date().getFullYear();

    // Wines to keep (peak starts in future)
    const keepResult = await db
        .select({ count: sql<number>`COALESCE(SUM(${wines.nombre}), 0)` })
        .from(wines)
        .where(sql`${wines.debutApogee} > ${currentYear} AND ${wines.nombre} > 0`);

    // Wines at peak (current year is within apogee window)
    const peakResult = await db
        .select({ count: sql<number>`COALESCE(SUM(${wines.nombre}), 0)` })
        .from(wines)
        .where(sql`${wines.debutApogee} <= ${currentYear} AND ${wines.finApogee} >= ${currentYear} AND ${wines.nombre} > 0`);

    // Wines past peak (end of apogee was in past)
    const oldResult = await db
        .select({ count: sql<number>`COALESCE(SUM(${wines.nombre}), 0)` })
        .from(wines)
        .where(sql`${wines.finApogee} < ${currentYear} AND ${wines.nombre} > 0`);

    return {
        keep: Number(keepResult[0]?.count) || 0,
        peak: Number(peakResult[0]?.count) || 0,
        old: Number(oldResult[0]?.count) || 0,
    };
}

export async function getVintageDistribution() {
    const result = await db
        .select({
            year: wines.millesime,
            count: sql<number>`COALESCE(SUM(${wines.nombre}), 0)`,
        })
        .from(wines)
        .where(sql`${wines.millesime} IS NOT NULL AND ${wines.nombre} > 0`)
        .groupBy(wines.millesime)
        .orderBy(asc(wines.millesime));

    return result.map(r => ({ year: r.year || 0, count: Number(r.count) }));
}

export async function addWine(data: {
    domaine: string;
    designation?: string;
    millesime?: number;
    type?: string;
    region?: string;
    appellation?: string;
    cepage?: string;
    cru?: string;
    nombre: number;
    prixAchat?: string;
    lieuAchat?: string;
    dateAchat?: string;
    debutApogee?: number;
    finApogee?: number;
}) {
    const result = await db
        .insert(wines)
        .values({
            domaine: data.domaine,
            designation: data.designation || null,
            millesime: data.millesime || null,
            type: data.type || null,
            region: data.region || null,
            appellation: data.appellation || null,
            cepage: data.cepage || null,
            cru: data.cru || null,
            nombre: data.nombre,
            prixAchat: data.prixAchat || null,
            lieuAchat: data.lieuAchat || null,
            dateAchat: data.dateAchat || null,
            debutApogee: data.debutApogee || null,
            finApogee: data.finApogee || null,
        })
        .returning({ id: wines.id });

    return { success: true, wineId: result[0].id };
}

