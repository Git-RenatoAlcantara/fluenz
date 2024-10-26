import { InitialStateType } from "@/lib/type";
import { create } from "zustand";

type UpdateType = {
  [_: string]: string | number | boolean;
};
interface InitialStateStore {
  initialState: InitialStateType;
  update: (props: UpdateType) => void;
}

export const useVideoPlayer = create<InitialStateStore>((set, get) => ({
  initialState: {
    playing: false,
    muted: true,
    currentTime: 0,
    transcript: [
      {
        text: "something",
        timestamp: 0.2,
      },
      {
        text: "happened",
        timestamp: 0.8,
      },
      {
        text: "to me",
        timestamp: 2.5,
      },
    ],
  },
  update: (props: UpdateType) => {
    set((state) => ({
      initialState: {
        ...state.initialState, // Mantém as propriedades existentes
        ...props, // Mescla as novas propriedades
      },
    }));
  },
}));
