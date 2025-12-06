'use client'

import { useState, useEffect } from 'react'
import { ShieldAlert, Wind, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function SOSPage() {
    const [mode, setMode] = useState<'idle' | 'breathing'>('idle')
    const [phase, setPhase] = useState('Inspire') // Inspire, Segure, Expire
    const [count, setCount] = useState(4)

    useEffect(() => {
        if (mode === 'breathing') {
            const interval = setInterval(() => {
                setCount((c) => {
                    if (c === 1) {
                        // Cycle phases
                        if (phase === 'Inspire') {
                            setPhase('Segure')
                            return 4
                        } else if (phase === 'Segure') {
                            setPhase('Expire')
                            return 4
                        } else {
                            setPhase('Inspire')
                            return 4
                        }
                    }
                    return c - 1
                })
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [mode, phase])

    const handlePanic = async () => {
        setMode('breathing')
        // Optional: Log SOS event silently
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await supabase.from('cravings_log').insert({
                user_id: user.id,
                app_target: 'SOS - Botão de Pânico',
                emotion: 'Pânico',
                context: 'Acionado via SOS'
            })
        }
    }

    if (mode === 'breathing') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
                {/* Background Animation */}
                <div className={`absolute inset-0 transition-opacity duration-[4000ms] ${phase === 'Inspire' ? 'opacity-30 bg-blue-500/20' : phase === 'Expire' ? 'opacity-10 bg-blue-500/5' : 'opacity-20 bg-blue-500/10'}`} />

                <button
                    onClick={() => setMode('idle')}
                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white"
                >
                    <X className="w-8 h-8" />
                </button>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <Wind className="w-16 h-16 text-blue-400 mb-8 animate-bounce" />

                    <h2 className="text-4xl font-bold text-white mb-4 transition-all duration-500">
                        {phase}
                    </h2>

                    <div className="text-9xl font-bold text-blue-500/50 font-mono">
                        {count}
                    </div>

                    <p className="mt-12 text-slate-400 max-w-xs">
                        Concentre-se apenas na sua respiração. Isso vai passar.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-white mb-2">Está difícil agora?</h1>
                <p className="text-slate-400">Não tome nenhuma decisão nos próximos 2 minutos.</p>
            </div>

            <button
                onClick={handlePanic}
                className="group relative w-64 h-64 rounded-full bg-gradient-to-br from-rose-600 to-red-700 flex flex-col items-center justify-center shadow-[0_0_60px_rgba(225,29,72,0.4)] hover:shadow-[0_0_100px_rgba(225,29,72,0.6)] transition-all duration-500 hover:scale-105 active:scale-95"
            >
                <div className="absolute inset-0 rounded-full border-4 border-white/10 animate-[ping_3s_ease-in-out_infinite]" />
                <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-[ping_3s_ease-in-out_infinite_1s]" />

                <ShieldAlert className="w-20 h-20 text-white mb-2 drop-shadow-lg" />
                <span className="text-2xl font-bold text-white tracking-widest drop-shadow-md">SOS</span>
            </button>

            <p className="mt-12 text-sm text-slate-500 font-medium uppercase tracking-widest">
                Respire fundo
            </p>
        </div>
    )
}
