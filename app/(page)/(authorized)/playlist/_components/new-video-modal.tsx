'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function NewVideo() {
  const queryClient = useQueryClient()
  const [modalOpenVideo, setModalOpenVideo] = useState(false);
  const [url, setUrl] = useState<string>("");
  const {toast} = useToast();

  useEffect(() => {
    setUrl("");
  }, [])


    // Mutação para deletar vídeo
    const saveMutation = useMutation({
      mutationFn: saveUserAction,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['videos'], // Aqui especifica o tipo esperado
        });
        toast({
          title: "Video salvo com sucesso!"
        })
      },
    });

    if(saveMutation.isPending) return <p>Salvando novo vídeo...</p>
    
  async function  onSubmit(event: React.FormEvent){
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    saveMutation.mutate(formData);
  }


  return (
    <Dialog open={modalOpenVideo}>
      <DialogTrigger onClick={() => {
        setModalOpenVideo(true)
      }} className="bg-primary hover:bg-primary/90  px-5 rounded h-10">
       Novo vídeo
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Digite o link do video do youtube</DialogTitle>
         
        </DialogHeader>
        
        <form onSubmit={onSubmit}>
          <div className="w-full flex justify-center gap-2">
            <Input
                placeholder="https://www.youtube.com/watch?v=j6ucGt_Xp14"
                name="url"
                id="url"
              />
            <Button onClick={() => setModalOpenVideo(false)} className="">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
