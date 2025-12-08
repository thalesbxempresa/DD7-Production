import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
    try {
        // Inicializar Supabase com permissão de admin
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('Missing Supabase credentials')
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })

        // Receber dados do webhook
        const data = await req.json()
        console.log('Kiwify Webhook received:', JSON.stringify(data, null, 2))

        // Verificar se o pedido foi pago
        if (data.order_status !== 'paid') {
            console.log('Order not paid, ignoring webhook')
            return NextResponse.json({ received: true, message: 'Order not paid yet' })
        }

        // Extrair email do cliente
        const email = data.Customer?.email

        if (!email) {
            console.error('No email found in webhook data')
            return NextResponse.json({ error: 'Missing customer email' }, { status: 400 })
        }

        console.log(`Creating account for: ${email}`)

        // Tentar criar o usuário no Supabase Auth
        const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: 'mudar123', // Senha padrão que o usuário deve trocar
            email_confirm: true, // Confirmar email automaticamente
            user_metadata: {
                name: data.Customer?.name || 'Aluno',
                source: 'kiwify'
            }
        })

        if (createError) {
            // Se o erro for que o usuário já existe, considerar como sucesso
            if (createError.message.includes('already') || createError.message.includes('exists')) {
                console.log(`User ${email} already exists, skipping creation`)
                return NextResponse.json({
                    received: true,
                    message: 'User already exists',
                    email
                })
            }

            console.error('Error creating user:', createError)
            return NextResponse.json({
                error: 'Failed to create user',
                details: createError.message
            }, { status: 500 })
        }

        console.log(`✅ User created successfully: ${email}`)

        // Retornar sucesso
        return NextResponse.json({
            received: true,
            user_created: true,
            email,
            user_id: userData.user?.id
        })

    } catch (error) {
        console.error('Webhook error:', error)
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
