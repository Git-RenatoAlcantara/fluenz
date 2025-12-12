'use client'
import { useQuery } from '@tanstack/react-query'
import { fetchVideo } from './_actions/fetchVideo'
import { Player } from './_components/player'
import { Video } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function VideoClient({
    params
}: {
    params: { id: string }
}){

    const fetchDataOptions = {
        id: parseInt(params.id)
    }

    const {isLoading, data} = useQuery({
        queryKey: ['data', fetchDataOptions],
        queryFn: () => fetchVideo(fetchDataOptions),
    })


    const video = data?.result

    if(isLoading){
        return (
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground">Carregando vídeo...</p>
                </div>
            </div>
        )
    }

    if (!video) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16 opacity-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    <p className="text-lg">Vídeo não encontrado</p>
                    <Link href="/playlist">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para playlist
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col"
        >
            {/* Header */}
            <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/playlist">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Voltar para playlist
                            </Button>
                        </Link>
                        
                        {video.createdAt && (
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Adicionado em {new Date(video.createdAt).toLocaleDateString('pt-BR')}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Player Container */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-background to-muted/20">
                <Player video={video}/>
            </div>
        </motion.div>
    )
}