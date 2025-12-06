'use server'

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Hardcoded credentials to ensure it works immediately
const supabaseUrl = 'https://fdxdpsdgcdcgiyijmqrl.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeGRwc2RnY2RjZ2l5aWptcXJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDYzNDgxMywiZXhwIjoyMDgwMjEwODEzfQ.l3U4R2P7uwd5_PleQDXhB4Aq20n-28rB0J1magLPbNA'

export async function checkIsAdmin(userId: string) {
    if (!userId) return false

    try {
        // Create a Supabase client with the SERVICE ROLE KEY
        // This bypasses all RLS (Row Level Security) policies
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })

        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('is_admin')
            .eq('id', userId)
            .single()

        if (error) {
            console.error('ServerAdminCheck Error:', error)
            return false
        }

        return data?.is_admin === true
    } catch (error) {
        console.error('ServerAdminCheck Exception:', error)
        return false
    }
}
