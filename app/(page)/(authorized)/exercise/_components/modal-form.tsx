'use client'

import { v4 as uuid } from 'uuid'
import { ChangeEvent, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveExercise } from "../_actions/saveExercise"
import { cn } from "@/lib/utils"
import debounce from 'lodash.debounce';


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { Check, Plus, Trash } from 'lucide-react'

type QChoiceOption = {
  opt: string;
  isCorrect: boolean;
  isSelected: boolean;
}
interface IQChoice {
  id: string;
  question: string;
  type: string;
  category: string;
  options: QChoiceOption[]
}

interface IQField {
  id: string;
  question: string;
  type: string;
  category: string;
  answer: string;
}


export default function ModalForm() {
  const [quizzQuestion, setQuizzQuestion] = useState("")
  const [quizType, setQuizType] = useState("multiple")
  const [errorMessage, setErrorMessage] = useState<{[x: string]: string} | null>(null)
  const [loading, setLoading] = useState(false)

  const initialQChoiceState = {
    id: uuid(),
    question: "",
    type: "multiple",
    category: "Simple Present",
    options: [
      {
        opt: "Opção 1",
        isCorrect: false,
        isSelected: false
      },
    ]
  }

  const initialQFieldState =  {
    id: uuid(),
    type: "field",
    category: "Simple Present",
    question: "Cayo goes to the College tonight (go)",
    answer: "goes"
}

  const [quizz, setQuizz] = useState<IQChoice | IQField>(
    initialQChoiceState  
  )

  useEffect(() => {
    if(quizType === "field"){
      setQuizz(initialQFieldState)
    }else{
      setQuizz(initialQChoiceState)
    }
  }, [quizType])
  
  const debounced = debounce((query:string) => {
    setQuizzQuestion(query)
    setQuizz((prevState) => {
      const cloneObj = {...prevState}
      cloneObj.question = query
      return cloneObj
    })
  }, 50); // delay function call for 500ms

  const queryClient = useQueryClient()
  const saveMutation = useMutation({
    mutationFn: saveExercise,
    onSuccess: () => {
        
        queryClient.cancelQueries({
            queryKey: ['quizz']
        });
    }
})

  
  
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
   if(formData.get('selectedQuizzType') === "multiple"){
    if(isEmpty(quizz.question)){
      setErrorMessage({ "question": "Perguna não pode ficar vazio."})
      return
    }
    let errorObject =  null
    Object.entries(quizz as IQChoice).forEach(([key, value]) => {
      
      if(Array.isArray(value)){
        if(value.length < 3){
          errorObject = {[key]: "Campo deve ter 3 opções."}
          return;
        }
        const someCorrectAnswer = value.some((opt) => opt.isCorrect === true)
        if(!someCorrectAnswer){
          errorObject = {[key]: "Campo deve ter 1 uma resposta correta."}
        }
      }
    })

    if(errorObject){
      return setErrorMessage(errorObject)
    }
  
    setErrorMessage(null)
    saveMutation.mutate(quizz)
    setQuizz(initialQChoiceState)
    setQuizzQuestion("")
   }
}

const addQuizzOption = () => {
  setQuizz((prevState: IQChoice | IQField) => {
    const cloneObj: IQChoice = {...prevState} as IQChoice;
    const total = cloneObj.options.length
    cloneObj.options = [
      ...cloneObj.options,
      {
        opt: `Opção ${total + 1}`,
        isCorrect: false,
        isSelected: false
      },
    ]
    return cloneObj
  })
}

const selectAnswer = (optionIndex: number) => {
  setQuizz((prevState: IQChoice | IQField) => {
    const cloneObj: IQChoice = { ...prevState } as IQChoice
    cloneObj.options = cloneObj.options.map((item, idx) => ({
      ...item,
      isCorrect : idx === optionIndex
    }))

    return cloneObj
  })
}

const deleteOption = (index: number) => {
  setQuizz((prevState: IQChoice | IQField) => {
    const cloneObj: IQChoice = {...prevState} as IQChoice
    cloneObj.options.splice(index, 1)
    return cloneObj
  })
}

const handleInputChange = (event: ChangeEvent<HTMLInputElement>, idx: number) => {
  const value = event.target.value;
  setQuizz((prevState: IQChoice | IQField) => {
    const cloneObj: IQChoice = {...prevState} as IQChoice
    const updateOptions = cloneObj.options.map((option, index) => 
      index === idx ? { ...option, opt: value } : option 
    )

    return {
      ...cloneObj,
      options: updateOptions
    }
  })
}

const renderOptions = () => {
  const quizzChoice: IQChoice = quizz as IQChoice;

  return (
    <div className='flex flex-col gap-2'>
    { quizzChoice?.options?.length &&
       (quizzChoice.options.map((item, index) => (
        <div className='flex gap-1'>
          <Input name='inputQuestion' value={item.opt} onChange={(event) => handleInputChange(event, index)}/>
          <Button className={cn(item.isCorrect && "bg-green-500/20")} onClick={() => selectAnswer(index)} variant={"outline"} type='button'><Check/></Button>
          <Button className="bg-red-500/20" onClick={() => deleteOption(index)} variant={"outline"} type='button'><Trash/></Button>
        </div>
      )))
    }           
    {(errorMessage && errorMessage["options"]) && <div className='font-semibold text-red-500 px-2'>{errorMessage["options"]}</div> }
    </div>
  )
}


const isEmpty = (w: string) => {
  return w === "" || !w.length || w === undefined || w === null || w === typeof undefined || w === typeof null
}

const renderSelectCorrectWord = () => {
  const quizzField: IQField = quizz as IQField
  if(!quizzQuestion.split(" ").length) return

  const words: string[] = quizzQuestion.split(" ")

  if(words && words.length > 2){
    return (
      <Select name='answer'>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Escolha a palavra a ocultar" />
        </SelectTrigger>
          <SelectContent>
                  {words.filter(w => !isEmpty(w)).map((item, index) => (
                    <SelectItem  key={item} value={item}>{item}</SelectItem>
                  ))}
        </SelectContent>
      </Select>
    )
  }

}


  return (
        <form  onSubmit={handleSubmit} className="space-y-4 mt-3">
          <div className='flex flex-col gap-2'>
            <Select defaultValue='multiple' name='selectedQuizzType' onValueChange={(value) => setQuizType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Escolha o tipo de quiz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple">Multipla escolha</SelectItem>
                <SelectItem value="field">Campo de texto</SelectItem>
              </SelectContent>
            </Select>
            <Input value={quizzQuestion} onChange={(event) => debounced(event.target.value)} placeholder='Digite sua pergunta' />
            {(errorMessage && errorMessage["question"]) && <div className='font-semibold text-red-500 px-2'>{errorMessage["question"]}</div> }
              {quizType === "multiple" && 
                <>
                {renderOptions()}
                <Button onClick={addQuizzOption} variant={"outline"} type='button'>
                  <Plus />
                </Button>
                </>
              }
           
              {
                (quizType === "field" && quizzQuestion && quizzQuestion.length > 1) && (
                  <>
                  {renderSelectCorrectWord()}
                  </>
                )
              }
            
              <Button 
                disabled={saveMutation.isPending}
                type='submit'
              >
                {saveMutation.isPending && "Carregando..."}
                {(saveMutation.isIdle || saveMutation.isSuccess) && "Salvar"}
                </Button>
          </div>
        </form>
  )
}

