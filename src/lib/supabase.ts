import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars. Check .env for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ListingStatus = 'available' | 'sold' | 'unverified' | 'pending_check';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  owner_phone: string;
  image_url: string | null;
  posted_at: string;
  view_count: number;
  status: ListingStatus;
  last_checked_at: string | null;
  created_at: string;
}

export type ListingInsert = Omit<Listing, 'id' | 'created_at' | 'last_checked_at' | 'status'> & {
  status?: ListingStatus;
};
