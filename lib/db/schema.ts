import { pgTable, text, integer, timestamp, decimal, serial, date, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Wine types enum values
export const wineTypes = [
    "Rouge",
    "Blanc",
    "Blanc moelleux",
    "Blanc effervescent",
    "Rosé",
] as const;

export type WineType = (typeof wineTypes)[number];

// Core Wine entity
export const wines = pgTable("wines", {
    id: serial("id").primaryKey(),
    domaine: text("domaine").notNull(),
    millesime: integer("millesime"),
    appellation: text("appellation"),
    designation: text("designation"),
    cru: text("cru"),
    type: varchar("type", { length: 50 }),
    region: text("region"),
    cepage: text("cepage"),
    debutApogee: integer("debut_apogee"),
    finApogee: integer("fin_apogee"),
    note: text("note"),
    prixAchat: decimal("prix_achat", { precision: 10, scale: 2 }),
    lieuAchat: text("lieu_achat"),
    dateAchat: date("date_achat"),
    nombre: integer("nombre").default(1),
    caConnu: decimal("ca_connu", { precision: 10, scale: 2 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Tasting notes - one wine can have many tastings
export const tastings = pgTable("tastings", {
    id: serial("id").primaryKey(),
    wineId: integer("wine_id").references(() => wines.id, { onDelete: "cascade" }).notNull(),
    date: date("date"),
    rating: decimal("rating", { precision: 3, scale: 1 }),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const winesRelations = relations(wines, ({ many }) => ({
    tastings: many(tastings),
}));

export const tastingsRelations = relations(tastings, ({ one }) => ({
    wine: one(wines, {
        fields: [tastings.wineId],
        references: [wines.id],
    }),
}));

// Types for TypeScript
export type Wine = typeof wines.$inferSelect;
export type NewWine = typeof wines.$inferInsert;
export type Tasting = typeof tastings.$inferSelect;
export type NewTasting = typeof tastings.$inferInsert;
