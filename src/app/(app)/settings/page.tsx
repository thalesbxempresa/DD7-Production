'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, User, Lock, Save, CheckCircle2, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // Profile State
    const [name, setName] = useState('')
    const [userId, setUserId] = useState('')

    // Password State
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            setUserId(user.id)
            const { data } = await supabase
                .from('profiles')
                .select('name')
                .eq('id', user.id)
                .single()

            if (data) setName(data.name || '')
        }
        setLoading(false)
    }

    const handleUpdateName = async () => {
        if (!name.trim()) {
            setMessage({ type: 'error', text: 'O nome não pode estar vazio.' })
            return
        }

        setSaving(true)
        setMessage(null)

        const { error } = await supabase
            .from('profiles')
            .update({ name })
            .eq('id', userId)

        if (!error) {
            setMessage({ type: 'success', text: 'Nome atualizado com sucesso!' })
        } else {
            setMessage({ type: 'error', text: 'Erro ao atualizar nome.' })
        }
        setSaving(false)
    }

    const handleUpdatePassword = async () => {
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres.' })
            return
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'As senhas não coincidem.' })
            return
        }

        setSaving(true)
        setMessage(null)

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (!error) {
            setMessage({ type: 'success', text: 'Senha alterada com sucesso!' })
            setNewPassword('')
            setConfirmPassword('')
        } else {
            setMessage({ type: 'error', text: 'Erro ao alterar senha. Tente novamente.' })
        }
        setSaving(false)
    }

    return (
        <div className="min-h-screen pb-24 p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-700/10 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-white/10 text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-white">Configurações</h1>
            </div>

            {/* Message Toast */}
            {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            <div className="space-y-8 max-w-md mx-auto">

                {/* Profile Section */}
                <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
                            <User className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Perfil</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Seu Nome
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-4 text-white focus:border-amber-500 outline-none transition-colors"
                            />
                        </div>

                        <button
                            onClick={handleUpdateName}
                            disabled={saving || loading}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {saving ? 'Salvando...' : <><Save className="w-4 h-4" /> Salvar Nome</>}
                        </button>
                    </div>
                </section>

                {/* Security Section */}
                <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                            <Lock className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Segurança</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Nova Senha
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Confirmar Senha
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repita a nova senha"
                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>

                        <button
                            onClick={handleUpdatePassword}
                            disabled={saving || loading || !newPassword}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {saving ? 'Alterando...' : 'Alterar Senha'}
                        </button>
                    </div>
                </section>

            </div>
        </div>
    )
}
