'use server'
import { getSession } from "@/lib/session"
import db from "@/prisma/prisma"
import dayjs from "dayjs";
import { updateUserProgress } from "@/app/(page)/(authorized)/_actions/userProgress"


export  async function upadteVideoAction(
    videoId: number
){

    const session = await getSession()
    if(session.userId && videoId){
        const userId = parseInt(session.userId);
    
        // Buscar duração do vídeo
        const video = await db.video.findUnique({
            where: { id: videoId },
            select: { duration: true, last_view_at: true }
        })

        // Se é a primeira vez assistindo, define revisão para hoje (disponível imediatamente)
        const isFirstWatch = !video?.last_view_at
        const nextReview = new Date()
        // Define para o fim do dia de hoje para aparecer imediatamente na página de revisão
        nextReview.setHours(23, 59, 59, 999)

        await db.video.update({
            where: {
                id: videoId
            },
            data: {
                last_view_at: dayjs().format("DD-MM-YYYY"),
                ...(isFirstWatch && {
                    nextReviewDate: nextReview,
                    repetitionInterval: 0, // Primeira revisão
                    repetitionEase: 2.5
                })
            }
        })

        // Atualizar progresso do usuário (XP, nível, streak)
        if (video?.duration) {
            const durationMinutes = Math.ceil(video.duration / 60)
            await updateUserProgress(durationMinutes, videoId)
        }
    
    }

    return { success: true, message: 'Video update successfully' }
}