import { eq, sql } from "drizzle-orm";
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
    pgPolicy("authenticated user can create", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`true`,
    }),
    pgPolicy("owner can view count", {
      for: "select",
      to: authenticatedRole,
      using: eq(t.userId, authUid),
    }),
    pgPolicy("owner can update count", {
      for: "update",
      to: authenticatedRole,
      using: eq(t.userId, authUid),
      withCheck: eq(t.userId, authUid),
    }),
    pgPolicy("owner can delete count", {
      for: "delete",
      to: authenticatedRole,
      using: eq(t.userId, authUid),
    }),
  ]
).enableRLS();
export type InsertCount = typeof countsTable.$inferInsert;
export type SelectCount = typeof countsTable.$inferSelect;
