export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      gallery: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          filename: string
          storage_path: string
          public_url: string
          alt_text: string | null
          page: string | null
          section: string | null
          category: string | null
          is_published: boolean
          show_on_homepage: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          filename: string
          storage_path: string
          public_url: string
          alt_text?: string | null
          page?: string | null
          section?: string | null
          category?: string | null
          is_published?: boolean
          show_on_homepage?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          filename?: string
          storage_path?: string
          public_url?: string
          alt_text?: string | null
          page?: string | null
          section?: string | null
          category?: string | null
          is_published?: boolean
          show_on_homepage?: boolean
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          created_at: string
          name: string
          company: string | null
          email: string
          phone: string
          service: string | null
          material: string | null
          quantity: string | null
          message: string
          drawing_url: string | null
          status: string
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          company?: string | null
          email: string
          phone: string
          service?: string | null
          material?: string | null
          quantity?: string | null
          message: string
          drawing_url?: string | null
          status?: string
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          company?: string | null
          email?: string
          phone?: string
          service?: string | null
          material?: string | null
          quantity?: string | null
          message?: string
          drawing_url?: string | null
          status?: string
          notes?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          slug: string
          title: string
          category: string
          excerpt: string
          content: string
          author: string
          date: string
          read_time: string
          image_url: string | null
          featured: boolean
          published: boolean
          show_on_homepage: boolean
          meta_title: string | null
          meta_description: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          slug: string
          title: string
          category: string
          excerpt: string
          content: string
          author?: string
          date: string
          read_time: string
          image_url?: string | null
          featured?: boolean
          published?: boolean
          show_on_homepage?: boolean
          meta_title?: string | null
          meta_description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          slug?: string
          title?: string
          category?: string
          excerpt?: string
          content?: string
          author?: string
          date?: string
          read_time?: string
          image_url?: string | null
          featured?: boolean
          published?: boolean
          show_on_homepage?: boolean
          meta_title?: string | null
          meta_description?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          id: string
          created_at: string
          name: string
          role: string
          company: string | null
          content: string
          rating: number
          active: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          role: string
          company?: string | null
          content: string
          rating?: number
          active?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          role?: string
          company?: string | null
          content?: string
          rating?: number
          active?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          created_at: string
          name: string
          role: string | null
          company: string | null
          rating: number
          comment: string
          approved: boolean
          show_on_homepage: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          role?: string | null
          company?: string | null
          rating: number
          comment: string
          approved?: boolean
          show_on_homepage?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          role?: string | null
          company?: string | null
          rating?: number
          comment?: string
          approved?: boolean
          show_on_homepage?: boolean
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          id: string
          created_at: string
          title: string
          category: string
          image_url: string
          size: string
          active: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          category: string
          image_url: string
          size?: string
          active?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          category?: string
          image_url?: string
          size?: string
          active?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          created_at: string
          slug: string
          title: string
          client: string
          completed: string
          industry: string
          summary: string
          specs: string[]
          image_url: string
          active: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          slug: string
          title: string
          client: string
          completed: string
          industry: string
          summary: string
          specs?: string[]
          image_url: string
          active?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          slug?: string
          title?: string
          client?: string
          completed?: string
          industry?: string
          summary?: string
          specs?: string[]
          image_url?: string
          active?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      contact_settings: {
        Row: {
          id: number
          created_at: string
          updated_at: string
          phone: string
          whatsapp: string
          email: string
          address: string
          hours: string
          maps_link: string
          maps_embed: string
        }
        Insert: {
          id?: number
          created_at?: string
          updated_at?: string
          phone: string
          whatsapp: string
          email: string
          address: string
          hours: string
          maps_link: string
          maps_embed: string
        }
        Update: {
          id?: number
          created_at?: string
          updated_at?: string
          phone?: string
          whatsapp?: string
          email?: string
          address?: string
          hours?: string
          maps_link?: string
          maps_embed?: string
        }
        Relationships: []
      }
      seo_settings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          page_path: string
          title: string
          description: string
          keywords: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          page_path: string
          title: string
          description: string
          keywords?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          page_path?: string
          title?: string
          description?: string
          keywords?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
