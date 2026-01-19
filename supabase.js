import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cyuqpiginylojahoytxx.supabase.co";
const supabaseKey = "sb_publishable_CiXdCgdXrbfXi2nZfc-Ywg_MGsB57DQ";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
