# 🎮 Sistema RPG - Arcane Academy

## 📋 Visão Geral

O **Arcane Academy** é um sistema de gamificação RPG completo implementado para incentivar o aprendizado consistente de inglês através de vídeos. O sistema recompensa os usuários com XP, níveis, badges e gems baseado em seu progresso e consistência.

---

## 🏆 Mecânicas Principais

### 1. Sistema de XP e Níveis

#### Ganho de XP
- **Fórmula Base**: `XP = duração do vídeo (minutos) × 10`
- **Multiplicador de Streak**: XP base × streak multiplier
- **Exemplo**: Vídeo de 5 minutos = 50 XP base

#### Cálculo de Nível
```javascript
nivel = Math.floor(Math.sqrt(xp) * 0.1) + 1
```

**Progressão de XP por Nível:**
- Nível 1: 0 XP
- Nível 2: 100 XP
- Nível 3: 400 XP
- Nível 4: 900 XP
- Nível 5: 1,600 XP
- Nível 10: 9,900 XP
- Nível 20: 39,900 XP
- Nível 50: 249,900 XP
- Nível 100: 999,900 XP

**Característica**: Curva de progressão √ (raiz quadrada) para evitar nivelamento muito rápido em níveis altos.

---

### 2. Sistema de Títulos

Os usuários recebem títulos baseados em seu nível atual:

| Nível | Título | Descrição |
|-------|--------|-----------|
| 1-4 | **Novice Listener** | Iniciando sua jornada linguística |
| 5-9 | **Apprentice Speaker** | Desenvolvendo habilidades básicas |
| 10-19 | **Skilled Conversationalist** | Conversação fluente em desenvolvimento |
| 20-39 | **Master Polyglot** | Domínio avançado do idioma |
| 40-59 | **Legendary Linguist** | Expertise excepcional |
| 60-99 | **Mythical Word Weaver** | Maestria lendária |
| 100+ | **Language God** | Transcendeu os limites do aprendizado |

**Atualização**: Automática ao atingir novo nível.

---

### 3. Sistema de Streak (Sequência)

#### Como Funciona
- **Streak**: Conta dias consecutivos de estudo
- **Resetado**: Se passar 1 dia sem estudar
- **Cálculo**: Baseado em `lastStudyDate` comparado com data atual

#### Multiplicadores de Streak

| Dias de Streak | Multiplicador | Cor | Benefício |
|----------------|---------------|-----|-----------|
| 0-6 dias | **1.0x** | Cinza | XP normal |
| 7-29 dias | **1.2x** | Laranja | +20% XP |
| 30+ dias | **1.5x** | Dourado | +50% XP |

#### Exemplo de Impacto
```
Vídeo de 10 minutos (100 XP base):
- Sem streak (0-6 dias): 100 XP
- Streak 7-29 dias: 120 XP
- Streak 30+ dias: 150 XP
```

---

### 4. Sistema de Mana Diária (Quest Diária)

#### Conceito
- **Meta Diária**: 40 minutos de estudo
- **Mana**: Representa progresso na quest diária
- **Resetado**: Automaticamente à meia-noite

#### Funcionamento
1. Cada minuto assistido = 1 mana
2. Máximo: 40 mana por dia
3. Ao atingir 40 mana → **Quest Completa!**

#### Recompensas ao Completar Quest Diária
- **Bônus de XP**: +100 XP extra
- **Gem**: +1 💎

#### Visualização
- Barra de progresso gradient (purple → indigo)
- Animação shimmer quando em progresso
- Badge "Quest Completa!" quando atinge 40min
- Texto: `X / 40 min`

---

### 5. Sistema de Badges (Conquistas)

#### Lista de Badges Disponíveis

| Badge | Nome | Condição | Descrição |
|-------|------|----------|-----------|
| 🏁 | **first_blood** | Assistir primeiro vídeo | Primeira vitória |
| 🌅 | **early_bird** | Estudar antes das 9h | Madrugador |
| 🌙 | **night_owl** | Estudar após 22h | Coruja noturna |
| 🎯 | **daily_quest_master** | Completar quest diária (40min) | Mestre das quests |
| 🔥 | **week_warrior** | 7 dias de streak | Guerreiro semanal |
| 👑 | **month_legend** | 30 dias de streak | Lenda mensal |

#### Desbloqueio
- **Automático**: Verificado a cada atualização de progresso
- **Único**: Cada badge só pode ser ganho uma vez
- **Persistente**: Armazenado como array no banco de dados

#### Detecção de Horário
```javascript
const hora = new Date().getHours()
// Early Bird: hora < 9
// Night Owl: hora >= 22
```

---

### 6. Sistema de Gems (Moeda Premium)

#### Como Ganhar
- **Quest Diária**: +1 gem ao completar 40 minutos
- **Futuro**: Streaks longos, achievements especiais

#### Uso Potencial (Planejado)
- Comprar temas visuais
- Desbloquear avatares
- Streak freeze (proteger sequência)
- Recompensas cosméticas

#### Visualização
- Ícone: 💎 (Gem - Lucide React)
- Cor: Cyan (cyan-300)
- Efeito: Drop shadow com glow
- **Condicional**: Só aparece se `gems > 0`

