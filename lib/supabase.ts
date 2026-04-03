import { createClient } from "@supabase/supabase-js";

// Server-side client using service role key (never exposed to browser)
export function createServerClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null; // Supabase not configured — app falls back to mock data
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export type Database = {
  public: {
    Tables: {
      holdings: {
        Row: {
          id: string;
          user_id: string;
          ticker: string;
          name: string;
          sector: string;
          shares: number;
          avg_cost: number;
          purchase_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ticker: string;
          name: string;
          sector: string;
          shares: number;
          avg_cost: number;
          purchase_date?: string | null;
        };
        Update: {
          ticker?: string;
          name?: string;
          sector?: string;
          shares?: number;
          avg_cost?: number;
          purchase_date?: string | null;
          updated_at?: string;
        };
      };
    };
  };
};
