import { useVideoPlayer } from "@/app/store/useVideoPlayer";
import { InitialStateType } from "@/lib/type";
import { formatVideoTime } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

export function VideoPlayback() {
  const [audio, setAudio] = useState<boolean>(true);

  const playerRef = useRef<ReactPlayer>(null);
  const initialState = useVideoPlayer((state) => state.initialState);
  const update = useVideoPlayer((state) => state.update);

  useEffect(() => {
    if (playerRef.current) {
      const frame = playerRef.current.getInternalPlayer();
      if (frame) {
        const iframe = frame.g;
        iframe.style.borderRadius = "8px";
      }
    }
  }, [playerRef.current]);

  useEffect(() => {
    if (initialState.playing) {
      setAudio(false);
    }
  }, [initialState.playing]);

  useEffect(() => {
    console.log("seekToState", initialState.seekTo);
    const video = playerRef.current;
    const seekTo = initialState.seekTo;
    if (video) {
      if (seekTo !== null) {
        video.seekTo(seekTo);
        update({ seekTo: null });
      }
    }
  }, [initialState.seekTo, initialState]);

  return (
    <div>
      <div className="shadow-lg rounded">
        <div className="p-0.5">
          <ReactPlayer
            ref={playerRef}
            playing={initialState.playing}
            onProgress={(progress) =>
              update({ currentTime: progress.playedSeconds })
            }
            controls={true}
            muted={audio}
            url={initialState.collections[0].url}
            width={"100%"}
            height={"420px"}
          />
        </div>
      </div>
      <p className="w-full text-white text-center text-lg font-bold">{formatVideoTime(initialState.currentTime)}</p>
    </div>
  );
}
