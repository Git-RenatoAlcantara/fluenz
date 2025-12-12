import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'

config({ path: '.env.local' })

const prisma = new PrismaClient()

async function testManaReset() {
  console.log('🧪 Testando reset de Mana Diária\n')

  // Pegar primeiro usuário
  const user = await prisma.user.findFirst()
  
  if (!user) {
    console.log('❌ Nenhum usuário encontrado')
    return
  }

  console.log('👤 Usuário:', user.name || user.email)
  console.log('📅 lastStudyDate:', user.lastStudyDate)
  console.log('⚡ manaDaily atual:', user.manaDaily)
  console.log('🔥 streak atual:', user.streak)
  
  // Simular função getDateKey do código
  const getDateKey = (d: Date) => {
    const year = d.getFullYear()
    const month = `${d.getMonth() + 1}`.padStart(2, '0')
    const day = `${d.getDate()}`.padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const todayKey = getDateKey(new Date())
  const isNewDay = user.lastStudyDate !== todayKey

  console.log('\n📊 Análise:')
  console.log('Hoje (YYYY-MM-DD):', todayKey)
  console.log('É novo dia?', isNewDay ? '✅ SIM' : '❌ NÃO')
  
  if (isNewDay) {
    console.log('\n✨ RESET ACONTECERÁ:')
    console.log('- manaDaily será resetada para 0')
    console.log('- lastStudyDate será atualizado para:', todayKey)
    
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayKey = getDateKey(yesterday)
    
    console.log('\n🔥 Streak:')
    if (user.lastStudyDate === yesterdayKey) {
      console.log('- Último estudo foi ONTEM → streak += 1')
    } else if (!user.lastStudyDate) {
      console.log('- Primeiro estudo → streak = 1')
    } else {
      console.log('- Quebrou o streak → streak = 1')
    }
  } else {
    console.log('\n⏭️ MESMO DIA:')
    console.log('- manaDaily continuará acumulando')
    console.log('- streak permanece:', user.streak)
  }

  // Teste de ontem
  console.log('\n🧪 Teste de detecção de ontem:')
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayKey = getDateKey(yesterday)
  console.log('Ontem (YYYY-MM-DD):', yesterdayKey)
  console.log('lastStudyDate === ontem?', user.lastStudyDate === yesterdayKey ? '✅ SIM' : '❌ NÃO')
}

testManaReset()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
