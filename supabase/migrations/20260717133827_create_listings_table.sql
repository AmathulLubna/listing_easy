/*
# Create listings table (single-tenant, no auth)

1. New Tables
- `listings`
  - `id` (uuid, primary key)
  - `title` (text, not null) — e.g. "2BHK in Shamshabad"
  - `description` (text, not null) — listing details
  - `price` (integer, not null) — monthly rent in INR
  - `owner_phone` (text, not null) — fake owner phone for demo
  - `image_url` (text) — placeholder image URL
  - `posted_at` (timestamptz, not null, default now()) — when the listing was posted
  - `view_count` (integer, not null, default 0) — number of views
  - `status` (text, not null, default 'available') — one of: available, sold, unverified, pending_check
  - `last_checked_at` (timestamptz) — last time the cron scan touched this listing
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `listings`.
- Allow anon + authenticated full CRUD because this is a single-tenant demo app with intentionally shared/public data.

3. Important Notes
- This is a demo MVP. All data is shared/public — no user isolation.
- The "cron job" runs as a client-side scan triggered by a button; it updates `status` to `pending_check` when a listing is older than 7 days OR has more than 10 views.
- "Simulate Owner Reply" updates `status` to `available` (Yes) or `sold` (No).
*/

CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price integer NOT NULL,
  owner_phone text NOT NULL,
  image_url text,
  posted_at timestamptz NOT NULL DEFAULT now(),
  view_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'available',
  last_checked_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_listings" ON listings;
CREATE POLICY "anon_select_listings" ON listings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_listings" ON listings;
CREATE POLICY "anon_insert_listings" ON listings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_listings" ON listings;
CREATE POLICY "anon_update_listings" ON listings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_listings" ON listings;
CREATE POLICY "anon_delete_listings" ON listings FOR DELETE
  TO anon, authenticated USING (true);
