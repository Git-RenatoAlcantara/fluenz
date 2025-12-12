import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'

config({ path: '.env.local' })

const prisma = new PrismaClient()

async function testGetProfile() {
  console.log('🧪 Testando getUserProfile com auto-reset\n')

  // Simular função getDateKey
  const getDateKey = (d: Date) => {
    const year = d.getFullYear()
    const month = `${d.getMonth() + 1}`.padStart(2, '0')
    const day = `${d.getDate()}`.padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const user = await prisma.user.findFirst()
  
  if (!user) {
    console.log('❌ Nenhum usuário encontrado')
    return
  }

  console.log('ANTES:')
  console.log('📅 lastStudyDate:', user.lastStudyDate)
  console.log('⚡ manaDaily:', user.manaDaily)

  const todayKey = getDateKey(new Date())
  const isNewDay = user.lastStudyDate !== todayKey
  
  console.log('\n📊 Análise:')
  console.log('Hoje:', todayKey)
  console.log('É novo dia?', isNewDay ? '✅ SIM' : '❌ NÃO')

  if (isNewDay && user.manaDaily > 0) {
    console.log('\n🔄 Executando reset...')
    await prisma.user.update({
      where: { id: user.id },
      data: { manaDaily: 0 }
    })
    console.log('✅ manaDaily resetada para 0')
  }

  const userAfter = await prisma.user.findFirst()
  console.log('\nDEPOIS:')
  console.log('📅 lastStudyDate:', userAfter?.lastStudyDate)
  console.log('⚡ manaDaily:', userAfter?.manaDaily)
}

testGetProfile()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
