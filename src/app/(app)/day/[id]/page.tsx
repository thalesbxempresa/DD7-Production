'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, MoreVertical, ArrowRight, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import MicroImmersion from '@/components/day/MicroImmersion'
import NeuroCards from '@/components/day/NeuroCards'
import MissionSteps from '@/components/day/MissionSteps'
import DayConclusion from '@/components/day/DayConclusion'

type ViewState = 'immersion' | 'context' | 'mission' | 'conclusion'

export default function DayPage() {
    const params = useParams()
    const router = useRouter()
    const dayId = parseInt(params.id as string)

    const [loading, setLoading] = useState(true)
    const [task, setTask] = useState<any>(null)
    const [progress, setProgress] = useState<any>(null)
    const [viewState, setViewState] = useState<ViewState>('immersion')
    const [isLocked, setIsLocked] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                console.log('User not authenticated')
                router.push('/login')
                return
            }

            // Fetch Task Content
            const { data: taskData, error: taskError } = await supabase
                .from('tasks')
                .select('*')
                .eq('day_id', dayId)
                .single()

            if (taskError) {
                console.error('Error fetching task:', taskError)
            } else {
                setTask(taskData)
            }

            if (!taskData && !taskError) {
                // Handle case where task doesn't exist but no error (e.g. wrong ID)
                console.error('Task not found')
                // router.push('/') // Optional: redirect home
            }

            // Fetch User Progress
            const { data: progressData, error: progressError } = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', user.id)
                .eq('day_id', dayId)
                .maybeSingle()

            if (progressError) {
                console.error('Error fetching progress:', progressError)
            } else {
                setProgress(progressData)
            }

            // Check if locked (Logic: Day 1 is always open. Day N requires Day N-1 to be completed)
            if (dayId > 1) {
                const { data: prevDayProgress } = await supabase
                    .from('user_progress')
                    .select('status')
                    .eq('user_id', user.id)
                    .eq('day_id', dayId - 1)
                    .eq('status', 'completed')
                    .maybeSingle()

                if (!prevDayProgress) {
                    setIsLocked(true)
                    setViewState('context') // Skip immersion if locked
                }
            }

        } catch (error) {
            console.error('Unexpected error in fetchData:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleMissionComplete = async (stepData: any) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Save to DB
        const { error } = await supabase
            .from('user_progress')
            .upsert({
                user_id: user.id,
                day_id: dayId,
                status: 'completed',
                data: stepData,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id, day_id' })

        if (!error) {
            setProgress({ ...progress, status: 'completed', data: stepData })
            setViewState('conclusion')
        } else {
            alert('Erro ao salvar progresso. Tente novamente.')
        }
    }

    if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>

    return (
        <>
            {/* 1. IMMERSION OVERLAY */}
            <AnimatePresence>
                {viewState === 'immersion' && (
                    <MicroImmersion onComplete={() => setViewState('context')} />
                )}
            </AnimatePresence>

            <div className="min-h-screen text-slate-50 pb-safe flex flex-col relative overflow-hidden">
                {/* Background Orbs for Day View */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px]" />
                </div>

                {/* Header (Hidden in Immersion) */}
                {viewState !== 'immersion' && (
                    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
                        <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="text-center">
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest border border-amber-500/20 px-2 py-0.5 rounded-full">Dia {dayId}</span>
                            <h1 className="text-sm font-bold text-white mt-1 flex items-center justify-center gap-2">
                                {isLocked && <Lock className="w-3 h-3 text-slate-400" />}
                                {task?.title}
                            </h1>
                        </div>
                        <button className="p-2 -mr-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                            <MoreVertical className="w-6 h-6" />
                        </button>
                    </header>
                )}

                <main className="flex-1 flex flex-col p-6">
                    <AnimatePresence mode="wait">

                        {/* 2. CONTEXT (Neuro Cards) */}
                        {viewState === 'context' && (
                            <motion.div
                                key="context"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex-1 flex flex-col"
                            >
                                <div className="mb-6">
                                    <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">
                                        {task?.title}
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed text-lg">
                                        {task?.description}
                                    </p>
                                </div>

                                <div className="flex flex-col -mx-6 mb-6">
                                    <div className="px-6 mb-4">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Entenda a Ciência</h3>
                                    </div>
                                    <NeuroCards />
                                </div>

                                <button
                                    onClick={() => !isLocked && setViewState('mission')}
                                    disabled={isLocked}
                                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${isLocked
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                                        : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02]'
                                        }`}
                                >
                                    {isLocked ? (
                                        <>
                                            <Lock className="w-5 h-5" /> Sem Acesso
                                        </>
                                    ) : (
                                        <>
                                            Aceitar Missão <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        )}

                        {/* 3. MISSION (Steps) */}
                        {viewState === 'mission' && (
                            <motion.div
                                key="mission"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                            >
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-slate-900">Sua Missão</h3>
                                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                                        {task?.duration || '15 min'}
                                    </span>
                                </div>
                                <MissionSteps dayId={dayId} onComplete={handleMissionComplete} />
                            </motion.div>
                        )}

                        {/* 4. CONCLUSION */}
                        {viewState === 'conclusion' && (
                            <motion.div
                                key="conclusion"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <DayConclusion
                                    data={progress?.data}
                                    onRedo={() => setViewState('immersion')}
                                />
                            </motion.div>
                        )}

                    </AnimatePresence>
                </main>
            </div>
        </>
    )
}
