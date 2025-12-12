'use server'

import db from "@/prisma/prisma"
import { getSession } from "@/lib/session"
import { updateUserProgress } from "./userProgress"

/**
 * Sistema de Repetição Espaçada baseado no algoritmo SM-2 (SuperMemo 2)
 * 
 * Qualidade da revisão:
 * 5 - Perfeito (Muito fácil)
 * 4 - Correto com hesitação (Fácil)
 * 3 - Correto com dificuldade (Médio)
 * 2 - Incorreto mas lembrei (Difícil)
 * 1 - Incorreto, não lembrei (Muito difícil)
 * 0 - Blackout completo
 */

export async function reviewVideo(videoId: number, quality: number) {
  const session = await getSession()
  if (!session?.userId) {
    throw new Error('Não autenticado')
  }

  const video = await db.video.findUnique({
    where: { id: videoId }
  })

  if (!video) {
    throw new Error('Vídeo não encontrado')
  }

  // Valores iniciais
  let interval = video.repetitionInterval || 0
  let ease = video.repetitionEase || 2.5
  let reviewCount = (video.reviewCount || 0) + 1

  // Algoritmo SM-2
  if (quality >= 3) {
    // Resposta correta
    if (interval === 0 || reviewCount === 1) {
      interval = 1 // 1 dia (primeira revisão real)
    } else if (reviewCount === 2) {
      interval = 6 // 6 dias
    } else {
      interval = Math.round(interval * ease)
    }
  } else {
    // Resposta incorreta - reinicia
    reviewCount = 1
    interval = 1
  }

  // Atualizar ease factor
  ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  
  // Ease mínimo de 1.3
  if (ease < 1.3) {
    ease = 1.3
  }

  // Calcular próxima data de revisão
  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + interval)

  // Atualizar vídeo
  const updated = await db.video.update({
    where: { id: videoId },
    data: {
      repetitionInterval: interval,
      repetitionEase: ease,
      nextReviewDate: nextReview,
      reviewCount: reviewCount
    }
  })

  // Atualizar progresso do usuário (XP, mana, etc)
  // Revisões contam com a duração completa do vídeo
  if (video.duration) {
    const durationMinutes = Math.ceil(video.duration / 60)
    await updateUserProgress(durationMinutes, videoId)
  }

  return {
    success: true,
    interval,
    nextReviewDate: nextReview.toISOString(),
    message: `Próxima revisão em ${interval} dia${interval > 1 ? 's' : ''}`
  }
}

/**
 * Busca vídeos que precisam ser revisados hoje
 */
export async function getVideosForReview() {
  const session = await getSession()
  if (!session?.userId) {
    return []
  }

  const today = new Date()
  today.setHours(23, 59, 59, 999) // Fim do dia de hoje

  console.log('🔍 getVideosForReview - userId:', session.userId)
  console.log('🔍 getVideosForReview - today:', today)

  const videos = await db.video.findMany({
    where: {
      userId: parseInt(session.userId),
      last_view_at: { not: null }, // Apenas vídeos já assistidos
      nextReviewDate: { 
        not: null,
        lte: today 
      } // Vídeos com revisão agendada para hoje ou antes
    },
    orderBy: {
      nextReviewDate: 'asc'
    }
  })

  console.log('🔍 getVideosForReview - encontrados:', videos.length)
  console.log('🔍 Videos:', videos.map(v => ({ id: v.id, title: v.title, nextReviewDate: v.nextReviewDate })))

  return JSON.parse(JSON.stringify(videos))
}

/**
 * Retorna estatísticas de revisão
 */
export async function getReviewStats() {
  const session = await getSession()
  if (!session?.userId) {
    return { today: 0, tomorrow: 0, thisWeek: 0, total: 0 }
  }

  const today = new Date()
  today.setHours(23, 59, 59, 999) // Fim do dia de hoje

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0) // Início de amanhã

  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  nextWeek.setHours(23, 59, 59, 999) // Fim daqui a 7 dias

  const [todayCount, tomorrowCount, weekCount, totalWatched] = await Promise.all([
    db.video.count({
      where: {
        userId: parseInt(session.userId),
        last_view_at: { not: null },
        nextReviewDate: { 
          not: null,
          lte: today 
        } // Vídeos para revisar hoje ou antes
      }
    }),
    db.video.count({
      where: {
        userId: parseInt(session.userId),
        nextReviewDate: {
          gte: tomorrow,
          lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    }),
    db.video.count({
      where: {
        userId: parseInt(session.userId),
        nextReviewDate: {
          gt: today, // Após hoje
          lte: nextWeek // Até final da semana
        }
      }
    }),
    db.video.count({
      where: {
        userId: parseInt(session.userId),
        last_view_at: { not: null }
      }
    })
  ])

  return {
    today: todayCount,
    tomorrow: tomorrowCount,
    thisWeek: weekCount,
    total: totalWatched
  }
}
