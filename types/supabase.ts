// Generated: supabase gen types typescript --schema public (postgres-meta), from supabase/migrations applied in order.
// Do not edit by hand. Regenerate after a migration, e.g. once it is applied:
//   npx supabase gen types typescript --project-id <project-ref> --schema public > types/supabase.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string;
          content: NonNullable<Json>;
          cover_image_path: string;
          created_at: string;
          description: string;
          id: string;
          published_at: string | null;
          slug: string;
          status: string;
          title: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          author_id: string;
          content: NonNullable<Json>;
          cover_image_path: string;
          created_at?: string;
          description: string;
          id?: string;
          published_at?: string | null;
          slug: string;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string;
          content?: NonNullable<Json>;
          cover_image_path?: string;
          created_at?: string;
          description?: string;
          id?: string;
          published_at?: string | null;
          slug?: string;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
          subject: string | null;
          user_id: string | null;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
          subject?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          subject?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      game_analyses: {
        Row: {
          created_at: string;
          data: NonNullable<Json>;
          game_id: string;
          id: string;
          source: string;
          updated_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          data?: NonNullable<Json>;
          game_id: string;
          id?: string;
          source: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          data?: NonNullable<Json>;
          game_id?: string;
          id?: string;
          source?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      game_analysis_mistakes: {
        Row: {
          created_at: string;
          game_analysis_id: string | null;
          game_id: string;
          id: string;
          move_sequence_id: string | null;
          ply: number;
          quality: string;
          source: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          game_analysis_id?: string | null;
          game_id: string;
          id?: string;
          move_sequence_id?: string | null;
          ply: number;
          quality: string;
          source: string;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          game_analysis_id?: string | null;
          game_id?: string;
          id?: string;
          move_sequence_id?: string | null;
          ply?: number;
          quality?: string;
          source?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_game_analysis_mistakes_move_sequence";
            columns: ["move_sequence_id"];
            referencedRelation: "move_sequences";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "game_analysis_mistakes_game_analysis_id_fkey";
            columns: ["game_analysis_id"];
            referencedRelation: "game_analyses";
            referencedColumns: ["id"];
          },
        ];
      };
      games: {
        Row: {
          black_player: string;
          created_at: string;
          description: string | null;
          event: string | null;
          id: string;
          opening: string | null;
          pgn: string;
          played_at: string;
          result: string;
          url: string | null;
          white_player: string;
        };
        ComputedFields: never;
        Insert: {
          black_player: string;
          created_at?: string;
          description?: string | null;
          event?: string | null;
          id?: string;
          opening?: string | null;
          pgn: string;
          played_at: string;
          result: string;
          url?: string | null;
          white_player: string;
        };
        Update: {
          black_player?: string;
          created_at?: string;
          description?: string | null;
          event?: string | null;
          id?: string;
          opening?: string | null;
          pgn?: string;
          played_at?: string;
          result?: string;
          url?: string | null;
          white_player?: string;
        };
        Relationships: [];
      };
      move_sequences: {
        Row: {
          created_at: string;
          display_fen: string | null;
          goals: Json | null;
          id: string;
          initial_fen: string;
          moves: string;
          pgn: string | null;
          updated_at: string;
          user_id: string | null;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          display_fen?: string | null;
          goals?: Json | null;
          id?: string;
          initial_fen: string;
          moves: string;
          pgn?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          display_fen?: string | null;
          goals?: Json | null;
          id?: string;
          initial_fen?: string;
          moves?: string;
          pgn?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      opening_variant_themes: {
        Row: {
          created_at: string;
          id: string;
          opening_variant_id: string;
          theme_id: string;
          weight: number;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          opening_variant_id: string;
          theme_id: string;
          weight?: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          opening_variant_id?: string;
          theme_id?: string;
          weight?: number;
        };
        Relationships: [
          {
            foreignKeyName: "opening_variant_themes_opening_variant_id_fkey";
            columns: ["opening_variant_id"];
            referencedRelation: "opening_variants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "opening_variant_themes_theme_id_fkey";
            columns: ["theme_id"];
            referencedRelation: "themes";
            referencedColumns: ["id"];
          },
        ];
      };
      opening_variants: {
        Row: {
          created_at: string;
          description: string | null;
          eco: string | null;
          id: string;
          initial_ply: number;
          move_sequence_id: string;
          opening_id: string;
          sort_key: number;
          title: string | null;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          description?: string | null;
          eco?: string | null;
          id?: string;
          initial_ply?: number;
          move_sequence_id: string;
          opening_id: string;
          sort_key: number;
          title?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          eco?: string | null;
          id?: string;
          initial_ply?: number;
          move_sequence_id?: string;
          opening_id?: string;
          sort_key?: number;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "opening_variants_move_sequence_id_fkey";
            columns: ["move_sequence_id"];
            referencedRelation: "move_sequences";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "opening_variants_opening_id_fkey";
            columns: ["opening_id"];
            referencedRelation: "openings";
            referencedColumns: ["id"];
          },
        ];
      };
      openings: {
        Row: {
          cover_image_color: string | null;
          cover_image_url: string | null;
          created_at: string;
          description: string | null;
          display_fen: string | null;
          id: string;
          name: string;
          slug: string | null;
          type: string | null;
        };
        ComputedFields: never;
        Insert: {
          cover_image_color?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          description?: string | null;
          display_fen?: string | null;
          id?: string;
          name: string;
          slug?: string | null;
          type?: string | null;
        };
        Update: {
          cover_image_color?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          description?: string | null;
          display_fen?: string | null;
          id?: string;
          name?: string;
          slug?: string | null;
          type?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          chesscom_username: string | null;
          created_at: string | null;
          current_rating: number | null;
          id: string;
          initial_rating: number | null;
          lichess_username: string | null;
          onboarding_completed: boolean;
          role: string;
          username: string | null;
          volt_score: number;
        };
        ComputedFields: never;
        Insert: {
          chesscom_username?: string | null;
          created_at?: string | null;
          current_rating?: number | null;
          id: string;
          initial_rating?: number | null;
          lichess_username?: string | null;
          onboarding_completed?: boolean;
          role?: string;
          username?: string | null;
          volt_score?: number;
        };
        Update: {
          chesscom_username?: string | null;
          created_at?: string | null;
          current_rating?: number | null;
          id?: string;
          initial_rating?: number | null;
          lichess_username?: string | null;
          onboarding_completed?: boolean;
          role?: string;
          username?: string | null;
          volt_score?: number;
        };
        Relationships: [];
      };
      puzzle_themes: {
        Row: {
          created_at: string;
          id: string;
          puzzle_id: string;
          theme_id: string;
          weight: number;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          puzzle_id: string;
          theme_id: string;
          weight?: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          puzzle_id?: string;
          theme_id?: string;
          weight?: number;
        };
        Relationships: [
          {
            foreignKeyName: "puzzle_themes_puzzle_id_fkey";
            columns: ["puzzle_id"];
            referencedRelation: "puzzles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "puzzle_themes_theme_id_fkey";
            columns: ["theme_id"];
            referencedRelation: "themes";
            referencedColumns: ["id"];
          },
        ];
      };
      puzzles: {
        Row: {
          created_at: string;
          game_id: string | null;
          id: string;
          is_active: boolean;
          move_sequence_id: string;
          popularity: number | null;
          rating: number | null;
          source: string | null;
          source_id: string | null;
          title: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          game_id?: string | null;
          id?: string;
          is_active?: boolean;
          move_sequence_id: string;
          popularity?: number | null;
          rating?: number | null;
          source?: string | null;
          source_id?: string | null;
          title: string;
        };
        Update: {
          created_at?: string;
          game_id?: string | null;
          id?: string;
          is_active?: boolean;
          move_sequence_id?: string;
          popularity?: number | null;
          rating?: number | null;
          source?: string | null;
          source_id?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "game_riddles_game_id_fkey";
            columns: ["game_id"];
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "game_riddles_move_sequence_id_fkey";
            columns: ["move_sequence_id"];
            referencedRelation: "move_sequences";
            referencedColumns: ["id"];
          },
        ];
      };
      sections: {
        Row: {
          cover_image_color: string;
          cover_image_url: string;
          created_at: string;
          created_by: string | null;
          description: string;
          id: string;
          is_active: boolean;
          sort_order: number;
          title: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          cover_image_color?: string;
          cover_image_url?: string;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          id?: string;
          is_active?: boolean;
          sort_order?: number;
          title: string;
          updated_at?: string;
        };
        Update: {
          cover_image_color?: string;
          cover_image_url?: string;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          id?: string;
          is_active?: boolean;
          sort_order?: number;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      studies: {
        Row: {
          cover_image_color: string;
          cover_image_url: string;
          created_at: string;
          created_by: string | null;
          description: string | null;
          difficulty: number | null;
          id: string;
          is_active: boolean;
          slug: string;
          sort_order: number;
          title: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          cover_image_color?: string;
          cover_image_url?: string;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          difficulty?: number | null;
          id?: string;
          is_active?: boolean;
          slug: string;
          sort_order?: number;
          title: string;
          updated_at?: string;
        };
        Update: {
          cover_image_color?: string;
          cover_image_url?: string;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          difficulty?: number | null;
          id?: string;
          is_active?: boolean;
          slug?: string;
          sort_order?: number;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      study_puzzles: {
        Row: {
          created_at: string;
          id: string;
          puzzle_id: string;
          sort_order: number;
          study_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          puzzle_id: string;
          sort_order?: number;
          study_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          puzzle_id?: string;
          sort_order?: number;
          study_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "study_puzzles_puzzle_id_fkey";
            columns: ["puzzle_id"];
            referencedRelation: "puzzles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "study_puzzles_study_id_fkey";
            columns: ["study_id"];
            referencedRelation: "studies";
            referencedColumns: ["id"];
          },
        ];
      };
      study_themes: {
        Row: {
          created_at: string;
          id: string;
          study_id: string;
          theme_id: string;
          weight: number;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          study_id: string;
          theme_id: string;
          weight?: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          study_id?: string;
          theme_id?: string;
          weight?: number;
        };
        Relationships: [
          {
            foreignKeyName: "study_themes_study_id_fkey";
            columns: ["study_id"];
            referencedRelation: "studies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "study_themes_theme_id_fkey";
            columns: ["theme_id"];
            referencedRelation: "themes";
            referencedColumns: ["id"];
          },
        ];
      };
      themes: {
        Row: {
          category: string;
          cover_image_url: string | null;
          created_at: string;
          description: string | null;
          id: string;
          is_active: boolean;
          slug: string;
          sort_order: number;
          title: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          category: string;
          cover_image_url?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          slug: string;
          sort_order?: number;
          title: string;
          updated_at?: string;
        };
        Update: {
          category?: string;
          cover_image_url?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          slug?: string;
          sort_order?: number;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_favorites: {
        Row: {
          created_at: string;
          game_analysis_mistake_id: string | null;
          id: string;
          is_pinned: boolean;
          note: string | null;
          opening_variant_id: string | null;
          puzzle_id: string | null;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          game_analysis_mistake_id?: string | null;
          id?: string;
          is_pinned?: boolean;
          note?: string | null;
          opening_variant_id?: string | null;
          puzzle_id?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          game_analysis_mistake_id?: string | null;
          id?: string;
          is_pinned?: boolean;
          note?: string | null;
          opening_variant_id?: string | null;
          puzzle_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_favorites_game_analysis_mistake_id_fkey";
            columns: ["game_analysis_mistake_id"];
            referencedRelation: "game_analysis_mistakes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_favourites_riddle_id_fkey";
            columns: ["puzzle_id"];
            referencedRelation: "puzzles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_practice_opening_variants_opening_variant_id_fkey";
            columns: ["opening_variant_id"];
            referencedRelation: "opening_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      user_sequence_attempt_events: {
        Row: {
          attempt_id: string;
          created_at: string;
          event_type: Database["public"]["Enums"]["sequence_attempt_event_type"];
          expected_uci: string | null;
          hint_level: number | null;
          id: string;
          is_correct: boolean | null;
          move_uci: string | null;
          time_from_start_ms: number | null;
        };
        ComputedFields: never;
        Insert: {
          attempt_id: string;
          created_at?: string;
          event_type: Database["public"]["Enums"]["sequence_attempt_event_type"];
          expected_uci?: string | null;
          hint_level?: number | null;
          id?: string;
          is_correct?: boolean | null;
          move_uci?: string | null;
          time_from_start_ms?: number | null;
        };
        Update: {
          attempt_id?: string;
          created_at?: string;
          event_type?: Database["public"]["Enums"]["sequence_attempt_event_type"];
          expected_uci?: string | null;
          hint_level?: number | null;
          id?: string;
          is_correct?: boolean | null;
          move_uci?: string | null;
          time_from_start_ms?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_sequence_attempt_events_attempt_id_fkey";
            columns: ["attempt_id"];
            referencedRelation: "user_sequence_attempts";
            referencedColumns: ["id"];
          },
        ];
      };
      user_sequence_attempts: {
        Row: {
          completed_at: string | null;
          correct_move_count: number;
          created_at: string;
          duration_ms: number | null;
          hint_count: number;
          id: string;
          max_correct_streak: number;
          sequence_id: string;
          started_at: string;
          status: Database["public"]["Enums"]["puzzle_attempt_status"];
          updated_at: string;
          user_id: string;
          wrong_move_count: number;
        };
        ComputedFields: never;
        Insert: {
          completed_at?: string | null;
          correct_move_count?: number;
          created_at?: string;
          duration_ms?: number | null;
          hint_count?: number;
          id?: string;
          max_correct_streak?: number;
          sequence_id: string;
          started_at?: string;
          status?: Database["public"]["Enums"]["puzzle_attempt_status"];
          updated_at?: string;
          user_id: string;
          wrong_move_count?: number;
        };
        Update: {
          completed_at?: string | null;
          correct_move_count?: number;
          created_at?: string;
          duration_ms?: number | null;
          hint_count?: number;
          id?: string;
          max_correct_streak?: number;
          sequence_id?: string;
          started_at?: string;
          status?: Database["public"]["Enums"]["puzzle_attempt_status"];
          updated_at?: string;
          user_id?: string;
          wrong_move_count?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: {
      difficulty: "beginner" | "intermediate" | "advanced" | "master" | "grandmaster";
      journey_difficulty: "beginner" | "intermediate" | "advanced" | "expert";
      puzzle_attempt_status: "started" | "completed" | "failed" | "abandoned";
      riddle_type: "game" | "lichess" | "custom";
      sequence_attempt_event_type: "start" | "move" | "hint" | "complete" | "fail" | "abandon";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      difficulty: ["beginner", "intermediate", "advanced", "master", "grandmaster"],
      journey_difficulty: ["beginner", "intermediate", "advanced", "expert"],
      puzzle_attempt_status: ["started", "completed", "failed", "abandoned"],
      riddle_type: ["game", "lichess", "custom"],
      sequence_attempt_event_type: ["start", "move", "hint", "complete", "fail", "abandon"],
    },
  },
} as const;
