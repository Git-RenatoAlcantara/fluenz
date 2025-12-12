'use server'

import { unstable_noStore as noStore } from 'next/cache'
import { getSession } from "@/lib/session"
import prisma from "@/prisma/prisma"

export async function getVideosWithoutDuration() {
  noStore()
  
  const session = await getSession()
  const userId = session.userId
  
  if (!userId) {
    throw new Error("Usuário não autenticado")
  }

  const videos = await prisma.video.findMany({
    where: {
      userId: parseInt(userId),
      duration: null
    },
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      url: true,
      title: true,
      type: true
    }
  })

  return videos
}

export async function batchUpdateDurations(updates: Array<{ id: number, duration: number }>) {
  noStore()
  
  const session = await getSession()
  const userId = session.userId
  
  if (!userId) {
    throw new Error("Usuário não autenticado")
  }

  let updated = 0
  
  for (const update of updates) {
    try {
      // Verifica se o vídeo pertence ao usuário
      const video = await prisma.video.findFirst({
        where: {
          id: update.id,
          userId: parseInt(userId)
        }
      })

      if (video) {
        await prisma.video.update({
          where: { id: update.id },
          data: { duration: Math.round(update.duration) }
        })
        updated++
      }
    } catch (err) {
      console.error(`Erro ao atualizar vídeo ${update.id}:`, err)
    }
  }

  return { updated }
}
