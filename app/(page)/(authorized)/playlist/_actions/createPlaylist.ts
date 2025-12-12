'use server'

import db from "@/prisma/prisma"
import { getSession } from "@/lib/session"
import * as z from "zod"

const playlistSchema = z.object({
  name: z.string().min(1, {
    message: "Nome é obrigatório",
  }),
})

export async function createPlaylist(formData: FormData) {
  const session = await getSession()
  
  if (!session) {
    throw new Error("Não autenticado")
  }

  const result = playlistSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    throw new Error(result.error.flatten().fieldErrors.name?.[0] || "Erro de validação")
  }

  console.log('Creating playlist:', result.data.name, 'for user:', session.userId)

  const playlist = await db.playlist.create({
    data: {
      name: result.data.name,
      userId: parseInt(session.userId!)
    }
  })

  console.log('Playlist created:', playlist)

  return playlist
}
