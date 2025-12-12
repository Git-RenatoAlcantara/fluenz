# Instruções para Executar Migração do Skill Tree e Loja

## 🎯 Objetivo
Esta migração adiciona o sistema de Skill Tree (Árvore de Habilidades) e Loja de Gems ao banco de dados.

## 📋 Pré-requisitos
- Acesso ao Supabase Dashboard
- Projeto: fluenz
- Conexão ativa com o banco PostgreSQL

## 🔧 Passos para Executar

### 1. Acesse o SQL Editor do Supabase
1. Entre em: https://supabase.com/dashboard/project/[SEU_PROJECT_ID]
2. No menu lateral, clique em **SQL Editor**
3. Clique em **New query**

### 2. Execute o Script de Migração
1. Abra o arquivo `SKILL_TREE_LOJA_MIGRATION.sql` na raiz do projeto
2. Copie TODO o conteúdo do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** (ou pressione Ctrl+Enter)

### 3. Verifique a Execução
Você deve ver as seguintes mensagens de sucesso:
```
✓ ALTER TABLE video ADD COLUMN category
✓ CREATE TABLE skill_tree
✓ CREATE TABLE item
✓ CREATE TABLE user_item
✓ INSERT INTO item (6 rows inserted)
✓ CREATE INDEX idx_skill_tree_user
✓ CREATE INDEX idx_user_item_user
✓ CREATE INDEX idx_user_item_active
```

### 4. Validação
Execute a query abaixo para confirmar que os dados foram inseridos:

```sql
SELECT * FROM item;
```

Você deve ver 6 itens:
- 🧪 Potion of Clarity (5 gems)
- 🧊 Streak Freeze (10 gems)
- 📜 Quest Reroll Scroll (2 gems)
- 🌑 Dark Necromancer Theme (20 gems)
- ✨ High Elf Gold Theme (20 gems)
- 🌆 Cyberpunk Neon Theme (20 gems)

## 📊 O Que Foi Criado

### Novas Tabelas:

**1. skill_tree**
- Armazena os 4 atributos RPG de cada usuário
- `intellect`: Pontos de gramática (vídeos de grammar)
- `charisma`: Pontos de listening (vídeos de listening)
- `perception`: Pontos de filmes (vídeos de movies)
- `wisdom`: Pontos de notícias (vídeos de news)

**2. item**
- Catálogo de itens disponíveis na loja
- Tipos: potion, cosmetic, artifact
- Efeitos: xp_boost, streak_freeze, quest_reroll

**3. user_item**
- Inventário de itens dos usuários
- Rastreia quantidade, status ativo, data de expiração

### Modificações:

**video table**
- Nova coluna `category`: Classifica vídeos em grammar/listening/movies/news

## 🎮 Como Funciona

### Skill Tree:
1. Ao assistir um vídeo, o sistema verifica sua categoria
2. Atribui pontos ao atributo correspondente (1 ponto/minuto)
3. O atributo com mais pontos determina sua classe:
   - 📚 **Scholar** (Intellect dominante)
   - 🎭 **Bard** (Charisma dominante)
   - 🎬 **Ranger** (Perception dominante)
   - 🔮 **Mage** (Wisdom dominante)

### Loja:
1. Use gems para comprar itens
2. Poções dão buffs temporários (ex: 2x XP por 30min)
3. Cosméticos são permanentes
4. Itens ativos aparecem no header

## ⚠️ Troubleshooting

### Erro: "column already exists"
Se você já executou parte da migração, rode primeiro:
```sql
-- Limpar tentativas anteriores (cuidado em produção!)
DROP TABLE IF EXISTS user_item;
DROP TABLE IF EXISTS item;
DROP TABLE IF EXISTS skill_tree;
ALTER TABLE video DROP COLUMN IF EXISTS category;
```

### Erro: "relation does not exist"
Certifique-se de que as tabelas `users` e `video` existem e estão acessíveis.

### Erro: "permission denied"
Verifique se você tem permissões de ALTER TABLE e CREATE TABLE no Supabase.

## 🚀 Próximos Passos

Após executar a migração:
1. ✅ Acesse `/shop` para ver a loja funcionando
2. ✅ Acesse `/skills` para ver sua Skill Tree
3. ✅ Faça upload de um vídeo e defina sua categoria
4. ✅ Assista o vídeo para ganhar pontos de skill
5. ✅ Use gems para comprar poções

## 📝 Notas Importantes

- **Categorias de vídeos**: Você precisará adicionar a categoria manualmente aos vídeos existentes
- **Gems iniciais**: Usuários começam com 0 gems, ganham 1 gem ao completar daily quest (40min)
- **Skill points**: São calculados retroativamente apenas para novos vídeos assistidos
- **Itens ativos**: Expire automaticamente após o tempo definido

---

**Data de criação**: 28/11/2024  
**Versão**: 1.0  
**Autor**: Sistema Arcane Academy
