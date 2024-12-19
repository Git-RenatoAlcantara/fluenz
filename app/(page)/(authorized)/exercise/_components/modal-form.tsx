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
import { useQuizForm } from '../useQuizForm'
import { IQChoice, IQField } from '@/lib/type'
import { QuizOptions } from './QuizOptions'
import { on } from 'events'


const isEmpty = (w: string) => {
  return w === "" || !w.length || w === undefined || w === null || w === typeof undefined || w === typeof null
}

export default function ModalForm() {

  const { quizz, quizzQuestion, quizType, setQuizType,  handleSubmit ,setQuizzQuestion, setQuizz, deleteOption ,errorMessage, saveMutation } = useQuizForm()

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


  const debounced = debounce((query: string) => {
    setQuizzQuestion(query)
    setQuizz((prevState) => ({
      ...prevState,
      question: query
    }))
  }, 50)

  

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
            <Select 
              defaultValue='multiple' 
              name='selectedQuizzType' 
              onValueChange={(value) => setQuizType(value)}>
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
                <QuizOptions 
                  quizz={quizz as IQChoice}
                  onOptionChange={handleInputChange}
                  onSelectAnswer={selectAnswer}
                  onDeleteOption={deleteOption}
                  errorMessage={errorMessage}
                />
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

