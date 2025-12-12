'use server'

import { unstable_noStore as noStore } from 'next/cache'
import { getSession } from "@/lib/session"
import prisma from "@/prisma/prisma"

export async function updateVideoDuration(videoId: number, durationInSeconds: number) {
  noStore()
  
  const session = await getSession()
  const userId = session.userId
  
  if (!userId) {
    throw new Error("Usuário não autenticado")
  }

  // Verifica se o vídeo pertence ao usuário
  const video = await prisma.video.findFirst({
    where: {
      id: videoId,
      userId: parseInt(userId)
    }
  })

  if (!video) {
    throw new Error("Vídeo não encontrado")
  }

  // Atualiza a duração
  await prisma.video.update({
    where: { id: videoId },
    data: { duration: Math.round(durationInSeconds) }
  })

  console.log(`Updated video ${videoId} duration to ${Math.round(durationInSeconds)} seconds`)
  
  return { success: true }
}
