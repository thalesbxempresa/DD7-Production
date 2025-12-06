'use client'

import { ExternalLink, Copy, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AdminSidebarActions() {
    const router = useRouter()
    const [copied, setCopied] = useState(false)
    const appUrl = 'https://d-dsete.vercel.app'

    const handleCopy = () => {
        navigator.clipboard.writeText(appUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="px-4 mt-6 space-y-2">
            <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ações Rápidas</p>

            <button
                onClick={() => router.push('/')}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-all group text-sm font-medium border border-teal-500/20"
            >
                <ExternalLink className="w-4 h-4" />
                Acessar App
            </button>

            <button
                onClick={handleCopy}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all group text-sm font-medium border border-slate-700"
            >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Link Copiado!' : 'Copiar Link'}
            </button>
        </div>
    )
}
