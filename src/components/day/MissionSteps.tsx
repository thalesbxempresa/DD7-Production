'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, Smile, Meh, Frown, AlertCircle } from 'lucide-react'

type StepData = {
    diagnosis?: string
    emotion?: string
    checklist?: string[]
    reflection?: string
}

interface MissionStepsProps {
    dayId: number
    onComplete: (data: StepData) => void
}

export default function MissionSteps({ dayId, onComplete }: MissionStepsProps) {
    const [currentStep, setCurrentStep] = useState(1)
    const [data, setData] = useState<StepData>({ checklist: [] })

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1)
        } else {
            onComplete(data)
        }
    }

    const updateData = (key: keyof StepData, value: any) => {
        setData(prev => ({ ...prev, [key]: value }))
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="mb-8 flex justify-between items-center">
                {[1, 2, 3, 4].map((step) => (
                    <div
                        key={step}
                        className={`h-2 rounded-full transition-all duration-500 ${step <= currentStep ? 'w-full bg-amber-500' : 'w-full bg-white/10'
                            } ${step !== 4 ? 'mr-2' : ''}`}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl min-h-[400px] flex flex-col"
                >
                    {currentStep === 1 && (
                        <Step1_Diagnosis
                            value={data.emotion}
                            onChange={(val) => updateData('emotion', val)}
                        />
                    )}
                    {currentStep === 2 && (
                        <Step2_Challenge />
                    )}
                    {currentStep === 3 && (
                        <Step3_Checklist
                            checked={data.checklist || []}
                            onChange={(val) => updateData('checklist', val)}
                        />
                    )}
                    {currentStep === 4 && (
                        <Step4_Journal
                            value={data.reflection}
                            onChange={(val) => updateData('reflection', val)}
                        />
                    )}

                    <div className="mt-auto pt-8">
                        <button
                            onClick={handleNext}
                            disabled={currentStep === 1 && !data.emotion}
                            className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {currentStep === 4 ? 'Concluir Missão' : 'Próximo Passo'} <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

function Step1_Diagnosis({ value, onChange }: { value?: string, onChange: (v: string) => void }) {
    const emotions = [
        { label: 'Ansioso', icon: Frown, color: 'text-rose-400' },
        { label: 'Entediado', icon: Meh, color: 'text-amber-400' },
        { label: 'Calmo', icon: Smile, color: 'text-emerald-400' },
    ]

    return (
        <div>
            <h3 className="text-2xl font-bold text-white mb-2">Como você está?</h3>
            <p className="text-slate-400 mb-8">Identificar sua emoção é o primeiro passo para o controle.</p>

            <div className="grid grid-cols-1 gap-4">
                {emotions.map((e) => (
                    <button
                        key={e.label}
                        onClick={() => onChange(e.label)}
                        className={`p-4 rounded-xl border transition-all flex items-center gap-4 ${value === e.label
                                ? 'bg-white/10 border-white/30 shadow-lg'
                                : 'bg-transparent border-white/5 hover:bg-white/5'
                            }`}
                    >
                        <e.icon className={`w-8 h-8 ${e.color}`} />
                        <span className="text-white font-bold text-lg">{e.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

function Step2_Challenge() {
    return (
        <div className="text-center">
            <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/30">
                <AlertCircle className="w-10 h-10 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Desafio do Dia</h3>
            <p className="text-slate-300 leading-relaxed mb-6">
                Hoje, seu desafio é simples mas poderoso: <br />
                <span className="text-amber-400 font-bold">Não toque no celular na primeira hora da manhã.</span>
            </p>
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-sm text-amber-200">
                Isso reduz o cortisol e impede que você comece o dia reagindo ao mundo.
            </div>
        </div>
    )
}

function Step3_Checklist({ checked, onChange }: { checked: string[], onChange: (v: string[]) => void }) {
    const items = [
        "Não usei o celular na cama",
        "Fiz 5 min de respiração",
        "Bebi um copo d'água antes da tela"
    ]

    const toggle = (item: string) => {
        if (checked.includes(item)) {
            onChange(checked.filter(i => i !== item))
        } else {
            onChange([...checked, item])
        }
    }

    return (
        <div>
            <h3 className="text-2xl font-bold text-white mb-6">Checklist Matinal</h3>
            <div className="space-y-4">
                {items.map((item) => (
                    <button
                        key={item}
                        onClick={() => toggle(item)}
                        className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-left"
                    >
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${checked.includes(item) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'
                            }`}>
                            {checked.includes(item) && <Check className="w-4 h-4 text-slate-900" />}
                        </div>
                        <span className={`text-lg ${checked.includes(item) ? 'text-white' : 'text-slate-400'}`}>
                            {item}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}

function Step4_Journal({ value, onChange }: { value?: string, onChange: (v: string) => void }) {
    return (
        <div>
            <h3 className="text-2xl font-bold text-white mb-4">Compromisso</h3>
            <p className="text-slate-400 mb-6">Escreva uma intenção para hoje. O que você quer realizar sem a distração digital?</p>
            <textarea
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Hoje eu vou focar em..."
                className="w-full h-40 bg-slate-950/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:border-amber-500 outline-none transition-colors resize-none"
            />
        </div>
    )
}
