import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export function SpeechRecord() {
  const [text, setText] = useState("");
  const [isListening, setListening] = useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Web speech api is not supported.");
      return;
    }
  }, []);

  return (
    <>
      <div>
        <p>Microphone: {listening ? "on" : "off"}</p>
        <Button
          onClick={() =>
            SpeechRecognition.startListening({
              language: "en-US",
            })
          }
          disabled={listening}
        >
          Start recording
        </Button>
        <Button
          onClick={() => SpeechRecognition.stopListening()}
          disabled={!listening}
        >
          Stop recording
        </Button>
        <button onClick={resetTranscript}>Reset</button>
        <p>{transcript}</p>
      </div>
    </>
  );
}
