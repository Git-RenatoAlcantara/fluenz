'use server'

import db from "@/prisma/prisma"
import { getSession } from "@/lib/session"

export async function updateWatchTime(watchedSeconds: number) {
  const session = await getSession()
  
  if (!session?.userId) {
    return { success: false, error: 'Não autenticado' }
  }

  const userId = parseInt(session.userId)
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  try {
    // Buscar ou criar registro do dia
    const dailyStats = await db.dailyStats.upsert({
      where: {
        userId_date: {
          userId,
          date: today
        }
      },
      update: {
        totalWatchTime: {
          increment: Math.floor(watchedSeconds)
        }
      },
      create: {
        userId,
        date: today,
        totalWatchTime: Math.floor(watchedSeconds),
        videosWatched: 0
      }
    })

    return { success: true, dailyStats }
  } catch (error) {
    console.error('Erro ao atualizar tempo assistido:', error)
    return { success: false, error: 'Erro ao salvar' }
  }
}

export async function getTodayStats() {
  const session = await getSession()
  
  if (!session?.userId) {
    return null
  }

  const userId = parseInt(session.userId)
  const today = new Date().toISOString().split('T')[0]

  const stats = await db.dailyStats.findUnique({
    where: {
      userId_date: {
        userId,
        date: today
      }
    }
  })

  return stats
}
