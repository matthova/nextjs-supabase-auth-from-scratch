import { eq } from "drizzle-orm";
import { integer, pgPolicy, pgTable, uuid } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";
import { authenticatedRole, authUid } from "drizzle-orm/supabase";

export const countsTable = pgTable(
  "counts_table",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id)
      .unique(),
    count: integer("count").notNull().default(0),
  },
  (t) => [
    pgPolicy("owner can read and update", {
      for: "all",
      to: authenticatedRole,
      using: eq(t.userId, authUid),
      withCheck: eq(t.userId, authUid),
    }),
  ]
).enableRLS();
export type InsertCount = typeof countsTable.$inferInsert;
export type SelectCount = typeof countsTable.$inferSelect;
