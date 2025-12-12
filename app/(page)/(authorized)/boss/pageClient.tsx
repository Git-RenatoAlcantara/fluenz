'use client'

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { checkBossBattleTrigger, createBossBattle, getBossBattle, submitBossBattle } from "../_actions/bossBattle"
import { getUserProfile } from "../_actions/userProgress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Skull, Sword, Heart, Trophy, Zap, Crown } from "lucide-react"
import { toast } from "sonner"

export default function BossBattleClient() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [battleStarted, setBattleStarted] = useState(false)
  const [battleId, setBattleId] = useState<number | null>(null)

  const { data: trigger } = useQuery({
    queryKey: ['boss-trigger'],
    queryFn: checkBossBattleTrigger
  })

  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    refetchInterval: 5000
  })

  const { data: battle, refetch: refetchBattle } = useQuery({
    queryKey: ['boss-battle', battleId],
    queryFn: () => battleId ? getBossBattle(battleId) : null,
    enabled: !!battleId
  })

  const createMutation = useMutation({
    mutationFn: (level: number) => createBossBattle(level),
    onSuccess: (data) => {
      if (data.success && data.battleId) {
        setBattleId(data.battleId)
        setBattleStarted(true)
        refetchBattle()
        toast.success('Boss Battle iniciado!', {
          description: 'Responda 5 perguntas para derrotar o chefe'
        })
      } else {
        toast.error('Erro ao criar batalha', {
          description: data.error
        })
      }
    }
  })

  const submitMutation = useMutation({
    mutationFn: (answers: number[]) => submitBossBattle(battleId!, answers),
    onSuccess: (data) => {
      if (data.success) {
        if (data.victory) {
          toast.success('🎉 Vitória!', {
            description: `Você derrotou o Boss! +${data.rewards?.xp} XP, +${data.rewards?.gems} Gems`,
            duration: 5000
          })
        } else {
          toast.error('💀 Derrota...', {
            description: `Você precisa estudar mais! Assista +20 min de vídeos para tentar novamente.`,
            duration: 5000
          })
        }
        
        queryClient.invalidateQueries({ queryKey: ['user-profile'] })
        queryClient.invalidateQueries({ queryKey: ['boss-trigger'] })
        
        setTimeout(() => {
          router.push('/daily')
        }, 3000)
      } else {
        toast.error('Erro', { description: data.error })
      }
    }
  })

  if (!trigger?.shouldTrigger) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <Card className="max-w-md bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sem Boss Disponível</CardTitle>
            <CardDescription className="text-center">
              Boss Battles aparecem a cada 5 níveis
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Skull className="w-20 h-20 mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400 mb-2">Nível atual: {user?.level || 1}</p>
            <p className="text-sm text-slate-500">
              Próximo Boss no nível {Math.ceil((user?.level || 1) / 5) * 5}
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => router.push('/daily')} 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Voltar para Daily Mix
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!battleStarted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <Card className="max-w-md bg-gradient-to-br from-red-950/50 to-orange-950/50 border-red-800">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Skull className="w-16 h-16 text-red-500" />
            </div>
            <CardTitle className="text-3xl text-center bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Boss Battle
            </CardTitle>
            <CardDescription className="text-center text-lg text-slate-300">
              Nível {trigger.level} - Teste de Conhecimento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-900/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Sword className="w-5 h-5 text-red-400" />
                <span className="font-semibold">Boss HP:</span>
                <span className="text-red-400">5 pontos</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-green-400" />
                <span className="font-semibold">Sua Mana:</span>
                <span className="text-green-400">{user?.manaDaily || 0} minutos</span>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 space-y-2 text-sm">
              <p className="font-semibold text-indigo-400">⚔️ Mecânica:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Acertar = -1 HP do Boss</li>
                <li>Errar = -10 Mana sua</li>
                <li>5 perguntas para derrotar</li>
              </ul>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 space-y-2 text-sm">
              <p className="font-semibold text-yellow-400">🏆 Recompensas:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>+500 XP</li>
                <li>+{(trigger.level ?? 1) >= 10 ? '3' : '2'} Gems</li>
                {(trigger.level ?? 1) >= 10 && <li>Título especial: "Boss Slayer"</li>}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => createMutation.mutate(trigger.level ?? 1)}
              disabled={createMutation.isPending}
              className="w-full bg-red-600 hover:bg-red-700 text-lg py-6"
            >
              <Sword className="w-5 h-5 mr-2" />
              {createMutation.isPending ? 'Preparando...' : 'Iniciar Batalha'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!battle || !battle.questions) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-slate-400">Carregando batalha...</p>
      </div>
    )
  }

  const questions = battle.questions as any[]
  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Submeter respostas
      if (selectedAnswers.length === questions.length) {
        submitMutation.mutate(selectedAnswers)
      } else {
        toast.error('Responda todas as perguntas!')
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Boss HP Bar */}
        <Card className="mb-6 bg-gradient-to-r from-red-950/30 to-orange-950/30 border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Skull className="w-6 h-6 text-red-500" />
                <span className="font-bold">Boss HP</span>
              </div>
              <span className="text-red-400 font-bold">5 / 5</span>
            </div>
            <Progress value={100} className="h-4 bg-slate-800" />
            
            <div className="flex items-center justify-between mt-4 mb-2">
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-green-500" />
                <span className="font-bold">Sua Mana</span>
              </div>
              <span className="text-green-400 font-bold">{user?.manaDaily || 0} min</span>
            </div>
            <Progress value={(user?.manaDaily || 0) / 40 * 100} className="h-4 bg-slate-800" />
          </CardContent>
        </Card>

        {/* Question Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">
              Pergunta {currentQuestion + 1} de {questions.length}
            </span>
            <Badge variant="outline" className="bg-indigo-950/30 border-indigo-600">
              <Zap className="w-3 h-3 mr-1" />
              {progress.toFixed(0)}%
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl">{currentQ.question}</CardTitle>
            <CardDescription className="text-base text-slate-300">
              {currentQ.questionPT}
            </CardDescription>
            {currentQ.sentence && (
              <p className="mt-2 text-lg font-mono bg-slate-800/50 p-3 rounded-lg">
                "{currentQ.sentence}"
              </p>
            )}
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={selectedAnswers[currentQuestion]?.toString()} 
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            >
              <div className="space-y-3">
                {currentQ.options.map((option: string, idx: number) => (
                  <div
                    key={idx}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedAnswers[currentQuestion] === idx
                        ? 'border-indigo-600 bg-indigo-950/30'
                        : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'
                    }`}
                    onClick={() => handleAnswerSelect(idx)}
                  >
                    <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                    <Label 
                      htmlFor={`option-${idx}`} 
                      className="flex-1 cursor-pointer text-base"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
              className="flex-1"
            >
              Anterior
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            >
              {currentQuestion === questions.length - 1 ? (
                <>
                  <Trophy className="w-4 h-4 mr-2" />
                  Finalizar
                </>
              ) : (
                'Próxima'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
