import heroFabrication from "@/assets/hero-fabrication.jpg";
import welding from "@/assets/welding.jpg";
import cnc from "@/assets/cnc.jpg";
import steelStructure from "@/assets/steel-structure.jpg";
import heavyMachinery from "@/assets/heavy-machinery.jpg";
import engineeringDesign from "@/assets/engineering-design.jpg";
import workshop from "@/assets/workshop.jpg";
import quality from "@/assets/quality.jpg";
import factory from "@/assets/factory.jpg";
import finishedProducts from "@/assets/finished-products.jpg";

export const img = {
  heroFabrication,
  welding,
  cnc,
  steelStructure,
  heavyMachinery,
  engineeringDesign,
  workshop,
  quality,
  factory,
  finishedProducts,
};

export const company = {
  name: "MM Engineering",
  shortName: "MM",
  legalName: "MM Engineering",
  tagline: "Industrial Fabrication & Precision Engineering — Baddi, Himachal Pradesh",
  phone: "+91 93188 73188",
  phoneRaw: "+919318873188",
  email: "info@mmengineeringbaddi.in",
  address:
    "Near Simro Dharam Kanta, By Pass Road, Baddi, Himachal Pradesh 173205, India",
  addressShort: "Baddi, Himachal Pradesh",
  hours: "Mon – Sat: 8:00 AM – 6:30 PM",
  hoursSchema: "Mo-Sa 08:00-18:30",
  whatsapp: "919318873188",
  operatingArea: [
    "Baddi",
    "Barotiwala",
    "Nalagarh",
    "BBN Industrial Area",
    "Solan District",
    "Himachal Pradesh",
  ],
  // Approx coordinates for Baddi, HP
  geo: { lat: 30.9578, lng: 76.7913 },
  mapsEmbed:
    "https://www.google.com/maps?q=Baddi,Himachal+Pradesh,India&output=embed",
  mapsLink: "https://maps.google.com/?q=MM+Engineering+Baddi+Himachal+Pradesh",
};

export const stats = [
  { value: 15, suffix: "+", label: "Years in Fabrication" },
  { value: 850, suffix: "+", label: "Projects Delivered" },
  { value: 120, suffix: "+", label: "Industrial Clients" },
  { value: 9, suffix: "", label: "Industries Served" },
];

export const trustedBy = [
  "Cipla",
  "Sun Pharma",
  "Cadila Healthcare",
  "Nestlé India",
  "Dabur",
  "Havells",
  "Kajaria Ceramics",
  "Amul",
];

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface FabricationType {
  slug: string;
  title: string;
  image: string;
  description: string;
  applications: string[];
  materials: string[];
  industries: string[];
  process: string[];
}

export interface Service {
  slug: string;
  title: string;
  icon: string;
  image: string;
  short: string;
  overview: string;
  benefits: string[];
  applications: string[];
  industries: string[];
  process: { step: string; detail: string }[];
  equipment: string[];
  materials: string[];
  faqs: ServiceFaq[];
  fabricationTypes?: FabricationType[];
  seoTitle: string;
  seoDescription: string;
}

const standardProcess = [
  { step: "Requirement Study", detail: "Drawings, samples and specifications reviewed by our engineering team. Feasibility and material advice shared within 24–48 hours." },
  { step: "Quotation & Approval", detail: "Detailed quotation with material grade, lead time and payment terms. Work order confirmed after drawing sign-off." },
  { step: "Material Procurement", detail: "Steel, stainless steel and consumables sourced from approved mills with test certificates (MTC) and traceability." },
  { step: "Fabrication & Machining", detail: "Cutting, forming, welding and machining executed as per approved drawings by experienced fabricators and CNC operators." },
  { step: "Inspection & Finishing", detail: "Dimensional check, weld inspection, cleaning, priming/painting or passivation as per specification." },
  { step: "Dispatch & Installation", detail: "Safe packing and on-time dispatch across the BBN belt and PAN India. On-site fitment support available on request." },
];

