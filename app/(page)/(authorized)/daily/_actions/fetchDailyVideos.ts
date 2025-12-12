'use server'

import { unstable_noStore as noStore } from 'next/cache'
import { getSession } from "@/lib/session"
import prisma from "@/prisma/prisma"

const TARGET_DURATION = 40 * 60 // 40 minutos em segundos

export async function fetchDailyVideos() {
  noStore()
  
  const session = await getSession()
  const userId = session.userId
  
  if (!userId) {
    throw new Error("Usuário não autenticado")
  }

  // Busca vídeos não assistidos com duração definida
  const unwatchedVideos = await prisma.video.findMany({
    where: {
      userId: parseInt(userId),
      last_view_at: null,
      duration: { not: null }
    },
    orderBy: {
      createdAt: 'asc'
    },
    include: {
      playlist: true
    }
  })

  // Seleciona vídeos até completar aproximadamente 40 minutos
  const selectedVideos = []
  let totalDuration = 0

  for (const video of unwatchedVideos) {
    if (totalDuration >= TARGET_DURATION) break
    
    if (video.duration) {
      selectedVideos.push(video)
      totalDuration += video.duration
    }
  }

  return {
    videos: selectedVideos,
    totalDuration,
    targetDuration: TARGET_DURATION
  }
}

export async function getAllUnwatchedVideos() {
  noStore()
  
  const session = await getSession()
  const userId = session.userId
  
  if (!userId) {
    throw new Error("Usuário não autenticado")
  }

  const videos = await prisma.video.findMany({
    where: {
      userId: parseInt(userId),
      last_view_at: null
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      playlist: true
    }
  })

  return videos
}
