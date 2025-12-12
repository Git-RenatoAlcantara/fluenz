import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import db from '@/prisma/prisma'
import { unstable_noStore as noStore } from 'next/cache'

export async function GET() {
  noStore()
  
  const session = await getSession()
  
  if (!session?.userId) {
    return NextResponse.json({ 
      error: 'Não autenticado'
    }, { status: 401 })
  }

  const userId = parseInt(session.userId)

  const videos = await db.video.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json({
    success: true,
    videos
  })
}
