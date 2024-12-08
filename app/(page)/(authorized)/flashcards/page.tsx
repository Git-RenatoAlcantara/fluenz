'use client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Decks from "./_components/Deck";

const queryClient = new QueryClient()


export default function Flashcard(){
  return (
    <QueryClientProvider client={queryClient}>
      <Decks />
    </QueryClientProvider>
  )
}