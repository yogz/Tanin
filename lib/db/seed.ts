import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as XLSX from "xlsx";
import * as path from "path";
import { wines, tastings } from "./schema";
import { sql } from "drizzle-orm";

// Convert any value to string safely
function toString(val: unknown): string {
    if (val === null || val === undefined) return "";
    return String(val);
}

// Parse date in DD/MM/YYYY format
function parseDate(dateVal: unknown): string | null {
    const dateStr = toString(dateVal);
    if (!dateStr.trim()) return null;
    // Handle multiple dates (take the first one)
    const firstDate = dateStr.split("\n")[0].trim();
    const parts = firstDate.split("/");
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    // Validate parts are numbers
    if (isNaN(parseInt(day)) || isNaN(parseInt(month)) || isNaN(parseInt(year))) return null;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

// Parse integer safely
function safeParseInt(val: unknown): number | null {
    if (val === null || val === undefined) return null;
    // If it's already a number, return it
    if (typeof val === "number") return Math.floor(val);
    const str = String(val).trim();
    if (str === "") return null;
    const num = parseInt(str);
    return isNaN(num) ? null : num;
}

// Parse rating like "3/5" or "4,5" to decimal
function parseRating(ratingVal: unknown): string | null {
    const ratingStr = toString(ratingVal);
    if (!ratingStr.trim()) return null;
    // Handle multiple ratings (take the first one)
    const firstRating = ratingStr.split("\n")[0].trim();
    // Handle "3/5" format - convert to 5-point scale
    if (firstRating.includes("/")) {
        const [num] = firstRating.split("/");
        const parsed = parseFloat(num);
        return isNaN(parsed) ? null : num;
    }
    // Handle "4,5" format - French decimal
    const result = firstRating.replace(",", ".");
    return isNaN(parseFloat(result)) ? null : result;
}

// Parse price - handle French format with comma and numeric values
function parsePrice(priceVal: unknown): string | null {
    if (priceVal === null || priceVal === undefined) return null;
    // If it's already a number, return it as string
    if (typeof priceVal === "number") return priceVal.toString();
    const priceStr = String(priceVal).trim();
    if (!priceStr) return null;
    // Handle multiple prices (take the first one)
    const firstPrice = priceStr.split("\n")[0].trim();
    const cleaned = firstPrice.replace(",", ".").replace(/[^0-9.]/g, "");
    return cleaned === "" || isNaN(parseFloat(cleaned)) ? null : cleaned;
}

// Parse multiple tastings from a single row
function parseTastings(row: Record<string, unknown>): Array<{ date: string | null; rating: string | null; comment: string | null }> {
    const tastingsList: Array<{ date: string | null; rating: string | null; comment: string | null }> = [];

    const dates = toString(row["Date dégustation"]).split("\n").map((d) => d.trim()).filter(Boolean);
    const ratings = toString(row["Ma Note"]).split("\n").map((r) => r.trim()).filter(Boolean);
    const comments = toString(row["Commentaire"]).split("\n").map((c) => c.trim()).filter(Boolean);

    // Get the max count of any field
    const maxCount = Math.max(dates.length, ratings.length, comments.length, 1);

    for (let i = 0; i < maxCount; i++) {
        const dateStr = dates[i] || "";
        const ratingStr = ratings[i] || "";
        const commentStr = comments[i] || "";

        // Only add if at least one field has data
        if (dateStr || ratingStr || commentStr) {
            tastingsList.push({
                date: parseDate(dateStr),
                rating: parseRating(ratingStr),
                comment: commentStr || null,
            });
        }
    }

    return tastingsList;
}

// Validate that a row has valid wine data
function isValidWineRow(row: Record<string, unknown>): boolean {
    // Must have a valid domaine
    const domaine = toString(row["Domaine"]);
    if (!domaine || domaine.length > 200) return false;
    // Skip rows where domaine looks like a comment or date
    if (domaine.includes("Je ") || domaine.includes("Tout seul") || domaine.match(/^\d{2}\/\d{2}\/\d{4}/)) return false;
    return true;
}

async function seed() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is not set");
    }

    const sqlClient = neon(process.env.DATABASE_URL);
    const db = drizzle(sqlClient);

    console.log("🗑️  Clearing existing data...");

    // Clear existing data (tastings first due to foreign key)
    await db.delete(tastings);
    await db.delete(wines);

    // Reset sequences
    await db.execute(sql`ALTER SEQUENCE wines_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE tastings_id_seq RESTART WITH 1`);

    console.log("✅ Database cleared!");
    console.log("🌱 Starting seed...");

    // Read and parse Excel
    const excelPath = path.join(process.cwd(), "cave", "Copie de Cave Little.xlsx");
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    console.log(`📊 Found ${rows.length} rows in Excel`);

    let imported = 0;
    let skipped = 0;
    let tastingsImported = 0;

    // Insert wines and their tastings
    for (const row of rows) {
        // Skip invalid rows
        if (!isValidWineRow(row)) {
            skipped++;
            continue;
        }

        try {
            // Insert wine
            const [insertedWine] = await db
                .insert(wines)
                .values({
                    domaine: toString(row["Domaine"]),
                    millesime: safeParseInt(row["Millésime"]),
                    appellation: toString(row["Appellation"]) || null,
                    designation: toString(row["Désignation"]) || null,
                    cru: toString(row["Cru"]) || null,
                    type: toString(row["Type"]) || null,
                    region: toString(row["Région"]) || null,
                    cepage: toString(row["Cépage principal"]) || null,
                    debutApogee: safeParseInt(row["Début apogée"]),
                    finApogee: safeParseInt(row["Fin apogée"]),
                    note: toString(row["Note"]) || null,
                    prixAchat: parsePrice(row["Prix achat"]),
                    lieuAchat: toString(row["Lieu Achat"]) || null,
                    dateAchat: parseDate(row["Date Achat"]),
                    nombre: safeParseInt(row["Nombre"]) ?? 0,
                    caConnu: parsePrice(row["CA Connu"]),
                })
                .returning({ id: wines.id });

            // Parse and insert all tastings for this wine
            const wineTastings = parseTastings(row);
            for (const tasting of wineTastings) {
                await db.insert(tastings).values({
                    wineId: insertedWine.id,
                    date: tasting.date,
                    rating: tasting.rating,
                    comment: tasting.comment,
                });
                tastingsImported++;
            }

            imported++;
            if (imported % 50 === 0) {
                console.log(`  ✓ Imported ${imported} wines...`);
            }
        } catch (error) {
            console.error(`  ✗ Failed to import: ${toString(row["Domaine"])}`, error);
            skipped++;
        }
    }

    console.log(`\n✅ Seed completed!`);
    console.log(`   Imported: ${imported} wines`);
    console.log(`   Imported: ${tastingsImported} tastings`);
    console.log(`   Skipped: ${skipped} rows`);
}

seed().catch(console.error);
