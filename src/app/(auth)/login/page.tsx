'use client'

import Link from 'next/link'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { InstallPrompt } from '@/components/InstallPrompt'
import { ArrowRight, Mail, Lock, Loader2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const router = useRouter()

    // Clear any existing bypass cookies on load
    useState(() => {
        if (typeof document !== 'undefined') {
            document.cookie = "auth-bypass=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
            document.cookie = "admin-bypass=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        }
    })

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg(null)

        try {
            // --- ADMIN BYPASS ---
            if (email === 'thalesbx@gmail.com' && password === '123456') {
                // Set cookies for middleware to read
                document.cookie = "auth-bypass=true; path=/; max-age=86400" // 1 day
                document.cookie = "admin-bypass=true; path=/; max-age=86400"

                // Simulate network delay for realism
                await new Promise(resolve => setTimeout(resolve, 800))

                router.push('/')
                return
            }
            // --------------------


            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error
            router.push('/')
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao entrar. Verifique suas credenciais.'
            setErrorMsg(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/20 rounded-full blur-[100px] animate-pulse-glow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
            </div>

            <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 shadow-lg shadow-teal-500/20 mb-4 animate-float">
                        <span className="text-3xl font-bold text-white">D</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight text-glow">
                        Bem-vindo(a)
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base">
                        Continue sua jornada de detox. <span className="text-xs text-teal-400 font-mono bg-teal-400/10 px-2 py-0.5 rounded-full border border-teal-400/20">v2.1</span>
                    </p>
                </div>

                <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
                    {errorMsg && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-200 text-sm">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all text-base sm:text-sm"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Senha</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all text-base sm:text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-slate-900 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Entrar
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-400">
                            Não tem uma conta?{' '}
                            <Link href="/register" className="font-medium text-teal-400 hover:text-teal-300 transition-colors">
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="pt-4">
                    <InstallPrompt />
                </div>
            </div>
        </div>
    )
}
