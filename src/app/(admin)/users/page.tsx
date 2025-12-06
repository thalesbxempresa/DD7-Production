export default function UsersPage() {
    // Mock data
    const users = [
        { id: 1, email: 'user1@example.com', joined: '2023-10-01', progress: 'Dia 7' },
        { id: 2, email: 'user2@example.com', joined: '2023-10-02', progress: 'Dia 3' },
        { id: 3, email: 'user3@example.com', joined: '2023-10-05', progress: 'Dia 1' },
    ]

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-8">Usuários Cadastrados</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Email</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Data de Cadastro</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Progresso Atual</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-slate-700">{user.email}</td>
                                <td className="px-6 py-4 text-slate-500">{user.joined}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded-md text-xs font-bold">
                                        {user.progress}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Detalhes</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
