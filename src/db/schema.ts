import { boolean, index, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    brand: text("brand").notNull().default(""),
    category: text("category").notNull(), // telephones | ordinateurs | tablettes | audio-accessoires
    subcategory: text("subcategory").notNull(),
    subcategoryLabel: text("subcategory_label").notNull().default(""),
    condition: text("condition").notNull().default("neuf"), // neuf | occasion
    conditionDetail: text("condition_detail").notNull().default("Neuf"),
    warranty: text("warranty"),
    description: text("description").notNull().default(""),
    images: jsonb("images").$type<string[]>().notNull().default([]),
    price: integer("price").notNull(), // FCFA
    priceNote: text("price_note"),
    featured: boolean("featured").notNull().default(false),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("products_category_idx").on(t.category),
    index("products_subcategory_idx").on(t.subcategory),
    index("products_price_idx").on(t.price),
  ],
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
