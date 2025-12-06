-- Add name column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name text;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload config';
