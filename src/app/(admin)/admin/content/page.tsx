'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
    Edit,
    Save,
    X,
    Zap,
    Trash2,
    Phone,
    Leaf,
    BookOpen,
    PenTool,
    Feather,
    LayoutDashboard,
    Clock,
    Image as ImageIcon,
    Loader2
} from 'lucide-react'

// Helper to render dynamic icons safely
const IconComponent = ({ name, className }: { name: string, className?: string }) => {
    const iconMap: { [key: string]: any } = {
        Zap, Trash2, Phone, Leaf, BookOpen, PenTool, Feather, LayoutDashboard
    }
    const Icon = iconMap[name] || Zap
    return <Icon className={className} />
}

export default function ContentPage() {
    const router = useRouter()
    const [tasks, setTasks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [editingTask, setEditingTask] = useState<any | null>(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('day_id', { ascending: true })

        if (data) setTasks(data)
        setLoading(false)
    }

    const handleEdit = (task: any) => {
        console.log('Editing task:', task) // Debug
        setEditingTask({ ...task })
    }

    const handleSave = async () => {
        if (!editingTask) return
        setSaving(true)

        const { error } = await supabase
            .from('tasks')
            .update({
                title: editingTask.title,
                description: editingTask.description,
                duration: editingTask.duration,
                icon: editingTask.icon
            })
            .eq('id', editingTask.id)

        setSaving(false)

        if (!error) {
            alert('Salvo com sucesso!')
            setEditingTask(null)
            // Force a reload to ensure data is fresh
            window.location.reload()
        } else {
            alert('Erro ao salvar: ' + error.message)
        }
    }

    return (
        <div className="text-white">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Gestão de Conteúdo</h1>
                    <p className="text-slate-400 text-sm mt-1">Edite os cards dos 7 dias do detox.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
                </div>
            ) : tasks.length === 0 ? (
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-12 text-center">
                    <LayoutDashboard className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Nenhum conteúdo</h3>
                    <p className="text-slate-400">A tabela de tarefas está vazia.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            onClick={() => handleEdit(task)}
                            className="bg-slate-800 border border-slate-700 rounded-xl p-6 relative group hover:border-teal-500/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-teal-900/10 hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-teal-400">
                                    <IconComponent name={task.icon} className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-900 px-2 py-1 rounded">
                                    Dia {task.day_id}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{task.title}</h3>
                            <p className="text-slate-400 text-sm mb-4 line-clamp-3 h-16">{task.description}</p>

                            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium bg-teal-400/10 px-2 py-1 rounded w-fit">
                                <Clock className="w-3 h-3" />
                                <span>{task.duration || 'N/A'}</span>
                            </div>

                            <div className="absolute top-4 right-4 p-2 bg-teal-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <Edit className="w-4 h-4" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editingTask && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    {/* Modal Box */}
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl text-slate-900">

                        {/* Header */}
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Edit className="w-5 h-5 text-teal-600" />
                                Editar Dia {editingTask.day_id}
                            </h2>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingTask(null);
                                }}
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-5">

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título</label>
                                <input
                                    type="text"
                                    value={editingTask.title}
                                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                                    placeholder="Ex: Detox de Dopamina"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descrição</label>
                                <textarea
                                    value={editingTask.description}
                                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all h-32 resize-none"
                                    placeholder="Descreva a atividade..."
                                />
                            </div>

                            {/* Row: Duration & Icon */}
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duração</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={editingTask.duration || ''}
                                            onChange={(e) => setEditingTask({ ...editingTask, duration: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                            placeholder="Ex: 15 min"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ícone (Nome)</label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={editingTask.icon}
                                            onChange={(e) => setEditingTask({ ...editingTask, icon: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                            placeholder="Ex: Zap, Leaf..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingTask(null);
                                }}
                                className="px-5 py-2.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2.5 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-500 transition-colors flex items-center gap-2 shadow-lg shadow-teal-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Salvar Alterações
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
