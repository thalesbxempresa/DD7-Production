-- Add UPDATE policy for cravings_log
create policy "Users can update own cravings." on cravings_log for update using ( auth.uid() = user_id );

-- Add DELETE policy for cravings_log
create policy "Users can delete own cravings." on cravings_log for delete using ( auth.uid() = user_id );

-- Reload schema cache
NOTIFY pgrst, 'reload config';
