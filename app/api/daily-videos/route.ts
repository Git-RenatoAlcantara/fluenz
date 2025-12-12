import { NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'
import { fetchDailyVideos } from '@/app/(page)/(authorized)/daily/_actions/fetchDailyVideos'

export async function GET() {
  noStore()
  
  try {
    const result = await fetchDailyVideos()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching daily videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily videos' },
      { status: 500 }
    )
  }
}
