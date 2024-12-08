'use server'
import { getSession } from "@/lib/session"
import db from "@/prisma/prisma"
import { Prisma } from "@prisma/client";
import * as z from "zod"

const cardSchema = z.object({
    front: z.string(),
    back: z.string()
})

export async function saveCard(data: FormData){
    const result = cardSchema.safeParse(Object.fromEntries(data));

    if(!result.success){
        return {
            success: false,
            erros: result.error.flatten().fieldErrors
        }
    }
    
    const session = await getSession();

    if(!session?.userId){
        return {
            success: false,
        }
    }

    try {

        await db.flashcard.create({
            data: {
                front: result.data.front,
                back: result.data.back,
                user: {
                    connect: {
                        id: parseInt(session.userId)
                    }
                }
            }
        })

        return {
            success: true
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