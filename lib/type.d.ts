interface ITranscript  {
  text: string;
  start: number;
  end: number;
}

interface ICollection {
  id: number;
  url: string;
  transcripts: ITranscript[];
}

export type InitialStateType = {
  playing: boolean;
  muted: boolean;
  seekTo: number | null;
  currentTime: number;
  collections: ICollection[] | []
};
