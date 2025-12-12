'use client'

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getMyGuild, listGuilds, createGuild, joinGuild, leaveGuild, deleteGuild } from "../_actions/guild"
import { getUserProfile } from "../_actions/userProgress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Crown, Trophy, Target, Gem, Shield, UserPlus, LogOut, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function GuildClient() {
  const queryClient = useQueryClient()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newGuildName, setNewGuildName] = useState('')
  const [newGuildDescription, setNewGuildDescription] = useState('')
  const [newGuildIcon, setNewGuildIcon] = useState('🏰')

  const { data: myGuild, isLoading: isLoadingMyGuild, error: myGuildError } = useQuery({
    queryKey: ['my-guild'],
    queryFn: async () => {
      console.log('🔵 Buscando minha guilda...')
      const result = await getMyGuild()
      console.log('🔵 Resultado getMyGuild:', result)
      return result
    },
    refetchInterval: 10000
  })

  const { data: allGuilds = [] } = useQuery({
    queryKey: ['all-guilds'],
    queryFn: listGuilds,
    refetchInterval: 15000
  })

  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile
  })

  const createMutation = useMutation({
    mutationFn: () => createGuild(newGuildName, newGuildDescription, newGuildIcon),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Guilda criada!', {
          description: `Bem-vindo à ${data.guild?.name}`
        })
        setCreateDialogOpen(false)
        setNewGuildName('')
        setNewGuildDescription('')
        setNewGuildIcon('🏰')
        queryClient.invalidateQueries({ queryKey: ['my-guild'] })
        queryClient.invalidateQueries({ queryKey: ['all-guilds'] })
      } else {
        toast.error('Erro ao criar guilda', {
          description: data.error
        })
      }
    },
    onError: (error) => {
      console.error('Erro na mutation:', error)
      toast.error('Erro ao criar guilda', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    }
  })

  const joinMutation = useMutation({
    mutationFn: (guildId: number) => joinGuild(guildId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Você entrou na guilda!', {
          description: `Bem-vindo à ${data.guild?.name}`
        })
        queryClient.invalidateQueries({ queryKey: ['my-guild'] })
        queryClient.invalidateQueries({ queryKey: ['all-guilds'] })
      } else {
        toast.error('Erro', { description: data.error })
      }
    }
  })

  const leaveMutation = useMutation({
    mutationFn: leaveGuild,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Você saiu da guilda')
        queryClient.invalidateQueries({ queryKey: ['my-guild'] })
        queryClient.invalidateQueries({ queryKey: ['all-guilds'] })
      } else {
        toast.error('Erro', { description: data.error })
      }
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (guildId: number) => deleteGuild(guildId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Guilda deletada')
        queryClient.invalidateQueries({ queryKey: ['my-guild'] })
        queryClient.invalidateQueries({ queryKey: ['all-guilds'] })
      } else {
        toast.error('Erro', { description: data.error })
      }
    }
  })

  const weeklyProgress = myGuild ? (myGuild.currentWeekMinutes / myGuild.weeklyGoal) * 100 : 0

  console.log('🎯 Estado atual:', { myGuild, isLoadingMyGuild, myGuildError })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Guildas
          </h1>
          <p className="text-slate-400">Junte-se a outros estudantes e alcancem metas juntos</p>
          {isLoadingMyGuild && (
            <p className="text-yellow-400 mt-2">⏳ Carregando guilda...</p>
          )}
          {myGuildError && (
            <p className="text-red-400 mt-2">❌ Erro: {String(myGuildError)}</p>
          )}
        </div>

        <Tabs defaultValue={myGuild ? "my-guild" : "browse"} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-900">
            <TabsTrigger value="my-guild" disabled={!myGuild}>
              <Shield className="w-4 h-4 mr-2" />
              Minha Guilda
            </TabsTrigger>
            <TabsTrigger value="browse">
              <Users className="w-4 h-4 mr-2" />
              Explorar
            </TabsTrigger>
          </TabsList>

          {/* My Guild Tab */}
          <TabsContent value="my-guild" className="mt-6">
            {myGuild ? (
              <div className="space-y-6">
                {/* Guild Header */}
                <Card className="bg-gradient-to-br from-indigo-950/50 to-purple-950/50 border-indigo-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-6xl">{myGuild.icon}</div>
                        <div>
                          <CardTitle className="text-3xl">{myGuild.name}</CardTitle>
                          <CardDescription className="text-lg text-slate-300 mt-1">
                            {myGuild.description || 'Sem descrição'}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-indigo-600">
                        <Users className="w-4 h-4 mr-1" />
                        {myGuild.members.length}/{myGuild.maxMembers}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Weekly Goal Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-yellow-400" />
                          <span className="font-semibold">Meta Semanal</span>
                        </div>
                        <span className="text-sm text-slate-400">
                          {myGuild.currentWeekMinutes} / {myGuild.weeklyGoal} min
                        </span>
                      </div>
                      <Progress value={weeklyProgress} className="h-4" />
                      {weeklyProgress >= 100 && (
                        <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                          <Trophy className="w-4 h-4" />
                          Meta completada! Todos ganham +5 Gems
                        </p>
                      )}
                    </div>

                    {/* Owner Info */}
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <span>Líder: {myGuild.owner.name}</span>
                      <Badge variant="outline">{myGuild.owner.currentTitle}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2">
                    {myGuild.ownerId === user?.id ? (
                      <Button
                        onClick={() => myGuild && deleteMutation.mutate(myGuild.id)}
                        disabled={deleteMutation.isPending}
                        variant="destructive"
                        className="flex-1"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Deletar Guilda
                      </Button>
                    ) : (
                      <Button
                        onClick={() => leaveMutation.mutate()}
                        disabled={leaveMutation.isPending}
                        variant="outline"
                        className="flex-1"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair da Guilda
                      </Button>
                    )}
                  </CardFooter>
                </Card>

                {/* Members List */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle>Membros</CardTitle>
                    <CardDescription>
                      {myGuild.members.length} de {myGuild.maxMembers} vagas ocupadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {myGuild.members.map((member: any) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {member.id === myGuild.ownerId && (
                              <Crown className="w-5 h-5 text-yellow-400" />
                            )}
                            <div>
                              <p className="font-semibold">{member.name}</p>
                              <p className="text-sm text-slate-400">{member.currentTitle}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="text-center">
                              <p className="text-indigo-400 font-bold">Lv {member.level}</p>
                              <p className="text-xs text-slate-500">Nível</p>
                            </div>
                            <div className="text-center">
                              <p className="text-orange-400 font-bold">{member.streak}</p>
                              <p className="text-xs text-slate-500">Streak</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-400">Você não está em uma guilda</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Browse Guilds Tab */}
          <TabsContent value="browse" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Create Guild Card */}
              {!myGuild && (
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Card className="bg-gradient-to-br from-indigo-950/30 to-purple-950/30 border-indigo-800 border-dashed cursor-pointer hover:border-indigo-600 transition-colors">
                      <CardContent className="flex flex-col items-center justify-center h-full min-h-[250px] gap-4">
                        <UserPlus className="w-12 h-12 text-indigo-400" />
                        <div className="text-center">
                          <p className="font-semibold text-lg">Criar Nova Guilda</p>
                          <p className="text-sm text-slate-400 mt-1">
                            Reúna seus amigos
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Guilda</DialogTitle>
                      <DialogDescription>
                        Defina o nome e descrição da sua guilda
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Ícone</Label>
                        <Input
                          value={newGuildIcon}
                          onChange={(e) => setNewGuildIcon(e.target.value)}
                          placeholder="🏰"
                          maxLength={2}
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                      <div>
                        <Label>Nome da Guilda</Label>
                        <Input
                          value={newGuildName}
                          onChange={(e) => setNewGuildName(e.target.value)}
                          placeholder="Os Mestres do Inglês"
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                      <div>
                        <Label>Descrição (opcional)</Label>
                        <Textarea
                          value={newGuildDescription}
                          onChange={(e) => setNewGuildDescription(e.target.value)}
                          placeholder="Guilda focada em estudar todos os dias..."
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          console.log('🔵 Botão clicado!')
                          console.log('Nome:', newGuildName)
                          console.log('Descrição:', newGuildDescription)
                          console.log('Ícone:', newGuildIcon)
                          createMutation.mutate()
                        }}
                        disabled={!newGuildName || createMutation.isPending}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        {createMutation.isPending ? 'Criando...' : 'Criar Guilda'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* Guild Cards */}
              {allGuilds.map((guild: any) => (
                <Card key={guild.id} className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{guild.icon}</div>
                        <div>
                          <CardTitle className="text-xl">{guild.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {guild.description || 'Sem descrição'}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Membros</span>
                      <Badge variant="outline">
                        {guild._count.members}/{guild.maxMembers}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Líder</span>
                      <span>{guild.owner.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Progresso Semanal</span>
                      <span className="text-green-400">
                        {guild.currentWeekMinutes} / {guild.weeklyGoal} min
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => joinMutation.mutate(guild.id)}
                      disabled={
                        joinMutation.isPending ||
                        !!myGuild ||
                        guild._count.members >= guild.maxMembers
                      }
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      {guild._count.members >= guild.maxMembers ? (
                        'Guilda Cheia'
                      ) : myGuild ? (
                        'Você já está em uma guilda'
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Entrar
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
