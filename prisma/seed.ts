import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Criar itens da loja se não existirem
  const items = [
    {
      name: 'Potion of Clarity',
      description: 'Dobra o XP ganho por 30 minutos',
      type: 'potion',
      cost: 5,
      effectType: 'xp_boost',
      effectValue: 2.0,
      duration: 30,
      icon: '🧪'
    },
    {
      name: 'Streak Freeze',
      description: 'Protege seu streak por 1 dia',
      type: 'potion',
      cost: 10,
      effectType: 'streak_freeze',
      effectValue: 1.0,
      duration: null,
      icon: '🧊'
    },
    {
      name: 'Quest Reroll Scroll',
      description: 'Redefine sua daily quest',
      type: 'potion',
      cost: 2,
      effectType: 'quest_reroll',
      effectValue: 1.0,
      duration: null,
      icon: '📜'
    },
    {
      name: 'Dark Necromancer Theme',
      description: 'Tema visual sombrio',
      type: 'cosmetic',
      cost: 20,
      effectType: null,
      effectValue: null,
      duration: null,
      icon: '🌑'
    },
    {
      name: 'High Elf Gold Theme',
      description: 'Tema visual dourado élfico',
      type: 'cosmetic',
      cost: 20,
      effectType: null,
      effectValue: null,
      duration: null,
      icon: '✨'
    },
    {
      name: 'Cyberpunk Neon Theme',
      description: 'Tema visual neon futurista',
      type: 'cosmetic',
      cost: 20,
      effectType: null,
      effectValue: null,
      duration: null,
      icon: '🌆'
    }
  ]

  for (const item of items) {
    await prisma.item.upsert({
      where: { name: item.name },
      update: {},
      create: item
    })
  }

  console.log('✅ Seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
