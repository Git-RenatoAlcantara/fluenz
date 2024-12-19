'use server'
import { v4 as uuid } from "uuid";
import { ViewQuizz } from "./_components/view-quizz";
import { getSession } from "@/lib/session";

const grammar = [
    {
        id: uuid(),
        category: "Simple Present",
        label: "Do e Does"
    },
    {
        id: uuid(),
        category: "Simple Present",
        label: "Verbo To be"
    }
]
export default async  function Exercise(){
    
    return (
      <ViewQuizz />
    )
}