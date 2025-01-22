import postgres from "postgres";
import { DrizzleConfig } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";

import { createSupabaseClient } from "./getServerSupabase";

import { createDrizzle } from "./drizzle";
import * as schema from "./schema";
import { decode } from "./jwt";

const config = {
  casing: "snake_case",
  schema,
} satisfies DrizzleConfig<typeof schema>;

// ByPass RLS
const admin = drizzle({
  client: postgres(process.env.POSTGRES_URL!, { prepare: false }),
  ...config,
});

// Protected by RLS
const client = drizzle({
  client: postgres(process.env.POSTGRES_RLS_URL!, { prepare: false }),
  ...config,
});

// https://github.com/orgs/supabase/discussions/23224
// Should be secure because we use the access token that is signed, and not the data read directly from the storage
export async function createDrizzleSupabaseClient() {
  const supabase = await createSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return createDrizzle(decode(session?.access_token ?? ""), { admin, client });
}
