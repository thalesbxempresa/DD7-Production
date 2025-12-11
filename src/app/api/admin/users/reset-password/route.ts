import { createClient } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const supabaseUrl = 'https://fdxdpsdgcdcgiyijmqrl.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeGRwc2RnY2RjZ2l5aWptcXJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDYzNDgxMywiZXhwIjoyMDgwMjEwODEzfQ.l3U4R2P7uwd5_PleQDXhB4Aq20n-28rB0J1magLPbNA'

// Lista de emails autorizados a resetar senhas
const AUTHORIZED_ADMIN_EMAILS = [
    'thalesbx@gmail.com',
    'thalesbxempresa@gmail.com'
]

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { userId } = body

        if (!userId) {
            return NextResponse.json({ error: 'ID do usuário é obrigatório.' }, { status: 400 })
        }

        // 1. Criar cliente Supabase com cookies para verificar autenticação
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options })
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.set({ name, value: '', ...options })
                    },
                },
            }
        )

        // 2. Verificar se há usuário autenticado
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Você precisa estar autenticado para realizar esta ação.' },
                { status: 401 }
            )
        }

        // 3. Buscar perfil do usuário autenticado
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('email, is_admin')
            .eq('id', user.id)
            .single()

        if (profileError || !profile) {
            return NextResponse.json(
                { error: 'Erro ao buscar perfil do usuário.' },
                { status: 500 }
            )
        }

        // 4. Verificar se o usuário tem permissão (admin + email autorizado)
        if (!profile.is_admin) {
            return NextResponse.json(
                { error: 'Você não tem permissão de administrador.' },
                { status: 403 }
            )
        }

        if (!AUTHORIZED_ADMIN_EMAILS.includes(profile.email || '')) {
            return NextResponse.json(
                { error: 'Seu email não está autorizado a resetar senhas.' },
                { status: 403 }
            )
        }

        // 5. Usuário autorizado - prosseguir com reset de senha
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

        // Gerar senha temporária aleatória
        const tempPassword = Math.random().toString(36).slice(-10) + 'A1!'

        // Atualizar senha do usuário
        const { error } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { password: tempPassword }
        )

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            tempPassword,
            message: 'Senha resetada com sucesso'
        })
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}