---

## 🎨 Interface Visual (RPG Header)

### Elementos do Header

#### 1. Logo e Título
- **Ícone**: 🏆 Trophy (gradient purple → indigo)
- **Título**: "Arcane Academy" (gradient text)
- **Subtítulo**: Título atual do usuário
- **Efeitos**: Ring border, glow shadow

#### 2. Stats Cards (Desktop)
Todos com `bg-indigo-800/50` e `border-indigo-600/50`:

##### Nível
- **Label**: "NÍVEL" (uppercase, indigo-300)
- **Valor**: Número grande (yellow-400)
- **Efeito**: Glow dourado

##### XP Total
- **Label**: "XP TOTAL"
- **Valor**: Número formatado com vírgulas (purple-300)

##### Streak
- **Label**: "STREAK"
- **Ícone**: 🔥 Flame (orange-500 com fill)
- **Valor**: Dias (orange-400)
- **Multiplicador**: `×1.2` ou `×1.5` (emerald-400) quando > 1

##### Gems
- **Ícone**: 💎 Gem (cyan-400)
- **Valor**: Quantidade (cyan-300)
- **Visibilidade**: `{gems > 0 && ...}`

#### 3. Barra de Mana
- **Label**: ⚡ "Mana Diária"
- **Progresso**: `X / 40 min`
- **Background**: `bg-slate-900/50` com border
- **Fill**: Gradient `purple-600 → indigo-600 → purple-600`
- **Animação**: Shimmer deslizante (2s loop infinito)
- **Badge Completo**: "✓ Quest Completa!" (emerald-400, pulse)

---

## 💾 Estrutura de Dados

### Modelo User (Prisma Schema)

```prisma
model user {
  id                Int       @id @default(autoincrement())
  email             String    @unique
  password          String
  
  // Campos RPG
  xp                Int       @default(0)
  level             Int       @default(1)
  streak            Int       @default(0)
  lastStudyDate     String?
  manaDaily         Int       @default(0)
  gems              Int       @default(0)
  currentTitle      String    @default("Novice Listener")
  streakMultiplier  Float     @default(1.0)
  badges            String[]  @default([])
  
  // Relacionamentos
  videos            video[]
  dailyStats        DailyStats[]
}
```

### Modelo DailyStats

```prisma
model DailyStats {
  id              Int      @id @default(autoincrement())
  userId          Int
  date            String   // Formato: YYYY-MM-DD
  totalWatchTime  Int      @default(0) // Em minutos
  videosWatched   Int      @default(0)
  
  user            user     @relation(fields: [userId], references: [id])
  
  @@unique([userId, date])
}
```

---

## 🔄 Fluxo de Atualização de Progresso

### Função: `updateUserProgress(videoDuration)`

```javascript
// 1. Buscar usuário atual
const user = await prisma.user.findUnique({ where: { id: userId } })

// 2. Detectar novo dia e resetar mana
const hoje = new Date().toISOString().split('T')[0]
if (user.lastStudyDate !== hoje) {
  manaDaily = 0
}

// 3. Atualizar mana diária
const novoManaDaily = Math.min(manaDaily + durationMinutes, 40)

// 4. Calcular streak
let streak = user.streak
if (lastStudyDate === ontem) {
  streak++ // Consecutivo
} else if (lastStudyDate !== hoje) {
  streak = 1 // Resetar
}

// 5. Obter multiplicador de streak
const multiplier = getStreakMultiplier(streak)

// 6. Calcular XP
const baseXP = durationMinutes * 10
const finalXP = Math.round(baseXP * multiplier)
const novoXP = user.xp + finalXP

// 7. Calcular novo nível
const novoLevel = calculateLevel(novoXP)
const leveledUp = novoLevel > user.level

// 8. Verificar daily quest
const dailyQuestComplete = 
  user.manaDaily < 40 && novoManaDaily >= 40

// 9. Adicionar bônus de quest
if (dailyQuestComplete) {
  novoXP += 100
  gems += 1
}

// 10. Desbloquear badges
const newBadges = checkAndUnlockBadges(user, novoManaDaily)

// 11. Atualizar título se levelou
if (leveledUp) {
  currentTitle = getTitleForLevel(novoLevel)
}

// 12. Salvar no banco
await prisma.user.update({
  where: { id: userId },
  data: {
    xp: novoXP,
    level: novoLevel,
    streak,
    lastStudyDate: hoje,
    manaDaily: novoManaDaily,
    gems,
    currentTitle,
    streakMultiplier: multiplier,
    badges: { push: newBadges }
  }
})

// 13. Retornar feedback
return {
  xp: novoXP,
  level: novoLevel,
  streak,
  xpGain: finalXP,
  leveledUp,
  newTitle: leveledUp ? currentTitle : null,
  dailyQuestComplete,
  bonusGems: dailyQuestComplete ? 1 : 0,
  newBadges
}
```

---

## 📊 APIs e Rotas

### GET `/api/user-profile`

**Retorna perfil completo do usuário:**

