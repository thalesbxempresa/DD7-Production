-- Drop ALL existing policies for cravings_log to ensure a clean slate
drop policy if exists "Users can view own cravings." on cravings_log;
drop policy if exists "Users can insert own cravings." on cravings_log;
drop policy if exists "Users can update own cravings." on cravings_log;
drop policy if exists "Users can delete own cravings." on cravings_log;
drop policy if exists "Manage own cravings" on cravings_log;

-- Create a single comprehensive policy for ALL operations
create policy "Manage own cravings" on cravings_log
for all
using ( auth.uid() = user_id )
with check ( auth.uid() = user_id );

-- Ensure RLS is enabled
alter table cravings_log enable row level security;

-- Reload schema cache
NOTIFY pgrst, 'reload config';
