"use client"

import cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchVideos } from "./_actions/fetchVideos";
import { deleteVideo } from "./_actions/deleteVideo";
import { fetchPlaylists } from "./_actions/fetchPlaylists";
import { deletePlaylist } from "./_actions/deletePlaylist";
import { createPlaylist } from "./_actions/createPlaylist";
import { updatePlaylist } from "./_actions/updatePlaylist";
import { updateVideoPlaylist } from "./_actions/updateVideoPlaylist";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Trash2, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import UpdateDurationsClient from "./_components/UpdateDurationsClient";
import { NewVideo } from "./_components/new-video-modal";


const getYouTubeThumbnail = (url: string): string | null => {
  const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return videoIdMatch ? `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg` : null;
};

const isLocalVideo = (url: string): boolean => {
  return url.startsWith('/api/videos/') || url.startsWith('/videos/');
};

const getVideoThumbnail = (url: string): string => {
  if (isLocalVideo(url)) {
    // Para vídeos locais, usar uma imagem placeholder ou gerar thumbnail
    return '/placeholder-video.svg';
  }
  return getYouTubeThumbnail(url) || '/placeholder-video.svg';
};

export default function PageClient() {
  const queryClient = useQueryClient();
  const { toast } = useToast()
  const [renameOpen, setRenameOpen] = useState(false)
  const [renameTarget, setRenameTarget] = useState<any | null>(null)
  const [renameName, setRenameName] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [createName, setCreateName] = useState("")
  const [assignVideoId, setAssignVideoId] = useState<number | null>(null)
  const [showDurationTool, setShowDurationTool] = useState(false)

  // Limpar cache ao montar o componente
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['playlists'] })
  }, [queryClient])


const {isLoading, data} = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const response = await fetch('/api/videos');
      const data = await response.json();
      return data;
    },
    staleTime: 0,
    refetchOnMount: 'always',
})

