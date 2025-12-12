'use server'
import { getSession } from "@/lib/session"
import db from "@/prisma/prisma"
import { Video } from "@prisma/client"
import { unstable_noStore as noStore } from 'next/cache'

export async function fetchVideos(){
    noStore() // Desabilita cache do Next.js
    
    const session = await getSession()
    if(session?.userId){
        const userId = parseInt(session.userId)
        const videos: Video[] = await db.video.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' }
        })

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