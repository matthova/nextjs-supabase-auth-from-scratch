import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

function createSupabaseClient() {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function getClientSupabase() {
  if (supabase != null) {
    return supabase;
  }

  supabase = createSupabaseClient();
  return supabase;
}
