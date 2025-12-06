import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        'https://fdxdpsdgcdcgiyijmqrl.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeGRwc2RnY2RjZ2l5aWptcXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MzQ4MTMsImV4cCI6MjA4MDIxMDgxM30.qdhuXiczy3sxbPiAaMP1O0seSnIg9FC27TKYPCM9nr8',
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
    if (user && (path === '/login' || path === '/register' || path === '/onboarding')) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // 2. Protected Routes (Home, Day, Profile, Admin) - Redirect to Login if NOT logged in
    const isBypassed = request.cookies.get('auth-bypass')?.value === 'true'
    const isAdminBypassed = request.cookies.get('admin-bypass')?.value === 'true'

    if (!user && !isBypassed &&
        !path.startsWith('/login') &&
        !path.startsWith('/register') &&
        !path.startsWith('/_next') &&
        !path.startsWith('/api') &&
        !path.startsWith('/debug-version') &&
        !path.includes('.') // static files like favicon.ico, manifest.json
    ) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 3. Admin Routes - Check if user is admin
    if (path.startsWith('/admin')) {
        // If bypassed admin, allow access
        if (isAdminBypassed) {
            return response
        }

        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()

        if (profile?.is_admin !== true) {
            // Not an admin, redirect to home
            return NextResponse.redirect(new URL('/', request.url))
        }
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
