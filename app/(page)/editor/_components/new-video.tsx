"use client";
import { useVideoPlayer } from "@/app/store/useVideoPlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ICollection } from "@/lib/type";

export function NewVideo() {
  const [url, setUrl] = useState<string>("");
  const storage: ICollection[] = useVideoPlayer((state) => state.storage);
  const updateStorage = useVideoPlayer((state) => state.updateStorage);

  const handleSaveNewVideo = () => {
    const total = storage.length;

    updateStorage(true, { id: total, url, transcripts: [{ text: "First transcript", start: 0.0, end: 0.0}] });
  };

  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Digite o link do video do youtube</DialogTitle>
          <DialogDescription>
            <Input
              placeholder="https://www.youtube.com/watch?v=j6ucGt_Xp14"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex justify-center">
          <Button onClick={(event) => handleSaveNewVideo()} className="w-full">
            Adicionar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
