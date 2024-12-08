'use server'
import db from "@/prisma/prisma"
import { Prisma } from "@prisma/client"


export async function fetchCards(){
    console.log("fetchCards")
    try {
        
        const cards = await db.flashcard.findMany()
         console.log(cards);

        return {
            success: true,
            fleshcards: cards
        }

    } catch (error) {
        console.log(error)
        if (error instanceof Prisma.PrismaClientValidationError) {
            console.log(error)
            return {
                erros: error.message
            }
        }
    }
}