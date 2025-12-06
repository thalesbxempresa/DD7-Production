import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = 'https://fdxdpsdgcdcgiyijmqrl.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeGRwc2RnY2RjZ2l5aWptcXJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDYzNDgxMywiZXhwIjoyMDgwMjEwODEzfQ.l3U4R2P7uwd5_PleQDXhB4Aq20n-28rB0J1magLPbNA'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { action, userIds } = body

        const supabaseAdmin = createClient(
            supabaseUrl,
            supabaseServiceKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        if (action === 'delete') {
            // Bulk delete users
            for (const userId of userIds) {
                // Delete related records
                await supabaseAdmin.from('user_progress').delete().eq('user_id', userId)
                await supabaseAdmin.from('assessments').delete().eq('user_id', userId)
                await supabaseAdmin.from('focus_sessions').delete().eq('user_id', userId)
                await supabaseAdmin.from('cravings_log').delete().eq('user_id', userId)
                await supabaseAdmin.from('sos_logs').delete().eq('user_id', userId)
                await supabaseAdmin.from('profiles').delete().eq('id', userId)
                await supabaseAdmin.auth.admin.deleteUser(userId)
            }

            return NextResponse.json({ success: true, message: `${userIds.length} usuários excluídos` })
        }

        if (action === 'changeRole') {
            const { role } = body
            const isAdmin = role === 'admin'

            for (const userId of userIds) {
                await supabaseAdmin
                    .from('profiles')
                    .update({ is_admin: isAdmin })
                    .eq('id', userId)
            }

            return NextResponse.json({ success: true, message: `Função alterada para ${userIds.length} usuários` })
        }

        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}
