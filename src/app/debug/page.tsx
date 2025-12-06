'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugPage() {
    const [status, setStatus] = useState('Checking...')
    const [envCheck, setEnvCheck] = useState<any>({})
    const [session, setSession] = useState<any>(null)

    useEffect(() => {
        const check = async () => {
            // 1. Check Env Vars
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL
            const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

            setEnvCheck({
                url: url ? `Present (Starts with ${url.substring(0, 8)}...)` : 'MISSING',
                key: key ? `Present (Starts with ${key.substring(0, 8)}...)` : 'MISSING'
            })

            // 2. Check Connection
            try {
                const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
                if (error) throw error
                setStatus(`Connected! (Profiles count status: ${data === null ? 'OK' : 'OK'})`)
            } catch (e: any) {
                setStatus(`Connection Failed: ${e.message}`)
            }

            // 3. Check Session
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
        }

        check()
    }, [])

    return (
        <div className="p-8 bg-slate-900 text-white min-h-screen font-mono">
            <h1 className="text-2xl font-bold mb-4 text-teal-400">Debug Console</h1>

            <div className="space-y-6">
                <div className="p-4 border border-slate-700 rounded-lg">
                    <h2 className="font-bold mb-2">1. Environment Variables</h2>
                    <pre className="text-sm text-slate-300">
                        URL: {envCheck.url}
                        <br />
                        KEY: {envCheck.key}
                    </pre>
                </div>

                <div className="p-4 border border-slate-700 rounded-lg">
                    <h2 className="font-bold mb-2">2. Supabase Connection</h2>
                    <div className={`text-lg ${status.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                        {status}
                    </div>
                </div>

                <div className="p-4 border border-slate-700 rounded-lg">
                    <h2 className="font-bold mb-2">3. Auth Session</h2>
                    <pre className="text-xs bg-black p-2 rounded overflow-auto max-h-40">
                        {session ? JSON.stringify(session.user, null, 2) : 'No active session'}
                    </pre>
                </div>
            </div>
        </div>
    )
}
