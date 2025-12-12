'use client'

import { useQuery } from "@tanstack/react-query"
import { getSkillTree } from "../_actions/skillTree"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Mic, Film, Newspaper, Crown, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useMemo } from "react"
import { Button } from "@/components/ui/button"

const SKILL_INFO = {
  intellect: {
    name: "Intellect",
    icon: BookOpen,
    color: "text-blue-400",
    bgColor: "bg-blue-950/30",
    borderColor: "border-blue-800",
    description: "Domínio de gramática e estrutura formal"
  },
  charisma: {
    name: "Charisma",
    icon: Mic,
    color: "text-purple-400",
    bgColor: "bg-purple-950/30",
    borderColor: "border-purple-800",
    description: "Compreensão auditiva e conversação"
  },
  perception: {
    name: "Perception",
    icon: Film,
    color: "text-pink-400",
    bgColor: "bg-pink-950/30",
    borderColor: "border-pink-800",
    description: "Contexto cultural através de filmes"
  },
  wisdom: {
    name: "Wisdom",
    icon: Newspaper,
    color: "text-yellow-400",
    bgColor: "bg-yellow-950/30",
    borderColor: "border-yellow-800",
    description: "Conhecimento de atualidades e vocabulário avançado"
  }
}

// Mapeamento exato das Strings do Banco para UI
const CLASS_INFO: Record<string, { icon: string, color: string, description: string }> = {
  Scholar: {
    icon: "📚",
    color: "text-blue-400",
    description: "Mestre da gramática e estrutura formal"
  },
  Bard: {
    icon: "🎭",
    color: "text-purple-400",
    description: "Especialista em comunicação oral"
  },
  Ranger: {
    icon: "🎬",
    color: "text-pink-400",
    description: "Conhecedor de contextos culturais"
  },
  Mage: {
    icon: "🔮",
    color: "text-yellow-400",
    description: "Sábio de vocabulário avançado"
  },
  Novice: {
    icon: "🌱",
    color: "text-slate-400",
    description: "Iniciante em todas as artes"
  }
}

