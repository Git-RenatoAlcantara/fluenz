'use client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardClient from "./pageClient";

const queryClient = new QueryClient()

export default function Dashboard(){
    return (
      <QueryClientProvider client={queryClient}>
      <div className="w-full">
         <DashboardClient />
      </div>
      </QueryClientProvider>
    )
}