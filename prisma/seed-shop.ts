import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'

config({ path: '.env.local' })

const prisma = new PrismaClient()

async function seedShopItems() {
  console.log('🛒 Populando itens da loja...')

  const items = [
    // Poções
    {
      name: "Potion of Clarity",
      description: "Dobra o XP ganho pelos próximos 30 minutos. Ideal para sessões intensas.",
      type: "potion",
      cost: 5,
      effectType: "xp_boost",
      effectValue: 2.0,
      duration: 30,
      icon: "🧪"
    },
    {
      name: "Cryo Crystal",
      description: "Protege o seu Streak se você deixar de estudar por um dia. Consumo automático.",
      type: "potion",
      cost: 10,
      effectType: "streak_freeze",
      effectValue: 1.0,
      duration: null,
      icon: "❄️"
    },
    {
      name: "Quest Reroll Scroll",
      description: "Substitui uma missão diária difícil por outra aleatória.",
      type: "potion",
      cost: 2,
      effectType: "quest_reroll",
      effectValue: 1.0,
      duration: null,
      icon: "📜"
    },
    {
      name: "Elixir of Focus",
      description: "Aumenta o XP em 50% pelos próximos 60 minutos.",
      type: "potion",
      cost: 8,
      effectType: "xp_boost",
      effectValue: 1.5,
      duration: 60,
      icon: "⚗️"
    },
    // Cosméticos
    {
      name: "Dark Necromancer",
      description: "Tema de interface sombrio com detalhes em roxo e verde necrótico.",
      type: "cosmetic",
      cost: 50,
      effectType: "theme",
      effectValue: null,
      duration: null,
      icon: "🎨"
    },
    {
      name: "High Elf Gold",
      description: "Tema de interface elegante com detalhes dourados e brancos.",
      type: "cosmetic",
      cost: 50,
      effectType: "theme",
      effectValue: null,
      duration: null,
      icon: "✨"
    },
    {
      name: "Neon Frame",
      description: "Borda animada brilhante para o seu avatar de perfil.",
      type: "cosmetic",
      cost: 30,
      effectType: "frame",
      effectValue: null,
      duration: null,
      icon: "🖼️"
    },
    {
      name: "Mystic Aura",
      description: "Borda roxa com efeito de partículas mágicas ao redor do avatar.",
      type: "cosmetic",
      cost: 35,
      effectType: "frame",
      effectValue: null,
      duration: null,
      icon: "🔮"
    },
    // Artefatos
    {
      name: "Pena da Sabedoria",
      description: "+5% de XP permanente em vídeos de Gramática. Um artefato lendário.",
      type: "artifact",
      cost: 100,
      effectType: "artifact",
      effectValue: 1.05,
      duration: null,
      icon: "🪶"
    },
    {
      name: "Orbe do Conhecimento",
      description: "+10% de XP permanente em todos os vídeos assistidos.",
      type: "artifact",
      cost: 200,
      effectType: "artifact",
      effectValue: 1.10,
      duration: null,
      icon: "🔮"
    },
    {
      name: "Cristal da Persistência",
      description: "Dobra o multiplicador de streak. Quanto maior o streak, maior o bônus!",
      type: "artifact",
      cost: 150,
      effectType: "artifact",
      effectValue: 2.0,
      duration: null,
      icon: "💎"
    }
  ]

  for (const item of items) {
    try {
      await prisma.item.upsert({
        where: { name: item.name },
        update: item,
        create: item
      })
      console.log(`✓ ${item.name}`)
    } catch (error) {
      console.error(`✗ Erro ao criar ${item.name}:`, error)
    }
  }

  console.log('✅ Loja populada com sucesso!')
}

async function main() {
  try {
    await seedShopItems()
  } catch (error) {
    console.error('Erro ao popular banco de dados:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
