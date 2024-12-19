'use server'
import { getSession } from "@/lib/session"
import { randomBetween } from "@/lib/utils";
import db from "@/prisma/prisma"
import { add } from "date-fns";
import { connect } from "http2";

interface ISession {
    userId: string | undefined;
    expiresAt: string | undefined;
}
export async function reviewUpdateAction(quizzId: number){

    try {
        
        const daysRandom = randomBetween(1,10)

        const now = new Date()
        const reviewAt = add(now, {days: daysRandom})
        //  reviewAt: 2024-12-16T20:52:23.670Z,
        const session = await getSession();

        if(!session?.userId){
            return {
                success: false,
            }
        }

        const updated = await db.quizz.update({
            where: {
                id: quizzId
            },
            data: {
                reviewAt
            }
        })

        console.log(updated)
        return {
            success: true
        }
    } catch (err) {
        console.error(err)
        return {
            success: false
        }
    }
}   