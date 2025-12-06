'use client'

import { useState, useEffect } from 'react'
import { Download, Share, PlusSquare, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [showIOSPrompt, setShowIOSPrompt] = useState(false)
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsStandalone(true)
        }

        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase()
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent)
        setIsIOS(isIosDevice)

        // Capture Android prompt
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault()
            setDeferredPrompt(e)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        }
    }, [])

    const handleInstallClick = async () => {
        if (isIOS) {
            setShowIOSPrompt(true)
        } else if (deferredPrompt) {
            deferredPrompt.prompt()
            const { outcome } = await deferredPrompt.userChoice
            if (outcome === 'accepted') {
                setDeferredPrompt(null)
            }
        } else {
            // Fallback for desktop or unsupported
            alert('Para instalar, procure a opção "Adicionar à Tela Inicial" no menu do seu navegador.')
        }
    }

    // Don't show if already installed
    if (isStandalone) return null

    // Don't show if not installable (not Android with prompt, not iOS)
    if (!deferredPrompt && !isIOS) return null

    return (
        <>
            {/* Install Button (Inline) */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={handleInstallClick}
                className="w-full mb-8 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-200 px-6 py-4 rounded-2xl flex items-center justify-between font-bold text-sm hover:bg-white/5 transition-all active:scale-[0.98]"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Download className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="text-left">
                        <span className="block text-white">Instalar App</span>
                        <span className="text-xs text-amber-200/70 font-normal">Para uma melhor experiência</span>
                    </div>
                </div>
                <div className="bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                    Baixar
                </div>
            </motion.button>

            {/* iOS Instructions Modal */}
            <AnimatePresence>
                {showIOSPrompt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowIOSPrompt(false)}
                    >
                        <motion.div
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            exit={{ y: 100 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-3xl p-6 relative"
                        >
                            <button
                                onClick={() => setShowIOSPrompt(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                                    <Download className="w-8 h-8 text-amber-400" />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">Instalar no iPhone</h3>
                                <p className="text-slate-400 text-sm mb-6">
                                    Siga os passos abaixo para adicionar o App à sua tela de início:
                                </p>

                                <div className="w-full space-y-4 text-left">
                                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <Share className="w-6 h-6 text-blue-400" />
                                        <span className="text-sm text-slate-200">1. Toque no botão <span className="font-bold text-white">Compartilhar</span></span>
                                    </div>
                                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <PlusSquare className="w-6 h-6 text-slate-200" />
                                        <span className="text-sm text-slate-200">2. Selecione <span className="font-bold text-white">Adicionar à Tela de Início</span></span>
                                    </div>
                                </div>

                                <div className="mt-6 text-xs text-slate-500">
                                    O app ficará disponível na sua tela inicial como um aplicativo nativo.
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