export default function SkillTreeClient() {
  const { data: skillTree, error, isLoading, refetch } = useQuery({
    queryKey: ['skill-tree'],
    queryFn: getSkillTree,
    refetchInterval: 5000,
    retry: 1
  })

  // Cálculos derivados (useMemo para performance)
  const stats = useMemo(() => {
    if (!skillTree) return null

    // 1. Calcular total para porcentagens
    const total = (skillTree.intellect || 0) + (skillTree.charisma || 0) + (skillTree.perception || 0) + (skillTree.wisdom || 0)
    const safeTotal = total === 0 ? 1 : total // Evitar divisão por zero

    return {
      total,
      percentages: {
        intellect: ((skillTree.intellect || 0) / safeTotal) * 100,
        charisma: ((skillTree.charisma || 0) / safeTotal) * 100,
        perception: ((skillTree.perception || 0) / safeTotal) * 100,
        wisdom: ((skillTree.wisdom || 0) / safeTotal) * 100,
      }
    }
  }, [skillTree])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center gap-2">
        <Loader2 className="animate-spin text-indigo-500" />
        <p className="text-slate-400">Consultando os astros...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="bg-red-500/10 p-4 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <div className="space-y-2 max-w-md">
            <h2 className="text-xl font-bold text-red-400">Falha na conexão com o Grimório</h2>
            <p className="text-slate-400 text-sm bg-slate-900 p-3 rounded border border-slate-800 font-mono break-all">
                {error instanceof Error ? error.message : "Erro desconhecido"}
            </p>
        </div>
        <Button 
            onClick={() => refetch()} 
            variant="outline" 
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white gap-2"
        >
            <RefreshCw className="w-4 h-4" />
            Tentar Novamente
        </Button>
      </div>
    )
  }

  if (!skillTree) return null

  // CORREÇÃO 1: Acessar a string direta 'primaryClass' e fazer fallback seguro
  const currentClassName = skillTree.primaryClass || "Novice"
  const classInfo = CLASS_INFO[currentClassName] || CLASS_INFO["Novice"]

  // Dados para o Gráfico
  const radarData = [
    {
      attribute: 'Scholar (INT)',
      value: skillTree.intellect,
      // Usar Math.max para escalar o gráfico dinamicamente
      fullMark: Math.max(skillTree.intellect, skillTree.charisma, skillTree.perception, skillTree.wisdom, 100)
    },
    {
      attribute: 'Bard (CHA)',
      value: skillTree.charisma,
      fullMark: Math.max(skillTree.intellect, skillTree.charisma, skillTree.perception, skillTree.wisdom, 100)
    },
    {
      attribute: 'Ranger (PER)',
      value: skillTree.perception,
      fullMark: Math.max(skillTree.intellect, skillTree.charisma, skillTree.perception, skillTree.wisdom, 100)
    },
    {
      attribute: 'Mage (WIS)',
      value: skillTree.wisdom,
      fullMark: Math.max(skillTree.intellect, skillTree.charisma, skillTree.perception, skillTree.wisdom, 100)
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Árvore de Habilidades
          </h1>
          <p className="text-slate-400">Sua especialização baseada no conteúdo que você consome.</p>
        </div>

        {/* Dominant Class Card */}
        <Card className="bg-gradient-to-br from-indigo-950/50 to-purple-950/50 border-indigo-800/50 overflow-hidden relative">
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none"></div>
            
          <CardHeader>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-7xl drop-shadow-lg filter grayscale-0 animate-in zoom-in duration-500">
                {classInfo.icon}
              </div>
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                    <CardTitle className={`text-3xl font-bold ${classInfo.color}`}>
                    {currentClassName}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                        <Crown className="w-3 h-3 mr-1" />
                        Classe Atual
                    </Badge>
                </div>
                <CardDescription className="text-lg text-slate-300">
                  {classInfo.description}
                </CardDescription>
              </div>
              
              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right border-l border-white/10 pl-6">
                <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Pontos Totais</p>
                    <p className="text-2xl font-bold text-white">{stats?.total}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Nível Máx</p>
                    <p className="text-2xl font-bold text-indigo-400">
                        {Math.floor(Math.sqrt((stats?.total || 0) * 0.1)) + 1}
                    </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Radar Chart */}
            <Card className="lg:col-span-1 bg-slate-900/50 border-slate-800 flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg">Perfil de Habilidades</CardTitle>
                <CardDescription>Distribuição do seu conhecimento</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="attribute" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                    <Radar
                    name="XP"
                    dataKey="value"
                    stroke="#818cf8"
                    fill="#818cf8"
                    fillOpacity={0.5}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                        itemStyle={{ color: '#818cf8' }}
                    />
                </RadarChart>
                </ResponsiveContainer>
            </CardContent>
            </Card>

            {/* Right Column: Skill Breakdown */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(SKILL_INFO) as Array<keyof typeof SKILL_INFO>).map((skillKey) => {
                const skill = SKILL_INFO[skillKey]
                const Icon = skill.icon
                // Usando o operador de coalescência nula para garantir número
                const value = skillTree[skillKey] ?? 0 
                // CORREÇÃO 2: Usando porcentagem calculada no frontend
                const percentage = stats?.percentages[skillKey] ?? 0

                return (
                <Card key={skillKey} className={`bg-slate-900/40 border-slate-800 transition-colors hover:bg-slate-900/60 ${skill.bgColor.replace('/30', '/10')}`}>
                    <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div className={`p-2 rounded-lg bg-slate-950/50 ${skill.color}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-2xl font-bold ${skill.color}`}>{value}</span>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <CardTitle className="text-base mb-1">{skill.name}</CardTitle>
                    <CardDescription className="text-xs text-slate-400 mb-3 h-8 line-clamp-2">
                        {skill.description}
                    </CardDescription>
                    
                    <div className="space-y-1">
                        <Progress value={percentage} className="h-2 bg-slate-950" />
                        <p className="text-xs text-slate-500 text-right">{percentage.toFixed(0)}%</p>
                    </div>
                    </CardContent>
                </Card>
                )
            })}
            </div>
        </div>

        {/* Footer Hint */}
        <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-lg p-4 flex gap-4 items-center">
             <div className="p-2 bg-indigo-900/50 rounded-full text-indigo-400">
                <BookOpen size={20} />
             </div>
             <div>
                 <h4 className="font-bold text-indigo-300 text-sm">Dica de Mestre</h4>
                 <p className="text-xs text-slate-400">Para mudar sua classe dominante, foque em assistir mais conteúdos da categoria desejada. O atributo mais alto define seu título.</p>
             </div>
        </div>

      </div>
    </div>
  )
}