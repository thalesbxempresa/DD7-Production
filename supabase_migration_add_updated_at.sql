-- Add updated_at column to cravings_log
alter table public.cravings_log 
add column if not exists updated_at timestamp with time zone;

-- Reload schema cache
NOTIFY pgrst, 'reload config';
