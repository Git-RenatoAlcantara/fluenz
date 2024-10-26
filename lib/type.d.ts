export type InitialStateType = {
  playing: boolean;
  muted: boolean;
  currentTime: number;
  transcript: {
    text: string;
    timestamp: number;
  }[];
};