```typescript
{
  xp: number,
  level: number,
  streak: number,
  manaDaily: number,
  maxMana: 40,
  manaPercentage: number,
  gems: number,
  currentTitle: string,
  titleDescription: string,
  streakMultiplier: number,
  badges: string[]
}
```

**Atualização**: A cada 5 segundos (refetchInterval: 5000)

### POST `/play/[id]/_actions/updateVideoAction`

**Marca vídeo como assistido e atualiza progresso RPG**

```typescript
// Integração com sistema RPG
const result = await updateUserProgress(durationMinutes)

// Feedback ao usuário
toast({
  title: `+${result.xpGain} XP!`,
  description: result.leveledUp 
    ? `Parabéns! Você atingiu o nível ${result.level}!`
    : undefined
})
```

---

## 🎯 Estratégias de Engajamento

### 1. Progressão Visível
- XP e nível sempre visíveis no header
- Barra de mana mostra progresso diário
- Feedback imediato ao completar vídeos

### 2. Recompensas Diárias
- Quest de 40 minutos incentiva consistência
- Bônus de XP + gem ao completar
- Reset diário cria ciclo de hábito

### 3. Streaks e Multiplicadores
- Recompensa consistência com +50% XP
- Badges de streak (7 e 30 dias)
- Visual de flame com multiplicador

### 4. Sistema de Conquistas
- 6 badges diferentes para variedade
- Desafios de horário (early bird, night owl)
- Milestones de progresso

### 5. Hierarquia de Títulos
- 7 tiers de títulos mantém senso de progressão
- Títulos épicos em níveis altos motivam
- Títulos visíveis no header

---

## 🔮 Expansões Futuras Planejadas

### Sistema de Gems
- [ ] Loja de temas visuais
- [ ] Avatares customizáveis
- [ ] Streak freeze (preservar sequência)
- [ ] Badges premium

### Novos Badges
- [ ] Marathon Runner (assistir 3h em 1 dia)
- [ ] Perfectionist (completar playlist inteira)
- [ ] Speed Learner (5 vídeos em 1 dia)
- [ ] Weekend Warrior (estudar sábado e domingo)

### Social Features
- [ ] Leaderboard global/semanal
- [ ] Comparação com amigos
- [ ] Desafios em grupo
- [ ] Compartilhar conquistas

### Gamificação Avançada
- [ ] Sistema de missões semanais
- [ ] Eventos temporários (2x XP)
- [ ] Conquistas secretas
- [ ] Sistema de clãs/guildas

---

## 📱 Responsividade

### Desktop
- Header completo com todas as stats
- Sidebar lateral fixa
- Layout horizontal otimizado

### Mobile
- Header compacto (stats empilhadas)
- Bottom navigation fixa
- Barra de mana responsiva
- Padding bottom para não sobrepor navigation

---

## 🎨 Paleta de Cores Arcane Academy

### Primárias
- **Indigo**: 900, 800, 700, 600, 500, 400, 300, 200
- **Purple**: 900, 800, 600, 500, 400, 300, 200
- **Slate**: 950, 900, 800, 700, 400, 300, 200, 100

### Acentos
- **Yellow**: 400 (Nível)
- **Orange**: 500, 400 (Streak)
- **Emerald**: 500, 400 (Sucesso)
- **Cyan**: 400, 300 (Gems)
- **Red**: 500, 400 (Danger)

### Gradientes
- Header: `from-indigo-900 via-purple-900 to-indigo-900`
- Logo: `from-purple-500 to-indigo-600`
- Título: `from-purple-200 to-indigo-200`
- Mana Bar: `from-purple-600 via-indigo-600 to-purple-600`

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 6.19.0
- **State Management**: React Query 5.62.0
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **UI Components**: Radix UI

---

## 📝 Notas de Implementação

### Performance
- React Query com staleTime: 0 para dados sempre frescos
- RefetchInterval de 5s no RPG Header
- Índices no banco para `userId` e `date`

### Segurança
- JWT com dual cookie system
- Validação de userId em todas as operações
- Server actions protegidas

### UX
- Feedback visual imediato (toasts)
- Animações suaves (transitions)
- Loading states em todas as operações
- Error handling com mensagens amigáveis

---

## 🚀 Como Testar o Sistema

1. **Executar migração SQL** (ver `MIGRAÇÃO_RPG.md`)
2. **Assistir um vídeo** até 90%+
3. **Verificar XP gain** no header (atualiza em 5s)
4. **Completar 40 minutos** para ver quest completa
5. **Assistir em horários diferentes** para badges
6. **Manter streak** por 7 e 30 dias para multiplicadores

---

## 📞 Referências de Código

### Arquivos Principais
- `app/(page)/(authorized)/_actions/userProgress.ts` - Lógica RPG
- `components/global/RPGHeader.tsx` - Interface visual
- `app/api/user-profile/route.ts` - API de perfil
- `prisma/schema.prisma` - Modelos de dados
- `UPDATE_RPG_SYSTEM.sql` - Migração de banco

---

**Versão**: 1.0  
**Última atualização**: 28/11/2025  
**Status**: ✅ Implementado e funcional (aguardando migração SQL)
