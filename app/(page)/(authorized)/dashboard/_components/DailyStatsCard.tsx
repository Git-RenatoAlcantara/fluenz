'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getTodayStats } from '../../play/[id]/_actions/updateWatchTime'

export function DailyStatsCard() {
  const [stats, setStats] = useState<{ totalWatchTime: number } | null>(null)

  useEffect(() => {
    async function loadStats() {
      const data = await getTodayStats()
      setStats(data)
    }
    loadStats()
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`
    }
    return `${minutes}min`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tempo Assistido Hoje</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {stats ? formatTime(stats.totalWatchTime) : '0min'}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Continue assistindo para atingir sua meta diária
        </p>
      </CardContent>
    </Card>
  )
}
