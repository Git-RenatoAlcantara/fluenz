import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'

config({ path: '.env.local' })

const prisma = new PrismaClient()

async function simulateWatchVideo() {
  console.log('🎬 Simulando assistir vídeo completo\n')

  const user = await prisma.user.findFirst()
  
  if (!user) {
    console.log('❌ Nenhum usuário encontrado')
    return
  }

  console.log('👤 Usuário:', user.name || user.email)
  console.log('📊 Estado ANTES:')
  console.log('  📅 lastStudyDate:', user.lastStudyDate)
  console.log('  ⚡ manaDaily:', user.manaDaily)
  console.log('  ✨ XP:', user.xp)
  console.log('  🔥 Streak:', user.streak)

  // Simular duração do vídeo (em minutos)
  const videoDuration = 5

  const getDateKey = (d: Date) => {
    const year = d.getFullYear()
    const month = `${d.getMonth() + 1}`.padStart(2, '0')
    const day = `${d.getDate()}`.padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const todayKey = getDateKey(new Date())
  const isNewDay = user.lastStudyDate !== todayKey

  console.log('\n🔍 Análise:')
  console.log('  Hoje:', todayKey)
  console.log('  É novo dia?', isNewDay ? '✅ SIM' : '❌ NÃO')

  let manaDaily = isNewDay ? 0 : user.manaDaily
  manaDaily += videoDuration

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
      newStreak = 1
    }
  }

  const baseXP = videoDuration * 10
  const streakMultiplier = newStreak >= 30 ? 1.5 : newStreak >= 7 ? 1.2 : 1.0
  const xpGain = Math.floor(baseXP * streakMultiplier)
  const newXp = user.xp + xpGain

  console.log('\n📈 Cálculos:')
  console.log('  Duração do vídeo:', videoDuration, 'min')
  console.log('  Mana atual:', user.manaDaily)
  console.log('  Nova mana:', manaDaily, `(${isNewDay ? 'resetou e' : ''} +${videoDuration})`)
  console.log('  XP ganho:', xpGain, '(base:', baseXP, 'x', streakMultiplier, ')')
  console.log('  Novo XP:', newXp)
  console.log('  Streak:', user.streak, '→', newStreak)

  console.log('\n✅ Se você assistir um vídeo de', videoDuration, 'min agora:')
  console.log('  ⚡ manaDaily:', user.manaDaily, '→', manaDaily)
  console.log('  ✨ XP:', user.xp, '→', newXp)
  console.log('  🔥 Streak:', user.streak, '→', newStreak)
  console.log('  📅 lastStudyDate: será atualizado para', todayKey)
}

simulateWatchVideo()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
