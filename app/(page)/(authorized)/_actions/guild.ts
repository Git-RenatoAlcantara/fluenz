'use server'

import db from "@/prisma/prisma"
import { getSession } from "@/lib/session"

/**
 * Cria uma nova guilda
 */
export async function createGuild(name: string, description?: string, icon?: string) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      throw new Error('Usuário não autenticado')
    }

    // Validar nome
    if (!name || name.trim().length < 3) {
      return {
        success: false,
        error: 'O nome da guilda deve ter pelo menos 3 caracteres'
      }
    }

    // Verificar se nome já existe
    const existingGuild = await db.guild.findUnique({
      where: { name: name.trim() }
    })

    if (existingGuild) {
      return {
        success: false,
        error: 'Já existe uma guilda com este nome. Escolha outro.'
      }
    }

    // Verificar se usuário já tem guilda
    const user = await db.user.findUnique({
      where: { id: parseInt(session.userId) },
      select: { guildId: true }
    })

    if (user?.guildId) {
      return {
        success: false,
        error: 'Você já está em uma guilda. Saia dela primeiro.'
      }
    }

    // Criar guilda
    const guild = await db.guild.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        icon: icon || '🏰',
        ownerId: parseInt(session.userId),
        weekStartDate: new Date().toISOString().split('T')[0]
      }
    })

    // Adicionar criador como membro
    await db.user.update({
      where: { id: parseInt(session.userId) },
      data: { guildId: guild.id }
    })

    return {
      success: true,
      guild
    }
  } catch (error) {
    console.error('Erro ao criar guilda:', error)
    
    // Mensagens de erro mais específicas
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return {
          success: false,
          error: 'Nome de guilda já existe ou você já é dono de outra guilda'
        }
      }
      return {
        success: false,
        error: error.message
      }
    }
    
    return {
      success: false,
      error: 'Erro ao criar guilda. Tente novamente.'
    }
  }
}

/**
 * Lista todas as guildas disponíveis
 */
