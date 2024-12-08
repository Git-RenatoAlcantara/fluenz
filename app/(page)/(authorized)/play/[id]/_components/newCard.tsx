"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ICard { front: string, back: string}

export function NewCard() {
  
  const [modalOpenVideo, setModalOpenVideo] = useState(false);
  
  const [card, setCard] = useState<ICard>({
    front: "",
    back: ""
  });
  
  useEffect(() => {
    setCard({ front: "", back: ""});
  }, [])

  const handleTextfieldChange = (name: keyof ICard, value: string) => {
    setCard({
      ...card,
      [name]: value
    })
  }


  const handleSaveNewVideo = () => {
    let storagedDecks: string | null = localStorage.getItem("decks");
    if(storagedDecks){
      const decks: ICard[] | [] = JSON.parse(storagedDecks) as ICard[];
      const decksUpdate = [...decks, card]
      localStorage.setItem("decks", JSON.stringify(decksUpdate));
    }else{
      localStorage.setItem("decks", JSON.stringify([card]));
    }

  };

  return (
    
      <Dialog open={modalOpenVideo}>
        <DialogTrigger onClick={() => setModalOpenVideo(true)} className="dark:bg-[#9b5de5] dark:hover:bg-secondery/90  px-5 rounded h-10">
          New Card
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Novo Cartão</DialogTitle>
            <DialogDescription>
            <div className="space-y-2">
              <Textarea 
                  placeholder="Card Front"
                  onChange={(event) => handleTextfieldChange("front", event.target.value)}
                />
              <Textarea 
                  placeholder="Card Back"
                  onChange={(event) => handleTextfieldChange("back", event.target.value)}
              />
            </div>
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex justify-center">
            <Button  onClick={() =>{

              setModalOpenVideo(false);
              handleSaveNewVideo()

            }} className="w-full dark:bg-[#9b5de5] dark:hover:bg-[#9b5de5]/90 dark:text-white">
              New Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  );
}