const industrialFabricationTypes: FabricationType[] = [
  {
    slug: "sheet-metal-fabrication",
    title: "Sheet Metal Fabrication",
    image: workshop,
    description:
      "Precision sheet metal fabrication for enclosures, control panels, machine covers, ducting and equipment housings — cut, bent and welded to your drawings.",
    applications: [
      "Electrical & control panel enclosures",
      "Machine guards and safety covers",
      "HVAC ducting and hoods",
      "Storage bins, trolleys and racks",
      "Pharma equipment housings",
    ],
    materials: [
      "Mild Steel (CRCA, HRCA)",
      "Stainless Steel 304 / 316 / 316L",
      "Galvanised Sheets (GI, GP)",
      "Aluminium Sheets",
    ],
    industries: ["Pharmaceutical", "Packaging", "Electrical", "Food Processing"],
    process: [
      "CNC laser / plasma cutting",
      "Press brake bending",
      "TIG / MIG welding & spot welding",
      "Grinding, buffing & powder coating",
    ],
  },
  {
    slug: "pipe-tube-fabrication",
    title: "Pipe & Tube Fabrication",
    image: heavyMachinery,
    description:
      "Industrial pipe and tube fabrication for process piping, utility lines, handrails, structural tubing and equipment skids — cut, bent and welded with certified fitters.",
    applications: [
      "Process and utility piping",
      "Steam, water and compressed air lines",
      "Handrails, ladders and cage structures",
      "Structural tubular frames",
      "Skid-mounted piping assemblies",
    ],
    materials: [
      "Mild Steel Pipes (ERW, seamless)",
      "Stainless Steel Pipes (SS 304 / 316)",
      "GI Pipes",
      "Structural Hollow Sections (SHS / RHS)",
    ],
    industries: ["Chemical", "Pharmaceutical", "Food & Beverage", "Boiler Houses"],
    process: [
      "Pipe cutting & beveling",
      "Cold and mandrel bending",
      "Root-run TIG + fill-cap MIG welding",
      "Pickling, passivation and hydro testing",
    ],
  },
  {
    slug: "stainless-steel-fabrication",
    title: "Stainless Steel Fabrication",
    image: quality,
    description:
      "Hygienic and corrosion-resistant stainless steel fabrication for pharma, food and dairy plants — mirror / matte finish, argon-purged welds and full traceability.",
    applications: [
      "Pharma process tanks and vessels",
      "Food-grade storage & mixing tanks",
      "Cleanroom furniture and pass boxes",
      "SS platforms, ladders and railings",
      "Sanitary piping and manifolds",
    ],
    materials: [
      "SS 304 / 304L",
      "SS 316 / 316L",
      "SS 202 (for non-critical work)",
      "Duplex Stainless (on request)",
    ],
    industries: ["Pharmaceutical", "Food & Dairy", "Cosmetics", "Hospitals & Cleanrooms"],
    process: [
      "Shear / laser cutting",
      "Argon-purged TIG welding",
      "Grinding, buffing & electropolishing",
      "Passivation and cleaning per cGMP",
    ],
  },
  {
    slug: "custom-fabrication",
    title: "Custom Fabrication",
    image: steelStructure,
    description:
      "Tailor-made industrial fabrication solutions designed to meet specific engineering requirements, custom machinery frames, structures, and specialized steel fixtures.",
    applications: [
      "Custom machine frames and bases",
      "Specialized process vessels and tanks",
      "Material handling trolleys and racks",
      "Industrial workbenches and tool cabinets",
      "Structural modifications and adapters",
    ],
    materials: [
      "Mild Steel (IS 2062)",
      "Stainless Steel 304 / 316",
      "Aluminium",
      "Galvanized Steel",
    ],
    industries: ["Manufacturing", "Pharmaceutical", "Packaging", "Food Processing"],
    process: [
      "Site measurement & requirement study",
      "CAD modeling & shop drawing approval",
      "Precision metal cutting & forming",
      "TIG / MIG welding, assembly & surface finishing",
    ],
  },
];

