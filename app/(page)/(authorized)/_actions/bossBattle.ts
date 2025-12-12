'use server'

import db from "@/prisma/prisma"
import { getSession } from "@/lib/session"

/**
 * Verifica se o usuário deve enfrentar um Boss Battle
 */
export async function checkBossBattleTrigger() {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return { shouldTrigger: false }
    }

    const user = await db.user.findUnique({
      where: { id: parseInt(session.userId) },
      select: { level: true }
    })

    if (!user) {
      return { shouldTrigger: false }
    }

    // Boss Battle a cada 5 níveis
    if (user.level % 5 === 0 && user.level > 0) {
      // Verificar se já existe uma batalha para este nível
      const existingBattle = await db.bossBattle.findFirst({
        where: {
          userId: parseInt(session.userId),
          level: user.level,
          status: { in: ['PENDING', 'VICTORY'] }
        }
      })

      if (!existingBattle) {
        return { 
          shouldTrigger: true, 
          level: user.level 
        }
      }

      // Se existe mas está PENDING, retornar que deve mostrar
      if (existingBattle?.status === 'PENDING') {
        return {
          shouldTrigger: true,
          level: user.level,
          battleId: existingBattle.id
        }
      }
    }

    return { shouldTrigger: false }
  } catch (error) {
    console.error('Erro ao verificar Boss Battle:', error)
    return { shouldTrigger: false }
  }
}

/**
 * Cria uma nova Boss Battle com perguntas geradas
 */
export async function createBossBattle(level: number) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      throw new Error('Usuário não autenticado')
    }

    // Buscar últimos 3 vídeos assistidos pelo usuário
    const recentVideos = await db.video.findMany({
      where: { 
        userId: parseInt(session.userId),
        last_view_at: { not: null }
      },
      orderBy: { updatedAt: 'desc' },
      take: 3,
      select: {
        title: true,
        category: true
      }
    })

    if (recentVideos.length === 0) {
      throw new Error('Você precisa assistir pelo menos 3 vídeos antes de enfrentar um Boss')
    }

    // Gerar perguntas (por enquanto mock, depois integrar com IA)
    const questions = generateMockQuestions(level, recentVideos)

    const battle = await db.bossBattle.create({
      data: {
        userId: parseInt(session.userId),
        level,
        status: 'PENDING',
        questions,
        attempts: 0
      }
    })

    return {
      success: true,
      battleId: battle.id,
      questions: battle.questions
    }
  } catch (error) {
    console.error('Erro ao criar Boss Battle:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

/**
 * Busca uma Boss Battle específica
 */
export async function getBossBattle(battleId: number) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return null
    }

    const battle = await db.bossBattle.findFirst({
      where: {
        id: battleId,
        userId: parseInt(session.userId)
      }
    })

    return battle ? JSON.parse(JSON.stringify(battle)) : null
  } catch (error) {
    console.error('Erro ao buscar Boss Battle:', error)
    return null
  }
}

/**
 * Submete as respostas do usuário e calcula o resultado
 */
