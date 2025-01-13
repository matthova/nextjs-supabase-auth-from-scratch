import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const countsTable = pgTable("counts_table", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id)
    .unique(),
  count: integer("count").notNull().default(0),
});
export type InsertCount = typeof countsTable.$inferInsert;
export type SelectCount = typeof countsTable.$inferSelect;