export const services: Service[] = [
  {
    slug: "industrial-fabrication",
    title: "Industrial Fabrication",
    icon: "Factory",
    image: heroFabrication,
    short:
      "Hygienic stainless steel (SS), mild steel (MS), and precision sheet metal fabrication for pharmaceutical formulation, cosmetic, packaging, and food processing plants across Baddi, Solan district, and the BBN industrial area.",
    overview:
      "MM Engineering is Baddi's leading single-source vendor for industrial metal fabrication. Operating from our fully equipped workshop near Baddi Bypass Road, we specialize in high-purity Stainless Steel (SS 304, SS 316, SS 316L) fabrication featuring mirror polishing, argon-purged TIG welding, and chemical pickling & passivation. We serve the region's massive pharmaceutical hub and packaging OEMs with custom-built equipment, sterile furniture, storage tanks, and industrial piping assemblies conforming to cGMP standards.",
    benefits: [
      "Single-source vendor for MS, GI and SS fabrication work in BBN",
      "Certified welders (SMAW, GTAW, GMAW) with tested procedures",
      "Material Test Certificates (MTC) and traceability on request",
      "On-time delivery across Baddi, Barotiwala, Nalagarh and PAN India",
      "On-site fitment, erection and modification support",
    ],
    applications: [
      "Process skids and equipment frames",
      "Storage tanks, vessels and hoppers",
      "Industrial ducting and exhaust systems",
      "Platforms, ladders and safety railings",
      "Structural steel and mezzanine floors",
    ],
    industries: [
      "Pharmaceutical",
      "Food & Beverage Processing",
      "Packaging",
      "Chemical & Cosmetics",
      "General Engineering",
    ],
    process: standardProcess,
    equipment: [
      "CNC laser & plasma cutting",
      "Press brake bending machines",
      "TIG, MIG and arc welding stations",
      "Pipe bending & threading machines",
      "Overhead crane handling up to 5 tons",
    ],
    materials: [
      "Mild Steel (IS 2062, CRCA, HRCA)",
      "Stainless Steel (SS 304 / 316 / 316L)",
      "Galvanised Iron (GI, GP)",
      "Structural sections (angles, channels, ISMB, ISMC)",
      "Aluminium sheets & sections",
    ],
    faqs: [
      {
        q: "Do you serve small and mid-size factories in Baddi and Barotiwala?",
        a: "Yes. A large share of our regular work comes from pharma, packaging and food processing units across Baddi, Barotiwala, Nalagarh and the BBN industrial belt. We take up single-piece jobs as well as recurring supply schedules.",
      },
      {
        q: "Can you fabricate as per our approved drawings and GA?",
        a: "Absolutely. We work strictly to customer-approved drawings, GA and bill of materials. Where drawings are not available, our team can prepare shop drawings from your samples or reference equipment.",
      },
      {
        q: "Do you provide on-site installation?",
        a: "Yes. Our fitters and welders travel across Himachal Pradesh, Punjab, Haryana and nearby regions for on-site erection, modification and breakdown work.",
      },
      {
        q: "What is the typical lead time?",
        a: "Standard fabrication jobs are delivered in 5–15 working days depending on scope and material availability. Urgent breakdown jobs are accommodated on a priority basis.",
      },
    ],
    fabricationTypes: industrialFabricationTypes,
    seoTitle: "Industrial Fabrication Company in Baddi | SS & Sheet Metal Work HP",
    seoDescription:
      "MM Engineering offers certified industrial fabrication in Baddi, Barotiwala, and Nalagarh. Hygienic SS 316L piping, sheet metal enclosures, and custom MS fabrication for pharma & packaging plants.",
  },
  {
    slug: "structural-steel-work",
    title: "Structural Steel Work",
    icon: "LayoutGrid",
    image: steelStructure,
    short: "Heavy structural steel fabrication, mezzanine floor installation, industrial shed erection, and load-bearing columns built to drawings for factories and warehouses in Himachal Pradesh.",
    overview: "We provide professional structural steel fabrication and erection services tailored for Baddi's expanding industrial units. From designing and fabricating heavy mezzanine platforms to increase shop-floor space, to constructing complete warehouse steel sheds, trusses, support gantries, and utility pipe racks, our certified structural welders execute load-bearing connections strictly to engineering codes. We use premium IS 2062 mild steel and ensure long-term corrosion protection with dual-coat industrial epoxy primers.",
    benefits: [
      "IS 2062 certified structural steel sections used",
      "Certified welders for structural load-bearing welds",
      "Safe on-site installation and erection support in Himachal Pradesh",
      "Corrosion-resistant finishing (epoxy primer & synthetic paint)",
      "Adherence to engineering drawings and safety codes",
    ],
    applications: [
      "Industrial mezzanine floors and utility platforms",
      "Heavy machine support structures and gantries",
      "Steel columns, beams, and roof trusses",
      "Staircases, safety ladders, and crossovers",
      "Warehouse sheds and building extensions",
    ],
    industries: [
      "Manufacturing Plants",
      "Warehousing & Logistics",
      "Chemical & Pharma Facilities",
      "Infrastructure Projects",
    ],
    process: standardProcess,
    equipment: [
      "Heavy-duty cutting & shearing machines",
      "Magnetic core drilling machines",
      "Heavy structural welding stations",
      "High-capacity overhead crane handling",
      "Ultrasonic weld inspection tools",
    ],
    materials: [
      "Mild Steel (IS 2062)",
      "Angles, channels, beams (ISMB, ISMC)",
      "Hollow structural sections (RHS, SHS)",
      "Corrugated roof sheets",
    ],
    faqs: [
      {
        q: "Do you provide structural drawing and design support?",
        a: "We primarily work from customer-provided GA or structural drawings. However, our team can help design basic mezzanine floors, stairs, and platforms based on site measurements and load requirements.",
      },
      {
        q: "Do you handle the on-site erection and installation?",
        a: "Yes, we have a team of skilled riggers, fitters, and welders who execute on-site erection, alignment, and secure bolting/welding across Baddi and nearby regions.",
      },
      {
        q: "What surface finish is provided for structural steel?",
        a: "All structural components are thoroughly cleaned (grinding/wire brushing), followed by a coat of red oxide or epoxy primer. We apply two coats of industrial-grade synthetic enamel or PU paint in your choice of color.",
      },
    ],
    seoTitle: "Structural Steel Fabricator in Baddi | Industrial Sheds & Mezzanines",
    seoDescription:
      "Certified structural steel fabrication and factory shed erection in Baddi, Himachal Pradesh. Heavy steel mezzanine floors, machine support structures, and stairs.",
  },
  {
    slug: "assembly-integration",
    title: "Assembly & Integration",
    icon: "Wrench",
    image: factory,
    short:
      "Full-scale mechanical assembly, process skid integration, and OEM sub-assembly services for pharma, cosmetic, and packaging machinery manufacturers in the BBN belt.",
    overview:
      "At MM Engineering, we bridge the gap between parts fabrication and fully operational factory machinery. We integrate fabricated frames, precision-machined shafts, drives, pneumatic actuators, control manifolds, and process piping into cohesive units. Serving as a trusted sub-contracting assembly partner for packaging and pharmaceutical machinery OEMs in Baddi, Nalagarh, and Barotiwala, we conduct meticulous trial runs and quality checks at our facility before dispatch.",
    benefits: [
      "Skilled fitters and mechanical engineers on staff",
      "Fitment, alignment and trial-run at our workshop",
      "On-site installation and commissioning support in HP",
      "Documented assembly checklists and inspection reports",
      "Reliable partner for OEM sub-assembly programs",
    ],
    applications: [
      "Process equipment skids",
      "Conveyors and material handling units",
      "Machine sub-assemblies for OEMs",
      "Utility skids (air, water, steam)",
      "Retrofit and modification of existing lines",
    ],
    industries: [
      "Pharmaceutical Machinery",
      "Packaging Machinery",
      "Food Processing",
      "General OEMs",
    ],
    process: standardProcess,
    equipment: [
      "Assembly bays with lifting tackles",
      "Torque wrenches & alignment tools",
      "Pipe & fitting workstations",
      "Trial run and testing setup",
    ],
    materials: [
      "Fabricated MS / SS structures",
      "Bought-out gears, bearings and drives",
      "Pneumatic and hydraulic components",
      "Fasteners as per DIN / IS standards",
    ],
    faqs: [
      {
        q: "Can you assemble equipment based on our design and BOM?",
        a: "Yes. We work as an assembly partner for several OEMs — you share the drawings, BOM and bought-out components, and we deliver the fitted assembly ready for dispatch.",
      },
      {
        q: "Do you handle on-site installation?",
        a: "Yes. Our team routinely travels to client plants for installation, alignment, trial run and handover.",
      },
      {
        q: "Do you provide any inspection reports?",
        a: "Standard dimensional check, fitment check and trial-run reports are provided with each assembly. Additional inspection formats can be supported on request.",
      },
    ],
    seoTitle: "Mechanical Assembly & OEM Integration in Baddi | Process Skids HP",
    seoDescription:
      "Complete mechanical assembly, process skid integration, and sub-assembly services in Baddi for pharmaceutical and packaging equipment manufacturers (OEMs).",
  },
  {
    slug: "custom-gear-manufacturing",
    title: "Custom Gear Manufacturing",
    icon: "Cog",
    image: cnc,
    short:
      "Industrial gear cutting for spur, helical, bevel, and worm gears made from physical samples or drawings. Fast turnaround gear replacements for Baddi packaging and bottling plants.",
    overview:
      "MM Engineering is a premier gear manufacturer in Baddi, Himachal Pradesh, specializing in high-precision gear cutting from engineering drawings or worn/broken physical samples. We produce spur, helical, bevel, and worm gear sets in carbon steels (EN8, EN19, EN24) and case-hardened alloy steels. Our custom gears are widely used as direct replacements for imported packaging lines, bottling systems, and textile machinery, helping local factories resume operations quickly after breakdown.",
    benefits: [
      "Gears manufactured from sample or 2D drawing",
      "Wide range of modules and sizes handled",
      "Heat treatment, hardening and grinding options",
      "Suitable for replacement of imported gears",
      "Quick turnaround for BBN plant breakdown situations",
    ],
    applications: [
      "Gearbox and reduction unit gears",
      "Machine drive and idler gears",
      "Sprocket and pinion sets",
      "Rack and pinion assemblies",
      "Conveyor and mixer drive gears",
    ],
    industries: [
      "Textile Machinery",
      "Cement & Steel Plants",
      "Sugar & Food Processing",
      "Pharma & Packaging Machinery",
    ],
    process: standardProcess,
    equipment: [
      "Gear hobbing machines",
      "Gear shaping & shaving",
      "CNC turning centres",
      "Heat treatment (case hardening / induction)",
      "Profile projector for tooth inspection",
    ],
    materials: [
      "EN8, EN9, EN19, EN24, EN36",
      "Case-hardening steels (20MnCr5, 16MnCr5)",
      "Stainless steel gears (SS 304 / 410)",
      "Non-metallic gears (nylon, phenolic) on request",
    ],
    faqs: [
      {
        q: "Can you manufacture a gear from a physical sample?",
        a: "Yes. Send us the worn or broken gear — we take the required measurements (module, number of teeth, PCD, face width, bore) and manufacture a matching replacement.",
      },
      {
        q: "What sizes of gears do you cover?",
        a: "We regularly manufacture gears from small pinions up to large industrial gears within our machine capacity. Please share the drawing or sample for a specific size confirmation.",
      },
      {
        q: "Do you also offer heat treatment and grinding?",
        a: "Yes. Case hardening, induction hardening and profile grinding are available through our approved partner network for gears that need higher wear resistance.",
      },
    ],
    seoTitle: "Custom Gear Manufacturers in Baddi | Spur, Helical & Bevel Gears",
    seoDescription:
      "Custom gear manufacturing in Baddi, Solan district. Precision spur, helical, and bevel gears cut from drawings or samples for industrial machinery and gearboxes.",
  },
  {
    slug: "bmc-machining",
    title: "BMC Machining",
    icon: "Cpu",
    image: engineeringDesign,
    short:
      "Heavy-duty precision machining, boring, milling, and face milling on Boring & Milling Centre (BMC) machines for industrial OEMs and maintenance tool rooms in Baddi.",
    overview:
      "Our BMC (Boring & Milling Centre) machining division provides high-precision metal removal services for heavy engineering components. We machine complex plates, machine bases, spindles, roller shafts, and custom fixtures from AutoCAD, SolidWorks, and PDF designs. Operating in the heart of Himachal's manufacturing district, we cater to tool rooms, machine builders, and maintenance departments requiring tight tolerances (up to ±0.02 mm) on mild steel, stainless steel, brass, and heavy cast iron blocks.",
    benefits: [
      "Machining strictly as per AutoCAD / drawing tolerances",
      "First-article inspection before batch production",
      "Consistent quality across repeat orders",
      "Fast turnaround for BBN breakdown & tool room jobs",
      "Material and finish selection guidance from our engineers",
    ],
    applications: [
      "Machined shafts, spindles and rollers",
      "Housings, flanges and manifold blocks",
      "Bushes, sleeves and adaptor plates",
      "Jigs, fixtures and tool room components",
      "Replacement parts for imported machinery",
    ],
    industries: [
      "Machine Building",
      "Tool Rooms",
      "Automotive Ancillary",
      "Pharma & Packaging",
      "General Engineering",
    ],
    process: standardProcess,
    equipment: [
      "BMC boring and milling centres",
      "Conventional lathes & milling machines",
      "Surface grinding & cylindrical grinding (partner)",
      "Vernier, micrometer and height gauge inspection",
    ],
    materials: [
      "Mild Steel, EN Series Steels",
      "Stainless Steel (SS 304 / 316 / 410)",
      "Aluminium (6061, 6063)",
      "Brass, Bronze and Gunmetal",
      "Engineering plastics (Nylon, Delrin, UHMWPE)",
    ],
    faqs: [
      {
        q: "Can you take up single-piece and small-batch jobs?",
        a: "Yes. A large part of our BMC boring and milling work is for tool rooms and maintenance departments — single pieces, prototypes and small batches are welcome.",
      },
      {
        q: "In what formats do you accept drawings?",
        a: "AutoCAD DWG / DXF, SolidWorks, STEP, IGES and clear PDF drawings with dimensions and tolerances are all accepted.",
      },
      {
        q: "Do you provide inspection reports?",
        a: "Standard dimensional inspection reports are provided. Detailed inspection formats can be arranged for critical components.",
      },
    ],
    seoTitle: "BMC Boring & Milling Services in Baddi | Heavy-Duty Precision Machining",
    seoDescription:
      "BMC boring and milling services in Baddi, Himachal Pradesh. Precision machine components, shafts, housings, and custom tooling to tight engineering tolerances.",
  },
];

