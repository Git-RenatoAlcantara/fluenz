'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FlaskConical, Snowflake, Scroll, Palette, Frame, Sparkles, Gem, Lock, ShoppingCart, Loader2 } from "lucide-react"
import { getShopItems, purchaseItem } from "../_actions/shop"
import { getUserProfile } from "../_actions/userProgress"
import { useToast } from "@/hooks/use-toast"

// Mapeamento de ícones por effectType
const ICON_MAP: Record<string, any> = {
  xp_boost: FlaskConical,
  streak_freeze: Snowflake,
  quest_reroll: Scroll,
  theme: Palette,
  frame: Frame,
  artifact: Sparkles,
}

// Mapeamento de cores por tipo
const TYPE_COLORS: Record<string, { color: string, bgColor: string, borderColor: string }> = {
  potion: { color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/20" },
  cosmetic: { color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/20" },
  artifact: { color: "text-indigo-400", bgColor: "bg-indigo-500/10", borderColor: "border-indigo-500/20" },
}

type ShopItem = {
  id: number
  name: string
  description: string | null
  type: string
  cost: number
  effectType: string | null
  effectValue: number | null
  duration: number | null
  icon: string | null
}

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState("potion")
  const [userGems, setUserGems] = useState(0)
  const [items, setItems] = useState<ShopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<number | null>(null)
  const { toast } = useToast()

  // Carregar itens e dados do usuário
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [shopItems, userProfile] = await Promise.all([
          getShopItems(),
          getUserProfile()
        ])
        setItems(shopItems)
        setUserGems(userProfile?.gems || 0)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os itens da loja.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Filtrar itens pela aba ativa
  const filteredItems = items.filter(item => item.type === activeTab)

  const handleBuy = async (item: ShopItem) => {
    if (userGems < item.cost) {
      toast({
        title: "Gemas insuficientes!",
        description: `Você tem ${userGems} 💎, precisa de ${item.cost} 💎`,
        variant: "destructive"
      })
      return
    }

    setPurchasing(item.id)
    try {
      const result = await purchaseItem(item.id)
      
      if (result.success) {
        setUserGems(result.remainingGems || 0)
        toast({
          title: "Compra realizada! ✨",
          description: `Você comprou ${item.name}!`,
        })
      } else {
        toast({
          title: "Erro na compra",
          description: result.error || "Não foi possível comprar o item.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar a compra.",
        variant: "destructive"
      })
    } finally {
      setPurchasing(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header da Loja */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Loja Arcana
            </h1>
            <p className="text-slate-400">Aprimore sua jornada com itens mágicos e cosméticos.</p>
          </div>

          {/* Card de Saldo de Gemas */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3 shadow-lg">
            <div className="p-2 bg-cyan-950/50 rounded-lg text-cyan-400">
              <Gem size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Suas Gemas</p>
              <p className="text-2xl font-bold text-white">{userGems}</p>
            </div>
            <Button size="sm" variant="outline" className="ml-4 border-slate-700 hover:bg-slate-800">
              + Adicionar
            </Button>
          </div>
        </div>

        {/* Navegação de Abas Customizada */}
        <div className="flex p-1 bg-slate-900/50 rounded-lg border border-slate-800 w-fit">
          <button
            onClick={() => setActiveTab("potion")}
            className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "potion" 
                ? "bg-slate-800 text-white shadow-sm" 
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <FlaskConical size={16} className={activeTab === "potion" ? "text-blue-400" : ""} />
            Poções
          </button>
          <button
            onClick={() => setActiveTab("cosmetic")}
            className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "cosmetic" 
                ? "bg-slate-800 text-white shadow-sm" 
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Palette size={16} className={activeTab === "cosmetic" ? "text-purple-400" : ""} />
            Cosméticos
          </button>
          <button
            onClick={() => setActiveTab("artifact")}
            className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "artifact" 
                ? "bg-slate-800 text-white shadow-sm" 
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Sparkles size={16} className={activeTab === "artifact" ? "text-indigo-400" : ""} />
            Artefatos
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-indigo-400" size={32} />
          </div>
        )}

        {/* Grid de Itens */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const Icon = ICON_MAP[item.effectType || 'artifact'] || Sparkles
              const colors = TYPE_COLORS[item.type] || TYPE_COLORS.artifact
              const canAfford = userGems >= item.cost
              const isLegendary = item.type === 'artifact'
              const isPurchasing = purchasing === item.id

              return (
                <Card 
                  key={item.id} 
                  className={`bg-slate-900/40 border-slate-800 hover:border-slate-700 transition-all hover:bg-slate-900/60 flex flex-col ${isLegendary ? 'border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.1)]' : ''}`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className={`p-3 rounded-xl ${colors.bgColor} ${colors.color} border ${colors.borderColor}`}>
                        <Icon size={24} />
                      </div>
                      <Badge variant="secondary" className="bg-slate-950 border-slate-800 flex items-center gap-1 text-cyan-400">
                        <Gem size={12} />
                        {item.cost}
                      </Badge>
                    </div>
                    <CardTitle className={`mt-4 text-xl ${isLegendary ? 'text-indigo-300' : 'text-slate-100'}`}>
                        {item.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription className="text-slate-400 leading-relaxed">
                      {item.description || "Item mágico da loja arcana."}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      className={`w-full gap-2 font-semibold ${
                        canAfford 
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                          : "bg-slate-800 text-slate-500 cursor-not-allowed hover:bg-slate-800"
                      }`}
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford || isPurchasing}
                    >
                      {isPurchasing ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Comprando...
                        </>
                      ) : canAfford ? (
                        <>
                          <ShoppingCart size={16} /> Comprar
                        </>
                      ) : (
                        <>
                          <Lock size={16} /> Insuficiente
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })
          ) : (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
              <div className="p-4 bg-slate-900 rounded-full mb-4 opacity-50">
                <Lock size={32} />
              </div>
              <p>Nenhum item disponível nesta categoria no momento.</p>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  )
}