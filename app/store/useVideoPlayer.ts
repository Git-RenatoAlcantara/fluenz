import { ICollection, InitialStateType, ITranscript } from "@/lib/type";
import { create } from "zustand";

type UpdateType = {
  [_: string]: string | number | boolean | ICollection[] | null;
};

export const getLocalStorage = (): ICollection[] | undefined => {
  const storage = localStorage.getItem("collections");
  if (storage) {
    return JSON.parse(storage);
  }
};

interface InitialStateStore {
  initialState: InitialStateType;
  getTimestamp: () => [ITranscript, ICollection] | [];
  update: (props: UpdateType) => void;
  changeInput: (
    collectionId: number,
    transcriptIndex: number,
    key: string,
    value: string | number
  ) => void;
  insertSubtitleContainer: (collectionId: number, index: number) => void;
  storage: ICollection[] | [];
  updateStorage: (
    insert: boolean,
    collection: ICollection | ICollection[]
  ) => void;
  save: (collections?: ICollection[]) => void;
  load: () => void;
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
    collections: [],
  },

  getTimestamp: () => {
    
    const collections = get().initialState.collections;
    if (collections && collections.length) {
      const randomCollectionPostition = getRandomInt(0, collections.length - 1);
      const collectionRandom: ICollection =
        collections[randomCollectionPostition];
      const transcripts = collectionRandom.transcripts;
      const randomTranscriptPosition = getRandomInt(0, transcripts.length - 1);
      const transcriptRandom: ITranscript =
        transcripts[randomTranscriptPosition];

      return [transcriptRandom, collectionRandom];
    }
    return [];
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

      console.log("findCollection", findCollection);
      if (!findCollection) return state; // Se não encontrar a coleção, retorna o estado atual

      // Faz uma cópia das transcrições e atualiza a transcrição no índice correto
      const updatedTranscripts = [...findCollection.transcripts];

      updatedTranscripts[transcriptId] = {
        ...updatedTranscripts[transcriptId],
        [key]: value, // Atualiza apenas a chave especificada
      };

      console.log("updatedTranscripts", updatedTranscripts);

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
  storage: [],
  updateStorage: (insert: boolean, collection: ICollection | ICollection[]) => {
    console.log(collection);
    const storage = localStorage.getItem("collections");
    console.log(storage);
    if (insert) {
      if (storage) {
        const collections: ICollection[] = JSON.parse(storage);
        const storageList: ICollection[] = get().storage;
        storageList.push(collection as ICollection);
        set({ storage: [...storageList] });
        get().save(storageList);
      }
    } else {
      console.log("remover", collection);
      set({ storage: [...(collection as ICollection[])] });
      get().save();
    }
  },
  save: (storageList?: ICollection[]) => {
    //const initCollections = get().initialState.collections;
    const storage = get().storage;
    if (storageList && storageList.length) {
      localStorage.setItem("collections", JSON.stringify(storageList));
    } else {
      localStorage.setItem("collections", JSON.stringify(storage));
    }
  },

  load: () => {
    const storage = localStorage.getItem("collections");
    console.log(storage);
    if (storage) {
      const collections = JSON.parse(storage);
      set(() => ({ storage: collections }));
    }
  },
}));
