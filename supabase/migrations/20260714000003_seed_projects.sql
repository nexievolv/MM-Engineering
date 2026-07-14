-- SQL script to seed Projects table with the 6 standard case studies, 
-- dynamically resolving image URLs from the gallery table.

-- 1. Clear existing projects to prevent slug duplication
truncate table public.projects restart identity cascade;

-- 2. Insert case studies
insert into public.projects (
  slug,
  title,
  industry,
  client,
  completed,
  summary,
  specs,
  sort_order,
  active,
  image_url
) values
(
  'hygienic-ss-piping-baddi',
  'Hygienic SS 316L Piping for Pharma Plant',
  'Pharmaceutical',
  'Pharma Formulation Unit, Baddi',
  'January 2025',
  'Fabrication and site installation of clean utility SS 316L piping for a sterile formulation block in Baddi. Included complete weld logs and material certificates.',
  array[
    'SS 316L orbital welding',
    'Boroscopy inspection & report',
    'DM water loop distribution',
    'Completed during planned shutdown'
  ],
  10,
  true,
  coalesce((select public_url from public.gallery where filename like '%workshop-2.jpg%' or filename like '%workshop-2%' limit 1), 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80')
),
(
  'structural-steel-mezzanine-solan',
  'Structural Steel Mezzanine & Platforms',
  'Structural Engineering',
  'Packaging unit, Baddi',
  'December 2024',
  'Design support, fabrication and erection of a 120 sq. metre raw material storage mezzanine floor inside an operating packaging box factory in Baddi.',
  array[
    'IS 2062 structural steel',
    'CO2 welding by certified welders',
    'Epoxy primer and poly-urethane paint',
    'Zero-accident execution at height'
  ],
  20,
  true,
  coalesce((select public_url from public.gallery where filename like '%workshop-7.jpg%' or filename like '%workshop-7%' limit 1), 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80')
),
(
  'ss-conveyor-food-plant',
  'SS 304 Hygienic Belt Conveyor Line',
  'Food Processing',
  'Snack food manufacturer, Nalagarh',
  'March 2025',
  'Turnkey fabrication and installation of a hygienic SS 304 belt conveyor line connecting frying, seasoning and packaging sections of a snack food plant in Nalagarh.',
  array[
    '45 metre SS conveyor line',
    'Food-grade SS 304 construction',
    'Sanitary design with easy cleaning',
    'Installed and commissioned on site'
  ],
  30,
  true,
  coalesce((select public_url from public.gallery where filename like '%workshop-8.jpg%' or filename = 'workshop-8' limit 1), 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80')
),
(
  'gear-replacement-textile',
  'Replacement Gear Set for Textile Machinery',
  'Textile',
  'Textile mill, Punjab',
  'November 2024',
  'Emergency replacement of a broken imported helical gear set — reverse engineered from sample and delivered in eight working days to restart a stopped textile line.',
  array[
    'Helical gear set — reverse engineered',
    'Manufactured from EN24',
    'Induction hardened teeth',
    'Delivered in 8 working days'
  ],
  40,
  true,
  coalesce((select public_url from public.gallery where filename like '%workshop-3.jpg%' or filename like '%workshop-3%' limit 1), 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80')
),
(
  'hvac-ducting-cleanroom',
  'HVAC Ducting for Cleanroom Facility',
  'Pharmaceutical',
  'Cleanroom project, Baddi',
  'July 2024',
  'Fabrication and phased dispatch of GI HVAC ducting for a new cleanroom facility in Baddi — matched to the site erection sequence.',
  array[
    'GI ducting, factory-fabricated',
    'Rectangular & spiral sections',
    'Flanged joints with gaskets',
    'Delivered floor-wise for phased installation'
  ],
  50,
  true,
  coalesce((select public_url from public.gallery where filename like '%workshop-9.jpg%' or filename like '%workshop-9%' limit 1), 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80')
),
(
  'bmc-machined-parts-oem',
  'BMC Machined Components for Machine Builder',
  'Machine Building',
  'Special-purpose machine builder, Chandigarh',
  'Ongoing since 2022',
  'Recurring supply of BMC bored and milled components — shafts, housings and flanges — for a Chandigarh-based special-purpose machine builder.',
  array[
    'Machined shafts, housings & flanges',
    'Tolerances up to ±0.02 mm',
    'EN8, EN24, SS 304 materials',
    'Repeat monthly batches'
  ],
  60,
  true,
  coalesce((select public_url from public.gallery where filename like '%workshop-5.jpg%' or filename like '%workshop-5%' limit 1), 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80')
);
