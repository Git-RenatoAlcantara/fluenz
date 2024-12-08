'use server'
import { decrypt, getSession } from "@/lib/session";
import { cookies } from "next/headers";
import * as z from "zod"
import db from "@/prisma/prisma"
import { Prisma } from "@prisma/client";

const urlSchema = z.object({
  url: z.string().min(2, {
    message: "Url is empty",
  }),
})


export async function saveUserAction(formData: FormData){
    const result = urlSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
          errors: result.error.flatten().fieldErrors,
        };
      }

    
      const session: { userId: string | undefined, expiresAt: string | undefined} = await getSession()

   try {
    console.log(session, result.data)
    if(session?.userId){
        const userId: number =  parseInt(session.userId)
        const newVideoUrl = result.data.url

        await db.video.create({
            data: {
                url: newVideoUrl,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        /*
        if(userId ){
           const update = await db.user.update({
                where: {
                    id: userId
                },
                data: {
                    videos: {
                        create: {
                            url: newVideoUrl,
                        }
                    }
                }
            })
            console.log("update", update)
        }
        */

    }

    
    return { success: true, message: 'Video created successfully' }

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