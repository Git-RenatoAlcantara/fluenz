"use client"
import { useVideoPlayer } from "@/app/store/useVideoPlayer";
import { Button } from "@/components/ui/button";
import React from "react";

export function SaveVideo() {

    const save = useVideoPlayer((state) => state.save);

    const onClickSave = () => {
        save()
    }

  return (
    <>
      <Button onClick={onClickSave} className="bg-white text-zinc-900 px-5">
        Salvar
      </Button>
    </>
  );
}
