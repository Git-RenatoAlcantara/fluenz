"use client";
import React, { useEffect } from "react";
import { VideoPlayback } from "../_components/video-playback";
import { useVideoPlayer } from "@/app/store/useVideoPlayer";
import { Transcription } from "../editor/_components/Transcription";

function Trailer() {
  const initialState = useVideoPlayer((state) => state.initialState);
  const update = useVideoPlayer((state) => state.update);

  return (
    <div className="grid grid-cols-12 gap-3 ">
      <div className="col-span-3">1</div>
      <div className="col-span-6 space-y-5">
        <div className="w-full">
          <VideoPlayback
            width="450px"
            height="250px"
            isGame={true}
            isEditor={false}
            className=""
          />
        </div>
        <div className="p-2 w-full border rounded-md">
          <textarea
            className="w-full h-full border-0  bg-background text-md font-medium rounded-md "
            value=""
          />
        </div>
      </div>
      <div className="col-span-3">3</div>
    </div>
  );
}

export default Trailer;