export async function submitBossBattle(battleId: number, userAnswers: number[]) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      throw new Error('Usuário não autenticado')
    }

    const battle = await db.bossBattle.findFirst({
      where: {
        id: battleId,
        userId: parseInt(session.userId)
      }
    })

    if (!battle) {
      throw new Error('Batalha não encontrada')
    }

    if (battle.status !== 'PENDING') {
      throw new Error('Esta batalha já foi completada')
    }

    const questions = battle.questions as any[]
    
    // Calcular acertos
    let correctCount = 0
    const results = questions.map((q, idx) => {
      const isCorrect = userAnswers[idx] === q.correct
      if (isCorrect) correctCount++
      return {
        questionIndex: idx,
        userAnswer: userAnswers[idx],
        correct: q.correct,
        isCorrect
      }
    })

    // HP do Boss = 5, HP do Jogador = Mana atual
    const user = await db.user.findUnique({
      where: { id: parseInt(session.userId) },
      select: { manaDaily: true, xp: true, gems: true, level: true }
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const bossHP = 5
    const playerHP = user.manaDaily
    const damage = correctCount // Cada acerto = 1 dano no boss
    const playerDamage = (5 - correctCount) * 10 // Cada erro = -10 mana

    // Determinar vitória ou derrota
    const victory = damage >= bossHP && (playerHP - playerDamage) > 0
    const status = victory ? 'VICTORY' : 'DEFEAT'

    // Calcular recompensas se vitória
    let rewards = null
    let updatedUser = null

    if (victory) {
      const xpReward = 500
      const gemReward = battle.level >= 10 ? 3 : battle.level >= 5 ? 2 : 1
      
      rewards = {
        xp: xpReward,
        gems: gemReward,
        title: battle.level >= 10 ? 'Boss Slayer' : null
      }

      // Atualizar XP e Gems do usuário
      updatedUser = await db.user.update({
        where: { id: parseInt(session.userId) },
        data: {
          xp: { increment: xpReward },
          gems: { increment: gemReward }
        }
      })
    }

    // Atualizar batalha
    await db.bossBattle.update({
      where: { id: battleId },
      data: {
        status,
        answers: userAnswers,
        rewards: rewards ?? {},
        attempts: { increment: 1 }
      }
    })

    return {
      success: true,
      victory,
      results,
      correctCount,
      totalQuestions: questions.length,
      rewards,
      playerDamage,
      newXP: updatedUser?.xp || user.xp,
      newGems: updatedUser?.gems || user.gems
    }
  } catch (error) {
    console.error('Erro ao submeter Boss Battle:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

/**
 * Função auxiliar para gerar perguntas mock
 * TODO: Substituir por integração com OpenAI/Gemini
 */
function generateMockQuestions(level: number, videos: any[]) {
  const categories = videos.map(v => v.category).filter(Boolean)
  const mainCategory = categories[0] || 'general'

  const questionBank: Record<string, any[]> = {
    grammar: [
      {
        question: "What is the correct form of the verb?",
        questionPT: "Qual é a forma correta do verbo?",
        sentence: "She ___ to the store yesterday.",
        options: ["go", "goes", "went", "going"],
        correct: 2
      },
      {
        question: "Choose the correct preposition",
        questionPT: "Escolha a preposição correta",
        sentence: "I'm good ___ math.",
        options: ["in", "at", "on", "with"],
        correct: 1
      },
      {
        question: "Identify the correct sentence",
        questionPT: "Identifique a frase correta",
        sentence: "Which sentence is grammatically correct?",
        options: [
          "He don't like pizza",
          "He doesn't likes pizza",
          "He doesn't like pizza",
          "He not like pizza"
        ],
        correct: 2
      },
      {
        question: "Past participle form",
        questionPT: "Forma do particípio passado",
        sentence: "I have ___ this movie before.",
        options: ["see", "saw", "seen", "seeing"],
        correct: 2
      },
      {
        question: "Conditional sentence",
        questionPT: "Frase condicional",
        sentence: "If I ___ rich, I would travel the world.",
        options: ["am", "was", "were", "be"],
        correct: 2
      }
    ],
    listening: [
      {
        question: "What does 'catch up' mean?",
        questionPT: "O que significa 'catch up'?",
        sentence: "Let's catch up over coffee.",
        options: [
          "Pegar algo rapidamente",
          "Encontrar para conversar",
          "Correr atrás de alguém",
          "Pegar uma xícara"
        ],
        correct: 1
      },
      {
        question: "Informal greeting",
        questionPT: "Cumprimento informal",
        sentence: "How would you greet a friend casually?",
        options: ["Good morning, sir", "Hey, what's up?", "Greetings", "How do you do?"],
        correct: 1
      },
      {
        question: "Common response",
        questionPT: "Resposta comum",
        sentence: "'How are you?' - What's a casual response?",
        options: [
          "I am fine, thank you",
          "Pretty good, you?",
          "I am well",
          "Satisfactory"
        ],
        correct: 1
      },
      {
        question: "Slang meaning",
        questionPT: "Significado de gíria",
        sentence: "What does 'hit me up' mean?",
        options: [
          "Me bata",
          "Me ligue/chame",
          "Me acerte",
          "Vamos brigar"
        ],
        correct: 1
      },
      {
        question: "Conversation filler",
        questionPT: "Preenchedor de conversa",
        sentence: "Which is used to think while speaking?",
        options: ["Exactly", "You know", "Obviously", "Therefore"],
        correct: 1
      }
    ],
    movies: [
      {
        question: "Movie quote context",
        questionPT: "Contexto de citação de filme",
        sentence: "'I'll be back' is famously from which genre?",
        options: ["Romance", "Comedy", "Action", "Horror"],
        correct: 2
      },
      {
        question: "Cultural reference",
        questionPT: "Referência cultural",
        sentence: "In American movies, what does 'prom' mean?",
        options: [
          "Uma promessa",
          "Baile de formatura",
          "Promoção de loja",
          "Propaganda"
        ],
        correct: 1
      },
      {
        question: "Expression from cinema",
        questionPT: "Expressão do cinema",
        sentence: "'Plot twist' refers to:",
        options: [
          "Rotação de câmera",
          "Reviravolta na história",
          "Torcer algo",
          "Dança em filme"
        ],
        correct: 1
      },
      {
        question: "Film terminology",
        questionPT: "Terminologia de filme",
        sentence: "What is a 'cliffhanger'?",
        options: [
          "Pendurado em penhasco",
          "Final suspense",
          "Escalador",
          "Filme de ação"
        ],
        correct: 1
      },
      {
        question: "Character archetype",
        questionPT: "Arquétipo de personagem",
        sentence: "An 'anti-hero' is a character who:",
        options: [
          "Odeia heróis",
          "Não é totalmente bom",
          "É vilão",
          "Vem antes do herói"
        ],
        correct: 1
      }
    ],
    news: [
      {
        question: "News vocabulary",
        questionPT: "Vocabulário de notícias",
        sentence: "What does 'breaking news' mean?",
        options: [
          "Notícia quebrada",
          "Última hora",
          "Notícia antiga",
          "Notícia falsa"
        ],
        correct: 1
      },
      {
        question: "Formal expression",
        questionPT: "Expressão formal",
        sentence: "'According to sources' means:",
        options: [
          "Acordando com fontes",
          "De acordo com fontes",
          "Procurando fontes",
          "Sem fontes"
        ],
        correct: 1
      },
      {
        question: "Journalistic term",
        questionPT: "Termo jornalístico",
        sentence: "A 'headline' is:",
        options: [
          "Linha da cabeça",
          "Título da notícia",
          "Fila principal",
          "Cabeçalho de carta"
        ],
        correct: 1
      },
      {
        question: "Current events phrase",
        questionPT: "Frase de eventos atuais",
        sentence: "'Amid tensions' indicates:",
        options: [
          "No meio de tensões",
          "Sem tensões",
          "Antes das tensões",
          "Contra tensões"
        ],
        correct: 0
      },
      {
        question: "Political vocabulary",
        questionPT: "Vocabulário político",
        sentence: "What is a 'summit'?",
        options: [
          "Soma de valores",
          "Reunião de líderes",
          "Topo de montanha",
          "Verão"
        ],
        correct: 1
      }
    ]
  }

  const pool = questionBank[mainCategory] || questionBank.grammar
  
  // Selecionar 5 perguntas aleatórias
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 5)
}

/**
 * Lista histórico de Boss Battles do usuário
 */
export async function getBossBattleHistory() {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return []
    }

    const battles = await db.bossBattle.findMany({
      where: {
        userId: parseInt(session.userId)
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    return JSON.parse(JSON.stringify(battles))
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    return []
  }
}
