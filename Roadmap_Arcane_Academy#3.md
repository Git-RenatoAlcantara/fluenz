🗺️ Roadmap de Evolução: Arcane Academy

Este documento propõe expansões para o sistema base do Arcane Academy, transformando o "tracking passivo" em "aprendizado ativo" e criando uma economia vibrante para as Gems.

1. ⚔️ Mecânica de "Boss Battles" (Aprendizado Ativo)

O Problema Atual: O sistema recompensa apenas assistir. O usuário pode dar play e sair da sala.
A Solução: Implementar desafios de validação (Quizzes) temáticos gerados por IA.

1.1 O Conceito

A cada 5 Níveis ou ao completar uma Playlist Temática, o usuário enfrenta um "Boss".

O Gatilho: Ao atingir o nível 5, 10, 15, o botão "Próximo Vídeo" é substituído por "Boss Battle".

O Boss: Um Quiz de 5 perguntas geradas por IA baseadas no conteúdo consumido recentemente.

A Batalha:

HP do Boss: 5 Pontos de Vida (1 por questão).

HP do Jogador: Sua barra de Mana atual.

Mecânica: Acertar = Dano no Boss (-1 HP). Errar = Dano no Jogador (-10 Mana).

Derrota: Se a Mana zerar antes do Boss morrer, o usuário deve estudar mais (assistir +20 min) para tentar novamente.

1.2 Especificação Técnica (Fluxo de Dados)

Coleta de Contexto: O backend busca as legendas/transcrições dos últimos 3 vídeos assistidos pelo usuário.

Geração (AI Prompt): Envia para OpenAI/Gemini:

"Crie 5 perguntas de múltipla escolha (inglês com tradução) baseadas nestes textos, focando em vocabulário e interpretação. Retorne em JSON."

Persistência: Salva a batalha no banco como 'PENDING'.

1.3 Schema Prisma (Boss Battle)

Adicionar ao schema.prisma para suportar a feature:

model BossBattle {
  id        Int      @id @default(autoincrement())
  userId    Int
  level     Int      // O nível que desbloqueou este boss (ex: 5, 10)
  status    String   // 'PENDING', 'VICTORY', 'DEFEAT'
  questions Json     // Array de { q: string, options: string[], correct: int }
  rewards   Json?    // { xp: 500, item: "Golden Quill" }
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id])
}



1.4 Loot (Recompensa)

XP: 500 XP (equivalente a 50 min de estudo).

Artifacts: Itens únicos (ex: "Pena da Sabedoria" - +5% XP permanente em vídeos de gramática).

Título Especial: Desbloqueia sufixos (ex: "Novice Listener Slayer").

2. 🌳 Árvore de Habilidades (Skill Tree)

O Problema Atual: Nível único e genérico. Um usuário pode ser nível 50 só assistindo desenhos infantis, sem desenvolver gramática ou vocabulário técnico.
A Solução: Diferenciar tipos de conteúdo através de Tags RPG que alimentam atributos específicos.

2.1 O Conceito (Classes e Atributos)

Cada vídeo adicionado receberá uma Tag de Classe. O XP ganho conta para o nível geral, mas também acumula em atributos específicos.

Tag do Vídeo

Atributo RPG

Classe RPG

Foco de Aprendizado

Grammar / Classes

Intelecto (INT)

Scholar (Escriba)

Estrutura, regras, escrita.

Podcast / Vlog

Carisma (CHA)

Bard (Bardo)

Listening, gírias, fluidez.

Movies / Series

Percepção (PER)

Ranger (Patrulheiro)

Contexto, cultura, sotaques.

News / Tech / Doc

Sabedoria (WIS)

Mage (Mago)

Vocabulário técnico, formalidade.

2.2 Especificação Técnica (Fluxo de Dados)

Tagging (Classificação):

Manual: Dropdown ao adicionar vídeo: "Qual o foco deste vídeo?".

Automático (IA): Se o link for do YouTube, a API analisa título/descrição e sugere a tag.

Cálculo de XP Distribuído:

Ao completar um vídeo de 10 min (100 XP) com tag "Grammar":

User.xp += 100 (Nível Geral)

SkillTree.intellect += 100 (Atributo Específico)

Níveis de Habilidade:

Cada atributo tem seu próprio nível (1-100).

