"use client"

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchVideos } from "../playlist/_actions/fetchVideos";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw, Calendar, CheckCircle2 } from "lucide-react";
import { resetVideoStatus } from "./_actions/resetVideoStatus";

const getYouTubeThumbnail = (url: string): string | null => {
  const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return videoIdMatch ? `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg` : null;
};

const isLocalVideo = (url: string): boolean => {
  return url.startsWith('/videos/');
};

const getVideoThumbnail = (url: string): string => {
  if (isLocalVideo(url)) {
    return '/placeholder-video.svg';
  }
  return getYouTubeThumbnail(url) || '/placeholder-video.svg';
};

export default function HistoryClient() {
  const queryClient = useQueryClient();
  const { toast } = useToast()

  const {isLoading, data} = useQuery({
    queryKey: ['videos'],
    queryFn: () => fetchVideos(),
  })

  // Mutação para resetar status do vídeo
  const resetMutation = useMutation({
    mutationFn: resetVideoStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['videos'],
      });
      toast({
        title: "Vídeo movido de volta para playlist!"
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Ops! Algo deu errado."
      })
    }
  });

  if(isLoading) return (
    <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="text-slate-400">Carregando histórico...</p>
      </div>
    </div>
  )
 
  if(resetMutation.isPending) return (
    <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
      <p className="text-slate-400">Movendo vídeo...</p>
    </div>
  )

  const watchedVideos = data?.videos.filter(video => video?.last_view_at !== null) || [];
  
  return (
    <div className="p-6 pb-20 sm:pb-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight text-slate-100 mb-2"
        >
          Histórico de Vídeos
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-400"
        >
          Vídeos que você já assistiu (mais de 90%)
        </motion.p>
      </div>

      {/* Content */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {watchedVideos.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-700 rounded-2xl">
              <CheckCircle2 className="size-16 mb-4 opacity-50 text-slate-500" />
              <p className="text-lg text-slate-300">Nenhum vídeo assistido ainda</p>
              <p className="text-sm">Assista vídeos até 90% para vê-los aqui</p>
              <Link href="/playlist" className="mt-4">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Ir para Biblioteca
                </Button>
              </Link>
            </div>
          ) : (
            watchedVideos.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-3 bg-slate-800/80 rounded-xl relative flex flex-col border border-slate-700 hover:border-emerald-500/50 transition-all group"
              >
                  <Link
                    href={`/play/${video.id}`}
                    className="w-full"
                  >
                    {isLocalVideo(video.url) ? (
                      <video 
                        src={video.url} 
                        className="w-full rounded-md aspect-video object-cover"
                        preload="metadata"
                      />
                    ) : (
                      <img 
                        src={getVideoThumbnail(video.url)} 
                        alt="Video Thumbnail" 
                        className="w-full rounded-md aspect-video object-cover" 
                      />
                    )}
                  </Link>

                {/* Badge de assistido */}
                <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium text-white shadow-lg">
                  <CheckCircle2 className="size-3.5" />
                  Assistido
                </div>

                {/* Título do vídeo se existir */}
                {video.title && (
                  <p className="text-sm mt-2 text-slate-200 line-clamp-2 font-medium">{video.title}</p>
                )}

                {/* Data assistido */}
                {video.last_view_at && (
                  <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    {video.last_view_at}
                  </div>
                )}

                {/* Botão de resetar */}
                <Button
                  onClick={() => resetMutation.mutate(video.id)}
                  className="w-full mt-3 gap-2 bg-slate-700 hover:bg-indigo-600 border border-slate-600 hover:border-indigo-500 transition-all"
                  size="sm"
                >
                  <RotateCcw className="size-4" />
                  Assistir novamente
                </Button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