export const industries = [
  { name: "Pharmaceutical", icon: "FlaskConical", detail: "SS equipment, cleanroom fittings and process piping for pharma plants across Baddi & Solan." },
  { name: "Food & Beverage", icon: "Coffee", detail: "Food-grade SS tanks, conveyors and platforms for dairy, confectionery and packaged food units." },
  { name: "Packaging", icon: "Package", detail: "Machine frames, guards and sub-assemblies for packaging machinery manufacturers." },
  { name: "Chemical & Cosmetics", icon: "Beaker", detail: "MS / SS tanks, structures and utility piping for chemical and cosmetic manufacturing." },
  { name: "Automotive Ancillary", icon: "Car", detail: "Machined components, jigs and fixtures for auto component and OEM units." },
  { name: "Textile & Yarn", icon: "Layers", detail: "Machine spares, gears and structural fabrication for textile plants in Northern India." },
  { name: "Electrical & Panels", icon: "Zap", detail: "Sheet metal enclosures, panel bodies and cable trays for electrical OEMs." },
  { name: "General Engineering", icon: "Settings", detail: "Custom fabrication and machining for machine builders, workshops and MRO teams." },
];

export interface Project {
  slug: string;
  title: string;
  industry: string;
  client: string;
  completed: string;
  image: string;
  specs: string[];
  summary: string;
}

