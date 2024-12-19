'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createElement, useEffect, useRef, useState } from "react"
import { v4 as uuid } from "uuid"
import { fetchQuizz } from "../_actions/fetchQuizz"
import { Quizz } from "@prisma/client"
import Spinner from "@/components/global/loader/spinner"
import { reviewUpdateAction } from "../_actions/reviewUpdateAction"
import { IQField } from "@/lib/type"
import { MultipleQuizz } from "./MultipleQuizz"
import { FieldQuizz } from "./FieldQuizz"
import { quizz } from "../Quizz"

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
    const [currentPositionQuizz, setCurrentPositionQuizz] = useState(0);
    const [answerInput, setAnswerInput] = useState('');
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playSound, setPlaySound] = useState('');

    const { data, isPending, isSuccess, isLoading, isRefetching } = useQuery({
        queryKey: ["quizz"],
        queryFn: () => fetchQuizz()
    })

    const updateMutation = useMutation({
        mutationFn: reviewUpdateAction,
        onSuccess: () => {

        }
    })

    useEffect(() => {
        if(!data) return
        const quizz: IQChoice[] = data!.quizz as IQChoice[]
        setInitialState(quizz);
    }, [data])
    
    const insertInput = (quizz: any) => {
        return quizz.question.split(' ').map((item: string, index: number) => {
            console.log(item, quizz.answer)
            if (item === quizz.answer) {
                return <Input  onChange={(event) => setAnswerInput(event.target.value)} className={cn(
                    "focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0",
                   ( showAnswer && answerInput && answerInput.trim() !== quizz.answer) && "ring-offset-1 ring-1 ring-red-500" ,
                   ( showAnswer && answerInput && answerInput.trim() === quizz.answer) && "ring-offset-1 ring-1 ring-green-500"
                )} key={index} />;
            } else {
                return <span key={index} className="space-x-2">{item}</span>;
            }
        });
    };
    
   
    const handleSelectedOption = (id: number, optionId: number) => {
            console.log("keys: ",id, optionId)
            if(audioRef.current){
                setPlaySound('/effects/tap-sound.wav')
                audioRef.current.play()
            }
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
            if(initialState){
                updateMutation.mutateAsync(initialState[currentPositionQuizz].id)
                setCurrentPositionQuizz(currentPositionQuizz + 1)
                setShowAnswer(false)
            }
        }
    }

    
    const quizComponents: Record<string, React.ComponentType<any>> = {
        multiple: MultipleQuizz,
        field: FieldQuizz,
        // Adicione outros tipos de quiz aqui
      };
      

    if(isPending || isLoading || isRefetching) return <div className="h-[calc(100%-50px)] flex justify-center items-center"><Spinner /></div>

    return (
    <div className="w-full h-full flex justify-center ">
        <div className="w-1/2 mt-24 space-y-4">
        <audio ref={audioRef} src={playSound}/>
            {(initialState && initialState.length && initialState[currentPositionQuizz]) && (
                <>
                {initialState[currentPositionQuizz] && (() => {
                    const QuizComponent = quizComponents[initialState[currentPositionQuizz].type];
                    return QuizComponent ? (
                        <QuizComponent
                            key={initialState[currentPositionQuizz].id}
                            quizz={initialState[currentPositionQuizz]}
                            quizzPosition={currentPositionQuizz}
                        />
                    ) : (
                        <div>Tipo de quiz desconhecido: {initialState[currentPositionQuizz].type}</div>
                    );
                })()}
                {showAnswer ? (
                    <Button  onClick={checkCorrectAnswer} className={cn(
                        "uppercase bg-blue-500/25 border-blue-500/20 hover:bg-blue-500/20 text-white hover:border-b-0 w-full border-b-4 bo outline-none",
                        (showAnswer && initialState[currentPositionQuizz].answer !== answerInput.trim()  ) && "bg-red-500/25 border-red-500/20 hover:bg-red-500/20 animate-pulse",                    )}>
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