'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Zap,
    BookOpen,
    Leaf,
    Mountain,
    ArrowRight,
    Sparkles,
    Lock,
    CheckCircle2,
    Map
} from 'lucide-react'
import { InstallPrompt } from '@/components/InstallPrompt'

export default function HomePage() {
    const router = useRouter()
    const [tasks, setTasks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [userName, setUserName] = useState('')

    const [currentDay, setCurrentDay] = useState(1)
    const [progress, setProgress] = useState(0)
    const [expandedDay, setExpandedDay] = useState<number | null>(null)

    useEffect(() => {
        const init = async () => {
            let { data: { user } } = await supabase.auth.getUser()



            if (user) {
                // 1. Check Profile & Name
                let profileName = '' // Default Name

                try {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('name')
                        .eq('id', user.id)
                        .single()
                    if (profile?.name) {
                        profileName = profile.name
                    } else if (user.user_metadata?.name) {
                        profileName = user.user_metadata.name
                    } else if (user.user_metadata?.full_name) {
                        profileName = user.user_metadata.full_name
                    }
                } catch (e) {
                    console.log('Profile fetch failed, using default')
                }

                setUserName(profileName)

                // Fetch User Progress (Mocked if fails)
                try {
                    const { data: progressData } = await supabase
                        .from('user_progress')
                        .select('day_id')
                        .eq('user_id', user.id)
                        .eq('status', 'completed')

                    if (progressData) {
                        const completedCount = progressData.length
                        const nextDay = completedCount + 1
                        setCurrentDay(nextDay > 7 ? 7 : nextDay)
                        setProgress(Math.round((completedCount / 7) * 100))
                    }
                } catch (e) {
                    console.log('Progress fetch failed')
                }
            }

            // 2. Fetch Tasks (Mocked if fails)
            let tasksData = null
            try {
                const { data } = await supabase
                    .from('tasks')
                    .select('*')
                    .order('day_id', { ascending: true })
                tasksData = data
            } catch (e) { console.log('Tasks fetch failed') }

            // Fallback Mock Tasks
            if (!tasksData || tasksData.length === 0) {
                tasksData = [
                    { id: 1, day_id: 1, title: 'Detox de Dopamina', description: 'Reduza o uso de redes sociais por 24h.', duration: '15 min' },
                    { id: 2, day_id: 2, title: 'Limpeza Digital', description: 'Organize seus arquivos e e-mails.', duration: '30 min' },
                    { id: 3, day_id: 3, title: 'Conexão Real', description: 'Ligue para um amigo em vez de mandar mensagem.', duration: '20 min' },
                    { id: 4, day_id: 4, title: 'Natureza', description: 'Passe 30 minutos ao ar livre sem celular.', duration: '30 min' },
                    { id: 5, day_id: 5, title: 'Leitura', description: 'Leia um capítulo de um livro físico.', duration: '1 hora' },
                    { id: 6, day_id: 6, title: 'Criatividade', description: 'Desenhe, escreva ou crie algo offline.', duration: '45 min' },
                    { id: 7, day_id: 7, title: 'Reflexão', description: 'Escreva sobre sua semana de detox.', duration: '15 min' }
                ]
            }

            if (tasksData) setTasks(tasksData)
            setLoading(false)
        }
        init()
    }, [])

    const handleStart = () => {
        router.push(`/day/${currentDay}`)
    }

    if (loading) {
        return (
            <div className="flex-1 flex flex-col p-6 pb-24 text-white relative animate-pulse">
                <div className="w-full h-48 rounded-3xl bg-white/5 mb-6"></div>
                <div className="space-y-4">
                    <div className="h-20 rounded-2xl bg-white/5"></div>
                    <div className="h-20 rounded-2xl bg-white/5"></div>
                </div>
            </div>
        )
    }

    const todayTask = tasks.find(t => t.day_id === currentDay)

    return (
        <div className="flex-1 flex flex-col p-6 pb-32 text-slate-50 relative overflow-x-hidden">

            {/* Header Greeting */}
            <div className="flex justify-between items-end mb-10 animate-in slide-in-from-top-5 duration-700">
                <div>
                    <p className="text-amber-400 text-xs font-bold mb-2 flex items-center gap-2 uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" /> Olá{userName ? `, ${userName}` : ''}
                    </p>
                    <h1 className="text-4xl font-black text-white leading-tight tracking-tight">
                        Detox digital <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
                            em 7 dias
                        </span>
                    </h1>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-black text-white border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                        {progress}<span className="text-xs align-top mt-1">%</span>
                    </div>
                </div>
            </div>

            <InstallPrompt />

            {/* Hero Card (Current Day) - Premium Dark Glass */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-4 px-1">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-400 fill-amber-400" /> Foco de Hoje
                    </h2>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">
                        Dia {currentDay} de 7
                    </span>
                </div>

                <div
                    onClick={handleStart}
                    className="group relative w-full h-80 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/10 p-8 flex flex-col justify-between overflow-hidden shadow-2xl hover:shadow-[0_0_30px_rgba(244,63,94,0.2)] transition-all cursor-pointer"
                >
                    {/* Abstract Glow Background inside card */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl group-hover:bg-rose-500/30 transition-all duration-700" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl group-hover:bg-orange-500/30 transition-all duration-700" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold text-amber-300 mb-6 tracking-wider uppercase">
                            <Mountain className="w-3 h-3" /> Missão Principal
                        </div>
                        <h2 className="text-4xl font-black text-white leading-none mb-4 tracking-tight">
                            {todayTask?.title || 'Carregando...'}
                        </h2>
                        <p className="text-slate-300 text-base font-medium line-clamp-2 leading-relaxed">
                            {todayTask?.description}
                        </p>
                    </div>

                    <div className="relative z-10 flex justify-between items-end">
                        <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/5">
                            <Zap className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-bold text-white">{todayTask?.duration || '15 min'}</span>
                        </div>
                        <button className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                            <ArrowRight className="w-8 h-8" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Full Roadmap */}
            <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 px-1">
                    <Map className="w-5 h-5 text-emerald-400" /> Sua Jornada
                </h3>

                <div className="space-y-4">
                    {tasks.map((task) => {
                        const isCompleted = task.day_id < currentDay
                        const isCurrent = task.day_id === currentDay
                        const isLocked = task.day_id > currentDay
                        const isExpanded = expandedDay === task.day_id

                        return (
                            <motion.div
                                key={task.id}
                                layout
                                onClick={() => {
                                    // Always navigate to the day page, even if locked (Preview Mode)
                                    router.push(`/day/${task.day_id}`)
                                }}
                                className={`relative overflow-hidden rounded-3xl transition-all ${!isLocked ? 'cursor-pointer active:scale-[0.98]' : 'cursor-pointer'
                                    } ${isCurrent
                                        ? 'bg-gradient-to-r from-amber-500/50 to-rose-500/50 p-[1px]'
                                        : 'bg-transparent'
                                    }`}
                            >
                                <div className={`relative flex flex-col rounded-[22px] transition-colors duration-300 ${isCurrent ? 'bg-slate-900/90 backdrop-blur-xl' :
                                    isExpanded ? 'bg-white/10 backdrop-blur-md border border-white/20' :
                                        'bg-white/5 backdrop-blur-md border border-white/5'
                                    }`}>

                                    {/* Main Row */}
                                    <div className="flex items-center gap-5 p-5">
                                        {/* Icon Box */}
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner transition-colors duration-300 ${isCurrent ? 'bg-gradient-to-br from-orange-500 to-rose-600 text-white shadow-orange-500/20' :
                                            isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                isExpanded ? 'bg-slate-700 text-slate-300 border border-white/10' :
                                                    'bg-white/5 text-slate-600 border border-white/5'
                                            }`}>
                                            {isCompleted ? (
                                                <CheckCircle2 className="w-6 h-6" />
                                            ) : isLocked ? (
                                                <Lock className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'scale-110 text-amber-400' : ''}`} />
                                            ) : (
                                                <span className="text-xl font-black">{task.day_id}</span>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${isCurrent ? 'text-amber-400' :
                                                    isExpanded ? 'text-amber-200' :
                                                        'text-slate-500'
                                                    }`}>
                                                    Dia {task.day_id}
                                                </span>
                                                {isCurrent && (
                                                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold border border-rose-500/20">
                                                        AGORA
                                                    </span>
                                                )}
                                                {isLocked && !isExpanded && (
                                                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                                                        Bloqueado
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className={`text-lg font-bold truncate transition-colors duration-300 ${isLocked && !isExpanded ? 'text-slate-600' : 'text-white'
                                                }`}>
                                                {task.title}
                                            </h4>
                                        </div>

                                        {/* Chevron/Action */}
                                        <ArrowRight className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-slate-700'}`} />
                                    </div>


                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>




        </div >
    )
}
