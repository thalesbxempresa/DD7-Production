'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Play, Pause, Square, Clock, Brain, CheckCircle2, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function FocusPage() {
    const router = useRouter()
    const [mode, setMode] = useState<'setup' | 'running' | 'finished'>('setup')
    const [task, setTask] = useState('')
    const [duration, setDuration] = useState(25)
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [isActive, setIsActive] = useState(false)

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1)
            }, 1000)
        } else if (timeLeft === 0 && mode === 'running') {
            finishSession()
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isActive, timeLeft, mode])

    const startSession = () => {
        if (!task) return alert('Defina uma tarefa primeiro!')
        setTimeLeft(duration * 60)
        setMode('running')
        setIsActive(true)
    }

    const pauseSession = () => setIsActive(!isActive)

    const stopSession = () => {
        if (confirm('Tem certeza que deseja encerrar a sessão?')) {
            setMode('setup')
            setIsActive(false)
        }
    }

    const finishSession = async () => {
        setIsActive(false)
        setMode('finished')

        // Save to Supabase
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await supabase.from('focus_sessions').insert({
                user_id: user.id,
                task_name: task,
                duration_minutes: duration,
                focus_rating: 10 // Default, could ask user
            })
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="min-h-screen pb-24 p-6 relative overflow-hidden flex flex-col">
            {/* Background Orbs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="mb-8 flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Brain className="text-amber-400" /> Modo Foco
                </h1>
            </div>

            {mode === 'setup' && (
                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl">
                        <div className="mb-8">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sua Missão</label>
                            <input
                                type="text"
                                value={task}
                                onChange={(e) => setTask(e.target.value)}
                                placeholder="No que você vai focar?"
                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:border-amber-500 outline-none transition-colors text-lg"
                            />
                        </div>

                        <div className="mb-8">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Duração: {duration} min</label>
                            <input
                                type="range"
                                min="5"
                                max="120"
                                step="5"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                                <span>5m</span>
                                <span>60m</span>
                                <span>120m</span>
                            </div>
                        </div>

                        <button
                            onClick={startSession}
                            disabled={!task}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Play className="w-5 h-5 fill-current" /> Iniciar Sessão
                        </button>
                    </div>
                </div>
            )}

            {mode === 'running' && (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative w-72 h-72 flex items-center justify-center mb-12">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle
                                cx="144"
                                cy="144"
                                r="140"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-amber-500 transition-all duration-1000"
                                strokeDasharray={880}
                                strokeDashoffset={880 - (880 * timeLeft) / (duration * 60)}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="text-center z-10">
                            <div className="text-6xl font-black text-white font-mono tracking-tighter">
                                {formatTime(timeLeft)}
                            </div>
                            <p className="text-amber-400 font-medium mt-2 animate-pulse">{task}</p>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <button
                            onClick={pauseSession}
                            className="w-16 h-16 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                        >
                            {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                        </button>
                        <button
                            onClick={stopSession}
                            className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 transition-all"
                        >
                            <Square className="w-6 h-6 fill-current" />
                        </button>
                    </div>
                </div>
            )}

            {mode === 'finished' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30">
                        <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Sessão Concluída!</h2>
                    <p className="text-slate-400 mb-8">
                        Você focou em <span className="text-white font-bold">"{task}"</span> por {duration} minutos.
                    </p>

                    <button
                        onClick={() => setMode('setup')}
                        className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Nova Sessão
                    </button>
                </div>
            )}
        </div>
    )
}
