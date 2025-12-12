'use server'

import { unstable_noStore as noStore } from 'next/cache'
import { getSession } from "@/lib/session"
import prisma from "@/prisma/prisma"
import { getXPMultiplier } from "./shop"
import { updateSkillTree } from "./skillTree"
import { updateGuildProgress } from "./guild"

// Tabela de Títulos RPG
const TITLES = [
  { minLevel: 1, maxLevel: 4, title: "Novice Listener", description: "O início da jornada" },
  { minLevel: 5, maxLevel: 9, title: "Apprentice Scribe", description: "Começando a entender os símbolos" },
  { minLevel: 10, maxLevel: 19, title: "Word Ranger", description: "Explora novos vocabulários" },
  { minLevel: 20, maxLevel: 39, title: "Grammar Knight", description: "Defensor da estrutura correta" },
  { minLevel: 40, maxLevel: 59, title: "Syntax Sorcerer", description: "Manipula frases complexas" },
  { minLevel: 60, maxLevel: 99, title: "Linguistics Archmage", description: "Mestre fluente das artes" },
  { minLevel: 100, maxLevel: 999, title: "Language God", description: "Lenda viva" },
]

const getTitle = (level: number) => {
  const titleData = TITLES.find(t => level >= t.minLevel && level <= t.maxLevel)
  return titleData || TITLES[0]
}

const calculateLevel = (xp: number) => {
  return Math.floor(Math.sqrt(xp) * 0.1) + 1
}

const getStreakMultiplier = (streak: number) => {
  if (streak >= 30) return 1.5
  if (streak >= 7) return 1.2
  return 1.0
}

export async function getUserProfile() {
  noStore()
  
  const session = await getSession()
  const userId = session.userId
  
  if (!userId) {
    throw new Error("Usuário não autenticado")
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    select: {
      id: true,
      xp: true,
      level: true,
      streak: true,
      lastStudyDate: true,
      manaDaily: true,
      gems: true,
      currentTitle: true,
      streakMultiplier: true,
      badges: true,
      activeEffects: true
    }
  })

  if (!user) {
    return { 
      id: 0,
      xp: 0, 
      level: 1, 
      streak: 0, 
      lastStudyDate: null,
      manaDaily: 0,
      gems: 0,
      currentTitle: "Novice Listener",
      streakMultiplier: 1.0,
      badges: [],
      activeEffects: null
    }
  }

  // Verificar se precisa resetar mana diária
  const getDateKey = (d: Date) => {
    const year = d.getFullYear()
    const month = `${d.getMonth() + 1}`.padStart(2, '0')
    const day = `${d.getDate()}`.padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const todayKey = getDateKey(new Date())
  const isNewDay = user.lastStudyDate !== todayKey
  
  // Se é um novo dia, resetar manaDaily no banco
  let currentMana = user.manaDaily
  if (isNewDay && user.manaDaily > 0) {
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { manaDaily: 0 }
    })
    currentMana = 0
  }

  const titleData = getTitle(user.level)

  return JSON.parse(JSON.stringify({
    ...user,
    manaDaily: currentMana,
    titleDescription: titleData.description,
    maxMana: 40, // Meta diária de 40 minutos
    manaPercentage: Math.min((currentMana / 40) * 100, 100)
  }))
}

export async function updateUserProgress(videoDuration: number, videoId?: number) {
  noStore()
  
  const session = await getSession()
  const userId = session.userId
  
  if (!userId) {
    throw new Error("Usuário não autenticado")
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) }
  })

  if (!user) throw new Error("Usuário não encontrado")

  // Usa uma chave de data sem timezone (YYYY-MM-DD) para evitar problemas de fuso
  const getDateKey = (d: Date) => {
    const year = d.getFullYear()
    const month = `${d.getMonth() + 1}`.padStart(2, '0')
    const day = `${d.getDate()}`.padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const todayKey = getDateKey(new Date())
  const isNewDay = user.lastStudyDate !== todayKey

  // Reset Mana Daily se for novo dia
  let manaDaily = isNewDay ? 0 : user.manaDaily
  manaDaily += videoDuration

  // Calcular Streak
  let newStreak = user.streak

  if (isNewDay) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayKey = getDateKey(yesterday)
    if (user.lastStudyDate === yesterdayKey) {
      newStreak += 1
    } else if (!user.lastStudyDate) {
      newStreak = 1
    } else {
      // Se não é ontem, reinicia streak
      newStreak = 1
    }
  }

  // Multiplicador de Streak
  const streakMultiplier = getStreakMultiplier(newStreak)

  // Multiplicador da Potion of Clarity
  const itemMultiplier = await getXPMultiplier()

  // Calcular XP com multiplicadores
  const baseXP = videoDuration * 10 // 10 XP por minuto
  const xpGain = Math.floor(baseXP * streakMultiplier * itemMultiplier)
  const newXp = user.xp + xpGain

  // Atualizar Skill Tree se videoId foi fornecido
  let skillTreeUpdate = null
  if (videoId) {
    skillTreeUpdate = await updateSkillTree(videoId, videoDuration)
  }

  // Calcular Nível
  const newLevel = calculateLevel(newXp)
  const leveledUp = newLevel > user.level

  // Determinar Título
  const titleData = getTitle(newLevel)

  // Verificar Daily Quest Complete (40 minutos)
  let bonusGems = 0
  let dailyQuestBonus = 0
  const newBadges = [...user.badges]

  if (manaDaily >= 40 && user.manaDaily < 40) {
    dailyQuestBonus = 100
    bonusGems = 1
    
    // Badge: Daily Quest Master
    if (!newBadges.includes('daily_quest_master')) {
      newBadges.push('daily_quest_master')
    }

    // Check time for badges
    const hour = new Date().getHours()
    if (hour < 9 && !newBadges.includes('early_bird')) {
      newBadges.push('early_bird')
    }
    if (hour >= 22 && !newBadges.includes('night_owl')) {
      newBadges.push('night_owl')
    }
  }

  // Badge: First Blood
  if (user.xp === 0 && !newBadges.includes('first_blood')) {
    newBadges.push('first_blood')
  }

  // Badge: Week Warrior (7 day streak)
  if (newStreak >= 7 && !newBadges.includes('week_warrior')) {
    newBadges.push('week_warrior')
  }

  // Badge: Month Legend (30 day streak)
  if (newStreak >= 30 && !newBadges.includes('month_legend')) {
    newBadges.push('month_legend')
  }

  // Atualizar usuário
  await prisma.user.update({
    where: { id: parseInt(userId) },
    data: {
      xp: newXp + dailyQuestBonus,
      level: newLevel,
      streak: newStreak,
      lastStudyDate: todayKey,
      manaDaily: manaDaily, // Sem limite - pode acumular além de 40 min
      gems: user.gems + bonusGems,
      currentTitle: titleData.title,
      streakMultiplier: streakMultiplier,
      badges: newBadges
    }
  })

  // Atualizar progresso da guilda se usuário estiver em uma
  const guildReward = await updateGuildProgress(videoDuration)

  // Verificar se atingiu nível de Boss Battle (múltiplo de 5)
  const shouldTriggerBoss = leveledUp && newLevel % 5 === 0

  return { 
    xp: newXp + dailyQuestBonus, 
    level: newLevel, 
    streak: newStreak, 
    xpGain,
    leveledUp,
    newTitle: titleData.title,
    dailyQuestComplete: manaDaily >= 40,
    bonusGems,
    newBadges: newBadges.filter(b => !user.badges.includes(b)),
    skillTreeUpdate,
    itemMultiplier,
    shouldTriggerBoss,
    guildReward
  }
}
