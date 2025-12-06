'use client'

import { ExternalLink, Copy, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AdminActions() {
    const router = useRouter()
    const [copied, setCopied] = useState(false)
    const appUrl = 'https://d-dsete.vercel.app'

    const handleCopy = () => {
        navigator.clipboard.writeText(appUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Go to App Card */}
            <div
                onClick={() => router.push('/')}
                className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 p-6 rounded-xl cursor-pointer hover:bg-amber-500/20 transition-all group"
            >
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">Acessar Aplicativo</h3>
                    <ExternalLink className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-slate-400 text-sm">
                    Navegar para a versão de usuário do app.
                </p>
            </div>

            {/* Share Link Card */}
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Link para Alunos</h3>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 text-emerald-400" /> Copiado
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" /> Copiar
                            </>
                        )}
                    </button>
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-slate-700 flex items-center justify-between">
                    <code className="text-teal-400 text-sm truncate">{appUrl}</code>
                </div>
            </div>
        </div>
    )
}