export async function listGuilds() {
  try {
    const guilds = await db.guild.findMany({
      include: {
        owner: {
          select: {
            name: true,
            level: true,
            currentTitle: true
          }
        },
        members: {
          select: {
            id: true,
            name: true,
            level: true
          }
        },
        _count: {
          select: {
            members: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return JSON.parse(JSON.stringify(guilds))
  } catch (error) {
    console.error('Erro ao listar guildas:', error)
    return []
  }
}

/**
 * Busca detalhes de uma guilda específica
 */
export async function getGuild(guildId: number) {
  try {
    console.log('🔍 getGuild: Buscando guilda ID =', guildId)
    
    const guild = await db.guild.findUnique({
      where: { id: guildId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            level: true,
            currentTitle: true,
            xp: true
          }
        },
        members: {
          select: {
            id: true,
            name: true,
            level: true,
            currentTitle: true,
            xp: true,
            streak: true
          },
          orderBy: {
            xp: 'desc'
          }
        },
        quests: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      }
    })

    if (!guild) {
      console.log('❌ getGuild: Guilda não encontrada')
      return null
    } else {
      console.log('✅ getGuild: Guilda encontrada:', guild.name, '| Membros:', guild.members.length)
    }

    return JSON.parse(JSON.stringify(guild))
  } catch (error) {
    console.error('❌ Erro ao buscar guilda:', error)
    return null
  }
}

/**
 * Entrar em uma guilda
 */
export async function joinGuild(guildId: number) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      throw new Error('Usuário não autenticado')
    }

    const guild = await db.guild.findUnique({
      where: { id: guildId },
      include: {
        _count: {
          select: { members: true }
        }
      }
    })

    if (!guild) {
      throw new Error('Guilda não encontrada')
    }

    if (guild._count.members >= guild.maxMembers) {
      return {
        success: false,
        error: 'Guilda está cheia'
      }
    }

    // Verificar se usuário já está em guilda
    const user = await db.user.findUnique({
      where: { id: parseInt(session.userId) },
      select: { guildId: true }
    })

    if (user?.guildId) {
      return {
        success: false,
        error: 'Você já está em uma guilda'
      }
    }

    await db.user.update({
      where: { id: parseInt(session.userId) },
      data: { guildId: guild.id }
    })

    return {
      success: true,
      guild
    }
  } catch (error) {
    console.error('Erro ao entrar na guilda:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

/**
 * Sair de uma guilda
 */
export async function leaveGuild() {
  try {
    const session = await getSession()
    if (!session?.userId) {
      throw new Error('Usuário não autenticado')
    }

    const user = await db.user.findUnique({
      where: { id: parseInt(session.userId) },
      select: { guildId: true }
    })

    if (!user?.guildId) {
      return {
        success: false,
        error: 'Você não está em uma guilda'
      }
    }

    // Verificar se é o dono
    const guild = await db.guild.findUnique({
      where: { id: user.guildId },
      select: { ownerId: true }
    })

    if (guild?.ownerId === parseInt(session.userId)) {
      return {
        success: false,
        error: 'Você é o dono. Transfira a liderança ou delete a guilda.'
      }
    }

    await db.user.update({
      where: { id: parseInt(session.userId) },
      data: { guildId: null }
    })

    return {
      success: true
    }
  } catch (error) {
    console.error('Erro ao sair da guilda:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

/**
 * Atualiza o progresso semanal da guilda
 */
export async function updateGuildProgress(minutesWatched: number) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return
    }

    const user = await db.user.findUnique({
      where: { id: parseInt(session.userId) },
      select: { guildId: true }
    })

    if (!user?.guildId) {
      return
    }

    const guild = await db.guild.findUnique({
      where: { id: user.guildId }
    })

    if (!guild) {
      return
    }

    // Verificar se precisa resetar a semana
    const today = new Date().toISOString().split('T')[0]
    const weekStart = guild.weekStartDate || today
    const daysSinceStart = Math.floor((new Date(today).getTime() - new Date(weekStart).getTime()) / (1000 * 60 * 60 * 24))

    let currentMinutes = guild.currentWeekMinutes
    let newWeekStart = weekStart

    if (daysSinceStart >= 7) {
      // Nova semana, resetar
      currentMinutes = 0
      newWeekStart = today
    }

    // Atualizar progresso
    await db.guild.update({
      where: { id: guild.id },
      data: {
        currentWeekMinutes: currentMinutes + minutesWatched,
        weekStartDate: newWeekStart
      }
    })

    // Verificar se completou o objetivo
    if (currentMinutes + minutesWatched >= guild.weeklyGoal && currentMinutes < guild.weeklyGoal) {
      // Recompensar todos os membros
      const members = await db.user.findMany({
        where: { guildId: guild.id }
      })

      for (const member of members) {
        await db.user.update({
          where: { id: member.id },
          data: {
            gems: { increment: 5 }
          }
        })
      }

      return {
        questComplete: true,
        reward: 5
      }
    }
  } catch (error) {
    console.error('Erro ao atualizar progresso da guilda:', error)
  }
}

/**
 * Busca a guilda do usuário atual
 */
export async function getMyGuild() {
  try {
    const session = await getSession()
    if (!session?.userId) {
      console.log('❌ getMyGuild: Sem sessão')
      return null
    }

    console.log('✅ getMyGuild: userId =', session.userId)

    const user = await db.user.findUnique({
      where: { id: parseInt(session.userId) },
      select: { guildId: true }
    })

    console.log('✅ getMyGuild: user.guildId =', user?.guildId)

    if (!user?.guildId) {
      console.log('❌ getMyGuild: Usuário não tem guilda')
      return null
    }

    const guild = await getGuild(user.guildId)
    console.log('✅ getMyGuild: guild =', guild ? guild.name : 'null')
    return guild
  } catch (error) {
    console.error('❌ Erro ao buscar minha guilda:', error)
    return null
  }
}

/**
 * Deleta uma guilda (apenas o dono)
 */
export async function deleteGuild(guildId: number) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      throw new Error('Usuário não autenticado')
    }

    const guild = await db.guild.findUnique({
      where: { id: guildId },
      select: { ownerId: true }
    })

    if (!guild) {
      throw new Error('Guilda não encontrada')
    }

    if (guild.ownerId !== parseInt(session.userId)) {
      throw new Error('Apenas o dono pode deletar a guilda')
    }

    // Remover todos os membros
    await db.user.updateMany({
      where: { guildId: guildId },
      data: { guildId: null }
    })

    // Deletar guilda
    await db.guild.delete({
      where: { id: guildId }
    })

    return {
      success: true
    }
  } catch (error) {
    console.error('Erro ao deletar guilda:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}
