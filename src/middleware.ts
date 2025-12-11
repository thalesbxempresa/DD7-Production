import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
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

    const { data: { user } } = await supabase.auth.getUser()

    // Protected Routes Logic
    const path = request.nextUrl.pathname

    // 1. Auth Routes (Login/Register) - Redirect to Home if already logged in
    // EXCEÇÃO: /update-password e /auth/callback precisam funcionar com usuário logado
    if (user && (path === '/login' || path === '/register' || path === '/onboarding')) {
        return NextResponse.redirect(new URL('/', request.url))
    }


    // 2. Protected Routes (Home, Day, Profile, Admin) - Redirect to Login if NOT logged in
    // EXCEÇÃO: /auth/callback precisa funcionar SEM usuário para processar o código PKCE
    if (!user &&
        !path.startsWith('/login') &&
        !path.startsWith('/register') &&
        !path.startsWith('/auth/callback') &&
        !path.startsWith('/_next') &&
        !path.startsWith('/api') &&
        !path.includes('.') // static files like favicon.ico, manifest.json
    ) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 3. Admin Routes - Check if user is admin
    if (path.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        console.log('[Middleware] Admin check for user:', user.id, user.email)

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()

        console.log('[Middleware] Profile query result:', { profile, error })

        if (error) {
            console.error('[Middleware] Error fetching profile:', error)
            // Allow access if there's an error - don't block admins
            console.log('[Middleware] Allowing access despite error')
            return response
        }

        if (profile?.is_admin !== true) {
            console.log('[Middleware] User is NOT admin, redirecting to home')
            // Not an admin, redirect to home
            return NextResponse.redirect(new URL('/', request.url))
        }

        console.log('[Middleware] User IS admin, allowing access')
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