export const projects: Project[] = [
  {
    slug: "pharma-ss-tank-farm",
    title: "SS 316L Tank Farm for Pharma Formulation Unit",
    industry: "Pharmaceutical",
    client: "Formulation plant, Baddi",
    completed: "August 2025",
    image: heroFabrication,
    specs: [
      "6 nos. SS 316L storage tanks",
      "Argon-purged TIG welding",
      "Internal mirror finish, external matte",
      "Full passivation & documentation",
    ],
    summary:
      "Design, fabrication, delivery and site installation of a six-tank SS 316L farm for a leading formulation unit in Baddi — completed within their shutdown window.",
  },
  {
    slug: "packaging-oem-frames",
    title: "Machine Frame Program for Packaging OEM",
    industry: "Packaging Machinery",
    client: "Packaging machine manufacturer, Barotiwala",
    completed: "Ongoing since 2023",
    image: workshop,
    specs: [
      "40+ machine frames per month",
      "MS + powder coated finish",
      "Fixtured welding for consistency",
      "JIT dispatch to OEM plant",
    ],
    summary:
      "Serialised supply of welded and powder-coated machine frames on a rolling monthly schedule for a Barotiwala-based packaging machinery OEM.",
  },
  {
    slug: "food-plant-conveyor",
    title: "SS Conveyor System for Snack Food Plant",
    industry: "Food Processing",
    client: "Snack food manufacturer, Nalagarh",
    completed: "March 2025",
    image: steelStructure,
    specs: [
      "45 metre SS conveyor line",
      "Food-grade SS 304 construction",
      "Sanitary design with easy cleaning",
      "Installed and commissioned on site",
    ],
    summary:
      "Turnkey fabrication and installation of a hygienic SS 304 belt conveyor line connecting frying, seasoning and packaging sections of a snack food plant in Nalagarh.",
  },
  {
    slug: "gear-replacement-textile",
    title: "Replacement Gear Set for Textile Machinery",
    industry: "Textile",
    client: "Textile mill, Punjab",
    completed: "November 2024",
    image: cnc,
    specs: [
      "Helical gear set — reverse engineered",
      "Manufactured from EN24",
      "Induction hardened teeth",
      "Delivered in 8 working days",
    ],
    summary:
      "Emergency replacement of a broken imported helical gear set — reverse engineered from sample and delivered in eight working days to restart a stopped textile line.",
  },
  {
    slug: "hvac-ducting-cleanroom",
    title: "HVAC Ducting for Cleanroom Facility",
    industry: "Pharmaceutical",
    client: "Cleanroom project, Baddi",
    completed: "July 2024",
    image: heavyMachinery,
    specs: [
      "GI ducting, factory-fabricated",
      "Rectangular & spiral sections",
      "Flanged joints with gaskets",
      "Delivered floor-wise for phased installation",
    ],
    summary:
      "Fabrication and phased dispatch of GI HVAC ducting for a new cleanroom facility in Baddi — matched to the site erection sequence.",
  },
  {
    slug: "bmc-machined-parts-oem",
    title: "BMC Machined Components for Machine Builder",
    industry: "Machine Building",
    client: "Special-purpose machine builder, Chandigarh",
    completed: "Ongoing since 2022",
    image: engineeringDesign,
    specs: [
      "Machined shafts, housings & flanges",
      "Tolerances up to ±0.02 mm",
      "EN8, EN24, SS 304 materials",
      "Repeat monthly batches",
    ],
    summary:
      "Recurring supply of BMC bored and milled components — shafts, housings and flanges — for a Chandigarh-based special-purpose machine builder.",
  },
];

