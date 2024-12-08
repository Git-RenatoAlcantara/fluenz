interface ITranscript  {
  text: string;
  start: number;
  end: number;
}

interface ICollection {
  id: string;
  url: string;
  transcripts: ITranscript[];
}

export type InitialStateType = {
  index: number | null;
  playing: boolean;
  muted: boolean;
  seekTo: number | null;
  currentTime: number;
  collections: ICollection[] | []
};


export type InitialStateType = {
  playing: boolean;
  muted: boolean;
  currentTime: number;
  transcript: {
    text: string;
    timestamp: number;
  }[];
};

export interface IDecks  {
  front: string;
  back: string;
}


export interface ITag {
  id: number;
  label: string;
}

export interface IReasonProps { sei: boolean; naoSei: boolean}

export interface ICard { front: string, back: string}
