'use server'
import db from "@/prisma/prisma"

export async function resetVideoStatus(videoId: number){
    try {
        await db.video.update({
            where: {
                id: videoId
            },
            data: {
                last_view_at: null
            }
        })

        return { success: true, message: 'Status do vídeo resetado' }

    } catch (error) {
        console.log('Erro ao resetar status do vídeo:', error)
        throw error
    }
}
