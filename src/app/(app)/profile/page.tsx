'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { User, LogOut, Settings, Award, ShieldCheck } from 'lucide-react'

export default function ProfilePage() {
    const router = useRouter()
    const [userEmail, setUserEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                console.log('ProfilePage: No user logged in')
                setLoading(false)
                return
            }

            setUserEmail(user.email || '')
            console.log('ProfilePage: Checking admin status for user:', user.id)

            // Check bypass cookie
            const isBypassed = document.cookie.includes('admin-bypass=true')
            if (isBypassed) {
                console.log('ProfilePage: Admin bypass cookie detected')
                setIsAdmin(true)
                setLoading(false)
                return
            }

            // Check database
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', user.id)
                .single()

            if (error) {
                console.error('ProfilePage: Error fetching profile:', error)
                setIsAdmin(false)
                setLoading(false)
                return
            }

            console.log('ProfilePage: Profile data:', profile)
            console.log('ProfilePage: is_admin value:', profile?.is_admin)
            console.log('ProfilePage: is_admin type:', typeof profile?.is_admin)

            // CRITICAL: Only set true if explicitly true
            const adminStatus = profile?.is_admin === true
            console.log('ProfilePage: Final admin status:', adminStatus)
            setIsAdmin(adminStatus)
        } catch (error) {
            console.error('ProfilePage: Error', error)
            setIsAdmin(false)
        }
        setLoading(false)
    }

    const handleLogout = async () => {
        // Clear bypass cookies
        document.cookie = "auth-bypass=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "admin-bypass=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="min-h-screen pb-24 p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <User className="text-amber-400" /> Perfil
            </h1>

            {/* Profile Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 mb-8 text-center shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-50" />

                <div className="relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black text-white shadow-lg shadow-amber-500/20">
                        {userEmail[0]?.toUpperCase()}
                    </div>
                    <h2 className="text-xl font-bold text-white">{userEmail}</h2>
                    <p className="text-slate-400 text-sm mt-1">Membro desde 2024</p>
                    {isAdmin && (
                        <span className="inline-block mt-2 px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full border border-amber-500/20">
                            ADMINISTRADOR
                        </span>
                    )}
                </div>
            </div>

            {/* Menu */}
            <div className="space-y-4">
                {isAdmin && (
                    <button
                        onClick={() => router.push('/admin')}
                        className="w-full bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center justify-between text-white hover:bg-white/10 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <span className="font-bold">Painel Admin</span>
                        </div>
                    </button>
                )}

                <button className="w-full bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center justify-between text-white hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                            <Award className="w-5 h-5" />
                        </div>
                        <span className="font-bold">Conquistas</span>
                    </div>
                    <span className="text-slate-500 text-sm">Em breve</span>
                </button>

                <button
                    onClick={() => router.push('/settings')}
                    className="w-full bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center justify-between text-white hover:bg-white/10 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform">
                            <Settings className="w-5 h-5" />
                        </div>
                        <span className="font-bold">Configurações</span>
                    </div>
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl flex items-center justify-between text-rose-400 hover:bg-rose-500/20 transition-all group mt-8"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <span className="font-bold">Sair da Conta</span>
                    </div>
                </button>
            </div>
        </div>
    )
}
