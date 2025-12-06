'use client'

import { useState, useEffect } from 'react'
import { Users, Shield, UserPlus, TrendingUp, Download, Trash2, Edit, Key, Search, ChevronLeft, ChevronRight, Loader2, X, CheckCircle2, AlertCircle, Plus } from 'lucide-react'

interface User {
    id: string
    name: string
    email: string
    is_admin: boolean
    created_at: string
}

interface Stats {
    totalUsers: number
    adminCount: number
    memberCount: number
    newThisMonth: number
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [stats, setStats] = useState<Stats>({ totalUsers: 0, adminCount: 0, memberCount: 0, newThisMonth: 0 })
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])

    // Modals
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // Form states
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', isAdmin: false })
    const [creating, setCreating] = useState(false)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        fetchUsers()
        fetchStats()
    }, [page, limit, searchTerm, roleFilter])

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/users/stats')
            const data = await response.json()
            setStats(data)
        } catch (error) {
            console.error('Error fetching stats:', error)
        }
    }

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search: searchTerm,
                role: roleFilter
            })

            const response = await fetch(`/api/admin/users?${params}`)
            const data = await response.json()

            setUsers(data.users || [])
            setTotalPages(data.pagination?.totalPages || 1)
        } catch (error) {
            console.error('Error fetching users:', error)
        }
        setLoading(false)
    }

    const handleAddUser = async () => {
        if (!newUser.email || !newUser.password || !newUser.name) {
            setMessage({ type: 'error', text: 'Preencha todos os campos.' })
            return
        }

        setCreating(true)
        setMessage(null)

        try {
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            })

            const data = await response.json()

            if (response.ok) {
                setMessage({ type: 'success', text: 'Usuário criado com sucesso!' })
                setNewUser({ name: '', email: '', password: '', isAdmin: false })
                fetchUsers()
                fetchStats()
                setTimeout(() => {
                    setShowAddModal(false)
                    setMessage(null)
                }, 1500)
            } else {
                setMessage({ type: 'error', text: data.error || 'Erro ao criar usuário.' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro de conexão.' })
        }
        setCreating(false)
    }

    const handleEditUser = async () => {
        if (!editingUser?.name || !editingUser?.email) {
            setMessage({ type: 'error', text: 'Preencha todos os campos.' })
            return
        }

        setUpdating(true)
        setMessage(null)

        try {
            const response = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingUser.id,
                    name: editingUser.name,
                    email: editingUser.email,
                    isAdmin: editingUser.is_admin
                })
            })

            const data = await response.json()

            if (response.ok) {
                setMessage({ type: 'success', text: 'Usuário atualizado!' })
                fetchUsers()
                fetchStats()
                setTimeout(() => {
                    setShowEditModal(false)
                    setEditingUser(null)
                    setMessage(null)
                }, 1500)
            } else {
                setMessage({ type: 'error', text: data.error || 'Erro ao atualizar.' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro de conexão.' })
        }
        setUpdating(false)
    }

    const handleDeleteUser = async (id: string, email: string) => {
        if (!confirm(`Excluir ${email}? Essa ação é irreversível.`)) return

        try {
            const response = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' })
            if (response.ok) {
                alert('Usuário excluído.')
                fetchUsers()
                fetchStats()
            } else {
                const data = await response.json()
                alert(data.error || 'Erro ao excluir.')
            }
        } catch (error) {
            alert('Erro de conexão.')
        }
    }

    const handleBulkDelete = async () => {
        if (selectedUsers.length === 0) return
        if (!confirm(`Excluir ${selectedUsers.length} usuários? Essa ação é irreversível.`)) return

        try {
            const response = await fetch('/api/admin/users/bulk-actions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', userIds: selectedUsers })
            })

            if (response.ok) {
                alert(`${selectedUsers.length} usuários excluídos.`)
                setSelectedUsers([])
                fetchUsers()
                fetchStats()
            }
        } catch (error) {
            alert('Erro ao excluir usuários.')
        }
    }

    const handleResetPassword = async (userId: string, email: string) => {
        if (!confirm(`Resetar senha de ${email}?`)) return

        try {
            const response = await fetch('/api/admin/users/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            })

            const data = await response.json()

            if (response.ok) {
                alert(`Senha resetada!\nSenha temporária: ${data.tempPassword}\n\nCopie e envie ao usuário.`)
            } else {
                alert(data.error || 'Erro ao resetar senha.')
            }
        } catch (error) {
            alert('Erro de conexão.')
        }
    }

    const exportToCSV = () => {
        const headers = ['Nome', 'Email', 'Função', 'Criado em']
        const rows = users.map(u => [
            u.name,
            u.email,
            u.is_admin ? 'Admin' : 'Membro',
            new Date(u.created_at).toLocaleDateString('pt-BR')
        ])

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `usuarios-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
    }

    const toggleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([])
        } else {
            setSelectedUsers(users.map(u => u.id))
        }
    }

    return (
        <div className="text-white">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border border-teal-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Total de Usuários</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.totalUsers}</p>
                        </div>
                        <Users className="w-10 h-10 text-teal-500 opacity-50" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Administradores</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.adminCount}</p>
                        </div>
                        <Shield className="w-10 h-10 text-amber-500 opacity-50" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Membros</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.memberCount}</p>
                        </div>
                        <UserPlus className="w-10 h-10 text-blue-500 opacity-50" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Novos este mês</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.newThisMonth}</p>
                        </div>
                        <TrendingUp className="w-10 h-10 text-emerald-500 opacity-50" />
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
                    <p className="text-slate-400 text-sm mt-1">Controle total sobre membros da plataforma</p>
                </div>

                <div className="flex gap-3 flex-wrap">
                    <button
                        onClick={exportToCSV}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                        <Download className="w-4 h-4" /> Exportar CSV
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Adicionar Usuário
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setPage(1)
                        }}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                    />
                </div>

                <select
                    value={roleFilter}
                    onChange={(e) => {
                        setRoleFilter(e.target.value)
                        setPage(1)
                    }}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                >
                    <option value="all">Todas as funções</option>
                    <option value="admin">Apenas Admins</option>
                    <option value="member">Apenas Membros</option>
                </select>

                <select
                    value={limit}
                    onChange={(e) => {
                        setLimit(parseInt(e.target.value))
                        setPage(1)
                    }}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                >
                    <option value="10">10 por página</option>
                    <option value="25">25 por página</option>
                    <option value="50">50 por página</option>
                    <option value="100">100 por página</option>
                </select>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
                <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <span className="text-sm text-teal-400 font-medium">
                        {selectedUsers.length} usuário(s) selecionado(s)
                    </span>
                    <button
                        onClick={handleBulkDelete}
                        className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" /> Excluir Selecionados
                    </button>
                </div>
            )}

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
                </div>
            ) : (
                <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-xs uppercase text-slate-400 font-semibold">
                            <tr>
                                <th className="px-6 py-4 w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.length === users.length && users.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-teal-600"
                                    />
                                </th>
                                <th className="px-6 py-4">Usuário</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Função</th>
                                <th className="px-6 py-4">Criado em</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        Nenhum usuário encontrado.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedUsers([...selectedUsers, user.id])
                                                    } else {
                                                        setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                                                    }
                                                }}
                                                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-teal-600"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                                                    {user.name ? user.name[0].toUpperCase() : '?'}
                                                </div>
                                                <span className="font-medium text-slate-200">{user.name || 'Sem nome'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">{user.email}</td>
                                        <td className="px-6 py-4">
                                            {user.is_admin ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                                                    <Shield className="w-3 h-3" /> ADMIN
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 text-xs font-medium">
                                                    Membro
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleResetPassword(user.id, user.email)}
                                                    className="text-slate-400 hover:text-blue-400 p-2 rounded-lg hover:bg-blue-400/10 transition-colors"
                                                    title="Resetar Senha"
                                                >
                                                    <Key className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingUser(user)
                                                        setShowEditModal(true)
                                                    }}
                                                    className="text-slate-400 hover:text-teal-400 p-2 rounded-lg hover:bg-teal-400/10 transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id, user.email)}
                                                    className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-400/10 transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-slate-400">
                        Página {page} de {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" /> Anterior
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                            Próxima <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">Adicionar Novo Usuário</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {message && (
                            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                {message.text}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nome</label>
                                <input
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-teal-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-teal-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Senha</label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-teal-500 outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isAdmin"
                                    checked={newUser.isAdmin}
                                    onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-teal-600"
                                />
                                <label htmlFor="isAdmin" className="text-sm text-slate-300">Conceder acesso de Administrador</label>
                            </div>

                            <button
                                onClick={handleAddUser}
                                disabled={creating}
                                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition-colors mt-4 disabled:opacity-50"
                            >
                                {creating ? 'Criando...' : 'Criar Usuário'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">Editar Usuário</h3>
                            <button onClick={() => {
                                setShowEditModal(false)
                                setEditingUser(null)
                                setMessage(null)
                            }} className="text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {message && (
                            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                {message.text}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nome</label>
                                <input
                                    type="text"
                                    value={editingUser.name || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-teal-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                                <input
                                    type="email"
                                    value={editingUser.email || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-teal-500 outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="editIsAdmin"
                                    checked={editingUser.is_admin || false}
                                    onChange={(e) => setEditingUser({ ...editingUser, is_admin: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-teal-600"
                                />
                                <label htmlFor="editIsAdmin" className="text-sm text-slate-300">Conceder acesso de Administrador</label>
                            </div>

                            <button
                                onClick={handleEditUser}
                                disabled={updating}
                                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition-colors mt-4 disabled:opacity-50"
                            >
                                {updating ? 'Atualizando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
