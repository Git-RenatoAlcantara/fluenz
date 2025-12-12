'use server'

import db from "@/prisma/prisma"
import { getSession } from "@/lib/session"

export async function deletePlaylist(playlistId: number) {
  const session = await getSession()
  
  if (!session) {
    throw new Error("Não autenticado")
  }

  // Verifica se a playlist pertence ao usuário
  const playlist = await db.playlist.findFirst({
    where: {
      id: playlistId,
      userId: parseInt(session.userId!)
    }
  })

  if (!playlist) {
    throw new Error("Playlist não encontrada")
  }

  // Deleta a playlist (vídeos ficarão sem playlist por causa do onDelete: SetNull)
  await db.playlist.delete({
    where: {
      id: playlistId
    }
  })

  return { success: true }
}
