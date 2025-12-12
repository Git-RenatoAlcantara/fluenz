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
  type: z.enum(['youtube', 'local']).default('youtube'),
  title: z.string().optional(),
  duration: z.string().optional(),
  playlistId: z.string().optional(),
  category: z.string().optional(),
})


export async function saveUserAction(formData: FormData){
    const result = urlSchema.safeParse(Object.fromEntries(formData));

    console.log('=== SAVE VIDEO DEBUG ===');
    console.log('FormData entries:', Object.fromEntries(formData));
    console.log('Validation result:', result);

    if (!result.success) {
        console.log('Validation errors:', result.error.flatten().fieldErrors);
        return {
          errors: result.error.flatten().fieldErrors,
        };
      }

    
      const session: { userId: string | undefined, expiresAt: string | undefined} = await getSession()

   try {
    console.log('Session:', session);
    console.log('Data to save:', result.data);
    
    if(session?.userId){
        const userId: number =  parseInt(session.userId)
        const { url, type, title, duration, playlistId, category } = result.data

        console.log('Creating video with:', { url, type, title, duration, playlistId, category, userId });

        const createData: any = {
            url: url,
            type: type,
            title: title || null,
            duration: duration ? parseInt(duration) : null,
            category: category || null,
            last_view_at: null,
            user: {
                connect: {
                    id: userId
                }
            }
        };

        // Adicionar playlist se fornecido
        if (playlistId) {
            createData.playlist = {
                connect: {
                    id: parseInt(playlistId)
                }
            };
        }

        const video = await db.video.create({
            data: createData
        })

        console.log('Video created:', video);
        console.log('=== END DEBUG ===');

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