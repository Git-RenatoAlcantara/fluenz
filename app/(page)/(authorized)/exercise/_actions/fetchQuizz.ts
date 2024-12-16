'use server'
import { getSession } from "@/lib/session";
import db from "@/prisma/prisma"
import { Prisma, User } from "@prisma/client";

type quizzOption = {
    id: number | null;
    quizzId: number | null;
    opt: string | null;
    isCorrect: boolean | null;
    isSelected: boolean | null;
}[];

export async function fetchQuizz(){

    try {
        const session = await getSession()

        if(!session?.userId){
            return {
                success: false,
            }
        }

        const user  = await db.user.findUnique({
            where: {
                id: parseInt(session.userId)
            },
            include: {
                quizz: {
                    include: { 
                        quizzOption: true
                    }
                }
            }
        })

        if(!user){
            return {
                success: false,
                quizz: []
            }
        }
        
        const {quizz} = user;

       return {
           success: true,
            quizz: quizz.map((q: { id: number; question: string; type: string; answer: string | null; quizzOption: quizzOption | [] }) => ({
                id: q.id,
                type: q.type,
                question: q.question,
                answer: q?.answer,
                quizzOption: q.quizzOption
            }))
       }

    } catch (err) {
        console.log(err)
        if (err instanceof Prisma.PrismaClientValidationError) {
            console.log(err)
            return {
                erros: err.message
            }
        }
    }
}