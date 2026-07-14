import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in process.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .limit(1);
  
  if (error) {
    console.log("Gallery table does not exist or error:", error.message);
  } else {
    console.log("Gallery table exists! Row data sample:", data);
  }
}

main().catch(console.error);
