'use server'
import { getSession } from "@/lib/session"
import db from "@/prisma/prisma"
import { Video } from "@prisma/client"

export async function fetchVideos(){
    const session = await getSession()
    if(session?.userId){

        const videos: Video[] = await db.video.findMany()

        return {
            success: true,
            videos
        }
    }

    return {
        success: false,
        videos: []
    }
}