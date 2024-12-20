import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import React, { FormEventHandler, useState } from "react"
import { saveCard } from "../_actions/saveCard"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"


export const CardModal = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()
    
    const saveMutation = useMutation({
        mutationFn: saveCard,
        onSuccess: () => {
            queryClient.cancelQueries({
                queryKey: ['cards']
            });

            toast({
                title: "Novo cartão salvo com sucesso!0"
            })
        }
    })
    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault()
    
        const formData = new FormData(event.target as HTMLFormElement)
        saveMutation.mutate(formData)
    }

    return (
        <Dialog>
        <DialogTrigger className="flex uppercase gap-1 items-center bg-blue-500/20 px-5 rounded h-10">
        card <Plus /> 
        </DialogTrigger>
            <DialogContent>
                  <form  onSubmit={onSubmit}>
                    <div className="space-y-5">
                        <Textarea 
                            name="front"
                            className="w-full"
                            placeholder="Card Front"
                        />
                        <Textarea 
                            name="back"
                            className="w-full"
                            placeholder="Card Back"
                        />
                        <Button type="submit" className="w-full">Salvar</Button>
                    </div>
                  </form>
            </DialogContent>
        </Dialog>
    )
}