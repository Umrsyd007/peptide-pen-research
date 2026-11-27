import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export async function getServerSupabaseClient() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return supabaseAdmin;
  }

  const supabaseUrl =
    process.env.SUPABASE_URL ??
    process.env.VITE_SUPABASE_URL ??
    "https://caxskmuobsvvybkducdd.supabase.co";

  const publicKey =
    process.env.VITE_SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    "";

  if (!supabaseUrl || !publicKey) {
    throw new Error(
      "Missing Supabase connection settings on server (SUPABASE_URL and anon/publishable key).",
    );
  }

  return createClient<Database>(supabaseUrl, publicKey, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}