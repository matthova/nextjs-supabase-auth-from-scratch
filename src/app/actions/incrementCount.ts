"use server";

import { incrementCountForUser } from "@/db/queries";
import { revalidatePath } from "next/cache";

export async function incrementCount(userId: string) {
  let didError = false;
  try {
    const rand = Math.random();
    if (rand > 0.5) {
      throw new Error("ope");
    }
    await incrementCountForUser(userId);
  } catch (ex) {
    console.log("Increment failed", ex);
    didError = true;
  } finally {
    revalidatePath("/");
  }

  if (didError) {
    throw new Error("Increment failed");
  }
}
