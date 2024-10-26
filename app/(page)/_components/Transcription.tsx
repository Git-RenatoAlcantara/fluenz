import { useVideoPlayer } from "@/app/store/useVideoPlayer";
import React, { useEffect, useRef, useState } from "react";

export function Transcription() {
  let initialState = useVideoPlayer((state) => state.initialState);
  const [currentSubt, setCurrentSub] = useState<any>();
  const transcriptionContainerRef = useRef(null);
  const step = {
    start: 0.2,
    end: 2.5,
  };
  useEffect(() => {
    const currentTime = initialState.currentTime;
    const transcript = initialState.transcript;
    const subtitle = transcript.map((sub) => {
      if (currentTime > step.start && currentTime < step.end) {
        return sub;
      }
    });

    if (subtitle && subtitle.length) {
      setCurrentSub(subtitle);
    }

    
  }, [transcriptionContainerRef, initialState.currentTime]);
  return (
    <div
      className="bg-zinc-950/70 w-[620px] text-center h-14 flex  items-center justify-center gap-2"
    >
      {currentSubt?.map((content: any) => (
        <span className="text-white text-2xl">{content?.text}</span>
      ))}
    </div>
  );
}
