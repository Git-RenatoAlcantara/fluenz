import { Input } from "@/components/ui/input";
import { IQField } from "@/lib/type"
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function FieldQuizz({
    quizz,
    showAnswer,
    setAnswerInput,
    answerInput
}: {
    quizz: IQField;
    showAnswer: boolean;
    setAnswerInput: Dispatch<SetStateAction<string>>
    answerInput: string
}) {
    const [currentQuizz, setCurrentQuizz] = useState<IQField>();

 
    useEffect(() => {
        console.log(quizz)
        setCurrentQuizz(quizz);
    }, [quizz])
        

        
    const insertInput = (quizz: any) => {
        return quizz.question.split(' ').map((item: string, index: number) => {
            if (item === quizz.answer) {
                return <Input  onChange={(event) => setAnswerInput(event.target.value)} className={cn(
                    "focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0",
                   ( showAnswer && answerInput && answerInput.trim() !== String(currentQuizz!.answer).trim()) && "ring-offset-1 ring-1 ring-red-500" ,
                   ( showAnswer && answerInput && answerInput.trim() === String(currentQuizz!.answer).trim()) && "ring-offset-1 ring-1 ring-green-500"
                )} key={index} />;
            } else {
                return <span key={index} className="space-x-2">{item}</span>;
            }
        });
    };
    
    
    return (
        <>
         {currentQuizz && (
            <div className="flex flex-col gap-4">
                <div className="flex items-center w-full space-x-3 text-xl">
                    {insertInput(quizz)}
                </div>
                {showAnswer && (
                    <div className="flex gap-2">
                        <span className="text-lg font-semibold">Resposta: </span>
                        { currentQuizz.answer}
                    </div>
                )}
                
            </div>
         )}
        </>
    )
}