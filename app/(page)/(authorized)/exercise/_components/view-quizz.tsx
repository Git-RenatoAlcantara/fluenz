'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { v4 as uuid } from "uuid"
import { fetchQuizz } from "../_actions/fetchQuizz"
import { Quizz } from "@prisma/client"
import Spinner from "@/components/global/loader/spinner"


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
  
export const ViewQuizz = () => {
    const [showAnswer, setShowAnswer] = useState(false)
    const [initialState, setInitialState] = useState<IQChoice[]>();
    const [currentQuizz, setCurrentQuizz] = useState(0);
    const { data, isPending, isSuccess, isLoading, isRefetching } = useQuery({
        queryKey: ["quizz"],
        queryFn: () => fetchQuizz()
    })

    useEffect(() => {
        if(!data) return
        const quizz: IQChoice[] = data!.quizz as IQChoice[]
        setInitialState(quizz);
    }, [data])
    
    const insertInput = (question: string) => {
        return question.split(' ').map((item, index) => {
            if (item === "@") {
                return <Input className="w-24 text-center focus:outline-none focus-visible:outline-none focus:border-none mx-2" key={index} />;
            } else {
                return <span key={index} className="px-1">{item}</span>;
            }
        });
    };
    
   
    const handleSelectedOption = (id: number, optionId: number) => {
            console.log("keys: ",id, optionId)
            setInitialState((prevState) => {
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
    

    const checkCorrectAnswer = () => {
        if(!showAnswer){
            setShowAnswer(true)
        }else{
            setCurrentQuizz(currentQuizz + 1)
            setShowAnswer(false)
        }
    }

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

    const renderInput = (question: string) => {
        if(question){
            return (
                <div className="flex flex-col">
                    <div className="flex items-center">
                        {insertInput(question)}
                    </div>
                    {showAnswer && (
                        <div className=""><span className="text-lg font-semibold">Resposta: </span>
                        {(initialState && initialState.length) && initialState[currentQuizz].answer}
                        </div>
                    )}
                </div>
            )
        }
    }


    if(isPending || isLoading || isRefetching) return <div className="h-[calc(100%-50px)] flex justify-center items-center"><Spinner /></div>

    return (
    <div className="w-full h-full flex justify-center ">
        <div className="w-1/2 mt-24 space-y-4">
            {(initialState && initialState.length && initialState[currentQuizz]) && (
                <>
                {initialState.map((quizz, index) => {
                    if(index === currentQuizz){
                        if(initialState[currentQuizz].type === "multiple"){
                            return (
                                <>
                                <div key={quizz.id} className="space-y-4">
                                    <div className="flex gap-4 items-end">
                                        <div className="px-5 py-3 rounded-lg bg-green-500/25 border-b-4 border-green-500/25">{index + 1}</div>
                                        <span className="text-xl">{quizz.question}</span>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        { renderChoices(quizz.id,quizz.quizzOption)}
                                    </div>
                                </div>
                                </>
                            )
                        }else {
                            <div className="flex gap-4 items-end">
                                <div className="px-5 py-3 rounded-lg bg-blue-500/20">{index + 1}</div>
                                <span className="text-xl">{renderInput(quizz.question)}</span>
                            </div>
                        }
                    }
                })}
                {showAnswer ? (
                    <Button  onClick={checkCorrectAnswer} className="uppercase bg-blue-500/25 border-blue-500/20 hover:bg-blue-500/20 text-white hover:border-b-0 w-full border-b-4 bo outline-none">
                        Próximo
                    </Button>
                ) : (
                    <Button onClick={checkCorrectAnswer} className="uppercase w-full text-white hover:border-b-0 bg-green-500/25 border-green-500/20 border-b-4 outline-none">
                        Confirmar
                    </Button>
                )}
                </>
            ) || (
                <div className="flex justify-center items-center">
                    <span className="">Vazio</span>
                </div>
            )}
            
            
        </div>
    </div>
    )
    
}