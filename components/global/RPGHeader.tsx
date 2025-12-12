'use client'

import { Trophy, Flame, Zap, Gem } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export default function RPGHeader() {
  const [profile, setProfile] = useState({ 
    xp: 0, 
    level: 1, 
    streak: 0, 
    manaDaily: 0, 
    maxMana: 20,
    manaPercentage: 0,
    currentTitle: "Novice Listener",
    gems: 0,
    streakMultiplier: 1.0
  })

  const { data } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await fetch('/api/user-profile')
      if (!response.ok) throw new Error('Erro ao buscar perfil')
      return response.json()
    },
    staleTime: 0,
    refetchInterval: 5000,
  })

  useEffect(() => {
    if (data) {
      setProfile(data)
    }
  }, [data])

  return (
    <header className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 border-b border-indigo-700/50 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Top Row: Logo e Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-400/30">
              <Trophy size={24} className="drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-200 tracking-tight">
                Arcane Academy
              </h1>
              <p className="text-xs text-purple-300/80 font-medium">{profile.currentTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Level */}
            <div className="flex flex-col items-center bg-indigo-800/50 px-3 py-1.5 rounded-lg border border-indigo-600/50">
              <span className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider">Nível</span>
              <span className="font-bold text-yellow-400 text-lg drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                {profile.level}
              </span>
            </div>

            <div className="h-8 w-px bg-indigo-600/50"></div>

            {/* XP */}
            <div className="flex flex-col items-center bg-indigo-800/50 px-3 py-1.5 rounded-lg border border-indigo-600/50">
              <span className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider">XP Total</span>
              <span className="font-bold text-purple-300 text-lg">{profile.xp.toLocaleString()}</span>
            </div>

            <div className="h-8 w-px bg-indigo-600/50"></div>

            {/* Streak */}
            <div className="flex flex-col items-center bg-indigo-800/50 px-3 py-1.5 rounded-lg border border-indigo-600/50">
              <span className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider">Streak</span>
              <div className="flex items-center gap-1.5">
                <Flame 
                  size={18} 
                  className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" 
                  fill="currentColor" 
                />
                <span className="font-bold text-orange-400 text-lg">{profile.streak}</span>
                {profile.streakMultiplier > 1 && (
                  <span className="text-xs text-emerald-400 font-bold">×{profile.streakMultiplier}</span>
                )}
              </div>
            </div>

            {/* Gems */}
            {profile.gems > 0 && (
              <>
                <div className="h-8 w-px bg-indigo-600/50"></div>
                <div className="flex items-center gap-1.5 bg-indigo-800/50 px-3 py-1.5 rounded-lg border border-indigo-600/50">
                  <Gem size={16} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                  <span className="font-bold text-cyan-300 text-sm">{profile.gems}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mana Bar (Daily Focus) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Zap size={14} className="text-purple-400" fill="currentColor" />
              <span className="text-purple-200 font-medium">Mana Diária</span>
            </div>
            <span className="text-purple-300 font-bold">
              {profile.manaDaily} / {profile.maxMana} min
              {profile.manaDaily >= profile.maxMana && (
                <span className="ml-2 text-emerald-400 animate-pulse">✓ Quest Completa!</span>
              )}
            </span>
          </div>
          <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden border border-purple-900/50 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 transition-all duration-500 relative overflow-hidden"
              style={{ width: `${profile.manaPercentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </header>
  )
}
