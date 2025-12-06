import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = 'https://fdxdpsdgcdcgiyijmqrl.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeGRwc2RnY2RjZ2l5aWptcXJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDYzNDgxMywiZXhwIjoyMDgwMjEwODEzfQ.l3U4R2P7uwd5_PleQDXhB4Aq20n-28rB0J1magLPbNA'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search') || ''
        const roleFilter = searchParams.get('role') || 'all'
        const sortBy = searchParams.get('sortBy') || 'created_at'
        const sortOrder = searchParams.get('sortOrder') || 'desc'

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

        // Build query
        let query = supabaseAdmin
            .from('profiles')
            .select('*', { count: 'exact' })

        // Apply search filter
        if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
        }

        // Apply role filter
        if (roleFilter !== 'all') {
            query = query.eq('is_admin', roleFilter === 'admin')
        }

        // Apply sorting
        query = query.order(sortBy, { ascending: sortOrder === 'asc' })

        // Apply pagination
        const from = (page - 1) * limit
        const to = from + limit - 1
        query = query.range(from, to)

        const { data, error, count } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json({
            users: data,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
            }
        })
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, name, isAdmin } = body

        // Initialize Supabase Admin Client
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

        // 1. Create User in Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { name }
        })

        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 400 })
        }

        if (authData.user) {
            // 2. Update Profile (Name and Admin Status)
            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .update({
                    name: name,
                    is_admin: isAdmin
                })
                .eq('id', authData.user.id)

            if (profileError) {
                // Cleanup if profile update fails
                await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
                return NextResponse.json({ error: 'Erro ao criar perfil: ' + profileError.message }, { status: 400 })
            }

            return NextResponse.json({ success: true, user: authData.user })
        }

        return NextResponse.json({ error: 'Erro desconhecido ao criar usuário.' }, { status: 500 })

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json()
        const { id, name, email, isAdmin } = body

        if (!id) {
            return NextResponse.json({ error: 'ID do usuário é obrigatório.' }, { status: 400 })
        }

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

        // Update email in auth.users if changed
        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
            id,
            { email }
        )

        if (authError) {
            return NextResponse.json({ error: 'Erro ao atualizar email: ' + authError.message }, { status: 400 })
        }

        // Update profile (name, email, admin status)
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({
                name,
                email,
                is_admin: isAdmin
            })
            .eq('id', id)

        if (profileError) {
            return NextResponse.json({ error: 'Erro ao atualizar perfil: ' + profileError.message }, { status: 400 })
        }

        return NextResponse.json({ success: true })

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('id')

        if (!userId) {
            return NextResponse.json({ error: 'ID do usuário é obrigatório.' }, { status: 400 })
        }

        console.log('Attempting to delete user:', userId)

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

        // Step 1: Delete related records first (to avoid foreign key constraints)
        console.log('Deleting user_progress records...')
        const { error: progressError } = await supabaseAdmin
            .from('user_progress')
            .delete()
            .eq('user_id', userId)

        if (progressError) {
            console.error('Error deleting user_progress:', progressError)
        }

        console.log('Deleting assessments records...')
        const { error: assessmentError } = await supabaseAdmin
            .from('assessments')
            .delete()
            .eq('user_id', userId)

        if (assessmentError) {
            console.error('Error deleting assessments:', assessmentError)
        }

        console.log('Deleting focus_sessions records...')
        const { error: focusError } = await supabaseAdmin
            .from('focus_sessions')
            .delete()
            .eq('user_id', userId)

        if (focusError) {
            console.error('Error deleting focus_sessions:', focusError)
        }

        console.log('Deleting cravings_log records...')
        const { error: cravingsError } = await supabaseAdmin
            .from('cravings_log')
            .delete()
            .eq('user_id', userId)

        if (cravingsError) {
            console.error('Error deleting cravings_log:', cravingsError)
        }

        console.log('Deleting sos_logs records...')
        const { error: sosError } = await supabaseAdmin
            .from('sos_logs')
            .delete()
            .eq('user_id', userId)

        if (sosError) {
            console.error('Error deleting sos_logs:', sosError)
        }

        // Step 2: Delete from profiles table
        console.log('Deleting profile record...')
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .delete()
            .eq('id', userId)

        if (profileError) {
            console.error('Error deleting profile:', profileError)
        }

        // Step 3: Delete from auth.users (this is the main deletion)
        console.log('Deleting auth user...')
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

        if (authError) {
            console.error('Error deleting auth user:', authError)
            return NextResponse.json({ error: authError.message }, { status: 400 })
        }

        console.log('User deleted successfully!')
        return NextResponse.json({ success: true })

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}
