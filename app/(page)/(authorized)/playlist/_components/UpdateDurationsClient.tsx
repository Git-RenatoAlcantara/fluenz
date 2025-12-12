'use client'

import { useEffect, useRef, useState } from "react"
import ReactPlayer from "react-player"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getVideosWithoutDuration, batchUpdateDurations } from "../_actions/updateDurations"

interface VideoWithoutDuration {
  id: number
  url: string
  title: string | null
  type: string
}

export default function UpdateDurationsClient() {
  const [videos, setVideos] = useState<VideoWithoutDuration[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [durations, setDurations] = useState<Record<number, number>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const playerRef = useRef<ReactPlayer>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      const data = await getVideosWithoutDuration()
      setVideos(data)
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar vídeos"
      })
    }
  }

  const startProcessing = () => {
    setIsProcessing(true)
    setCurrentIndex(0)
  }

  const handleDuration = (duration: number) => {
    if (currentIndex >= 0 && currentIndex < videos.length) {
      const video = videos[currentIndex]
      setDurations(prev => ({ ...prev, [video.id]: duration }))
      
      // Avançar para o próximo vídeo
      setTimeout(() => {
        if (currentIndex < videos.length - 1) {
          setCurrentIndex(currentIndex + 1)
        } else {
          finishProcessing()
        }
      }, 500)
    }
  }

  const finishProcessing = async () => {
    setIsProcessing(false)
    setCurrentIndex(-1)
    
    // Salvar todas as durações
    const updates = Object.entries(durations).map(([id, duration]) => ({
      id: parseInt(id),
      duration
    }))

    try {
      const result = await batchUpdateDurations(updates)
      toast({
        title: `${result.updated} vídeos atualizados com sucesso!`
      })
      setIsComplete(true)
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar durações"
      })
    }
  }

  const progress = videos.length > 0 ? (Object.keys(durations).length / videos.length) * 100 : 0

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Atualizar Duração dos Vídeos</CardTitle>
          <CardDescription>
            Esta ferramenta detecta automaticamente a duração dos vídeos que ainda não têm essa informação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {videos.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium">Todos os vídeos já têm duração!</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{videos.length} vídeos sem duração</span>
                  <span>{Object.keys(durations).length} / {videos.length} processados</span>
                </div>
                <Progress value={progress} />
              </div>

              {!isProcessing && !isComplete && (
                <Button onClick={startProcessing} className="w-full">
                  Iniciar Detecção Automática
                </Button>
              )}

              {isProcessing && currentIndex >= 0 && currentIndex < videos.length && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processando: {videos[currentIndex].title || videos[currentIndex].url}</span>
                  </div>
                  
                  {/* Player invisível para detectar duração */}
                  <div className="hidden">
                    <ReactPlayer
                      ref={playerRef}
                      url={videos[currentIndex].url}
                      onDuration={handleDuration}
                      onError={(err) => {
                        console.error('Erro ao carregar vídeo:', err)
                        // Pular para o próximo em caso de erro
                        if (currentIndex < videos.length - 1) {
                          setCurrentIndex(currentIndex + 1)
                        } else {
                          finishProcessing()
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              {isComplete && (
                <div className="text-center py-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">Processamento concluído!</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Recarregar
                  </Button>
                </div>
              )}

              {/* Lista de vídeos processados */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {videos.map((video, index) => (
                  <div 
                    key={video.id}
                    className={`p-3 rounded border ${
                      index === currentIndex ? 'border-primary bg-primary/5' :
                      durations[video.id] ? 'border-green-500/50 bg-green-500/5' :
                      'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate flex-1">
                        {video.title || video.url}
                      </span>
                      {durations[video.id] && (
                        <span className="text-xs text-green-600 font-medium ml-2">
                          {Math.floor(durations[video.id] / 60)}:{(Math.floor(durations[video.id] % 60)).toString().padStart(2, '0')}
                        </span>
                      )}
                      {index === currentIndex && (
                        <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
