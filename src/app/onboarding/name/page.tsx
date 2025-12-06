'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'

export default function OnboardingNamePage() {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    name: name,
                    email: user.email
                })

            if (!error) {
                router.push('/')
            } else {
                console.error(error)
                alert(`Erro ao salvar: ${error.message || JSON.stringify(error)}`)
            }
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-500/10 text-teal-400 mb-4 ring-1 ring-teal-500/20">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Olá!</h1>
                    <p className="text-slate-400 text-lg">
                        Como você gostaria de ser chamado(a) durante sua jornada?
                    </p>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-xl text-center text-white placeholder:text-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                            placeholder="Seu nome ou apelido"
                            autoFocus
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !name.trim()}
                        className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Salvando...' : 'Começar Jornada'}
                    </button>
                </form>
            </div>
        </div>
    )
}
