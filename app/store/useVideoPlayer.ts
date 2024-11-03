import { InitialStateType } from "@/lib/type";
import { create } from "zustand";

type UpdateType = {
  [_: string]: string | number | boolean | null;
};
interface InitialStateStore {
  initialState: InitialStateType;
  update: (props: UpdateType) => void;
  changeInput: (
    collectionId: number,
    transcriptIndex: number,
    key: string,
    value: string | number
  ) => void;
  insertSubtitleContainer: (collectionId: number, index: number) => void;
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const useVideoPlayer = create<InitialStateStore>((set, get) => ({
  initialState: {
    playing: false,
    muted: true,
    currentTime: 0,
    seekTo: null,
    collections: [
      {
        id: 0,
        url: "https://www.youtube.com/watch?v=j6ucGt_Xp14",
        transcripts: [
          { text: "something happened to me", start: 0.0, end: 1.3 },
          {
            text: "But you wouldn't believe me if I told you.",
            start: 2.0,
            end: 4.5,
          },
          { text: "Ho, here we go.", start: 7.0, end: 8.5 },
          { text: "Wait for this", start: 8.8, end: 9.8 },
          {
            text: "To my extraordinary wife, Daniela.",
            start: 10.1,
            end: 12.5,
          },
          { text: "I do not deserve you", start: 12.6, end: 13.5 },
          { text: "That's true.", start: 13.6, end: 15.0 },
          { text: "A man of science", start: 18.5, end: 20.5 },
          {
            text: "he's married to the woman of his dreams",
            start: 20.8,
            end: 23.5,
          },
          { text: "and they have a good life.", start: 23.9, end: 24.8 },
        ],
      },
    ],
  },

  update: (props: UpdateType) => {
    set((state) => ({
      initialState: {
        ...state.initialState,
        ...props,
      },
    }));
  },

  changeInput: (
    collectionIndex: number = 0,
    transcriptId: number,
    key: string,
    value: string | number
  ) => {
    set((state) => {
      // Localiza a coleção correta pelo índice
      const findCollection = state.initialState.collections[collectionIndex];

      console.log("findCollection", findCollection)
      if (!findCollection) return state; // Se não encontrar a coleção, retorna o estado atual

      // Faz uma cópia das transcrições e atualiza a transcrição no índice correto
      const updatedTranscripts = [...findCollection.transcripts];

      updatedTranscripts[transcriptId] = {
        ...updatedTranscripts[transcriptId],
        [key]: value, // Atualiza apenas a chave especificada
      };

      console.log("updatedTranscripts", updatedTranscripts)

      // Atualiza a coleção com as transcrições modificadas
      const updatedCollections = [...state.initialState.collections];
      updatedCollections[collectionIndex] = {
        ...updatedCollections[collectionIndex], // Mantém outras propriedades da coleção
        transcripts: updatedTranscripts, // Substitui as transcrições atualizadas
      };

      return {
        initialState: {
          ...state.initialState,
          collections: updatedCollections,
        },
      };
    });
  },

  insertSubtitleContainer: (collectionId: number, index: number) => {
    set((state) => {
      // Localiza a coleção correta pelo ID
      const collectionIndex = state.initialState.collections.findIndex(
        (collection) => collection.id === collectionId
      );

      if (collectionIndex === -1) return state; // Se não encontrar a coleção, retorna o estado atual

      // Faz uma cópia das transcrições e insere um novo subtítulo no índice correto
      const updatedTranscripts = [
        ...state.initialState.collections[collectionIndex].transcripts,
      ];
      updatedTranscripts.splice(index + 1, 0, {
        text: "Novo subtítulo",
        start: 0,
        end: 0,
      });

      // Atualiza a coleção com as transcrições modificadas
      const updatedCollections = [...state.initialState.collections];
      updatedCollections[collectionIndex] = {
        ...updatedCollections[collectionIndex],
        transcripts: updatedTranscripts,
      };

      return {
        initialState: {
          ...state.initialState,
          collections: updatedCollections,
        },
      };
    });
  },
}));
