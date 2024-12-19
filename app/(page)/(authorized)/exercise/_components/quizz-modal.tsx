'use client'
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
import { useToast } from "@/hooks/use-toast"

import ModalForm from "./modal-form"
import { Plus } from "lucide-react"


export const QuizzModal = () => {
    
    const { toast } = useToast()
    
    return (
        <Dialog>
        <DialogTrigger className="flex uppercase gap-1 items-center bg-blue-500/20 px-5 rounded h-10">
          quizz <Plus /> 
        </DialogTrigger>
            <DialogContent>
                  <ModalForm />
            </DialogContent>
        </Dialog>
    )
}