'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, Trash } from 'lucide-react'
import { cn } from "@/lib/utils"
import { IQChoice} from '@/lib/type'
import { ChangeEvent } from 'react'


interface QuizOptionsProps {
  quizz: IQChoice
  onOptionChange: (event: ChangeEvent<HTMLInputElement>, idx: number) => void
  onSelectAnswer: (index: number) => void
  onDeleteOption: (index: number) => void
  errorMessage?: {[key: string]: string} | null
}

export const QuizOptions = ({
  quizz,
  onOptionChange,
  onSelectAnswer,
  onDeleteOption,
  errorMessage
}: QuizOptionsProps) => {
  return (
    <div className='flex flex-col gap-2'>
      {quizz?.options?.map((item, index) => (
        <div key={index} className='flex gap-1'>
          <Input 
            name='inputQuestion' 
            value={item.opt} 
            onChange={(event) => onOptionChange(event, index)}
          />
          <Button 
            className={cn(item.isCorrect && "bg-green-500/20")} 
            onClick={() => onSelectAnswer(index)} 
            variant="outline" 
            type='button'
          >
            <Check/>
          </Button>
          <Button 
            className="bg-red-500/20" 
            onClick={() => onDeleteOption(index)} 
            variant="outline" 
            type='button'
          >
            <Trash/>
          </Button>
        </div>
      ))}
      {errorMessage?.options && (
        <div className='font-semibold text-red-500 px-2'>
          {errorMessage.options}
        </div>
      )}
    </div>
  )
}
