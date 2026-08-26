/**
 * Hand-written to match the confirmed public.projects schema
 * (information_schema.columns dump) and the public.is_admin() function.
 * No columns beyond what was verified to exist are included.
 */
export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          short_description: string;
          problem: string | null;
          approach: string | null;
          solution: string | null;
          technologies: string[];
          category: string | null;
          featured: boolean;
          published: boolean;
          live_url: string | null;
          github_url: string | null;
          testimonial: string | null;
          testimonial_author: string | null;
          cover_image: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          short_description: string;
          problem?: string | null;
          approach?: string | null;
          solution?: string | null;
          technologies?: string[];
          category?: string | null;
          featured?: boolean;
          published?: boolean;
          live_url?: string | null;
          github_url?: string | null;
          testimonial?: string | null;
          testimonial_author?: string | null;
          cover_image?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];
