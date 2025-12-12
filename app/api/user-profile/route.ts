import { NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'
import { getUserProfile } from '@/app/(page)/(authorized)/_actions/userProgress'

export async function GET() {
  noStore()
  
  try {
    const profile = await getUserProfile()
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}
