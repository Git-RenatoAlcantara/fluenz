'use client';

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import VideoClient from './pageClient';
import { useParams } from 'next/navigation';

const queryClient = new QueryClient()

export default function Video() {
    const params: { id: string } = useParams()
    
    return (
        <QueryClientProvider client={queryClient}>
            <VideoClient params={params}/>
        </QueryClientProvider>
    )
}