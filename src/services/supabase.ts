import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;
const supabaseServiceRoleSecret = import.meta.env
  .VITE_SUPABASE_SERVICE_ROLE_SECRET as string;

const supabaseClient = createClient(supabaseUrl, supabaseKey, {});

export const supabase = () => supabaseClient;

const supabaseAdminClient = createClient(
  supabaseUrl,
  supabaseServiceRoleSecret,
);
const supabaseAdmin = () => supabaseAdminClient;

export default { supabase, supabaseAdmin };
