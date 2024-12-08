'use server'
import { getSession } from "@/lib/session";
import { Video } from "@prisma/client";
import { createContext } from "react";
import db from "@/prisma/prisma"

export const VideosContext = createContext<Video[]>([]);


export async function VideosProvider({ children}: {
    children: React.ReactNode
}){
    const session = await getSession()
    let videos: Video[] | [] = [];
   if(session?.userId){
    videos = await db.video.findMany({
        where: {
          userId: parseInt(session.userId)
        }
    })
   }
  

    return (
        <VideosContext.Provider value={videos}>
            {children}
        </VideosContext.Provider>
    )
}