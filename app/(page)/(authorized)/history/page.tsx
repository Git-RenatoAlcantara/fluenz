'use client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HistoryClient from "./pageClient";

const queryClient = new QueryClient()

export default function History(){
    return (
      <QueryClientProvider client={queryClient}>
      <div className="w-full h-full overflow-auto">
         <HistoryClient />
      </div>
      </QueryClientProvider>
    )
}
