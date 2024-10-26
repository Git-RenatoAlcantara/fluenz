import { useVideoPlayer } from "@/app/store/useVideoPlayer";
import { InitialStateType } from "@/lib/type";
import React, { useRef } from "react";
import ReactPlayer from "react-player";

export function VideoPlayback() {
  const playerRef = useRef(null);
  const initialState = useVideoPlayer((state) => state.initialState);
  const update = useVideoPlayer((state) => state.update);

  console.log(initialState);
  return (
    <ReactPlayer
      ref={playerRef}
      playing={initialState.playing}
      onProgress={(progress) => update({ currentTime: progress.playedSeconds })}
      muted
      url={"https://www.youtube.com/watch?v=j6ucGt_Xp14"}
      width={"100%"}
      height={"320px"}
    />
  );
}
