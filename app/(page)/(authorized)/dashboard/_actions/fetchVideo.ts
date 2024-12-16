'use server'
import db from "@/prisma/prisma"
import { Video } from "@prisma/client"

export async function fetchVideo(data: {userId: number}){
    console.log(data)
    
    if(!data) return {
        success: false,
        video: []
    }

    if(data?.userId){
        const videos: Video[] | [] = await db.video.findMany({
            where: {
                userId: data.userId
            }
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