import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in process.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const assets = [
  { file: 'hero-fabrication.jpg', title: 'Hero Fabrication', page: 'Homepage', section: 'Hero', category: 'Cover', alt: 'Industrial fabrication workshop at MM Engineering, Baddi' },
  { file: 'workshop.jpg', title: 'Workshop Overview', page: 'About', section: 'Overview', category: 'Cover', alt: 'Inside MM Engineering\'s fabrication workshop in Baddi' },
  { file: 'heavy-machinery.jpg', title: 'Heavy Machinery Fabrication', page: 'Homepage', section: 'Capabilities', category: 'Cover', alt: 'Fabrication bay at MM Engineering, Baddi' },
  { file: 'quality.jpg', title: 'Quality Inspection', page: 'Homepage', section: 'About', category: 'Gallery', alt: 'Precision quality inspection at MM Engineering' },
  { file: 'cnc.jpg', title: 'CNC Machining', page: 'Services', section: 'bmc-machining', category: 'Cover', alt: 'BMC machining tolerances' },
  { file: 'engineering-design.jpg', title: 'Engineering Design', page: 'Services', section: 'engineering-design', category: 'Cover', alt: 'Engineering design blueprint' },
  { file: 'welding.jpg', title: 'Structural Welding', page: 'Homepage', section: 'Hero', category: 'Gallery', alt: 'Certified structural welding' },
  { file: 'steel-structure.jpg', title: 'Structural Steel Platform', page: 'Projects', section: 'steel-structure', category: 'Cover', alt: 'Structural steel platform installation' },
  { file: 'factory.jpg', title: 'Industrial Facility', page: 'About', section: 'Facility', category: 'Cover', alt: 'Industrial plant support' },
  { file: 'finished-products.jpg', title: 'Finished Products', page: 'Homepage', section: 'Showcase', category: 'Gallery', alt: 'Finished machined gears and components' }
];

async function seed() {
  console.log("Starting media seeding to Supabase...");
  
  // Verify/create bucket
  const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets();
  if (bucketsErr) {
    console.error("Error listing buckets:", bucketsErr.message);
    return;
  }
  
  const hasGallery = buckets.some(b => b.id === 'gallery');
  if (!hasGallery) {
    console.log("Creating gallery bucket...");
    const { error: createErr } = await supabase.storage.createBucket('gallery', { public: true });
    if (createErr) {
      console.error("Failed to create bucket:", createErr.message);
      return;
    }
  }

  // Clear existing gallery table records to avoid duplicates when running again
  console.log("Clearing existing gallery records...");
  const { error: deleteErr } = await supabase.from('gallery').delete().neq('title', 'XYZ_NEVER_MATCH');
  if (deleteErr) {
    console.warn("Could not clear gallery table (might be empty):", deleteErr.message);
  }

  for (const asset of assets) {
    const filePath = path.join('src/assets', asset.file);
    if (!fs.existsSync(filePath)) {
      console.log(`Local asset file not found: ${filePath}`);
      continue;
    }

    console.log(`Processing ${asset.file}...`);
    const fileBuffer = fs.readFileSync(filePath);
    
    // Upload file
    const storagePath = `seeding/${asset.file}`;
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('gallery')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (uploadErr) {
      console.error(`Failed to upload ${asset.file} to storage:`, uploadErr.message);
      continue;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(storagePath);
    console.log(`Uploaded! Public URL: ${publicUrl}`);

    // Create gallery record
    const { data: dbData, error: dbErr } = await supabase
      .from('gallery')
      .insert({
        title: asset.title,
        filename: asset.file,
        storage_path: storagePath,
        public_url: publicUrl,
        alt_text: asset.alt,
        page: asset.page,
        section: asset.section,
        category: asset.category,
        is_published: true,
        show_on_homepage: asset.page === 'Homepage' || asset.section === 'Capabilities'
      })
      .select();

    if (dbErr) {
      console.error(`Failed to create gallery DB record for ${asset.file}:`, dbErr.message);
    } else {
      console.log(`DB record inserted successfully for ${asset.file}`);
    }
  }
  
  console.log("Seeding process completed!");
}

seed().catch(console.error);
