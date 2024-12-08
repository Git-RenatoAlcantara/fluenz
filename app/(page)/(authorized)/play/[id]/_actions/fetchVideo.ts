'use server'
import db from "@/prisma/prisma"


export  async function fetchVideo(
    data: { id: number }
){

    const result = await db.video.findUnique({
        where: {
            id: data.id
        }
    })

    return {
        result,
    }
}