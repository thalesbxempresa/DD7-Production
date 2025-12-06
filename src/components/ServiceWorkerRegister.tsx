'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegister() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((reg) => console.log('Service Worker Registered'))
                .catch((err) => console.log('Service Worker Failed', err))
        }
    }, [])

    return null
}
