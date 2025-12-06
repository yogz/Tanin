import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as fs from "fs";
import * as path from "path";
import { wines, tastings } from "./schema";

// Parse date in DD/MM/YYYY format
function parseDate(dateStr: string | undefined): string | null {
    if (!dateStr || dateStr.trim() === "") return null;
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    // Validate parts are numbers
    if (isNaN(parseInt(day)) || isNaN(parseInt(month)) || isNaN(parseInt(year))) return null;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

// Parse integer safely
function safeParseInt(str: string | undefined): number | null {
    if (!str || str.trim() === "") return null;
    const num = parseInt(str);
    return isNaN(num) ? null : num;
}

// Parse rating like "3/5" or "4,5" to decimal
function parseRating(ratingStr: string | undefined): string | null {
    if (!ratingStr || ratingStr.trim() === "") return null;
    // Handle "3/5" format - convert to 5-point scale
    if (ratingStr.includes("/")) {
        const [num] = ratingStr.split("/");
        const parsed = parseFloat(num);
        return isNaN(parsed) ? null : num;
    }
    // Handle "4,5" format - French decimal
    const result = ratingStr.replace(",", ".");
    return isNaN(parseFloat(result)) ? null : result;
}

// Parse price - handle French format with comma
function parsePrice(priceStr: string | undefined): string | null {
    if (!priceStr || priceStr.trim() === "") return null;
    const cleaned = priceStr.replace(",", ".").replace(/[^0-9.]/g, "");
    return cleaned === "" || isNaN(parseFloat(cleaned)) ? null : cleaned;
}

// Parse CSV (simple parser for this specific format)
function parseCSV(content: string): Record<string, string>[] {
    const lines = content.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        // Simple CSV parsing (handles quoted fields with commas)
        const values: string[] = [];
        let current = "";
        let inQuotes = false;

        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === "," && !inQuotes) {
                values.push(current.trim());
                current = "";
            } else {
                current += char;
            }
        }
        values.push(current.trim());

        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || "";
        });
        rows.push(row);
    }

    return rows;
}

// Validate that a row has valid wine data
function isValidWineRow(row: Record<string, string>): boolean {
    // Must have a valid domaine that doesn't look like a comment
    const domaine = row["Domaine"];
    if (!domaine || domaine.length > 200) return false;
    // Skip rows where domaine looks like a comment or date
    if (domaine.includes("Je ") || domaine.includes("Tout seul") || domaine.match(/^\d{2}\/\d{2}\/\d{4}/)) return false;
    return true;
}

async function seed() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is not set");
    }

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    console.log("🌱 Starting seed...");

    // Read and parse CSV
    const csvPath = path.join(process.cwd(), "cave", "Cave Little - Cave détaillée.csv");
    const csvContent = fs.readFileSync(csvPath, "utf-8");
    const rows = parseCSV(csvContent);

    console.log(`📊 Found ${rows.length} rows in CSV`);

    let imported = 0;
    let skipped = 0;

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
                    domaine: row["Domaine"],
                    millesime: safeParseInt(row["Millésime"]),
                    appellation: row["Appellation"] || null,
                    designation: row["Désignation"] || null,
                    cru: row["Cru"] || null,
                    type: row["Type"] || null,
                    region: row["Région"] || null,
                    cepage: row["Cépage principal"] || null,
                    debutApogee: safeParseInt(row["Début apogée"]),
                    finApogee: safeParseInt(row["Fin apogée"]),
                    note: row["Note"] || null,
                    prixAchat: parsePrice(row["Prix achat"]),
                    lieuAchat: row["Lieu Achat"] || null,
                    dateAchat: parseDate(row["Date Achat"]),
                    nombre: safeParseInt(row["Nombre"]) ?? 0,
                    caConnu: parsePrice(row["CA Connu"]),
                })
                .returning({ id: wines.id });

            // Insert tasting if present
            if (row["Date dégustation"] || row["Ma Note"] || row["Commentaire"]) {
                await db.insert(tastings).values({
                    wineId: insertedWine.id,
                    date: parseDate(row["Date dégustation"]),
                    rating: parseRating(row["Ma Note"]),
                    comment: row["Commentaire"] || null,
                });
            }

            imported++;
            if (imported % 50 === 0) {
                console.log(`  ✓ Imported ${imported} wines...`);
            }
        } catch (error) {
            console.error(`  ✗ Failed to import: ${row["Domaine"]}`, error);
            skipped++;
        }
    }

    console.log(`\n✅ Seed completed!`);
    console.log(`   Imported: ${imported} wines`);
    console.log(`   Skipped: ${skipped} rows`);
}

seed().catch(console.error);
