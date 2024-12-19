import { cn } from "@/lib/utils";
import exp from "constants";
import { useEffect, useRef, useState } from "react";



interface IQChoice {
    id: number;
    question: string;
    type: string;
    answer: string | null;
    quizzOption: {
        id: number | null;
        quizzId: number | null;
        opt: string | null;
        isCorrect: boolean | null;
        isSelected: boolean | null;
    }[];    
  }
  
  
export const MultipleQuizz = ({
    quizz,
    quizzPosition
}:{
    quizz: IQChoice
    quizzPosition: number
}) => {
    const [currentQuizz, setCurrentQuizz] = useState<IQChoice>();
    const [showAnswer, setShowAnswer] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        setCurrentQuizz(quizz);
    }, [quizz])
    
    /*
     const handleSelectedOption = (id: number, optionId: number) => {
                
                setCurrentQuizz((prevState) => {
                    // Encontrar o índice do item correspondente
                    if(!prevState) return prevState
                    
                    const findIndex = prevState.findIndex((item) => item.id === id);
                    if (findIndex === -1) return prevState; // Caso o item não seja encontrado
            
                    // Clonar o objeto para manter a imutabilidade
                    const objectClone = { ...prevState[findIndex] };
                    
                    if(objectClone.type !== "multiple") return prevState
                    
                    objectClone.quizzOption = objectClone.quizzOption.map((item, idx) => ({
                        ...item,
                        isSelected: item.id === optionId, // Marca o item selecionado
                    }));
                    
                    // Retornar um novo estado com o objeto atualizado
                    const updatedState = [...prevState];
                    updatedState[findIndex] = objectClone;
            
                    return updatedState;
                });
        
        };

    */

    /*
    const renderChoices = (cardId: number, choices: any) => {
            if(choices){
                return (
                    <>
                     {choices.map((option: any, idx: number) => {
                         return (
                             <div id={`card-${cardId}-opt-${idx}`} 
                             onClick={() => handleSelectedOption(cardId
                                , option.id)} className={cn(
                                 "p-3 text-xl hover:ring-1 cursor-pointer bg-zinc-900 rounded",
                                 option.isSelected && "ring-2 bg-blue-500/20",
                                 (option.isSelected && option.isCorrect && showAnswer) && "ring-green-500 bg-green-500/20",
                                 (option.isSelected && !option.isCorrect && showAnswer) && "ring-red-500 bg-red-500/20",
                                 (!option.isSelected && option.isCorrect && showAnswer) && "ring-green-500 bg-green-500/20"
                             )}>{option.opt}</div>
                         )
                     })}
                    </>
                 )
            }
        }

    */

    return (
    <>
        {currentQuizz && (
            <div key={currentQuizz.id} className="space-y-4">
                <div className="flex gap-4 items-end">
                    <div className="px-5 py-3 rounded-lg bg-green-500/25 border-b-4 border-green-500/25">{quizzPosition + 1}</div>
                    <span className="text-xl">{quizz.question}</span>
                </div>
                <div className="flex flex-col gap-4">
                    {/* { renderChoices(quizz.id,quizz.quizzOption)} */}
                </div>
            </div>
        )}
    </>
    )
}