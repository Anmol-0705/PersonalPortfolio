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
      skills: {
        Row: {
          id: string;
          name: string;
          category: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["skills"]["Insert"]>;
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          title: string;
          description: string;
          icon: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          icon: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
        Relationships: [];
      };
      social_links: {
        Row: {
          id: string;
          platform: string;
          label: string;
          url: string;
          icon: string;
          enabled: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          platform: string;
          label: string;
          url: string;
          icon: string;
          enabled?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["social_links"]["Insert"]>;
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

export type SkillRow = Database["public"]["Tables"]["skills"]["Row"];
export type SkillInsert = Database["public"]["Tables"]["skills"]["Insert"];
export type SkillUpdate = Database["public"]["Tables"]["skills"]["Update"];

export type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
export type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
export type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];

export type SocialLinkRow = Database["public"]["Tables"]["social_links"]["Row"];
export type SocialLinkInsert = Database["public"]["Tables"]["social_links"]["Insert"];
export type SocialLinkUpdate = Database["public"]["Tables"]["social_links"]["Update"];
