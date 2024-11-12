import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVideoPlayer } from "@/app/store/useVideoPlayer";
import { Transcription } from "./Transcription";
import { VideoPlayback } from "../../_components/video-playback";

export function VideoEditor({
  isGame = false,
  isEditor = false,
}: {
  isGame?: boolean;
  isEditor: boolean;
}) {
  let initialState = useVideoPlayer((state) => state.initialState);
  const changeInput = useVideoPlayer((state) => state.changeInput);
  const insertSubtitleContainer = useVideoPlayer(
    (state) => state.insertSubtitleContainer
  );

  const update = useVideoPlayer.getState().update;
  const [modalOpen, setModalOpen] = useState(false);
  const [index, setIndex] = useState(null);

  const stopIcon = () => {
    return (
      <div className="text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 5.25v13.5m-7.5-13.5v13.5"
          />
        </svg>
      </div>
    );
  };
  const restartIcon = () => {
    return (
      <div className="text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
          />
        </svg>
      </div>
    );
  };

  const playIcon = () => {
    return (
      <div className="text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
          />
        </svg>
      </div>
    );
  };

  const onInputClick = (sub: { text: string; start: number; end: number }) => {
    update({
      seekTo: sub.start,
    });
  };

  const renderPlayer = () => {
    return <></>;
  };
  return (
    <div className="grid grid-cols-12 gap-3 ">
      <div className="col-span-6">
        <ScrollArea className="w-full h-[460px] p-5 rounded-md ">
          <div className="w-full h-full space-y-2 rounded-md ">
            <>
              {initialState.collections[0].transcripts.map((sub, index) => (
                <div className="w-full h-36 gap-2 flex bg-purple-500 rounded relative">
                  <div className="h-28 w-full flex">
                    <div className="p-2 h-full flex flex-col justify-between">
                      <input
                        onClick={() => onInputClick(sub)}
                        onChange={(event) =>
                          changeInput(0, index, "start", event.target.value)
                        }
                        step={1.0}
                        className="bg-zinc-900 text-white rounded-md"
                        value={sub.start}
                        type="number"
                      />
                      <input
                        onClick={() => onInputClick(sub)}
                        onChange={(event) =>
                          changeInput(0, index, "end", event.target.value)
                        }
                        className="bg-zinc-900 text-white rounded-md"
                        value={sub.end}
                        type="number"
                      />
                    </div>
                    <div className="p-2 w-full ">
                      <textarea
                        onClick={() => onInputClick(sub)}
                        className="w-full h-full border-0  text-white text-md font-medium  bg-zinc-900 rounded-md "
                        value={sub.text}
                        onChange={(event) =>
                          changeInput(0, index, "text", event.target.value)
                        }
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => insertSubtitleContainer(0, index)}
                    className="absolute h-8 w-5 z-10 bg-yellow-500 rounded-full -bottom-4 right-5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </Button>
                </div>
              ))}
            </>
          </div>
        </ScrollArea>
      </div>
      <div className="col-span-5 space-y-5 relative">
        <div className="w-[700px] relative ">
          <div className="w-full">
            <VideoPlayback
              isEditor={isEditor}
              className="absolute z-0"
              isGame={isGame}
              height="480px"
              width="800px"
            />
          </div>
        </div>
        <div className="flex  w-full justify-center gap-2 absolute top-[510px]">
          <Button
            variant={"ghost"}
            className="bg-purple-500 hover:bg-purple-600"
            onClick={() => {
              const playing = initialState.playing;
              update({
                playing: !playing,
              });
            }}
          >
            {initialState.playing ? stopIcon() : playIcon()}
          </Button>
          <Button
            variant={"ghost"}
            className="bg-purple-500 hover:bg-purple-600"
            onClick={() => {
              update({ seekTo: 0.0 });
            }}
          >
            {restartIcon()}
          </Button>
        </div>
      </div>
    </div>
  );
}
