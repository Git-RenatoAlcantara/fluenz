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
import { ICard } from "@/lib/type"
import { Pencil } from "lucide-react"
import { useState } from "react"



  
export const EditCardModal = ({
    handleEditCard,
    saveCardEdited,
    card
}: {
    handleEditCard: (name: keyof ICard, value: string) => void;
    saveCardEdited: () => void;
    card: ICard | undefined;
}) => {
    
    const [close, setClose ] = useState<boolean>(false)

    return (
        <Dialog>
            <DialogTrigger className="ring-1 px-4 rounded-md">
                <Pencil size={14}/>
            </DialogTrigger>
            <DialogContent>
                <div className="space-y-5">
                    <Textarea 
                        value={card?.front}
                        className="w-full"
                            placeholder="Card Front"
                            onChange={(event) => handleEditCard("front", event.target.value)}
                        />
                        <Textarea 
                            value={card?.back}
                            className="w-full"
                            placeholder="Card Back"
                            onChange={(event) => handleEditCard("back", event.target.value)}
                        />
                        <Button onClick={() => {
                            saveCardEdited()
                            setClose(true);
                        }} className="w-full">Salvar</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}