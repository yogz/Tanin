import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";

async function createTables() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is not set");
    }

    const sql = neon(process.env.DATABASE_URL);

    console.log("🏗️ Creating wines table...");
    await sql`
    CREATE TABLE IF NOT EXISTS wines (
      id SERIAL PRIMARY KEY,
      domaine TEXT NOT NULL,
      millesime INTEGER,
      appellation TEXT,
      designation TEXT,
      cru TEXT,
      type VARCHAR(50),
      region TEXT,
      cepage TEXT,
      debut_apogee INTEGER,
      fin_apogee INTEGER,
      note TEXT,
      prix_achat DECIMAL(10, 2),
      lieu_achat TEXT,
      date_achat DATE,
      nombre INTEGER DEFAULT 1,
      ca_connu DECIMAL(10, 2),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

    console.log("🏗️ Creating tastings table...");
    await sql`
    CREATE TABLE IF NOT EXISTS tastings (
      id SERIAL PRIMARY KEY,
      wine_id INTEGER NOT NULL REFERENCES wines(id) ON DELETE CASCADE,
      date DATE,
      rating DECIMAL(3, 1),
      comment TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

    console.log("✅ Tables created successfully!");
}

createTables().catch(console.error);
