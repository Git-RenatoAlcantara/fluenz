import { useVideoPlayer } from "@/app/store/useVideoPlayer";
import React, { useEffect, useRef, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function Transcription() {
  let initialState = useVideoPlayer((state) => state.initialState);
  const update = useVideoPlayer((state) => state.update);

  const [currentSubt, setCurrentSub] = useState<any>();
  const transcriptionContainerRef = useRef(null);

  useEffect(() => {
    const currentTime = parseFloat(String(initialState.currentTime)).toFixed(2);
    const transcript = initialState.collections[0].transcripts;

    const subtitle = transcript.find(
      (step) =>
        parseFloat(currentTime) > step.start &&
        parseFloat(currentTime) < step.end
    );

    if (subtitle) {
      setCurrentSub(subtitle);
    } else {
      setCurrentSub("");
    }
  }, [transcriptionContainerRef, initialState.currentTime]);

  const onTranscriptionClick = (word: string) => {
    const playing = initialState.playing;
    update({ playing: false });
    console.log("WORD:", word);
  };
  const transcriptFormat = (text: string) => {
    if (text) {
      return text.split(" ").map((t) => (
        <HoverCard>
          <HoverCardTrigger>
            <span
              onClick={() => onTranscriptionClick(t)}
              className="transcription text-white text-2xl px-1 cursor-pointer hover:bg-blue-400"
            >
              {t}
            </span>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex flex-col">
              <h4 className="text-md text-center font-semibold">{t}</h4>
              <div className="w-full h-1 border-b-1 border-gray-200" />
              <p className="text-sm">
                The React Framework – created and maintained by @vercel.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      ));
    }
    return null;
  };
  return (
    <>
      <div
        ref={transcriptionContainerRef}
        className="w-full  flex px-1 items-center justify-center"
      >
        {currentSubt?.text && (
          <div className="bg-zinc-950/70 rounded w-full flex justify-center items-center h-14">
            {transcriptFormat(currentSubt?.text)}
          </div>
        )}
      </div>
    </>
  );
}
