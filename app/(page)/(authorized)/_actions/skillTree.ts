'use server'
import db from "@/prisma/prisma"
import { getSession } from "@/lib/session"

// Mapeamento de categorias para atributos RPG
const CATEGORY_TO_SKILL = {
  'grammar': 'intellect',      // Gramática/Aulas
  'listening': 'charisma',     // Podcasts/Conversa
  'movies': 'perception',      // Filmes/Séries
  'news': 'wisdom',            // Notícias/Tech
  'default': 'charisma'        // Padrão se não tiver categoria
} as const

type SkillAttribute = 'intellect' | 'charisma' | 'perception' | 'wisdom'

/**
 * Atualiza a Skill Tree do usuário baseado no vídeo assistido
 */
export async function updateSkillTree(videoId: number, durationMinutes: number) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      throw new Error('Usuário não autenticado')
    }

    // Buscar vídeo e sua categoria
    const video = await db.video.findUnique({
      where: { id: videoId },
      select: { category: true }
    })

    if (!video) {
      throw new Error('Vídeo não encontrado')
    }

    // Determinar qual skill aumentar
    const category = video.category || 'default'
    const skillToIncrease: SkillAttribute = CATEGORY_TO_SKILL[category as keyof typeof CATEGORY_TO_SKILL] || 'charisma'

    // Pontos ganhos: 1 ponto por minuto assistido
    const pointsGained = durationMinutes

    // Buscar ou criar Skill Tree do usuário
    let skillTree = await db.skillTree.findUnique({
      where: { userId: parseInt(session.userId) }
    })

    if (!skillTree) {
      // Criar Skill Tree inicial
      skillTree = await db.skillTree.create({
        data: {
          userId: parseInt(session.userId),
          intellect: 0,
          charisma: 0,
          perception: 0,
          wisdom: 0
        }
      })
    }

    // Atualizar o atributo específico
    const updateData: Record<string, number> = {
      [skillToIncrease]: (skillTree[skillToIncrease] as number) + pointsGained
    }

    const updated = await db.skillTree.update({
      where: { userId: parseInt(session.userId) },
      data: updateData
    })

    return {
      success: true,
      skillIncreased: skillToIncrease,
      pointsGained,
      newValue: updated[skillToIncrease]
    }
  } catch (error) {
    console.error('Erro ao atualizar Skill Tree:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

/**
 * Busca a Skill Tree completa do usuário
 */
export async function getSkillTree() {
  try {
    console.log('[SkillTree] Iniciando busca...')
    const session = await getSession()
    console.log('[SkillTree] Sessão:', session)
    if (!session?.userId) {
      console.log('[SkillTree] Usuário não autenticado')
      return null
    }

    let skillTree = await db.skillTree.findUnique({
      where: { userId: parseInt(session.userId) },
      select: {
        intellect: true,
        charisma: true,
        perception: true,
        wisdom: true
      }
    })
    console.log('[SkillTree] skillTree do banco:', skillTree)

    // Criar se não existir
    if (!skillTree) {
      await db.skillTree.create({
        data: {
          userId: parseInt(session.userId),
          intellect: 0,
          charisma: 0,
          perception: 0,
          wisdom: 0
        }
      })
      skillTree = { intellect: 0, charisma: 0, perception: 0, wisdom: 0 }
      console.log('[SkillTree] Criado skillTree inicial:', skillTree)
    }

    // Extrair campos como números puros
    const intellect = Number(skillTree.intellect)
    const charisma = Number(skillTree.charisma)
    const perception = Number(skillTree.perception)
    const wisdom = Number(skillTree.wisdom)

    // Calcular classe dominante baseada nos atributos
    const dominantClass = getDominantClass({ intellect, charisma, perception, wisdom })
    const primaryClass = dominantClass.name

    const total = intellect + charisma + perception + wisdom
    const maxValue = Math.max(intellect, charisma, perception, wisdom, 1)

    console.log('[SkillTree] Retornando dados:', { intellect, charisma, perception, wisdom, primaryClass })

    return JSON.parse(JSON.stringify({
      intellect,
      charisma,
      perception,
      wisdom,
      primaryClass,
      total,
      percentages: {
        intellect: total > 0 ? Math.round((intellect / maxValue) * 100) : 0,
        charisma: total > 0 ? Math.round((charisma / maxValue) * 100) : 0,
        perception: total > 0 ? Math.round((perception / maxValue) * 100) : 0,
        wisdom: total > 0 ? Math.round((wisdom / maxValue) * 100) : 0,
      }
    }))
  } catch (error) {
    console.error('[SkillTree] ERRO:', error)
    return null
  }
}

/**
 * Determina a classe dominante do usuário
 */
function getDominantClass(skillTree: {
  intellect: number
  charisma: number
  perception: number
  wisdom: number
}): { name: string; icon: string; description: string } {
  const skills = {
    intellect: { value: skillTree.intellect, name: 'Scholar', icon: '📚', description: 'Mestre da Gramática' },
    charisma: { value: skillTree.charisma, name: 'Bard', icon: '🎭', description: 'Conversador Nato' },
    perception: { value: skillTree.perception, name: 'Ranger', icon: '🎬', description: 'Explorador Cultural' },
    wisdom: { value: skillTree.wisdom, name: 'Mage', icon: '🔮', description: 'Sábio do Conhecimento' }
  }

  const dominant = Object.entries(skills).reduce((max, [key, skill]) => 
    skill.value > max.value ? skill : max
  , skills.intellect)

  return {
    name: dominant.name,
    icon: dominant.icon,
    description: dominant.description
  }
}
