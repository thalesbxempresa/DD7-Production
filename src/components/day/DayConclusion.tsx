'use client'

import { motion } from 'framer-motion'
import { Award, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function DayConclusion({ data, onRedo }: { data: any, onRedo: () => void }) {
    const router = useRouter()

    // Mock chart data based on user input (simplified)
    const chartData = [
        { name: 'Foco', value: 80, color: '#fbbf24' }, // Amber
        { name: 'Sono', value: 65, color: '#f43f5e' }, // Rose
        { name: 'Humor', value: 90, color: '#34d399' }, // Emerald
    ]

    return (
        <div className="text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(52,211,153,0.4)]"
            >
                <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>

            <h2 className="text-3xl font-black text-white mb-2">Missão Cumprida!</h2>
            <p className="text-slate-400 mb-8">
                Você deu um passo importante para retomar o controle da sua dopamina.
            </p>

            {/* Stats Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 mb-8 shadow-xl">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Seu Progresso Hoje</h3>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            />
                            <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="space-y-4">
                <button
                    onClick={() => router.push('/')}
                    className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-lg"
                >
                    Voltar para Home <ArrowRight className="w-5 h-5" />
                </button>

                <button
                    onClick={onRedo}
                    className="w-full bg-white/5 text-slate-400 font-bold py-4 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 border border-white/5"
                >
                    <RotateCcw className="w-5 h-5" /> Refazer Exercício
                </button>
            </div>
        </div>
    )
}
