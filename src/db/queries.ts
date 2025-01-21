import { createDrizzleSupabaseClient } from "./db";
import { countsTable } from "./schema";
import { eq } from "drizzle-orm";

export async function incrementCountForUser(userId: string) {
  const db = await createDrizzleSupabaseClient();
  
  const count = await getCountForUser(userId);
  if (count == null) {
    console.log('about to insert new count');
    try {
      await db.rls(t => t.insert(countsTable).values({ userId, count: 1 }).execute());
    } catch (ex) {
      console.log('error inserting new count', ex);
    }
    return;
  }
  try {
    console.log('about to update count');
  await db.rls(t => t
    .update(countsTable)
    .set({
      count: count + 1,
    })
    .where(eq(countsTable.userId, userId))
    .execute())
  } catch (ex) {
    console.log('error updating count', ex);
    throw ex
  }
}

export async function getCountForUser(userId: string): Promise<number | null> {
  const db = await createDrizzleSupabaseClient();
  let result = null;
  try {
    console.log('about to get count')
  result = await db.rls((t) => 
    t.select()
    .from(countsTable)
    .where(eq(countsTable.userId, userId))
    .execute()
  );
} catch (ex) {
  console.log("error getting count", ex);
  return null
  }

  return result[0]?.count ?? null;
}
