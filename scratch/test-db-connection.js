import pg from 'pg';
const { Client } = pg;

async function test() {
  const passwords = ['MMAdmin2026!', 'postgres'];
  const projectRefs = ['jguufknhhpdgnvklgxej', 'shkoibiglusjjwiguloq'];
  const regions = ['ap-south-1', 'ap-southeast-1', 'us-east-1', 'us-west-1'];
  
  for (const ref of projectRefs) {
    for (const region of regions) {
      // Format 1: pooler
      const host = `aws-0-${region}.pooler.supabase.com`;
      for (const password of passwords) {
        console.log(`Trying connection to ${host} with user postgres, db ${ref}, password...`);
        const client = new Client({
          host: host,
          port: 6543, // Transaction pooler
          user: `postgres.${ref}`, // In Supabase pooler, connection user must be postgres.[ref]
          password: password,
          database: 'postgres',
          ssl: { rejectUnauthorized: false }
        });
        
        try {
          await client.connect();
          console.log(`SUCCESS! Connected to ${host} for project ${ref}.`);
          const res = await client.query('SELECT NOW()');
          console.log('Result:', res.rows[0]);
          await client.end();
          process.exit(0);
        } catch (err) {
          console.log(`Failed: ${err.message}`);
        }
      }
    }
  }
}

test().catch(console.error);
