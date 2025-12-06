'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowRight, Check, BarChart3, Moon, Zap, Brain, ShieldAlert } from 'lucide-react'

type Step = 'welcome' | 'quiz' | 'analysis' | 'goals'

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState<Step>('welcome')
    const [loading, setLoading] = useState(false)

    // Form State
    const [answers, setAnswers] = useState({
        usage_time: '',
        pickup_count: '',
        fatigue_level: 5,
        focus_level: 5,
        sleep_quality: 5,
        anxiety_level: 5,
        self_esteem_impact: 5,
        apps: [] as string[]
    })

    const [goal, setGoal] = useState('')
    const [preferredTime, setPreferredTime] = useState('morning')

    // Quiz Questions
    const handleAnswer = (field: string, value: any) => {
        setAnswers(prev => ({ ...prev, [field]: value }))
    }

    const toggleApp = (app: string) => {
        setAnswers(prev => {
            const newApps = prev.apps.includes(app)
                ? prev.apps.filter(a => a !== app)
                : [...prev.apps, app]
            return { ...prev, apps: newApps }
        })
    }

    const calculateImpact = () => {
        // Simple logic to determine "Digital Overload" score
        const score = (
            (10 - answers.focus_level) +
            (10 - answers.sleep_quality) +
            answers.anxiety_level +
            answers.fatigue_level
        ) / 4
        return Math.round(score * 10) // 0-100
    }

    const saveAssessment = async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            alert('Erro: Usuário não identificado.')
            setLoading(false)
            return
        }

        // Save Assessment
        const { error: assessError } = await supabase
            .from('assessments')
            .insert({
                user_id: user.id,
                type: 'initial',
                ...answers
            })

        if (assessError) {
            console.error('Error saving assessment:', assessError)
            alert('Erro ao salvar avaliação.')
            setLoading(false)
            return
        }

        // Save Preferences (Goal) - Assuming we might store this in profiles or just local for now
        // For now, we'll just proceed. In a real app, we'd update a 'preferences' column in profiles.

        router.push('/')
    }

    // --- RENDER STEPS ---

    if (step === 'welcome') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-teal-900 to-slate-900 text-white">
                <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mb-8 animate-pulse">
                    <Brain className="w-10 h-10 text-teal-400" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Bem-vinda ao DD7</h1>
                <p className="text-slate-300 max-w-md mb-8 leading-relaxed">
                    Um protocolo guiado de 7 dias para reequilibrar seu foco, energia e sono.
                    Sem julgamentos, apenas neurociência aplicada à sua rotina.
                </p>
                <button
                    onClick={() => setStep('quiz')}
                    className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 flex items-center gap-2"
                >
                    Começar Avaliação Inicial <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        )
    }

    if (step === 'quiz') {
        return (
            <div className="min-h-screen p-6 bg-slate-900 text-white">
                <div className="max-w-lg mx-auto">
                    <h2 className="text-xl font-semibold mb-6 text-teal-400">Avaliação Neuro-Digital</h2>

                    <div className="space-y-8">
                        {/* Usage Time */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-300">Tempo estimado de uso diário:</label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-500 outline-none"
                                onChange={(e) => handleAnswer('usage_time', e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                <option value="< 2h">Menos de 2h</option>
                                <option value="2h - 4h">2h a 4h</option>
                                <option value="4h - 6h">4h a 6h</option>
                                <option value="6h+">Mais de 6h</option>
                            </select>
                        </div>

                        {/* Sliders */}
                        {[
                            { label: 'Nível de Cansaço Mental', field: 'fatigue_level', icon: Zap },
                            { label: 'Capacidade de Foco', field: 'focus_level', icon: Brain },
                            { label: 'Qualidade do Sono', field: 'sleep_quality', icon: Moon },
                            { label: 'Nível de Ansiedade', field: 'anxiety_level', icon: ShieldAlert },
                        ].map((item) => (
                            <div key={item.field} className="space-y-3">
                                <div className="flex justify-between">
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                        <item.icon className="w-4 h-4 text-teal-500" /> {item.label}
                                    </label>
                                    <span className="text-teal-400 font-bold">{(answers as any)[item.field]}</span>
                                </div>
                                <input
                                    type="range" min="0" max="10"
                                    value={(answers as any)[item.field]}
                                    onChange={(e) => handleAnswer(item.field, parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                />
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Baixo</span>
                                    <span>Alto</span>
                                </div>
                            </div>
                        ))}

                        {/* Apps */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-300">Apps que mais consomem seu tempo:</label>
                            <div className="flex flex-wrap gap-2">
                                {['Instagram', 'TikTok', 'WhatsApp', 'Twitter/X', 'YouTube', 'Jogos', 'Outros'].map(app => (
                                    <button
                                        key={app}
                                        onClick={() => toggleApp(app)}
                                        className={`px-4 py-2 rounded-full text-sm transition-colors ${answers.apps.includes(app)
                                                ? 'bg-teal-500 text-slate-900 font-bold'
                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                            }`}
                                    >
                                        {app}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setStep('analysis')}
                            className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-4 rounded-xl mt-8 transition-all"
                        >
                            Ver Meu Raio-X Digital
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (step === 'analysis') {
        const overloadScore = calculateImpact()

        return (
            <div className="min-h-screen p-6 bg-slate-900 text-white flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-2 text-white">Seu Mapa de Impacto</h2>
                <p className="text-slate-400 text-sm mb-8">Baseado nas suas respostas</p>

                <div className="w-full max-w-md bg-slate-800/50 p-6 rounded-2xl border border-slate-700 mb-8">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-slate-300">Sobrecarga Digital</span>
                        <span className="text-3xl font-bold text-teal-400">{overloadScore}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400"
                            style={{ width: `${overloadScore}%` }}
                        />
                    </div>
                    <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                        {overloadScore > 70
                            ? "Seu cérebro está em um estado de alerta constante. A dopamina rápida está afetando seu descanso e foco."
                            : overloadScore > 40
                                ? "Você apresenta sinais moderados de cansaço digital. É o momento ideal para intervir antes que vire exaustão."
                                : "Você tem um bom controle, mas pode otimizar sua energia mental para atingir novos níveis de foco."}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <div className="text-slate-400 text-xs mb-1">Sono</div>
                        <div className="text-xl font-bold text-white">{answers.sleep_quality}/10</div>
                        <div className="h-1 w-full bg-slate-700 mt-2 rounded-full">
                            <div className="h-full bg-purple-400 rounded-full" style={{ width: `${answers.sleep_quality * 10}%` }} />
                        </div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <div className="text-slate-400 text-xs mb-1">Foco</div>
                        <div className="text-xl font-bold text-white">{answers.focus_level}/10</div>
                        <div className="h-1 w-full bg-slate-700 mt-2 rounded-full">
                            <div className="h-full bg-blue-400 rounded-full" style={{ width: `${answers.focus_level * 10}%` }} />
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setStep('goals')}
                    className="w-full max-w-md bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-4 rounded-xl transition-all"
                >
                    Definir Meu Objetivo
                </button>
            </div>
        )
    }

    if (step === 'goals') {
        return (
            <div className="min-h-screen p-6 bg-slate-900 text-white">
                <div className="max-w-lg mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-teal-400">Compromisso Pessoal</h2>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-300">Qual seu principal objetivo com o DD7?</label>
                            {[
                                'Dormir melhor e acordar descansada',
                                'Reduzir a ansiedade e comparação',
                                'Recuperar meu foco no trabalho/estudo',
                                'Ter mais tempo de qualidade offline'
                            ].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setGoal(opt)}
                                    className={`w-full p-4 rounded-xl text-left border transition-all ${goal === opt
                                            ? 'bg-teal-500/10 border-teal-500 text-white'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-300">Melhor horário para o check-in diário:</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setPreferredTime('morning')}
                                    className={`p-4 rounded-xl border text-center transition-all ${preferredTime === 'morning'
                                            ? 'bg-teal-500/10 border-teal-500 text-white'
                                            : 'bg-slate-800 border-slate-700 text-slate-400'
                                        }`}
                                >
                                    ☀️ Manhã
                                </button>
                                <button
                                    onClick={() => setPreferredTime('night')}
                                    className={`p-4 rounded-xl border text-center transition-all ${preferredTime === 'night'
                                            ? 'bg-teal-500/10 border-teal-500 text-white'
                                            : 'bg-slate-800 border-slate-700 text-slate-400'
                                        }`}
                                >
                                    🌙 Noite
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={saveAssessment}
                            disabled={!goal || loading}
                            className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-900 font-bold py-4 rounded-xl mt-8 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? 'Salvando...' : 'Iniciar Jornada Dia 1'} <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
