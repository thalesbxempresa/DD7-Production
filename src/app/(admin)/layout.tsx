import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Link from "next/link";
import { LayoutDashboard, Users, FileText, DollarSign, LogOut, Settings } from "lucide-react";
import { AdminSidebarActions } from "@/components/AdminSidebarActions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "DD7 Admin",
    description: "Painel Administrativo",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-900 flex font-sans text-slate-100">
            {/* Sidebar Lateral Fixa */}
            <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-slate-800 flex items-center gap-2">
                    <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center font-bold text-white">D</div>
                    <h1 className="text-xl font-bold tracking-wider text-white">DD7 ADMIN <span className="text-xs text-teal-500">v2.0</span></h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Principal</p>
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-teal-400 transition-all group">
                        <LayoutDashboard className="w-5 h-5 group-hover:text-teal-400 transition-colors" />
                        Dashboard
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-teal-400 transition-all group">
                        <Users className="w-5 h-5 group-hover:text-teal-400 transition-colors" />
                        Usuários
                    </Link>

                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Gestão</p>
                    <Link href="/admin/content" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-teal-400 transition-all group">
                        <FileText className="w-5 h-5 group-hover:text-teal-400 transition-colors" />
                        Conteúdo
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-teal-400 transition-all group">
                        <DollarSign className="w-5 h-5 group-hover:text-teal-400 transition-colors" />
                        Financeiro
                    </Link>
                </nav>

                <AdminSidebarActions />

                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-900/10 text-slate-400 hover:text-red-400 transition-colors">
                        <LogOut className="w-5 h-5" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 bg-slate-900 min-h-screen">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
