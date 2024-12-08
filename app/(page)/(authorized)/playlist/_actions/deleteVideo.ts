'use server'
import db from "@/prisma/prisma"

export async function deleteVideo(videoId: number){

    try {
        await db.video.delete({
            where: {
                id: videoId
            }
        })

    } catch (error) {
        console.log(error)   
    }
}