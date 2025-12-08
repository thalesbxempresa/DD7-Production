'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export default function UpdatePasswordPage() {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Validações
        if (newPassword.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem')
            return
        }

        setLoading(true)

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (updateError) throw updateError

            setSuccess(true)

            // Redirecionar após 2 segundos
            setTimeout(() => {
                router.push('/')
            }, 2000)

        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar senha')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/20 rounded-full blur-[100px] animate-pulse-glow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
            </div>

            <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 shadow-lg shadow-teal-500/20 mb-4 animate-float">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight text-glow">
                        Defina sua Senha
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base">
                        Escolha uma senha segura para acessar sua conta
                    </p>
                </div>

                <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-200 text-sm">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3 text-green-200 text-sm">
                            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                            <span>Senha atualizada! Redirecionando...</span>
                        </div>
                    )}

                    <form onSubmit={handleUpdatePassword} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                Nova Senha
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all text-base sm:text-sm"
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                    disabled={success}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                                    disabled={success}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                Confirmar Senha
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all text-base sm:text-sm"
                                    placeholder="Repita a senha"
                                    required
                                    disabled={success}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                                    disabled={success}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Password Strength Indicator */}
                        {newPassword && (
                            <div className="space-y-2">
                                <div className="flex gap-1">
                                    <div className={`h-1 flex-1 rounded ${newPassword.length >= 6 ? 'bg-teal-500' : 'bg-slate-700'}`} />
                                    <div className={`h-1 flex-1 rounded ${newPassword.length >= 8 ? 'bg-teal-500' : 'bg-slate-700'}`} />
                                    <div className={`h-1 flex-1 rounded ${newPassword.length >= 10 && /[A-Z]/.test(newPassword) ? 'bg-teal-500' : 'bg-slate-700'}`} />
                                </div>
                                <p className="text-xs text-slate-500">
                                    {newPassword.length < 6 && 'Senha muito fraca'}
                                    {newPassword.length >= 6 && newPassword.length < 8 && 'Senha fraca'}
                                    {newPassword.length >= 8 && newPassword.length < 10 && 'Senha média'}
                                    {newPassword.length >= 10 && 'Senha forte'}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-slate-900 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Salvando...
                                </>
                            ) : success ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    Senha Atualizada!
                                </>
                            ) : (
                                'Salvar Senha'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-700">
                        <p className="text-xs text-slate-500 text-center">
                            Sua senha será criptografada e armazenada com segurança
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
