import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in process.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Checking Supabase connection and tables...");
  
  const tables = ['leads', 'reviews', 'blog_posts', 'projects', 'gallery_items', 'testimonials'];
  for (const table of tables) {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`Table "${table}": Error checking:`, error.message);
    } else {
      console.log(`Table "${table}": exists with ${count} rows`);
    }
  }
}

main().catch(console.error);
