'use client'
import { IDecks, IReasonProps, ITag } from "@/lib/type";
import { useEffect, useState } from "react";
import { FlipCard } from "./flip-card";
import { MovieCard } from "./movie-card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCards } from "../_actions/fetchCards";
import { isToday } from "date-fns";
import dayjs from "dayjs";
export default function Decks(){


   const {isLoading, error , data} = useQuery({
    queryKey: ['cards'],
    queryFn: () => fetchCards()
   })


    const [ reasonLabel, setReasonLabel] = useState({
        sei: false,
        naoSei: false
      })
    
      const [cardPosition, setCardPosition] = useState<number>(0)
      const [movieAnimation, setMovieAnimation] = useState<boolean>(false)

    
      const handleClickMovieAnimation = () => {
        setMovieAnimation(!movieAnimation)
      }
    
      const handleClickCardPosition = () => {
        setCardPosition( cardPosition + 1)
      }
    
      const handleChangeReasonLabel = (reason: IReasonProps) => {
        setReasonLabel({
          ...reason
        });
      }

      if(isLoading) return <p>Loading...</p>
      
      
      const flashcards = data?.fleshcards || []
      const filterTodayCards = flashcards.filter(card => isToday(dayjs(card.next_review_at).toDate()))

    return (
        <div className="w-full  overflow-hidden p-5">      
            <div className="w-full flex flex-col justify-center items-center">
                    {(!movieAnimation ) && (
                        <>
                            <FlipCard 
                                setReasonLabel={handleChangeReasonLabel} 
                                setCardPosition={handleClickCardPosition} 
                                cardPosition={cardPosition} 
                                setMovieAnimation={handleClickMovieAnimation} 
                                decks={filterTodayCards} 
                            />
                        </>
                    )}

                    {movieAnimation && (
                      <MovieCard reasonLabel={reasonLabel} setMovieAnimation={handleClickMovieAnimation} />
                    )}
            </div>
        </div>
    )
}