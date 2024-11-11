"use client";

import { Button } from "@/components/ui/button";
import { AppSidebar } from "./_components/app-sidebar";
import { useEffect, useRef, useState } from "react";
import { VideoEditor } from "./_components/video-editor";
import { getLocalStorage, useVideoPlayer } from "@/app/store/useVideoPlayer";
import { ICollection } from "@/lib/type";
import { VideoPlayback } from "../_components/video-playback";

export default function Home() {
  let initialState = useVideoPlayer((state) => state.initialState);
  const loadStorage = useVideoPlayer((state) => state.load);
  const storage: ICollection[] = useVideoPlayer((state) => state.storage);
  const updateStorage = useVideoPlayer((state) => state.updateStorage);
  const update = useVideoPlayer((state) => state.update);

  useEffect(() => {
    loadStorage();
  }, []);

  const handleCreate = (index: number) => {
    const storageUpdate: ICollection[] = storage.splice(index, 1);
    update({ collections: storageUpdate });
  };

  const handleRemoveItem = (index: number) => {
    const storageUpdate: ICollection[] = storage.splice(index, 1);
    console.log(storageUpdate);
    updateStorage(false, storage);
  };
  return (
    <div className="w-full min-h-screen h-full p-2">
      {initialState.collections && initialState.collections.length ? (
        <VideoEditor isGame={false} isEditor={true} />
      ) : (
        <div className="grid gap-2 grid-cols-1 lg:grid-cols-4">
          {storage && storage.length ? (
            <>
              {storage.map((video, index) => (
                <div className=" w-fit relative">
                  <VideoPlayback
                    className="absolute z-10"
                    isEditor={false}
                    isGame={false}
                    url={video.url}
                    height="250px"
                    width="450px"
                  />
                  <div
                    onClick={() => {
                      console.log(video);
                    }}
                    className="absolute p-2 bg-black/45 z-10 h-[250px] w-[450px] t-0 cursor-pointer"
                  >
                    <div className="w-full h-full gap-1 flex items-end justify-evenly">
                      <Button
                        onClick={() => handleCreate(index)}
                        className="w-full"
                      >
                        Criar
                      </Button>
                      <Button
                        onClick={() => handleRemoveItem(index)}
                        className="w-full bg-red-500"
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p>Carregando...</p>
          )}
        </div>
      )}
    </div>
  );
}
