'use server'
import db from "@/prisma/prisma"
import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function deleteVideo(videoId: number){

    try {
        // Buscar o vídeo antes de deletar para obter a URL
        const video = await db.video.findUnique({
            where: {
                id: videoId
            }
        })

        if (!video) {
            throw new Error('Vídeo não encontrado')
        }

        // Se for um vídeo local, deletar o arquivo
        if (video.type === 'local' && video.url.startsWith('/api/videos/')) {
            const filename = video.url.replace('/api/videos/', '')
            const filepath = join(process.cwd(), 'uploads', 'videos', filename)
            
            if (existsSync(filepath)) {
                await unlink(filepath)
                console.log('Arquivo de vídeo deletado:', filepath)
            }
        }

        // Deletar do banco de dados
        await db.video.delete({
            where: {
                id: videoId
            }
        })

        return { success: true, message: 'Vídeo deletado com sucesso' }

    } catch (error) {
        console.log('Erro ao deletar vídeo:', error)
        throw error
    }
}