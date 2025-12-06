"use server";

import { db } from "@/lib/db";
import { wines, tastings } from "@/lib/db/schema";
import { eq, like, or, sql, desc, asc, max } from "drizzle-orm";

export type WineWithTastings = typeof wines.$inferSelect & {
    tastings: (typeof tastings.$inferSelect)[];
};

export async function getWines(options?: {
    search?: string;
    type?: string;
    region?: string;
    appellation?: string;
    cepage?: string;
    lieuAchat?: string;
    millesime?: number;
    inStock?: boolean; // true = nombre > 0, false = nombre = 0, undefined = all
    maturity?: "keep" | "drink" | "drinkWait" | "old"; // Filter by maturity status
    limit?: number;
    offset?: number;
}) {
    const { search, type, region, appellation, cepage, lieuAchat, millesime, inStock, maturity, limit = 50, offset = 0 } = options || {};

    const currentYear = new Date().getFullYear();

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

    if (lieuAchat) {
        conditions.push(eq(wines.lieuAchat, lieuAchat));
    }

    if (millesime) {
        conditions.push(eq(wines.millesime, millesime));
    }

    if (inStock === true) {
        conditions.push(sql`${wines.nombre} > 0`);
    } else if (inStock === false) {
        conditions.push(sql`${wines.nombre} = 0 OR ${wines.nombre} IS NULL`);
    }

    // Filter by maturity
    if (maturity === "keep") {
        conditions.push(sql`${wines.debutApogee} > ${currentYear} AND ${wines.nombre} > 0`);
    } else if (maturity === "drink") {
        conditions.push(sql`${wines.finApogee} = ${currentYear} AND ${wines.nombre} > 0`);
    } else if (maturity === "drinkWait") {
        conditions.push(sql`${wines.debutApogee} <= ${currentYear} AND ${wines.finApogee} > ${currentYear} AND ${wines.nombre} > 0`);
    } else if (maturity === "old") {
        conditions.push(sql`${wines.finApogee} < ${currentYear} AND ${wines.nombre} > 0`);
    }

    // If fetching consumed wines, we need to join with tastings to get the latest tasting date
    if (inStock === false) {
        const result = await db
            .select({
                id: wines.id,
                domaine: wines.domaine,
                millesime: wines.millesime,
                appellation: wines.appellation,
                designation: wines.designation,
                cru: wines.cru,
                type: wines.type,
                region: wines.region,
                cepage: wines.cepage,
                debutApogee: wines.debutApogee,
                finApogee: wines.finApogee,
                note: wines.note,
                prixAchat: wines.prixAchat,
                lieuAchat: wines.lieuAchat,
                dateAchat: wines.dateAchat,
                nombre: wines.nombre,
                caConnu: wines.caConnu,
                createdAt: wines.createdAt,
                updatedAt: wines.updatedAt,
                lastTastingDate: sql<string | null>`(SELECT MAX(tastings.date) FROM tastings WHERE tastings.wine_id = ${wines.id})`.as('last_tasting_date'),
            })
            .from(wines)
            .where(conditions.length > 0 ? sql`${conditions.reduce((a, b) => sql`${a} AND ${b}`)}` : undefined)
            .limit(limit)
            .offset(offset)
            .orderBy(desc(sql`(SELECT MAX(tastings.date) FROM tastings WHERE tastings.wine_id = ${wines.id})`));
        
        return result.map(wine => ({
            ...wine,
            lastTastingDate: wine.lastTastingDate || null,
        }));
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
    // References count (number of different wines)
    const inStockRefsResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(wines)
        .where(sql`${wines.nombre} > 0`);

    const consumedRefsResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(wines)
        .where(sql`${wines.nombre} = 0 OR ${wines.nombre} IS NULL`);

    // Bottles count (total number of bottles)
    const inStockBottlesResult = await db
        .select({ sum: sql<number>`COALESCE(SUM(${wines.nombre}), 0)` })
        .from(wines)
        .where(sql`${wines.nombre} > 0`);

    return {
        inStock: {
            references: Number(inStockRefsResult[0]?.count) || 0,
            bottles: Number(inStockBottlesResult[0]?.sum) || 0,
        },
        consumed: {
            references: Number(consumedRefsResult[0]?.count) || 0,
        },
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

    // Total bottles (only in stock)
    const totalResult = await db
        .select({ sum: sql<number>`COALESCE(SUM(${wines.nombre}), 0)` })
        .from(wines)
        .where(sql`${wines.nombre} > 0`);

    // Total value (only bottles in stock)
    const valueResult = await db
        .select({ sum: sql<number>`COALESCE(SUM(${wines.prixAchat} * ${wines.nombre}), 0)` })
        .from(wines)
        .where(sql`${wines.nombre} > 0`);

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

export async function getUniqueAppellations() {
    const result = await db
        .selectDistinct({ appellation: wines.appellation })
        .from(wines)
        .where(sql`${wines.appellation} IS NOT NULL AND ${wines.appellation} != ''`)
        .orderBy(asc(wines.appellation));

    return result.map((r) => r.appellation).filter(Boolean) as string[];
}

export async function getUniqueCepages() {
    const result = await db
        .selectDistinct({ cepage: wines.cepage })
        .from(wines)
        .where(sql`${wines.cepage} IS NOT NULL AND ${wines.cepage} != ''`)
        .orderBy(asc(wines.cepage));

    return result.map((r) => r.cepage).filter(Boolean) as string[];
}

export async function getUniqueLieuxAchat() {
    const result = await db
        .selectDistinct({ lieuAchat: wines.lieuAchat })
        .from(wines)
        .where(sql`${wines.lieuAchat} IS NOT NULL AND ${wines.lieuAchat} != ''`)
        .orderBy(asc(wines.lieuAchat));

    return result.map((r) => r.lieuAchat).filter(Boolean) as string[];
}

export async function getUniqueMillesimes() {
    const result = await db
        .selectDistinct({ millesime: wines.millesime })
        .from(wines)
        .where(sql`${wines.millesime} IS NOT NULL`)
        .orderBy(desc(wines.millesime));

    return result.map((r) => r.millesime).filter(Boolean) as number[];
}

export async function getValueDetails() {
    // Get wines with value, sorted by total value (price * quantity)
    const result = await db
        .select({
            id: wines.id,
            domaine: wines.domaine,
            designation: wines.designation,
            millesime: wines.millesime,
            type: wines.type,
            nombre: wines.nombre,
            prixAchat: wines.prixAchat,
        })
        .from(wines)
        .where(sql`${wines.nombre} > 0 AND ${wines.prixAchat} IS NOT NULL AND ${wines.prixAchat} > 0`)
        .orderBy(desc(sql`${wines.prixAchat} * ${wines.nombre}`))
        .limit(20);

    // Calculate totals for in-stock wines
    const totalResult = await db
        .select({
            totalValue: sql<number>`COALESCE(SUM(${wines.prixAchat} * ${wines.nombre}), 0)`,
            totalBottles: sql<number>`COALESCE(SUM(${wines.nombre}), 0)`,
            avgPrice: sql<number>`COALESCE(AVG(${wines.prixAchat}), 0)`,
        })
        .from(wines)
        .where(sql`${wines.nombre} > 0 AND ${wines.prixAchat} IS NOT NULL AND ${wines.prixAchat} > 0`);

    // Calculate totals for consumed wines (nombre = 0 or NULL, but had prixAchat)
    // For consumed wines, we estimate based on the assumption they had at least 1 bottle
    // We use the prixAchat as the value per bottle consumed
    const consumedResult = await db
        .select({
            totalValue: sql<number>`COALESCE(SUM(${wines.prixAchat}), 0)`,
            totalBottles: sql<number>`COUNT(*)`,
            avgPrice: sql<number>`COALESCE(AVG(${wines.prixAchat}), 0)`,
        })
        .from(wines)
        .where(sql`(${wines.nombre} = 0 OR ${wines.nombre} IS NULL) AND ${wines.prixAchat} IS NOT NULL AND ${wines.prixAchat} > 0`);

    // Value by type (in stock)
    const byTypeResult = await db
        .select({
            type: wines.type,
            value: sql<number>`COALESCE(SUM(${wines.prixAchat} * ${wines.nombre}), 0)`,
            count: sql<number>`COALESCE(SUM(${wines.nombre}), 0)`,
        })
        .from(wines)
        .where(sql`${wines.nombre} > 0 AND ${wines.prixAchat} IS NOT NULL`)
        .groupBy(wines.type)
        .orderBy(desc(sql`SUM(${wines.prixAchat} * ${wines.nombre})`));

    // Value by type (consumed)
    const byTypeConsumedResult = await db
        .select({
            type: wines.type,
            value: sql<number>`COALESCE(SUM(${wines.prixAchat}), 0)`,
            count: sql<number>`COUNT(*)`,
        })
        .from(wines)
        .where(sql`(${wines.nombre} = 0 OR ${wines.nombre} IS NULL) AND ${wines.prixAchat} IS NOT NULL`)
        .groupBy(wines.type)
        .orderBy(desc(sql`SUM(${wines.prixAchat})`));

    return {
        topWines: result.map((w) => ({
            ...w,
            totalValue: Number(w.prixAchat || 0) * (w.nombre || 0),
        })),
        summary: {
            totalValue: Number(totalResult[0]?.totalValue) || 0,
            totalBottles: Number(totalResult[0]?.totalBottles) || 0,
            avgPrice: Math.round(Number(totalResult[0]?.avgPrice) || 0),
        },
        consumed: {
            totalValue: Number(consumedResult[0]?.totalValue) || 0,
            totalBottles: Number(consumedResult[0]?.totalBottles) || 0,
            avgPrice: Math.round(Number(consumedResult[0]?.avgPrice) || 0),
        },
        byType: byTypeResult.map((r) => ({
            type: r.type || "Inconnu",
            value: Number(r.value),
            count: Number(r.count),
        })),
        byTypeConsumed: byTypeConsumedResult.map((r) => ({
            type: r.type || "Inconnu",
            value: Number(r.value),
            count: Number(r.count),
        })),
    };
}

export async function getDistributionByRegion(limit?: number) {
    let query = db
        .select({
            region: wines.region,
            count: sql<number>`COALESCE(SUM(${wines.nombre}), 0)`,
        })
        .from(wines)
        .where(sql`${wines.region} IS NOT NULL AND ${wines.region} != '' AND ${wines.nombre} > 0`)
        .groupBy(wines.region)
        .orderBy(desc(sql`COALESCE(SUM(${wines.nombre}), 0)`));
    
    if (limit !== undefined) {
        query = query.limit(limit) as any;
    }

    const result = await query;
    return result.map((r) => ({ name: r.region || "Unknown", count: Number(r.count) }));
}

export async function getDistributionByAppellation(limit?: number) {
    let query = db
        .select({
            appellation: wines.appellation,
            count: sql<number>`COALESCE(SUM(${wines.nombre}), 0)`,
        })
        .from(wines)
        .where(sql`${wines.appellation} IS NOT NULL AND ${wines.appellation} != '' AND ${wines.nombre} > 0`)
        .groupBy(wines.appellation)
        .orderBy(desc(sql`COALESCE(SUM(${wines.nombre}), 0)`));
    
    if (limit !== undefined) {
        query = query.limit(limit) as any;
    }

    const result = await query;
    return result.map((r) => ({ name: r.appellation || "Unknown", count: Number(r.count) }));
}

export async function getDistributionByCepage(limit?: number) {
    let query = db
        .select({
            cepage: wines.cepage,
            count: sql<number>`COALESCE(SUM(${wines.nombre}), 0)`,
        })
        .from(wines)
        .where(sql`${wines.cepage} IS NOT NULL AND ${wines.cepage} != '' AND ${wines.nombre} > 0`)
        .groupBy(wines.cepage)
        .orderBy(desc(sql`COALESCE(SUM(${wines.nombre}), 0)`));
    
    if (limit !== undefined) {
        query = query.limit(limit) as any;
    }

    const result = await query;
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

    // Wines to drink now (last year of peak window)
    const drinkResult = await db
        .select({ count: sql<number>`COALESCE(SUM(${wines.nombre}), 0)` })
        .from(wines)
        .where(sql`${wines.finApogee} = ${currentYear} AND ${wines.nombre} > 0`);

    // Wines to drink or wait (in peak window but not last year)
    const drinkWaitResult = await db
        .select({ count: sql<number>`COALESCE(SUM(${wines.nombre}), 0)` })
        .from(wines)
        .where(sql`${wines.debutApogee} <= ${currentYear} AND ${wines.finApogee} > ${currentYear} AND ${wines.nombre} > 0`);

    // Wines past peak (end of apogee was in past)
    const oldResult = await db
        .select({ count: sql<number>`COALESCE(SUM(${wines.nombre}), 0)` })
        .from(wines)
        .where(sql`${wines.finApogee} < ${currentYear} AND ${wines.nombre} > 0`);

    return {
        keep: Number(keepResult[0]?.count) || 0,
        drink: Number(drinkResult[0]?.count) || 0,
        drinkWait: Number(drinkWaitResult[0]?.count) || 0,
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

export async function getDistributionByVintage(limit?: number) {
    let query = db
        .select({
            year: wines.millesime,
            count: sql<number>`COALESCE(SUM(${wines.nombre}), 0)`,
        })
        .from(wines)
        .where(sql`${wines.millesime} IS NOT NULL AND ${wines.nombre} > 0`)
        .groupBy(wines.millesime)
        .orderBy(desc(sql`COALESCE(SUM(${wines.nombre}), 0)`));
    
    if (limit !== undefined) {
        query = query.limit(limit) as any;
    }

    const result = await query;
    return result.map((r) => ({ name: String(r.year || 0), count: Number(r.count) }));
}

export async function getConsumptionByMonth(months: number = 12) {
    // Get the start date (months ago)
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    const startDateStr = startDate.toISOString().split('T')[0];

    // Get consumption data grouped by month
    const result = await db
        .select({
            month: sql<string>`TO_CHAR(${tastings.date}, 'YYYY-MM')`,
            count: sql<number>`COUNT(*)`,
        })
        .from(tastings)
        .where(sql`${tastings.date} >= ${startDateStr} AND ${tastings.date} IS NOT NULL`)
        .groupBy(sql`TO_CHAR(${tastings.date}, 'YYYY-MM')`)
        .orderBy(asc(sql`TO_CHAR(${tastings.date}, 'YYYY-MM')`));

    // Generate all months in range and fill missing ones with 0
    const monthsData: Array<{ month: string; count: number }> = [];
    const currentDate = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() - i);
        const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        const found = result.find(r => r.month === monthStr);
        monthsData.push({
            month: monthStr,
            count: found ? Number(found.count) : 0,
        });
    }

    // Format month labels
    return monthsData.map(item => {
        const [year, month] = item.month.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        return {
            month: item.month,
            label: `${monthNames[parseInt(month) - 1]} ${year.slice(-2)}`,
            count: item.count,
        };
    });
}

export async function getMaturityByYear(years: number = 10) {
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + years;

    // Get all wines with apogee dates
    const winesData = await db
        .select({
            debutApogee: wines.debutApogee,
            finApogee: wines.finApogee,
            nombre: wines.nombre,
        })
        .from(wines)
        .where(sql`${wines.nombre} > 0 AND ${wines.debutApogee} IS NOT NULL AND ${wines.finApogee} IS NOT NULL`);

    // Calculate maturity for each year
    const yearData: Array<{ year: number; keep: number; peak: number; old: number }> = [];

    for (let year = currentYear; year <= endYear; year++) {
        let keep = 0;
        let peak = 0;
        let old = 0;

        winesData.forEach(wine => {
            const debut = wine.debutApogee;
            const fin = wine.finApogee;
            const count = Number(wine.nombre) || 0;

            if (debut && fin) {
                if (year < debut) {
                    keep += count;
                } else if (year >= debut && year <= fin) {
                    peak += count;
                } else if (year > fin) {
                    old += count;
                }
            }
        });

        yearData.push({ year, keep, peak, old });
    }

    return yearData.map(item => ({
        year: item.year,
        label: String(item.year),
        keep: item.keep,
        peak: item.peak,
        old: item.old,
        total: item.keep + item.peak + item.old,
    }));
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

export async function getProfileStats() {
    // Total bottles in stock
    const bottlesResult = await db
        .select({ sum: sql<number>`COALESCE(SUM(${wines.nombre}), 0)` })
        .from(wines)
        .where(sql`${wines.nombre} > 0`);

    // Total tastings count
    const tastingsResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(tastings);

    // Average rating from tastings
    const avgRatingResult = await db
        .select({ avg: sql<number>`COALESCE(AVG(CAST(${tastings.rating} AS DECIMAL)), 0)` })
        .from(tastings)
        .where(sql`${tastings.rating} IS NOT NULL`);

    return {
        totalBottles: Number(bottlesResult[0]?.sum) || 0,
        totalTastings: Number(tastingsResult[0]?.count) || 0,
        avgRating: Number(avgRatingResult[0]?.avg).toFixed(1) || "0.0",
    };
}

