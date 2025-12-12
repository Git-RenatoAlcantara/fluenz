'use client'

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, RefreshCw, Clock, FileVideo } from "lucide-react"
import { useRouter } from "next/navigation"

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function DailyPageClient() {
  const router = useRouter()
  const [refreshKey, setRefreshKey] = useState(0)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['daily-videos', refreshKey],
    queryFn: async () => {
      const response = await fetch('/api/daily-videos')
      if (!response.ok) throw new Error('Erro ao buscar vídeos')
      return response.json()
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always'
  })

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatTotalDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    return `${mins} min`
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const videos = data?.videos || []
  const totalDuration = data?.totalDuration || 0
  const targetDuration = data?.targetDuration || 2400
  const percentage = Math.min((totalDuration / targetDuration) * 100, 100)

  return (
    <div className="p-6 pb-20 sm:pb-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-2">Sua Missão Diária</h2>
        <p className="opacity-90 mb-6">Assista a uma seleção de ~40 minutos para manter seu inglês afiado.</p>
        
        <div className="flex flex-wrap items-center gap-4">
          <Button 
            onClick={handleRefresh}
            className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold shadow-md flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Gerar Novo Mix
          </Button>
          
          <div className="text-sm font-medium px-4 py-2 bg-white/20 rounded-full">
            Total: {formatTotalDuration(totalDuration)}
          </div>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-700 rounded-2xl">
          <FileVideo size={48} className="mx-auto mb-4 text-slate-500" />
          <p className="text-lg mb-2 text-slate-300">Nenhum vídeo com duração definida</p>
          <Button onClick={() => router.push('/playlist')} className="mt-4 bg-indigo-600 hover:bg-indigo-700">
            Ir para Biblioteca
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video: any, index: number) => {
            const isYoutube = video.type === 'youtube';
            const youtubeId = isYoutube ? getYoutubeId(video.url) : null;
            
            return (
              <div 
                key={video.id} 
                className="relative flex flex-col bg-slate-800/80 rounded-xl shadow-sm border border-slate-700 overflow-hidden transition-all hover:shadow-lg hover:border-indigo-500/50"
              >
                <div className="h-32 bg-slate-900 relative group">
                  {isYoutube && youtubeId ? (
                    <img 
                      src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`} 
                      alt={video.title || 'Video'}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <FileVideo size={48} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                    <Clock size={12} />
                    {Math.ceil((video.duration || 0) / 60)} min
                  </div>
                  {video.type === 'local' && (
                    <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-md font-bold">
                      LOCAL
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-slate-100 line-clamp-2 mb-2 leading-tight">
                    {video.title || 'Sem título'}
                  </h3>
                  
                  {video.playlist && (
                    <div className="mb-2">
                      <Badge className="text-xs bg-indigo-600/20 text-indigo-300 border-indigo-500/30">
                        {video.playlist.name}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="mt-auto pt-3">
                    <Button 
                      onClick={() => router.push(`/play/${video.id}`)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2"
                    >
                      <PlayCircle size={16} /> Assistir
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}
