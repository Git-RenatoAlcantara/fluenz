"use client";
import Image from "next/image";
import { VideoPlayback } from "./_components/video-playback";
import { useVideoPlayer } from "../store/useVideoPlayer";
import { Button } from "@/components/ui/button";
import { Dialog } from "./Modal";
import { useState } from "react";
import { Transcription } from "./_components/Transcription";

export default function Home() {
  let initialState = useVideoPlayer((state) => state.initialState);
  const update = useVideoPlayer.getState().update;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-4">1</div>
      <div className="col-span-4 space-y-5">
        <div className="w-full relative">
          <div className="absolute w-full bottom-0">
            <Transcription />
          </div>
          <div className="w-full h-1/3">
          <VideoPlayback />
          </div>
        </div>
        <p>
          <span>Time:</span>
          {initialState.currentTime}
        </p>
        <Button
          onClick={() => {
            const playing = initialState.playing;
            update({
              playing: !playing,
            });
          }}
        >
          {initialState.playing ? "Stop" : "Play"}
        </Button>
      </div>
      <div className="col-span-4">3</div>
    </div>
  );
}
