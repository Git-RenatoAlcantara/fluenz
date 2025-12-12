'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPlaylist } from "../_actions/createPlaylist"
import { Plus } from "lucide-react"

export function NewPlaylistModal() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const { toast } = useToast()

  const createMutation = useMutation({
    mutationFn: createPlaylist,
    onSuccess: async (data) => {
      console.log('Playlist created successfully:', data)
      await queryClient.invalidateQueries({ queryKey: ['playlists'] })
      await queryClient.refetchQueries({ queryKey: ['playlists'] })
      toast({
        title: "Playlist criada com sucesso!"
      })
      setModalOpen(false)
    },
    onError: (error) => {
      console.error('Error creating playlist:', error)
      toast({
        variant: "destructive",
        title: "Erro ao criar playlist"
      })
    }
  })

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    console.log('Submitting playlist form:', Object.fromEntries(formData))
    createMutation.mutate(formData)
  }

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nova Playlist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar nova playlist</DialogTitle>
          <DialogDescription>
            Escolha um nome para organizar seus vídeos
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit}>
          <div className="w-full flex flex-col gap-4">
            <div>
              <Label htmlFor="name">Nome da playlist</Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Ex: Inglês Básico, Vocabulário, etc."
                required
                disabled={createMutation.isPending}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setModalOpen(false)}
                disabled={createMutation.isPending}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Criando...' : 'Criar'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
