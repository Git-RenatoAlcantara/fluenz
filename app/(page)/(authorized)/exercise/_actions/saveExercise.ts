'use server'
import { getSession } from "@/lib/session"
import db from "@/prisma/prisma"
import { connect } from "http2";

interface ISession {
    userId: string | undefined;
    expiresAt: string | undefined;
}
export async function saveExercise(data: any){

    try {
        console.log(data);
        const session = await getSession();

        if(!session?.userId){
            return {
                success: false,
            }
        }

        await db.quizz.create({
            data: {
                question: data.question,
                type: data.type,
                category: data.category,
                user: {
                    connect: {
                        id: parseInt(session.userId)
                    }
                },
                quizzOption: {
                    create: data.options.map((item: { opt: string; isCorrect: boolean; isSelected: boolean }) => ({
                        opt: item.opt,
                        isCorrect: item.isCorrect,
                        isSelected: item.isSelected,
                    })),
                }
            }
        })

        return {
            status: true
        }
    } catch (err) {
        console.error(err)
    }
}   