'use server'

import db from "@/prisma/prisma"
import { getSession } from "@/lib/session"
import * as z from "zod"

const schema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
})

export async function updatePlaylist(input: { id: number; name: string }) {
  const session = await getSession()
  if (!session?.userId) throw new Error("Não autenticado")

  const parsed = schema.parse(input)

  const found = await db.playlist.findFirst({
    where: { id: parsed.id, userId: parseInt(session.userId) }
  })
  if (!found) throw new Error("Playlist não encontrada")

  const updated = await db.playlist.update({
    where: { id: parsed.id },
    data: { name: parsed.name }
  })
  return updated
}