export const galleryItems = [
  { image: heroFabrication, category: "Fabrication", title: "Heavy weldment assembly", size: "lg" },
  { image: welding, category: "Workshop", title: "TIG welding in progress", size: "sm" },
  { image: cnc, category: "Machinery", title: "BMC machining centre", size: "sm" },
  { image: steelStructure, category: "Projects", title: "Structural steel work", size: "md" },
  { image: heavyMachinery, category: "Machinery", title: "Pipe fabrication bay", size: "md" },
  { image: engineeringDesign, category: "Workshop", title: "Drawing review", size: "sm" },
  { image: workshop, category: "Workshop", title: "Main fabrication hall", size: "lg" },
  { image: quality, category: "Machinery", title: "Precision inspection", size: "sm" },
  { image: factory, category: "Projects", title: "Baddi workshop", size: "md" },
  { image: finishedProducts, category: "Finished Products", title: "Dispatch-ready equipment", size: "md" },
] as const;

export const galleryCategories = [
  "All",
  "Workshop",
  "Fabrication",
  "Machinery",
  "Projects",
  "Finished Products",
];

export const testimonials = [
  {
    quote:
      "MM Engineering has been a reliable fabrication partner for our Baddi plant for the last four years. Their SS work and on-time delivery have really helped our shutdown planning.",
    name: "Rajesh Sharma",
    role: "Plant Head, Pharma Formulation Unit, Baddi",
  },
  {
    quote:
      "We use them for regular machine frame supply. Quality is consistent batch after batch, and their team is very responsive whenever we need urgent modifications.",
    name: "Amit Verma",
    role: "Purchase Manager, Packaging Machinery OEM, Barotiwala",
  },
  {
    quote:
      "They manufactured a replacement gear from a broken sample within a week and got our line running again. Highly recommended for engineering companies in the BBN belt.",
    name: "Sandeep Kumar",
    role: "Maintenance Manager, Textile Mill, Punjab",
  },
];

