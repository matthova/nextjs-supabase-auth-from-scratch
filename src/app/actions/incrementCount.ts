"use server";

import { incrementCountForUser } from "@/db/queries";
import { revalidatePath } from "next/cache";

export async function incrementCount(userId: string) {
  await incrementCountForUser(userId);
  revalidatePath("/");
}
