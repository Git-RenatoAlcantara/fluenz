'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { reviewVideo, getVideosForReview, getReviewStats } from "../_actions/spacedRepetition"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Calendar, CheckCircle2, Clock, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import ReactPlayer from "react-player"

type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5

const qualityOptions = [
  { value: 0 as ReviewQuality, label: 'Não lembro', color: 'destructive', icon: '❌' },
  { value: 1 as ReviewQuality, label: 'Muito Difícil', color: 'destructive', icon: '😰' },
  { value: 2 as ReviewQuality, label: 'Difícil', color: 'secondary', icon: '😕' },
  { value: 3 as ReviewQuality, label: 'Médio', color: 'default', icon: '🤔' },
  { value: 4 as ReviewQuality, label: 'Fácil', color: 'default', icon: '😊' },
  { value: 5 as ReviewQuality, label: 'Muito Fácil', color: 'default', icon: '🎯' },
]

export default function ReviewPageClient() {
  const queryClient = useQueryClient()
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  const { data: videos = [], isLoading: loadingVideos } = useQuery({
    queryKey: ['review-videos'],
    queryFn: async () => await getVideosForReview(),
  })

  const { data: stats } = useQuery({
    queryKey: ['review-stats'],
    queryFn: async () => await getReviewStats(),
  })

  const reviewMutation = useMutation({
    mutationFn: ({ videoId, quality }: { videoId: number, quality: ReviewQuality }) => 
      reviewVideo(videoId, quality),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['review-videos'] })
      queryClient.invalidateQueries({ queryKey: ['review-stats'] })
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      
      toast.success('Revisão registrada!', {
        description: data.message
      })

      // Avançar para próximo vídeo
      if (currentVideoIndex < videos.length - 1) {
        setCurrentVideoIndex(prev => prev + 1)
      } else {
        setCurrentVideoIndex(0)
      }
    },
    onError: (error: Error) => {
      toast.error('Erro ao registrar revisão', {
        description: error.message
      })
    }
  })

  const handleReview = (quality: ReviewQuality) => {
    if (!currentVideo) return
    reviewMutation.mutate({ videoId: currentVideo.id, quality })
  }

  const currentVideo = videos[currentVideoIndex]
  const progress = videos.length > 0 ? ((currentVideoIndex) / videos.length) * 100 : 0

  if (loadingVideos) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (videos.length === 0 || !currentVideo) {
    return (
      <div className="container mx-auto p-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              Tudo em dia!
            </CardTitle>
            <CardDescription>
              Você não tem vídeos para revisar hoje. Continue assistindo novos vídeos!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Amanhã</p>
                    <p className="text-2xl font-bold">{stats.tomorrow}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Esta semana</p>
                    <p className="text-2xl font-bold">{stats.thisWeek}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Brain className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total assistidos</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto p-8 space-y-6 max-h-[calc(100vh_-_100px)] mb-20 overflow-y-auto">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.today || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.thisWeek || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.total || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Progresso */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso da sessão</span>
              <span>{currentVideoIndex + 1} de {videos.length}</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardContent>
      </Card>

      {/* Vídeo atual */}
      <Card>
        <CardHeader>
          <div className="m-auto w-full">
            <CardTitle className="text-center">{currentVideo.title || 'Vídeo sem título'}</CardTitle>
            {currentVideo.reviewCount && currentVideo.reviewCount > 0 && (
              <Badge variant="secondary">
                {currentVideo.reviewCount}ª revisão
              </Badge>
            ) || ''}
          </div>
          <CardDescription>
           <div className="w-full m-auto text-center">
             Revise este vídeo e avalie a dificuldade
           </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video max-w-4xl m-auto bg-black rounded-lg mb-6 overflow-hidden">
            <ReactPlayer
              url={currentVideo.url}
              controls={true}
              width="100%"
              height="100%"
              config={{
                youtube: {
                  playerVars: {
                    rel: 0,
                    modestbranding: 1,
                    showinfo: 0,
                    fs: 1,
                    iv_load_policy: 3,
                    controls: 1,
                  },
                },
              }}
            />
          </div>

          <div className="space-y-4 max-w-4xl m-auto text-center">
            <h3 className="font-semibold text-lg">Como foi a revisão?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {qualityOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={option.color as any}
                  onClick={() => handleReview(option.value)}
                  disabled={reviewMutation.isPending}
                  className="h-auto py-4 flex flex-col gap-2"
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-sm">{option.label}</span>
                </Button>
              ))}
            </div>

            {currentVideo.repetitionInterval && currentVideo.repetitionInterval > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>
                  Último intervalo: {currentVideo.repetitionInterval} dia
                  {currentVideo.repetitionInterval > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