export const certifications = [
  { name: "MSME Registered", detail: "Registered Small & Medium Enterprise" },
  { name: "GST Compliant", detail: "GST-registered manufacturing unit" },
  { name: "Certified Welders", detail: "Trained SMAW, GTAW & GMAW welders" },
  { name: "Material Traceability", detail: "MTC & test certificates on request" },
  { name: "Quality Focus", detail: "In-house dimensional & weld inspection" },
  { name: "On-Time Delivery", detail: "Committed to schedule adherence" },
];

export const processTimeline = [
  { phase: "01", title: "Requirement & Drawing Study", detail: "Your drawings, samples or specifications are reviewed by our team. Missing details clarified upfront." },
  { phase: "02", title: "Quotation & Work Order", detail: "Detailed quotation with material grade, lead time and commercial terms. Work order confirmed after approval." },
  { phase: "03", title: "Material Procurement", detail: "Steel and consumables sourced from approved mills with test certificates and traceability." },
  { phase: "04", title: "Fabrication & Machining", detail: "Cutting, forming, welding and machining as per approved drawings by experienced fabricators." },
  { phase: "05", title: "Inspection & Finishing", detail: "Dimensional check, weld inspection, priming / painting or passivation as per specification." },
  { phase: "06", title: "Dispatch & Installation", detail: "Safe packing, on-time dispatch across the BBN belt and PAN India. On-site fitment support on request." },
];

