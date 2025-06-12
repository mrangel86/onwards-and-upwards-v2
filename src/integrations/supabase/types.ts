export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      books: {
        Row: {
          created_at: string | null
          file_url: string
          id: number
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          file_url: string
          id?: number
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          file_url?: string
          id?: number
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      media: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          is_featured_photo_section: boolean | null
          is_featured_video_section: boolean | null
          is_hero_carousel: boolean | null
          is_post_header_image: boolean | null
          location: string | null
          media_type: string
          post_slug: string | null
          tags: string[] | null
          title: string | null
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          is_featured_photo_section?: boolean | null
          is_featured_video_section?: boolean | null
          is_hero_carousel?: boolean | null
          is_post_header_image?: boolean | null
          location?: string | null
          media_type: string
          post_slug?: string | null
          tags?: string[] | null
          title?: string | null
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          is_featured_photo_section?: boolean | null
          is_featured_video_section?: boolean | null
          is_hero_carousel?: boolean | null
          is_post_header_image?: boolean | null
          location?: string | null
          media_type?: string
          post_slug?: string | null
          tags?: string[] | null
          title?: string | null
          url?: string
        }
        Relationships: []
      }
      media_backup: {
        Row: {
          caption: string | null
          created_at: string | null
          featured_sort_order: number | null
          id: string | null
          is_featured: boolean | null
          is_hero_image: boolean | null
          location: string | null
          media_type: string | null
          post_id: string | null
          sort_order: number | null
          tags: string[] | null
          title: string | null
          url: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          featured_sort_order?: number | null
          id?: string | null
          is_featured?: boolean | null
          is_hero_image?: boolean | null
          location?: string | null
          media_type?: string | null
          post_id?: string | null
          sort_order?: number | null
          tags?: string[] | null
          title?: string | null
          url?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          featured_sort_order?: number | null
          id?: string | null
          is_featured?: boolean | null
          is_hero_image?: boolean | null
          location?: string | null
          media_type?: string | null
          post_id?: string | null
          sort_order?: number | null
          tags?: string[] | null
          title?: string | null
          url?: string | null
        }
        Relationships: []
      }
      photo_tags: {
        Row: {
          photo_id: string
          tag_id: string
        }
        Insert: {
          photo_id: string
          tag_id: string
        }
        Update: {
          photo_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_tags_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          author: string | null
          caption: string | null
          created_at: string
          id: string
          location: string | null
          post_id: string | null
          url: string
        }
        Insert: {
          author?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          location?: string | null
          post_id?: string | null
          url: string
        }
        Update: {
          author?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          location?: string | null
          post_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_previews: {
        Row: {
          author: string | null
          content: string | null
          content_url: string | null
          created_at: string
          excerpt: string | null
          featuredhero: boolean | null
          gallery_description: string | null
          hero_image_url: string | null
          id: string
          location: string | null
          notion_id: string | null
          published: boolean
          slug: string
          title: string
          type: Database["public"]["Enums"]["post_type_enum"]
        }
        Insert: {
          author?: string | null
          content?: string | null
          content_url?: string | null
          created_at?: string
          excerpt?: string | null
          featuredhero?: boolean | null
          gallery_description?: string | null
          hero_image_url?: string | null
          id?: string
          location?: string | null
          notion_id?: string | null
          published?: boolean
          slug: string
          title: string
          type: Database["public"]["Enums"]["post_type_enum"]
        }
        Update: {
          author?: string | null
          content?: string | null
          content_url?: string | null
          created_at?: string
          excerpt?: string | null
          featuredhero?: boolean | null
          gallery_description?: string | null
          hero_image_url?: string | null
          id?: string
          location?: string | null
          notion_id?: string | null
          published?: boolean
          slug?: string
          title?: string
          type?: Database["public"]["Enums"]["post_type_enum"]
        }
        Relationships: []
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author: string | null
          content: string | null
          content_url: string | null
          created_at: string
          excerpt: string | null
          featuredhero: boolean | null
          gallery_description: string | null
          hero_image_url: string | null
          id: string
          location: string | null
          notion_id: string | null
          published: boolean
          slug: string
          title: string
          type: Database["public"]["Enums"]["post_type_enum"]
        }
        Insert: {
          author?: string | null
          content?: string | null
          content_url?: string | null
          created_at?: string
          excerpt?: string | null
          featuredhero?: boolean | null
          gallery_description?: string | null
          hero_image_url?: string | null
          id?: string
          location?: string | null
          notion_id?: string | null
          published?: boolean
          slug: string
          title: string
          type: Database["public"]["Enums"]["post_type_enum"]
        }
        Update: {
          author?: string | null
          content?: string | null
          content_url?: string | null
          created_at?: string
          excerpt?: string | null
          featuredhero?: boolean | null
          gallery_description?: string | null
          hero_image_url?: string | null
          id?: string
          location?: string | null
          notion_id?: string | null
          published?: boolean
          slug?: string
          title?: string
          type?: Database["public"]["Enums"]["post_type_enum"]
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          type: Database["public"]["Enums"]["tag_type_enum"]
        }
        Insert: {
          id?: string
          name: string
          slug: string
          type?: Database["public"]["Enums"]["tag_type_enum"]
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          type?: Database["public"]["Enums"]["tag_type_enum"]
        }
        Relationships: []
      }
      video_tags: {
        Row: {
          tag_id: string
          video_id: string
        }
        Insert: {
          tag_id: string
          video_id: string
        }
        Update: {
          tag_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_tags_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          author: string | null
          caption: string | null
          created_at: string
          id: string
          location: string | null
          post_id: string | null
          thumbnail_url: string | null
          url: string
        }
        Insert: {
          author?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          location?: string | null
          post_id?: string | null
          thumbnail_url?: string | null
          url: string
        }
        Update: {
          author?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          location?: string | null
          post_id?: string | null
          thumbnail_url?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_previews: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_preview_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      publish_post_from_preview: {
        Args: { preview_slug: string }
        Returns: Json
      }
      sync_notion_to_preview: {
        Args: {
          p_notion_id: string
          p_title: string
          p_content: string
          p_author: string
          p_type?: string
          p_hero_image_url?: string
          p_excerpt?: string
        }
        Returns: Json
      }
    }
    Enums: {
      post_type_enum:
        | "essay"
        | "journal"
        | "reflection"
        | "gallery"
        | "video"
        | "legacy"
      tag_type_enum: "post" | "photo" | "video" | "all"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      post_type_enum: [
        "essay",
        "journal",
        "reflection",
        "gallery",
        "video",
        "legacy",
      ],
      tag_type_enum: ["post", "photo", "video", "all"],
    },
  },
} as const
