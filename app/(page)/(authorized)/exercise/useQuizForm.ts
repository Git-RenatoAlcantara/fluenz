import { useState, ChangeEvent } from 'react'
import { v4 as uuid } from 'uuid'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveExercise } from './_actions/saveExercise'
import { IQChoice, IQField } from '@/lib/type'

const isEmpty = (w: string) => {
    return w === "" || !w.length || w === undefined || w === null || w === typeof undefined || w === typeof null
}

export const useQuizForm = () => {
  const [quizzQuestion, setQuizzQuestion] = useState("")
  const [quizType, setQuizType] = useState("multiple")
  const [errorMessage, setErrorMessage] = useState<{[x: string]: string} | null>(null)

  const initialQChoiceState: IQChoice = {
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

  const initialQFieldState: IQField = {
    id: uuid(),
    type: "field",
    category: "Simple Present",
    question: "Cayo goes to the College tonight (go)",
    answer: "goes"
  }

  const [quizz, setQuizz] = useState<IQChoice | IQField>(initialQChoiceState)

  const queryClient = useQueryClient()
  const saveMutation = useMutation({
    mutationFn: saveExercise,
    onSuccess: () => {
      queryClient.cancelQueries({ queryKey: ['quizz'] })
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
   }else {
    const cloneObj = { ...quizz } as IQField
    cloneObj.answer = formData.get('answer') as string
    cloneObj.type = "field"
    if(!cloneObj.question){
      setErrorMessage({ "question": "Pergunta não pode ficar vazio."})
      return
    }
    if(!cloneObj.answer){
      setErrorMessage({ "answer": "Resposta não pode ficar vazio."})
      return
    }
    setErrorMessage(null)
    saveMutation.mutate(cloneObj)
    setQuizz(initialQFieldState)
    setQuizzQuestion("")
   }
  }

  const deleteOption = (index: number) => {
    setQuizz((prevState: IQChoice | IQField) => {
      const cloneObj: IQChoice = {...prevState} as IQChoice
      cloneObj.options.splice(index, 1)
      return cloneObj
    })
  }

  // Métodos do formulário aqui...
  
  return {
    quizz,
    quizzQuestion,
    quizType,
    errorMessage,
    saveMutation,
    deleteOption,
    handleSubmit,
    setQuizType,
    setQuizzQuestion,
    setQuizz,
    // Retornar outros métodos necessários
  }
}
