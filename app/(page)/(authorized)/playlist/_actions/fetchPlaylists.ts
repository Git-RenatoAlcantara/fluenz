'use server'

import db from "@/prisma/prisma"
import { getSession } from "@/lib/session"
import { unstable_noStore as noStore } from 'next/cache'

export async function fetchPlaylists() {
  noStore() // Desabilita cache do Next.js
  
  const session = await getSession()
  
  if (!session?.userId) {
    return []
  }

  const userId = parseInt(session.userId)

  const playlists = await db.playlist.findMany({
    where: {
      userId: userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return playlists
}
