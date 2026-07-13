import { supabase } from "@/integrations/supabase/client";

export interface LeadInput {
  name: string;
  company?: string;
  email: string;
  phone: string;
  service?: string;
  material?: string;
  quantity?: string;
  message: string;
  drawingUrl?: string;
}

export interface ReviewInput {
  name: string;
  role?: string;
  company?: string;
  rating: number;
  comment: string;
}

/**
 * Submits a contact form lead to Supabase (includes RFQ specifications if provided)
 */
export async function submitLead(input: LeadInput) {
  const { error } = await supabase
    .from("leads")
    .insert([
      {
        name: input.name,
        company: input.company || null,
        email: input.email,
        phone: input.phone,
        service: input.service || null,
        material: input.material || null,
        quantity: input.quantity || null,
        message: input.message,
        drawing_url: input.drawingUrl || null,
        status: "new"
      }
    ]);

  if (error) throw error;
  return { success: true };
}

/**
 * Uploads a drawing/PDF to Supabase Storage
 */
export async function uploadRFQDrawing(file: File) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `drawings/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("rfq_drawings")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("rfq_drawings").getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Submits a customer review/testimonial to Supabase (pending approval)
 */
export async function submitReview(input: ReviewInput) {
  const { error } = await supabase
    .from("reviews")
    .insert([
      {
        name: input.name,
        role: input.role || null,
        company: input.company || null,
        rating: input.rating,
        comment: input.comment,
        approved: false
      }
    ]);

  if (error) throw error;
  return { success: true };
}

/**
 * Fetches approved reviews from Supabase
 */
export async function fetchApprovedReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Fetches published blog posts from Supabase
 */
export async function fetchPublishedBlogPosts() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}
