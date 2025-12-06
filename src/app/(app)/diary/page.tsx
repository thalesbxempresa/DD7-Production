'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { BookHeart, Plus, History, AlertCircle, Pencil, Trash2, X } from 'lucide-react'

export default function DiaryPage() {
    const [targetApp, setTargetApp] = useState('')
    const [context, setContext] = useState('')
    const [emotion, setEmotion] = useState('')
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Edit State
    const [editingItem, setEditingItem] = useState<any | null>(null)
    const [editTarget, setEditTarget] = useState('')
    const [editEmotion, setEditEmotion] = useState('')
    const [editContext, setEditContext] = useState('')

    useEffect(() => {
        fetchLogs()
    }, [])

    const fetchLogs = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('cravings_log')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10)

        if (error) {
            console.error('Error fetching logs:', error)
        } else if (data) {
            setLogs(data)
        }
        setLoading(false)
    }

    const handleLog = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase.from('cravings_log').insert({
            user_id: user.id,
            context,
            emotion,
            app_target: targetApp
        })

        if (error) {
            console.error('Error saving log:', error)
            alert('Erro ao registrar. Tente novamente.')
        } else {
            setTargetApp('')
            setContext('')
            setEmotion('')
            fetchLogs()
            alert('Registro salvo. Parabéns pela consciência!')
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este registro?')) return

        const { error } = await supabase
            .from('cravings_log')
            .delete()
            .eq('id', id)

        if (!error) {
            fetchLogs()
        } else {
            alert('Erro ao excluir.')
        }
    }

    const startEditing = (item: any) => {
        setEditingItem(item)
        setEditTarget(item.app_target)
        setEditEmotion(item.emotion)
        setEditContext(item.context || '')
    }


    const handleUpdate = async () => {
        if (!editTarget || !editEmotion) return

        const { data: { user } } = await supabase.auth.getUser()

        const { error } = await supabase
            .from('cravings_log')
            .update({
                app_target: editTarget,
                emotion: editEmotion,
                context: editContext,
                updated_at: new Date().toISOString()
            })
            .eq('id', editingItem.id)

        if (!error) {
            setEditingItem(null)
            fetchLogs()
        } else {
            alert('Erro ao atualizar. Tente novamente.')
        }
    }

    return (
        <div className="min-h-screen pb-24 p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px]" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BookHeart className="text-rose-400" /> Diário de Impulsos
            </h1>

            {/* Input Form */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 mb-8 shadow-xl">
                <h2 className="text-lg font-bold text-white mb-4">Registrar Novo Impulso</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">O que você ia fazer?</label>
                        <input
                            type="text"
                            value={targetApp}
                            onChange={(e) => setTargetApp(e.target.value)}
                            placeholder="Ex: Abrir Instagram, Ver TikTok..."
                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:border-rose-500 outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">O que sentiu antes?</label>
                        <div className="flex flex-wrap gap-2">
                            {['Tédio', 'Ansiedade', 'Cansaço', 'Hábito', 'Estresse', 'Solidão', 'Tristeza', 'Outro'].map((e) => (
                                <button
                                    key={e}
                                    onClick={() => setEmotion(e)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${emotion === e
                                        ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20'
                                        : 'bg-transparent border-white/10 text-slate-400 hover:border-white/30'
                                        }`}
                                >
                                    {e}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contexto (Opcional)</label>
                        <textarea
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            placeholder="Onde você estava? O que aconteceu?"
                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:border-rose-500 outline-none transition-colors h-24 resize-none"
                        />
                    </div>

                    <button
                        onClick={handleLog}
                        disabled={!targetApp || !emotion}
                        className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Registrar Resistência
                    </button>
                </div>
            </div>

            {/* History */}
            <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <History className="w-5 h-5 text-slate-400" /> Histórico Recente
                </h2>

                {loading ? (
                    <div className="text-center py-10 text-slate-500 animate-pulse">Carregando...</div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-slate-400">Nenhum registro ainda. Isso é bom!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {logs.map((log) => (
                            <div key={log.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex justify-between items-center group">
                                <div>
                                    <h3 className="font-bold text-white">{log.app_target}</h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Sentiu <span className="text-rose-400">{log.emotion}</span> • {new Date(log.updated_at || log.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => startEditing(log)} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(log.id)} className="p-2 rounded-full hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {
                editingItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white">Editar Registro</h3>
                                <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        O que você ia fazer?
                                    </label>
                                    <input
                                        type="text"
                                        value={editTarget}
                                        onChange={(e) => setEditTarget(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:border-rose-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        O que sentiu?
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Tédio', 'Ansiedade', 'Cansaço', 'Hábito', 'Estresse', 'Solidão', 'Tristeza', 'Outro'].map(feeling => (
                                            <button
                                                key={feeling}
                                                onClick={() => setEditEmotion(feeling)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${editEmotion === feeling
                                                    ? 'bg-rose-500 text-white border-rose-500'
                                                    : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                                                    }`}
                                            >
                                                {feeling}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        Contexto
                                    </label>
                                    <textarea
                                        value={editContext}
                                        onChange={(e) => setEditContext(e.target.value)}
                                        rows={3}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:border-rose-500 outline-none resize-none"
                                    />
                                </div>

                                <button
                                    onClick={handleUpdate}
                                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition-colors mt-4"
                                >
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}
