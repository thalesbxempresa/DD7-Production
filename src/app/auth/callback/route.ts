import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/'

    if (code) {
        // Criar resposta para poder adicionar cookies
        const response = NextResponse.redirect(new URL(next, request.url))

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return request.cookies.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        // Definir cookie na requisição E na resposta
                        request.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                    },
                    remove(name: string, options: CookieOptions) {
                        // Remover cookie da requisição E da resposta
                        request.cookies.set({
                            name,
                            value: '',
                            ...options,
                        })
                        response.cookies.set({
                            name,
                            value: '',
                            ...options,
                        })
                    },
                },
            }
        )

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Código trocado com sucesso, usuário agora está logado
            console.log('✅ Session created successfully, redirecting to:', next)
            return response
        }

        console.error('❌ Error exchanging code for session:', error)
    }

    // Se não tiver code ou houver erro, redirecionar para login
    console.log('⚠️ No code or error, redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
}
