export const dynamic = 'force-dynamic'

export default function DebugVersionPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
            <h1 className="text-4xl font-bold text-teal-500 mb-4">DEPLOYMENT STATUS: ONLINE</h1>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
                <p className="text-xl mb-2">Version: <span className="font-mono text-yellow-400">v3.3 - Git Connection Check</span></p>
                <p className="text-slate-400">Timestamp: {new Date().toISOString()}</p>
                <p className="mt-4 text-sm text-slate-500">If you see this, the new code IS deployed.</p>
            </div>
        </div>
    )
}
