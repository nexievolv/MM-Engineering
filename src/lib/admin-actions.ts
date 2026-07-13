import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Simple session assertion helper
function assertAdmin(token?: string) {
  if (token !== "mm_eng_admin_session_token_2026") {
    throw new Error("Unauthorized: Invalid admin session");
  }
}

/**
 * Verifies admin password and returns session token if valid
 */
export const verifyAdminPassword = createServerFn({ method: "POST" })
  .validator((d: string) => d)
  .handler(async ({ data: password }) => {
    const adminPassword = process.env.ADMIN_PASSWORD || "MMAdmin2026!";
    if (password === adminPassword) {
      return { success: true, token: "mm_eng_admin_session_token_2026" };
    }
    return { success: false, error: "Invalid password" };
  });

/**
 * Fetch all leads for admin panel
 */
export const fetchLeadsAdmin = createServerFn({ method: "GET" })
  .validator((token: string) => token)
  .handler(async ({ data: token }) => {
    assertAdmin(token);
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  });

/**
 * Update a lead's status and notes
 */
export const updateLeadStatusAdmin = createServerFn({ method: "POST" })
  .validator((d: { token: string; id: string; status: string; notes?: string }) => d)
  .handler(async ({ data: { token, id, status, notes } }) => {
    assertAdmin(token);
    const { data, error } = await supabaseAdmin
      .from("leads")
      .update({ status, notes })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  });

/**
 * Delete a lead
 */
export const deleteLeadAdmin = createServerFn({ method: "POST" })
  .validator((d: { token: string; id: string }) => d)
  .handler(async ({ data: { token, id } }) => {
    assertAdmin(token);
    const { error } = await supabaseAdmin.from("leads").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  });



/**
 * Fetch all reviews (approved & unapproved) for admin panel
 */
export const fetchReviewsAdmin = createServerFn({ method: "GET" })
  .validator((token: string) => token)
  .handler(async ({ data: token }) => {
    assertAdmin(token);
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  });

/**
 * Update approval status of a review
 */
export const approveReviewAdmin = createServerFn({ method: "POST" })
  .validator((d: { token: string; id: string; approved: boolean }) => d)
  .handler(async ({ data: { token, id, approved } }) => {
    assertAdmin(token);
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .update({ approved })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  });

/**
 * Delete a review
 */
export const deleteReviewAdmin = createServerFn({ method: "POST" })
  .validator((d: { token: string; id: string }) => d)
  .handler(async ({ data: { token, id } }) => {
    assertAdmin(token);
    const { error } = await supabaseAdmin.from("reviews").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  });

/**
 * Create or update a review
 */
export const upsertReviewAdmin = createServerFn({ method: "POST" })
  .validator((d: { token: string; review: any }) => d)
  .handler(async ({ data: { token, review } }) => {
    assertAdmin(token);
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .upsert(review, { onConflict: "id" })
      .select();

    if (error) throw error;
    return data;
  });

/**
 * Fetch all blog posts for admin panel
 */
export const fetchBlogPostsAdmin = createServerFn({ method: "GET" })
  .validator((token: string) => token)
  .handler(async ({ data: token }) => {
    assertAdmin(token);
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  });

/**
 * Create or update a blog post
 */
export const upsertBlogPostAdmin = createServerFn({ method: "POST" })
  .validator((d: { token: string; post: any }) => d)
  .handler(async ({ data: { token, post } }) => {
    assertAdmin(token);
    const updatedPost = {
      ...post,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .upsert(updatedPost, { onConflict: "id" })
      .select();

    if (error) throw error;
    return data;
  });

/**
 * Delete a blog post
 */
export const deleteBlogPostAdmin = createServerFn({ method: "POST" })
  .validator((d: { token: string; id: string }) => d)
  .handler(async ({ data: { token, id } }) => {
    assertAdmin(token);
    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  });

/**
 * Fetch all projects for admin panel
 */
export const fetchProjectsAdmin = createServerFn({ method: "GET" })
  .validator((token: string) => token)
  .handler(async ({ data: token }) => {
    assertAdmin(token);
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  });

/**
 * Create or update a project
 */
export const upsertProjectAdmin = createServerFn({ method: "POST" })
  .validator((d: { token: string; project: any }) => d)
  .handler(async ({ data: { token, project } }) => {
    assertAdmin(token);
    const { data, error } = await supabaseAdmin
      .from("projects")
      .upsert(project, { onConflict: "id" })
      .select();

    if (error) throw error;
    return data;
  });

/**
 * Delete a project
 */
export const deleteProjectAdmin = createServerFn({ method: "POST" })
  .validator((d: { token: string; id: string }) => d)
  .handler(async ({ data: { token, id } }) => {
    assertAdmin(token);
    const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  });

/**
 * Fetch all gallery items for admin panel
 */
export const fetchGalleryAdmin = createServerFn({ method: "GET" })
  .validator((token: string) => token)
  .handler(async ({ data: token }) => {
    assertAdmin(token);
    const { data, error } = await supabaseAdmin
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  });

/**
 * Create or update a gallery item
 */
export const upsertGalleryAdmin = createServerFn({ method: "POST" })
  .validator((d: { token: string; item: any }) => d)
  .handler(async ({ data: { token, item } }) => {
    assertAdmin(token);
    const { data, error } = await supabaseAdmin
      .from("gallery_items")
      .upsert(item, { onConflict: "id" })
      .select();

    if (error) throw error;
    return data;
  });

/**
 * Delete a gallery item
 */
export const deleteGalleryAdmin = createServerFn({ method: "POST" })
  .validator((d: { token: string; id: string }) => d)
  .handler(async ({ data: { token, id } }) => {
    assertAdmin(token);
    const { error } = await supabaseAdmin.from("gallery_items").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  });

/**
 * Fetch testimonials for admin panel
 */
export const fetchTestimonialsAdmin = createServerFn({ method: "GET" })
  .validator((token: string) => token)
  .handler(async ({ data: token }) => {
    assertAdmin(token);
    const { data, error } = await supabaseAdmin
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  });

/**
 * Create or update a testimonial
 */
export const upsertTestimonialAdmin = createServerFn({ method: "POST" })
  .validator((d: { token: string; testimonial: any }) => d)
  .handler(async ({ data: { token, testimonial } }) => {
    assertAdmin(token);
    const { data, error } = await supabaseAdmin
      .from("testimonials")
      .upsert(testimonial, { onConflict: "id" })
      .select();

    if (error) throw error;
    return data;
  });

/**
 * Delete a testimonial
 */
export const deleteTestimonialAdmin = createServerFn({ method: "POST" })
  .validator((d: { token: string; id: string }) => d)
  .handler(async ({ data: { token, id } }) => {
    assertAdmin(token);
    const { error } = await supabaseAdmin.from("testimonials").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  });
