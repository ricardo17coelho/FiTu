import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;
const supabaseServiceRoleSecret = import.meta.env
  .VITE_SUPABASE_SERVICE_ROLE_SECRET as string;

export const supabase = createClient(supabaseUrl, supabaseKey, {});

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleSecret
);
