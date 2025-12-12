'use server'

import db from "@/prisma/prisma"
import { getSession } from "@/lib/session"
import * as z from "zod"

const schema = z.object({
  videoId: z.number().int().positive(),
  playlistId: z.number().int().positive().nullable(),
})

export async function updateVideoPlaylist(input: { videoId: number; playlistId: number | null }) {
  const session = await getSession()
  if (!session?.userId) throw new Error("Não autenticado")

  const parsed = schema.parse(input)

  // Ensure video belongs to user
  const video = await db.video.findFirst({
    where: { id: parsed.videoId, userId: parseInt(session.userId) }
  })
  if (!video) throw new Error("Vídeo não encontrado")

  // If playlistId provided, ensure ownership
  if (parsed.playlistId) {
    const playlist = await db.playlist.findFirst({
      where: { id: parsed.playlistId, userId: parseInt(session.userId) }
    })
    if (!playlist) throw new Error("Playlist inválida")
  }

  const updated = await db.video.update({
    where: { id: parsed.videoId },
    data: { playlistId: parsed.playlistId }
  })

  return updated
}