Exemplo: Usuário Nível 10 (Geral), mas Scholar Nível 2 e Bardo Nível 8.

2.3 Schema Prisma (Skill Tree)

Adicionar ao schema.prisma. A relação é 1:1 com o User.

model SkillTree {
  id        Int  @id @default(autoincrement())
  userId    Int  @unique
  
  // Atributos (Acumulam XP específico)
  intellect Int  @default(0) // Grammar
  charisma  Int  @default(0) // Speaking/Listening
  perception Int @default(0) // Movies/Series
  wisdom    Int  @default(0) // News/Doc
  
  // Metadados para UI
  primaryClass String @default("Novice") // A classe com maior nível
  
  user      User @relation(fields: [userId], references: [id])
}

// Atualizar model Video para incluir a tag
model Video {
  // ... campos existentes ...
  rpgTag    String @default("general") // 'grammar', 'podcast', 'movie', 'news'
}


2.4 Visualização (Radar Chart)

No perfil do usuário, exibir um gráfico de radar (Spider Chart) usando recharts.

Eixo: 0 a 100 (Nível do Atributo).

Dados:

const data = [
  { subject: 'Scholar (INT)', A: calculateLevel(skillTree.intellect), fullMark: 100 },
  { subject: 'Bard (CHA)', A: calculateLevel(skillTree.charisma), fullMark: 100 },
  { subject: 'Ranger (PER)', A: calculateLevel(skillTree.perception), fullMark: 100 },
  { subject: 'Mage (WIS)', A: calculateLevel(skillTree.wisdom), fullMark: 100 },
];


3. 💎 Economia de Gems (A Loja do Alquimista)

O Problema Atual: As Gems acumulam sem uso claro além de cosméticos futuros.
A Solução: Itens consumíveis que afetam o gameplay.

Catálogo da Loja

Poções (Consumíveis):

🧪 Potion of Clarity (Double XP): Dobra o XP pelos próximos 30 minutos. Custo: 5 Gems.

🧊 Streak Freeze (Cryo Crystal): Protege o streak se você faltar um dia. Custo: 10 Gems.

📜 Quest Reroll Scroll: Troca uma missão diária difícil por outra aleatória. Custo: 2 Gems.

Cosméticos de Interface:

Temas de UI: "Dark Necromancer", "High Elf Gold", "Cyberpunk Neon".

Bordas de Avatar: Molduras animadas para o perfil.

4. 🏰 Sistema de Guildas (Social)

O Problema Atual: Jornada solitária.
A Solução: Grupos pequenos focados em responsabilidade mútua (Accountability).

Formação: Guildas de até 10 pessoas.

Guild Quest: "Se a guilda somar 1000 minutos de estudo esta semana, todos ganham 5 Gems."

Buffs de Guilda: Se todos os membros estudarem hoje, todos ganham +10% XP amanhã.

5. 🤖 Integração Técnica Sugerida (IA + YouTube)

Para automatizar a experiência e reduzir o atrito manual:

Metadata Fetching Automático:

Ao colar o link do YouTube, usar a API youtube-dl-exec (ou API oficial) no backend para puxar: Título, Thumbnail, Duração exata e Legendas (CC).

Geração de Tags com IA:

Passar a descrição/título para uma LLM classificar automaticamente: "Este vídeo é de Gramática ou Listening?" -> Atribui a Tag RPG.

Resumo Mágico:

Botão "Gerar Grimório": Cria um resumo em tópicos (bullet points) do vídeo assistido para salvar nas notas do usuário.

📋 Resumo das Novas Tabelas (Prisma Schema Update)

Para suportar essas melhorias, você precisaria expandir seu schema atual:

model Item {
  id          Int      @id @default(autoincrement())
  name        String
  type        String   // 'potion', 'skin', 'artifact'
  cost        Int
  effect      Json     // { "type": "xp_boost", "value": 2.0, "duration": 30 }
  users       UserItem[]
}

model UserItem {
  id        Int     @id @default(autoincrement())
  userId    Int
  itemId    Int
  quantity  Int     @default(1)
  user      User    @relation(fields: [userId], references: [id])
  item      Item    @relation(fields: [itemId], references: [id])
}

// SkillTree e BossBattle já definidos nas seções acima
