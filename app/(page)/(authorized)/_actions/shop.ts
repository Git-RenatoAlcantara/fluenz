'use server'

import db from "@/prisma/prisma"
import { getSession } from "@/lib/session"

/**
 * Lista todos os itens disponíveis na loja
 */
export async function getShopItems() {
  try {
    const items = await db.item.findMany({
      orderBy: [
        { type: 'asc' },
        { cost: 'asc' }
      ]
    })

    return JSON.parse(JSON.stringify(items))
  } catch (error) {
    console.error('Erro ao buscar itens da loja:', error)
    return []
  }
}

/**
 * Compra um item da loja
 */
export async function purchaseItem(itemId: number) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      throw new Error('Usuário não autenticado')
    }

    // Buscar item
    const item = await db.item.findUnique({
      where: { id: itemId }
    })

    if (!item) {
      throw new Error('Item não encontrado')
    }

    // Buscar usuário
    const user = await db.user.findUnique({
      where: { id: parseInt(session.userId) },
      select: { gems: true }
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    // Verificar se tem gems suficientes
    if (user.gems < item.cost) {
      return {
        success: false,
        error: `Gems insuficientes. Você tem ${user.gems} 💎, precisa de ${item.cost} 💎`
      }
    }

    // Verificar se já possui (para cosméticos)
    if (item.type === 'cosmetic') {
      const existing = await db.userItem.findFirst({
        where: {
          userId: parseInt(session.userId),
          itemId: item.id
        }
      })

      if (existing) {
        return {
          success: false,
          error: 'Você já possui este item'
        }
      }
    }

    // Processar compra em transação
    const result = await db.$transaction(async (tx) => {
      // Deduzir gems
      if (!session.userId) {
        throw new Error('Usuário não autenticado')
      }
      const updatedUser = await tx.user.update({
        where: { id: parseInt(session.userId) },
        data: {
          gems: { decrement: item.cost }
        }
      })

      // Adicionar ao inventário
      const userItem = await tx.userItem.create({
        data: {
          userId: parseInt(session.userId),
          itemId: item.id,
          quantity: item.type === 'potion' ? 1 : 1,
          active: false
        }
      })

      return { updatedUser, userItem }
    })

    return JSON.parse(JSON.stringify({
      success: true,
      item,
      remainingGems: result.updatedUser.gems
    }))
  } catch (error) {
    console.error('Erro ao comprar item:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

/**
 * Busca o inventário do usuário
 */
export async function getUserInventory() {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return []
    }

    const inventory = await db.userItem.findMany({
      where: { userId: parseInt(session.userId) },
      include: {
        item: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return JSON.parse(JSON.stringify(inventory))
  } catch (error) {
    console.error('Erro ao buscar inventário:', error)
    return []
  }
}

/**
 * Usa um item consumível (poção)
 */
export async function useItem(userItemId: number) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      throw new Error('Usuário não autenticado')
    }

    // Buscar item no inventário
    const userItem = await db.userItem.findFirst({
      where: {
        id: userItemId,
           userId: parseInt(session.userId)
      },
      include: {
        item: true
      }
    })

    if (!userItem) {
      throw new Error('Item não encontrado no inventário')
    }

    if (userItem.item.type !== 'potion') {
      throw new Error('Este item não pode ser usado')
    }

    if (userItem.quantity < 1) {
      throw new Error('Você não tem este item')
    }

    // Verificar se já há um item ativo do mesmo tipo
    const activeItem = await db.userItem.findFirst({
      where: {
        userId: parseInt(session.userId),
        active: true,
        item: {
          effectType: userItem.item.effectType
        }
      },
      include: { item: true }
    })

    if (activeItem) {
      return {
        success: false,
        error: `Você já tem uma ${activeItem.item.name} ativa`
      }
    }

    // Calcular expiração (se tiver duração)
    const expiresAt = userItem.item.duration 
      ? new Date(Date.now() + userItem.item.duration * 60 * 1000)
      : null

    // Ativar item em transação
    const result = await db.$transaction(async (tx) => {
      // Reduzir quantidade
      const updated = await tx.userItem.update({
        where: { id: userItemId },
        data: {
          quantity: { decrement: 1 },
          active: true,
          expiresAt
        }
      })

      // Se quantidade chegou a 0, deletar (mas manter ativo até expirar)
      if (updated.quantity === 0 && !expiresAt) {
        await tx.userItem.delete({
          where: { id: userItemId }
        })
      }

      return updated
    })

    return {
      success: true,
      item: userItem.item,
      expiresAt,
      message: `${userItem.item.name} ativado! ${
        expiresAt ? `Expira em ${userItem.item.duration} minutos.` : ''
      }`
    }
  } catch (error) {
    console.error('Erro ao usar item:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

/**
 * Verifica e retorna itens ativos do usuário
 */
export async function getActiveItems() {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return []
    }

    const now = new Date()

    // Buscar itens ativos
    const activeItems = await db.userItem.findMany({
      where: {
           userId: parseInt(session.userId),
        active: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } }
        ]
      },
      include: {
        item: true
      }
    })

    // Desativar itens expirados
    const expiredIds = await db.userItem.findMany({
      where: {
        userId: parseInt(session.userId),
        active: true,
        expiresAt: { lte: now }
      },
      select: { id: true }
    })

    if (expiredIds.length > 0) {
      await db.userItem.updateMany({
        where: {
          id: { in: expiredIds.map(i => i.id) }
        },
        data: {
          active: false
        }
      })
    }

    return JSON.parse(JSON.stringify(activeItems))
  } catch (error) {
    console.error('Erro ao buscar itens ativos:', error)
    return []
  }
}

/**
 * Calcula o multiplicador total de XP baseado em itens ativos
 */
export async function getXPMultiplier(): Promise<number> {
  try {
    const activeItems = await getActiveItems()
    
    let multiplier = 1.0
    
    for (const userItem of activeItems) {
      if (userItem.item.effectType === 'xp_boost' && userItem.item.effectValue) {
        multiplier *= userItem.item.effectValue
      }
    }
    
    return multiplier
  } catch (error) {
    console.error('Erro ao calcular multiplicador XP:', error)
    return 1.0
  }
}
