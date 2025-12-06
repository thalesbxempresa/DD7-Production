'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface MicroImmersionProps {
    onComplete: () => void
}

export default function MicroImmersion({ onComplete }: MicroImmersionProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6"
        >
            <div className="relative mb-12">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-64 h-64 rounded-full bg-gradient-to-br from-amber-400/20 to-rose-500/20 blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.3)] relative z-10"
                >
                    <span className="text-white font-bold text-sm tracking-widest uppercase">Respire</span>
                </motion.div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Hoje vamos reequilibrar seu cérebro.
                    </h2>
                    <p className="text-slate-400 mb-8">
                        Deixe as distrações lá fora. Este momento é seu.
                    </p>

                    <button
                        onClick={onComplete}
                        className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                    >
                        Começar o Dia <ArrowRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    )
}
