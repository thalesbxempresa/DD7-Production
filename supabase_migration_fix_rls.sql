-- Drop existing policies to avoid conflicts
drop policy if exists "Users can update own cravings." on cravings_log;
drop policy if exists "Users can delete own cravings." on cravings_log;

-- Re-create UPDATE policy
create policy "Users can update own cravings." on cravings_log for update using ( auth.uid() = user_id );

-- Re-create DELETE policy
create policy "Users can delete own cravings." on cravings_log for delete using ( auth.uid() = user_id );

-- Reload schema cache
NOTIFY pgrst, 'reload config';
