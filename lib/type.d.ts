interface ITranscript  {
  transcripts: {
    text: string;
  start: number;
  end: number;
  }
}

export type InitialStateType = {
  playing: boolean;
  muted: boolean;
  seekTo: number | null;
  currentTime: number;
  collections: transcripts[]
};
