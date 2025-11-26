"use client"

import { InngestRealtimeProvider } from "@inngest/realtime/components"
import { ReactNode } from "react"

interface RealtimeProviderProps {
    children: ReactNode
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
    return (
        <InngestRealtimeProvider
            apiBaseUrl="/api/realtime"
            reconnect={{
                maxAttempts: 5,
                baseDelay: 1000,
            }}
        >
            {children}
        </InngestRealtimeProvider>
    )
}
