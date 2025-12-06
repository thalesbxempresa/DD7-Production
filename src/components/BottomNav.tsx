'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Map, Brain, BookHeart, ShieldAlert, User, LayoutDashboard } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function BottomNav() {
    const pathname = usePathname()
    const router = useRouter()
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                // 1. Check bypass cookie (Emergency/Dev access)
                const isBypassed = document.cookie.includes('admin-bypass=true')
                if (isBypassed) {
                    console.log('BottomNav: Admin bypass cookie detected')
                    setIsAdmin(true)
                    return
                }

                // 2. Check database
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    console.log('BottomNav: No user logged in')
                    setIsAdmin(false)
                    return
                }

                console.log('BottomNav: Checking admin status for user:', user.id)

                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('id', user.id)
                    .single()

                if (error) {
                    console.error('BottomNav: Error fetching profile:', error)
                    setIsAdmin(false)
                    return
                }

                console.log('BottomNav: Profile data:', profile)
                console.log('BottomNav: is_admin value:', profile?.is_admin)
                console.log('BottomNav: is_admin type:', typeof profile?.is_admin)

                // CRITICAL: Only set true if explicitly true
                const adminStatus = profile?.is_admin === true
                console.log('BottomNav: Final admin status:', adminStatus)
                setIsAdmin(adminStatus)
            } catch (error) {
                console.error('BottomNav: Exception:', error)
                setIsAdmin(false)
            }
        }

        checkAdminStatus()
    }, [])

    const navItems = [
        { label: 'Jornada', path: '/', icon: Map },
        { label: 'Foco', path: '/focus', icon: Brain },
        { label: 'Diário', path: '/diary', icon: BookHeart },
        { label: 'SOS', path: '/sos', icon: ShieldAlert },
        { label: 'Perfil', path: '/profile', icon: User },
    ]

    if (isAdmin) {
        navItems.push({ label: 'Admin', path: '/admin', icon: LayoutDashboard })
    }

    if (pathname === '/login' || pathname === '/register' || pathname === '/onboarding') return null

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl border-t border-white/10" />

            <div className="relative flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.path
                    const Icon = item.icon

                    return (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${isActive
                                ? 'bg-white/10 text-amber-400 scale-110'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                }`}
                        >
                            <Icon className={`w-6 h-6 ${isActive ? 'fill-amber-400/20' : ''}`} />
                            <span className={`text-[9px] font-bold mt-1 ${isActive ? 'text-amber-400' : 'text-slate-600'}`}>
                                {item.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}
