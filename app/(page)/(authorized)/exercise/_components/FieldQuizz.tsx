import { Input } from "@/components/ui/input";
import { IQField } from "@/lib/type"
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function FieldQuizz({
    quizz
}: {
    quizz: IQField
}) {
    const [answerInput, setAnswerInput] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);
    const [currentQuizz, setCurrentQuizz] = useState<IQField>();

    useEffect(() => {
        setCurrentQuizz(quizz);
    }, [quizz])
        

        
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
                        { quizz.answer}
                    </div>
                )}
            </div>
         )}
        </>
    )
}