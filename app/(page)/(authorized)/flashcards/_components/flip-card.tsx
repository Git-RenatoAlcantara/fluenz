import { Button } from "@/components/ui/button";
import { ICard, ICollection, IDecks, IReasonProps } from "@/lib/type";
import { motion } from "framer-motion";
import { Pencil, Volume1 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { EditCardModal } from "./edit-card-modal";

export const FlipCard = ({
    decks,
    setMovieAnimation,
    setCardPosition,
    cardPosition,
    setReasonLabel,
  }:{
    decks?: IDecks[];
    setMovieAnimation: () => void;
    setCardPosition: () => void;
    cardPosition: number;
    setReasonLabel: (reason: IReasonProps) => void
  }) => {
    const [flipped, setFlipped] = useState(false);
    const [currenDeck, setCurrentDeck] = useState<ICard>()
    const audioRef = useRef<HTMLAudioElement>(null);
    
    const flipAnimation = {
      hidden: { rotateX: 0 },
      visible: { rotateX: 180 },
    };
  
    useEffect(() => {
      if(decks){
        console.log(decks[cardPosition]) 
        setCurrentDeck(decks[cardPosition])
      }
    }, [decks])
  
    useEffect(() => {
      if(audioRef.current){
        const playPromise = audioRef.current.play();

        // Verifica se a reprodução precisa ser tratada com uma Promise
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Áudio reproduzido automaticamente.");
            })
            .catch((error) => {
              console.warn("Reprodução automática falhou:", error);
            });
        }
      }
    }, [])


    const handleEditCard = (name: string, value: string) => {
     if(decks && decks[cardPosition]){
      setCurrentDeck( ({  ...decks[cardPosition], [name]: value }))
     }
    }


    const handleAudioPlay = () => {
      if(audioRef.current){
        audioRef.current.play()
      }
    }
    return (
      <>
      <motion.div 
      onClick={() => setFlipped(!flipped)}
        initial="hidden"
        animate={flipped ? 'visible' : 'hidden'}
        variants={flipAnimation}
        transition={{ duration: 0.2}}
        style={{ transformStyle: 'preserve-3d'}}
  
        className=" w-1/2 h-[380px] cursor-pointer relative rounded-xl  bg-purple-900"
    >   
        {currenDeck ? (
          <>
          <div
            className="absolute text-center backface-hidden text-3xl h-full w-full flex justify-items-center items-center justify-center"
          >
            <button>
            <Volume1 onClick={handleAudioPlay}   color="white" className="absolute top-2 right-2 hover:scale-105"/>
            </button>
            <audio ref={audioRef} src={`${String(currenDeck.front).toLowerCase()}.mp3`} autoPlay/>
            <span className="text-white">{currenDeck?.front}</span>
          </div>
          <div 
            style={{ transform: 'rotateX(180deg)' }}
            className="absolute text-center h-full w-full backface-hidden text-3xl flex justify-items-center items-center justify-center"
          >
            <span className="text-white ">{currenDeck?.back}</span>
          </div>
          </>
        ): (
          <div
            className="absolute text-center backface-hidden text-4xl h-full w-full flex justify-items-center items-center justify-center"
          >
            <span className="text-white">FIM!</span>
          </div>
        )}
    </motion.div>
    <div className="w-full flex justify-center gap-4 py-4">
      <Button
        onClick={() => {
          setMovieAnimation()
          setCardPosition()
          setReasonLabel({ sei: true, naoSei: false})
        }}
        variant={"ghost"} className="text-green-500 ring-1 rounded-lg"
      >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="size-8">
        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
  
      </Button>
      <Button 
        onClick={() => {
          setMovieAnimation()
          setCardPosition()
          setReasonLabel({ sei: false, naoSei: true})
        }}
        variant={"ghost"} className="text-red-500 ring-1 rounded-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </Button>
      <EditCardModal handleEditCard={handleEditCard} card={currenDeck} saveCardEdited={() => {}}/>
    </div>
  </>
    );
  };

  