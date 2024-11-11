import { useVideoPlayer } from "@/app/store/useVideoPlayer";
import { InitialStateType, ITranscript } from "@/lib/type";
import { cn, formatVideoTime } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Transcription } from "../editor/_components/Transcription";

export function VideoPlayback({
  isGame,
  isEditor,
  url,
  height,
  width,
  className,
}: {
  isGame: boolean;
  isEditor: boolean;
  url?: string;
  height: string;
  width: string;
  className: string;
}) {
  const [audio, setAudio] = useState<boolean>(true);

  const playerRef = useRef<ReactPlayer>(null);

  const update = useVideoPlayer((state) => state.update);
  const initialState = useVideoPlayer((state) => state.initialState);
  const [transcript, collection] = useVideoPlayer.getState().getTimestamp();

  useEffect(() => {
    const video = playerRef.current;

    if (video) {
      const frame = playerRef.current.getInternalPlayer();
      if (frame) {
        const iframe = frame.g;
        iframe.style.borderRadius = "8px";
      }
      if (isGame && transcript) {
        playerRef.current.seekTo(transcript.start);
        const time = setTimeout(() => {
          update({ playing: true });
        }, 500);
        return () => clearTimeout(time);
      }
    }
  }, [playerRef.current]);

  useEffect(() => {
    if (isGame && transcript) {
      const currentTime = initialState.currentTime;
      if (parseFloat(currentTime.toFixed(2)) > transcript.end) {
        console.log("==== PAUSED =====");
        update({ playing: false });
      }
    }
  }, [initialState.currentTime]);

  useEffect(() => {
    if (playerRef.current) {
      const seekTo = initialState.seekTo;
      console.log(seekTo);
      playerRef.current.seekTo(seekTo || 0.0);
    }
  }, [initialState.seekTo]);
  return (
    <div className={cn(className)}>
      <div className="shadow-lg rounded">
        <div className="p-0.5 relative">
          <ReactPlayer
            ref={playerRef}
            playing={initialState.playing}
            onProgress={(progress) =>
              update({ currentTime: progress.playedSeconds })
            }
            controls={false}
            muted={audio}
            url={collection?.url || url}
            width={width}
            height={height}
          />
          <div className="absolute w-full bottom-8">
            <Transcription isGame={isGame} />
          </div>
        </div>
      </div>
      {isGame ||
        (isEditor && (
          <p className="w-full text-white text-center text-lg font-bold">
            {formatVideoTime(initialState.currentTime)}
          </p>
        ))}
    </div>
  );
}
