import { db } from "./index";
import { countsTable } from "./schema";
import { eq } from "drizzle-orm";

export async function incrementCountForUser(userId: string) {
  const count = await getCountForUser(userId);
  if (count == null) {
    await db.insert(countsTable).values({ userId, count: 1 }).execute();
    return;
  }
  await db.update(countsTable).set({
    count: count + 1,
  });
}

export async function getCountForUser(userId: string): Promise<number | null> {
  const result = await db
    .select()
    .from(countsTable)
    .where(eq(countsTable.userId, userId))
    .execute();

  return result[0]?.count ?? null;
}
