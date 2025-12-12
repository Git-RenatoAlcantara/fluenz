'use client'

import Sidebar from "@/components/global/sidebar"
import RPGHeader from "@/components/global/RPGHeader"
import { ActiveEffectsHUD } from "@/components/global/ActiveEffectsHUD"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"

const queryClient = new QueryClient()

export default function LayoutClient({
    children
}: {
    children: React.ReactNode
}){
    
    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-slate-950 flex flex-col">
                <RPGHeader />
                <ActiveEffectsHUD />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </QueryClientProvider>
    )
}