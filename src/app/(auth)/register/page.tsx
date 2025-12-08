'use client'

import Link from 'next/link'
import { Lock, GraduationCap, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/20 rounded-full blur-[100px] animate-pulse-glow" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
            </div>

            <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 shadow-lg shadow-teal-500/20 mb-4 animate-float">
                        <Lock className="w-10 h-10 text-white" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight text-glow">
                        Inscrições Exclusivas
                    </h1>

                    <p className="text-slate-400 text-base md:text-lg max-w-sm mx-auto">
                        O acesso ao <span className="text-teal-400 font-semibold">DD7 - Detox Digital</span> é exclusivo para alunos matriculados.
                    </p>
                </div>

                <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl space-y-6">
                    {/* Info Box */}
                    <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 flex items-start gap-3">
                        <GraduationCap className="w-6 h-6 text-teal-400 shrink-0 mt-0.5" />
                        <div className="text-sm text-slate-300">
                            <p className="font-semibold text-teal-400 mb-1">Como funciona?</p>
                            <p>Ao fazer sua matrícula, você receberá um email com suas credenciais de acesso automaticamente.</p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <a
                            href="https://kiwify.app/SEU_LINK_AQUI"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-slate-900 transition-all active:scale-[0.98] group"
                        >
                            <GraduationCap className="mr-2 w-5 h-5" />
                            Fazer Matrícula
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>

                        <Link
                            href="/login"
                            className="w-full flex items-center justify-center py-3.5 px-4 border border-slate-600 rounded-xl shadow text-sm font-bold text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 transition-all active:scale-[0.98]"
                        >
                            Já sou aluno (Login)
                        </Link>
                    </div>

                    {/* Additional Info */}
                    <div className="pt-4 border-t border-slate-700">
                        <p className="text-xs text-slate-500 text-center">
                            Suas credenciais serão enviadas para o email cadastrado na matrícula.
                        </p>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="text-center">
                    <p className="text-xs text-slate-500">
                        Dúvidas? Entre em contato com o suporte.
                    </p>
                </div>
            </div>
        </div>
    )
}