const { data: playlists = [], refetch: refetchPlaylists } = useQuery({
  queryKey: ['playlists'],
  queryFn: async () => {
    const response = await fetch('/api/playlists');
    const data = await response.json();
    return data || [];
  },
  staleTime: 0,
  gcTime: 0,
  refetchOnMount: 'always',
  refetchOnWindowFocus: true,
})

    
  // Mutação para deletar vídeo
  const deleteMutation = useMutation({
    mutationFn: deleteVideo,
    onSuccess: (data) => {
      console.log(data)
      queryClient.invalidateQueries({
        queryKey: ['videos'],
      });
      toast({
        title: "Vídeo removido com sucesso!"
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Ops! Algo deu errado."
      })
    }
  });

  // Mutação para deletar playlist
  const deletePlaylistMutation = useMutation({
    mutationFn: deletePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['playlists'],
      });
      queryClient.invalidateQueries({
        queryKey: ['videos'],
      });
      toast({
        title: "Playlist removida com sucesso!"
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao remover playlist"
      })
    }
  });

  // Renomear playlist
  const renamePlaylistMutation = useMutation({
    mutationFn: updatePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] })
      toast({ title: 'Playlist renomeada!' })
      setRenameOpen(false)
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Erro ao renomear playlist' })
    }
  })

  // Mover vídeo de playlist
  const moveVideoMutation = useMutation({
    mutationFn: updateVideoPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      toast({ title: 'Vídeo movido!' })
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Erro ao mover vídeo' })
    }
  })

  // Criar playlist rapidamente
  const createPlaylistMutation = useMutation({
    mutationFn: createPlaylist,
    onSuccess: async (created: any) => {
      setCreateOpen(false)
      setCreateName("")
      await queryClient.invalidateQueries({ queryKey: ['playlists'] })
      await queryClient.refetchQueries({ queryKey: ['playlists'] })
      if (assignVideoId && created?.id) {
        moveVideoMutation.mutate({ videoId: assignVideoId, playlistId: created.id })
        setAssignVideoId(null)
      }
      toast({ title: 'Playlist criada!' })
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Erro ao criar playlist' })
    }
  })

  
  if(isLoading) return <p>Carregando...</p>

  const unwatchedVideos = data?.videos.filter((video: any) => video?.last_view_at === null) || [];
  
  // Organizar vídeos por playlist
  const videosWithoutPlaylist = unwatchedVideos.filter((v: any) => !v.playlistId);
  const videosByPlaylist = playlists.map((playlist: any) => ({
    ...playlist,
    videos: unwatchedVideos.filter((v: any) => v.playlistId === playlist.id)
  }));

  const VideoCard = ({ video, idx }: { video: any, idx: number }) => (
    <motion.div
      key={video.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{  opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="p-3 h-fit bg-slate-800/80 rounded-xl relative flex flex-col justify-end items-center border border-slate-700 hover:border-indigo-500/50 transition-all"
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
        {video.title && (
          <p className="text-sm mt-2 truncate">{video.title}</p>
        )}
      </Link>
      <div className="w-full mt-2 flex items-center gap-2">
        <Select
          value={video.playlistId ? String(video.playlistId) : '__none__'}
          onValueChange={(val) => {
            if (val === '__create__') {
              setAssignVideoId(video.id)
              setCreateOpen(true)
              return
            }
            if (val === '__none__') {
              moveVideoMutation.mutate({ videoId: video.id, playlistId: null })
              return
            }
            const playlistId = parseInt(val)
            moveVideoMutation.mutate({ videoId: video.id, playlistId })
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Mover para playlist" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Nenhuma</SelectItem>
            {playlists.map((p: any) => (
              <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
            ))}
            <SelectItem value="__create__">+ Criar playlist…</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
          onClick={() => deleteMutation.mutate(video.id)}
        className="w-fit  bg-red-200/50 top-3 right-3 hover:bg-red-500 text-white absolute"
      >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
      </Button>
    </motion.div>
  );
  
  return (
   <>
   {showDurationTool ? (
     <div className="relative p-6">
       <Button 
         onClick={() => setShowDurationTool(false)}
         className="mb-4 bg-indigo-600 hover:bg-indigo-700"
       >
         Voltar
       </Button>
       <UpdateDurationsClient />
     </div>
   ) : (
     <>
   <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-800">
     <h1 className="text-2xl font-bold text-slate-100">Biblioteca de Vídeos</h1>
     <div className="flex items-center gap-2">
       <NewVideo />
       <Button
         onClick={() => { setAssignVideoId(null); setCreateOpen(true); }}
         className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
       >
         + Nova Playlist
       </Button>
       <Button
         onClick={() => setShowDurationTool(true)}
         className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
       >
         <Clock className="w-4 h-4" />
         Atualizar Durações
       </Button>
     </div>
   </div>
   <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="p-6 space-y-8">
        {/* Vídeos sem playlist */}
        {videosWithoutPlaylist.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-slate-100">Sem Playlist</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {videosWithoutPlaylist.map((video: any, idx: number) => (
                <VideoCard key={video.id} video={video} idx={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Playlists */}
        {videosByPlaylist.map((playlist: any) => (
          <div key={playlist.id}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-slate-100">{playlist.name}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setRenameTarget(playlist)
                    setRenameName(playlist.name)
                    setRenameOpen(true)
                  }}
                  className="text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                >
                  Renomear
                </Button>
                <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30">{playlist.videos.length}</Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deletePlaylistMutation.mutate(playlist.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            {playlist.videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {playlist.videos.map((video: any, idx: number) => (
                  <VideoCard key={video.id} video={video} idx={idx} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Nenhum vídeo nesta playlist</p>
            )}
          </div>
        ))}

        {/* Empty state */}
        {unwatchedVideos.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16 mb-4 opacity-50">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            <p className="text-lg">Nenhum vídeo adicionado ainda</p>
            <p className="text-sm">Clique em "Novo vídeo" para começar</p>
          </div>
        )}
      </div>
    </ScrollArea>
    {/* Rename playlist modal */}
    <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renomear playlist</DialogTitle>
          <DialogDescription>Defina um novo nome.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="renameName">Nome</Label>
            <Input id="renameName" value={renameName} onChange={(e) => setRenameName(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRenameOpen(false)}>Cancelar</Button>
            <Button onClick={() => renameTarget && renameName.trim() && renamePlaylistMutation.mutate({ id: renameTarget.id, name: renameName.trim() })}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Create playlist inline modal */}
    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar playlist</DialogTitle>
          <DialogDescription>Crie e mova o vídeo para ela.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(); fd.append('name', createName); createPlaylistMutation.mutate(fd as any); }}>
          <div className="space-y-3">
            <div>
              <Label htmlFor="createName">Nome</Label>
              <Input id="createName" value={createName} onChange={(e) => setCreateName(e.target.value)} required />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
              <Button type="submit">Criar</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
   )}
    </>
     )
}