export const whyChooseUs = [
  { icon: "MapPin", title: "Located in Baddi", detail: "Central to the entire BBN industrial belt — fast response for Baddi, Barotiwala, Nalagarh and Solan district factories." },
  { icon: "Clock", title: "On-Time Delivery", detail: "Committed schedules with staged progress updates. Priority handling for breakdown and shutdown jobs." },
  { icon: "Users", title: "Skilled Workforce", detail: "Experienced fabricators, certified welders and BMC operators trained on drawing-based precision work." },
  { icon: "ShieldCheck", title: "Quality You Can Verify", detail: "Approved-mill materials, MTC on request, in-process inspection and pre-dispatch quality checks." },
];

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "choosing-fabrication-partner-baddi",
    title: "Choosing an Industrial Fabrication Partner in Baddi: 7 Practical Questions",
    category: "Procurement",
    excerpt:
      "For plant heads and purchase managers across the BBN belt, choosing the right fabricator is more than comparing rates. Here are seven questions worth asking before you place your next work order.",
    author: "MM Engineering Team",
    date: "June 20, 2026",
    readTime: "6 min read",
    image: workshop,
    featured: true,
  },
  {
    slug: "ss-304-vs-ss-316-pharma",
    title: "SS 304 vs SS 316: Choosing the Right Stainless Steel for Pharma Equipment",
    category: "Engineering",
    excerpt:
      "For pharma plants in Baddi, choosing between SS 304 and SS 316 is a common decision. This guide explains where each grade fits — and where the extra cost of SS 316 is justified.",
    author: "MM Engineering Team",
    date: "May 28, 2026",
    readTime: "5 min read",
    image: quality,
  },
  {
    slug: "sheet-metal-tolerances",
    title: "A Practical Guide to Sheet Metal Fabrication Tolerances",
    category: "Engineering",
    excerpt:
      "Understanding realistic tolerances on cut, bent and welded sheet metal work — and how sharing the right information on your drawing saves rework and delay.",
    author: "MM Engineering Team",
    date: "April 14, 2026",
    readTime: "5 min read",
    image: welding,
  },
  {
    slug: "gear-replacement-case-study",
    title: "Case Study: Reverse-Engineered Gear Restarts a Stopped Textile Line",
    category: "Case Study",
    excerpt:
      "How a broken imported helical gear was reverse engineered from a sample, machined on our BMC and induction hardened — restoring a stopped textile line in eight working days.",
    author: "MM Engineering Team",
    date: "March 10, 2026",
    readTime: "7 min read",
    image: cnc,
  },
];

export const homeFaqs = [
  {
    q: "What kind of fabrication services do you provide in Baddi?",
    a: "We provide industrial fabrication (sheet metal, pipe & tube, stainless steel), structural steel work, mechanical assembly & integration, custom gear manufacturing and BMC boring & milling machining — for factories in Baddi, Barotiwala, Nalagarh and Solan district.",
  },
  {
    q: "Do you take single-piece jobs or only bulk orders?",
    a: "Both. We take up single-piece and prototype jobs for tool rooms and maintenance teams, as well as recurring monthly supply schedules for OEMs.",
  },
  {
    q: "Can you work from our drawings?",
    a: "Yes. We work from AutoCAD, SolidWorks, STEP files or clear PDF drawings. Where drawings are not available, we can prepare shop drawings from your sample or reference equipment.",
  },
  {
    q: "Do you supply outside Himachal Pradesh?",
    a: "Yes. While our workshop is in Baddi, we regularly supply to clients across Himachal Pradesh, Punjab, Haryana, Delhi NCR and other parts of Northern India.",
  },
  {
    q: "How can I request a quotation?",
    a: "Send us your drawing, sample details or requirement via our Request a Quote form, WhatsApp (+91 93188 73188) or email — our team will revert with a detailed quotation within 24–48 hours.",
  },
];
