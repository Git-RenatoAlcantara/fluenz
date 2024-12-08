'use server'
import { getSession } from "@/lib/session"
import db from "@/prisma/prisma"
import dayjs from "dayjs";


export  async function upadteVideoAction(
    videoId: number
){

    const session = await getSession()
    if(session.userId && videoId){
        const userId = parseInt(session.userId);
    
        await db.video.update({
            where: {
                id: videoId
            },
            data: {
                last_view_at: dayjs().format("DD-MM-YYYY")
            }
        })
    
    }

    return { success: true, message: 'Video update successfully' }
}