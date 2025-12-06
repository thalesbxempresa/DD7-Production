'use client'

import { Brain, Zap, Lightbulb } from 'lucide-react'

const cards = [
    {
        title: "Dopamina",
        description: "O neurotransmissor do desejo. Reduzir estímulos reseta sua sensibilidade.",
        icon: Brain,
        color: "from-amber-400 to-orange-500"
    },
    {
        title: "Foco",
        description: "Sua atenção é um recurso finito. Proteja-a de interrupções constantes.",
        icon: Zap,
        color: "from-rose-400 to-pink-600"
    },
    {
        title: "Clareza",
        description: "Menos ruído digital significa mais espaço para pensamentos profundos.",
        icon: Lightbulb,
        color: "from-emerald-400 to-teal-600"
    }
]

export default function NeuroCards() {
    return (
        <div className="overflow-x-auto pb-4 -mx-6 px-6 [&::-webkit-scrollbar]:hidden flex gap-3 snap-x snap-mandatory">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="snap-center shrink-0 w-[200px] h-[240px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-5 shadow-xl relative overflow-hidden group flex flex-col justify-between hover:border-white/20 transition-all duration-300"
                >
                    <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${card.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500`} />
                    <div className={`absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr ${card.color} opacity-10 blur-xl group-hover:opacity-30 transition-opacity duration-500`} />

                    <div className="relative z-10">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <card.icon className="w-5 h-5 text-white" />
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{card.title}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed font-medium line-clamp-4">
                            {card.description}
                        </p>
                    </div>
                </div>
            ))}
            {/* Spacer for end of list */}
            <div className="w-2 shrink-0" />
        </div>
    )
}
