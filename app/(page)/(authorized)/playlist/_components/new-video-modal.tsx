'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import React, { useActionState, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { saveUserAction } from "../_actions/saveNewVideo";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPlaylists } from "../_actions/fetchPlaylists";

export function NewVideo() {
  const queryClient = useQueryClient()
  const [modalOpenVideo, setModalOpenVideo] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [videoType, setVideoType] = useState<'youtube' | 'local'>('youtube');
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('__none__');
  const [selectedCategory, setSelectedCategory] = useState<string>('__none__');
  const {toast} = useToast();

  // Buscar playlists
  const { data: playlists = [], isLoading: playlistsLoading, refetch: refetchPlaylists } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const response = await fetch('/api/playlists');
      const data = await response.json();
      console.log('API returned:', data);
      return data || [];
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  // Refetch quando o modal abrir
  useEffect(() => {
    if (modalOpenVideo) {
      refetchPlaylists();
    }
  }, [modalOpenVideo, refetchPlaylists]);

  useEffect(() => {
    console.log('Playlists state updated:', playlists);
  }, [playlists]);


    // Mutação para salvar vídeo
    const saveMutation = useMutation({
      mutationFn: saveUserAction,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['videos'],
        });
        toast({
          title: "Video salvo com sucesso!"
        })
        setModalOpenVideo(false);
        setVideoType('youtube');
        setSelectedPlaylist('__none__');
        setSelectedCategory('__none__');
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Erro ao salvar vídeo"
        })
      }
    });

    
  async function onSubmit(event: React.FormEvent){
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    
    if (videoType === 'youtube') {
      // Upload via URL do YouTube
      const youtubeUrl = formData.get('youtubeUrl') as string;
      const title = formData.get('title') as string;
      
      if (!youtubeUrl) {
        toast({
          variant: "destructive",
          title: "Digite a URL do YouTube"
        })
        return;
      }

      const saveFormData = new FormData();
      saveFormData.append('url', youtubeUrl);
      saveFormData.append('type', 'youtube');
      saveFormData.append('title', title || '');
      if (selectedPlaylist && selectedPlaylist !== '__none__') {
        saveFormData.append('playlistId', selectedPlaylist);
      }
      if (selectedCategory && selectedCategory !== '__none__') {
        saveFormData.append('category', selectedCategory);
      }
      
      saveMutation.mutate(saveFormData);

    } else {
      // Upload de arquivo local
      const videoFile = formData.get('video') as File;
      const title = formData.get('title') as string;

      if (!videoFile || videoFile.size === 0) {
        toast({
          variant: "destructive",
          title: "Selecione um arquivo de vídeo"
        })
        return;
      }

      setIsUploading(true);

      try {
        // Fazer upload do vídeo
        const uploadFormData = new FormData();
        uploadFormData.append('video', videoFile);

        const response = await fetch('/api/upload/video', {
          method: 'POST',
          body: uploadFormData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao fazer upload');
        }

        // Salvar URL do vídeo no banco de dados
        const saveFormData = new FormData();
        saveFormData.append('url', data.videoUrl);
        saveFormData.append('type', 'local');
        saveFormData.append('title', title || '');
        if (selectedPlaylist && selectedPlaylist !== '__none__') {
          saveFormData.append('playlistId', selectedPlaylist);
        }
        if (selectedCategory && selectedCategory !== '__none__') {
          saveFormData.append('category', selectedCategory);
        }
        
        saveMutation.mutate(saveFormData);

      } catch (error: any) {
        toast({
          variant: "destructive",
          title: error.message || "Erro ao fazer upload do vídeo"
        })
      } finally {
        setIsUploading(false);
      }
    }
  }


  return (
    <Dialog open={modalOpenVideo} onOpenChange={setModalOpenVideo}>
      <DialogTrigger className="bg-primary hover:bg-primary/90 px-5 rounded h-10">
       Novo vídeo
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar novo vídeo</DialogTitle>
          <DialogDescription>
            Escolha entre URL do YouTube ou fazer upload de um arquivo local
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit}>
          <div className="w-full flex flex-col gap-4">
            <RadioGroup value={videoType} onValueChange={(value) => setVideoType(value as 'youtube' | 'local')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="youtube" id="youtube" />
                <Label htmlFor="youtube">URL do YouTube</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="local" id="local" />
                <Label htmlFor="local">Arquivo Local</Label>
              </div>
            </RadioGroup>

            <div>
              <Label htmlFor="title">Título (opcional)</Label>
              <Input
                type="text"
                name="title"
                id="title"
                placeholder="Digite o título do vídeo"
                disabled={isUploading || saveMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="playlist">Playlist (opcional)</Label>
              <Select value={selectedPlaylist} onValueChange={setSelectedPlaylist}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma playlist" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Nenhuma</SelectItem>
                  {playlists && playlists.length > 0 ? (
                    playlists.map((playlist: any) => (
                      <SelectItem key={playlist.id} value={playlist.id.toString()}>
                        {playlist.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="__loading__" disabled>Nenhuma playlist criada</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Categoria (opcional)</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Nenhuma</SelectItem>
                  <SelectItem value="grammar">📚 Grammar - Gramática e Estrutura</SelectItem>
                  <SelectItem value="listening">🎧 Listening - Podcasts e Conversação</SelectItem>
                  <SelectItem value="movies">🎬 Movies - Filmes e Séries</SelectItem>
                  <SelectItem value="news">📰 News - Notícias e Documentários</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Escolha para ganhar XP em atributos específicos da Skill Tree
              </p>
            </div>

            {videoType === 'youtube' ? (
              <div>
                <Label htmlFor="youtubeUrl">URL do YouTube</Label>
                <Input
                  type="url"
                  name="youtubeUrl"
                  id="youtubeUrl"
                  placeholder="https://www.youtube.com/watch?v=..."
                  disabled={isUploading || saveMutation.isPending}
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="video">Arquivo de vídeo</Label>
                <Input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  name="video"
                  id="video"
                  disabled={isUploading || saveMutation.isPending}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  MP4, WebM, OGG. Tamanho máximo: 100MB
                </p>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setModalOpenVideo(false)}
                disabled={isUploading || saveMutation.isPending}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isUploading || saveMutation.isPending}
              >
                {isUploading ? 'Fazendo upload...' : saveMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
