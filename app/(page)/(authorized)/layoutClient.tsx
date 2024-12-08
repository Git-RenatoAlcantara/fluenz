'use client'

import Header from "@/components/Header"
import Sidebar from "@/components/sidebar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { usePathname } from 'next/navigation'
import React from "react"

const pathPlayRegex = /\/play\/[0-9]/
const queryClient = new QueryClient()

export default function LayoutClient({
    children
}: {
    children: React.ReactNode
}){

    const pathname = usePathname()
    
    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex h-screen">
            <Sidebar />
                <div className="w-full h-full">
                    {pathname.match(pathPlayRegex)?.pop() ? "" : <Header newVideo/> }
                    {children}
                </div>
            </div>
        </QueryClientProvider>
    )
}