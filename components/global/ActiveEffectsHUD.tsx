'use client'

import { useQuery } from "@tanstack/react-query"
import { getUserProfile } from "@/app/(page)/(authorized)/_actions/userProgress"
import { useEffect, useState } from "react"
import { Zap, Snowflake } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActiveEffect {
  type: 'xpBoost' | 'streakFreeze'
  expiresAt?: string
  active: boolean
}

export function ActiveEffectsHUD() {
  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    refetchInterval: 5000
  })

  const [effects, setEffects] = useState<ActiveEffect[]>([])
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    if (!user?.activeEffects) {
      setEffects([])
      return
    }

    const activeEffects = user.activeEffects as any
    const newEffects: ActiveEffect[] = []

    // XP Boost
    if (activeEffects.xpBoostExpiresAt) {
      const expiresAt = new Date(activeEffects.xpBoostExpiresAt)
      const now = new Date()
      
      if (expiresAt > now) {
        newEffects.push({
          type: 'xpBoost',
          expiresAt: activeEffects.xpBoostExpiresAt,
          active: true
        })
      }
    }

    // Streak Freeze
    if (activeEffects.streakFreeze === true) {
      newEffects.push({
        type: 'streakFreeze',
        active: true
      })
    }

    setEffects(newEffects)
  }, [user?.activeEffects])

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining: { [key: string]: number } = {}
      
      effects.forEach(effect => {
        if (effect.expiresAt) {
          const now = new Date()
          const expiresAt = new Date(effect.expiresAt)
          const diff = expiresAt.getTime() - now.getTime()
          newTimeRemaining[effect.type] = Math.max(0, diff)
        }
      })

      setTimeRemaining(newTimeRemaining)
    }, 1000)

    return () => clearInterval(interval)
  }, [effects])

  if (effects.length === 0) {
    return null
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col gap-2">
      {effects.map(effect => {
        if (effect.type === 'xpBoost') {
          return (
            <div
              key="xpBoost"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg",
                "bg-gradient-to-r from-yellow-950/90 to-orange-950/90",
                "border border-yellow-700/50 backdrop-blur-sm",
                "shadow-lg shadow-yellow-900/20",
                "animate-pulse"
              )}
            >
              <div className="relative">
                <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <div className="absolute inset-0 blur-sm">
                  <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-yellow-300">2x XP Boost</p>
                {timeRemaining.xpBoost !== undefined && (
                  <p className="text-xs text-yellow-400/80">
                    {formatTime(timeRemaining.xpBoost)}
                  </p>
                )}
              </div>
            </div>
          )
        }

        if (effect.type === 'streakFreeze') {
          return (
            <div
              key="streakFreeze"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg",
                "bg-gradient-to-r from-cyan-950/90 to-blue-950/90",
                "border border-cyan-700/50 backdrop-blur-sm",
                "shadow-lg shadow-cyan-900/20"
              )}
            >
              <div className="relative">
                <Snowflake className="w-6 h-6 text-cyan-400" />
                <div className="absolute inset-0 blur-sm">
                  <Snowflake className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-cyan-300">Streak Freeze</p>
                <p className="text-xs text-cyan-400/80">Protegido</p>
              </div>
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
