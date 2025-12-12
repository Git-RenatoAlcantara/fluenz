# 🎮 Migração do Sistema RPG - Arcane Academy

## ⚠️ PASSO OBRIGATÓRIO - Execute isto AGORA!

O código está pronto, mas **as colunas RPG não existem no banco de dados**.

### 📋 Instruções:

1. **Acesse o Supabase:**
   - Vá para: https://supabase.com/dashboard
   - Selecione seu projeto
   
2. **Abra o SQL Editor:**
   - No menu lateral, clique em "SQL Editor"
   - Clique em "+ New query"

3. **Cole o SQL abaixo:**

```sql
-- Execute este SQL no Supabase para adicionar campos do Sistema RPG

-- Adicionar novos campos RPG na tabela user
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "manaDaily" INTEGER DEFAULT 0;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "gems" INTEGER DEFAULT 0;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "currentTitle" TEXT DEFAULT 'Novice Listener';
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "streakMultiplier" DOUBLE PRECISION DEFAULT 1.0;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "badges" TEXT[] DEFAULT '{}';

-- Verificar criação
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'user' 
  AND column_name IN ('manaDaily', 'gems', 'currentTitle', 'streakMultiplier', 'badges');
```

4. **Execute:**
   - Clique em "RUN" ou pressione `Ctrl + Enter`
   - Aguarde a confirmação ✅

5. **Verifique:**
   - A query de verificação mostrará as 5 novas colunas
   - Se aparecer a tabela com as colunas, está pronto!

---

## 🎨 Mudanças Implementadas (Arcane Academy Design)

### ✨ Removido:
- ❌ Header antigo com breadcrumbs e notifications
- ❌ Padding-bottom desnecessário
- ❌ Background claro (bg-slate-50/900)

### ✅ Adicionado:
- ✨ Background slate-950 (preto profundo)
- ✨ RPGHeader com gradiente indigo/purple
- ✨ Sidebar minimalista (3 botões)
- ✨ Cores Arcane Academy:
  - Indigo-600/500 (primário)
  - Purple-600/500 (secundário)
  - Emerald-500 (sucesso)
  - Orange-500 (streak)
  - Slate-800/700/400 (neutrals)

### 📄 Páginas Atualizadas:
- `/daily` - Quest Card com gradiente
- `/dashboard` - Stats cards com cores Arcane
- `/playlist` - Cards de vídeo com hover indigo
- Layout geral - Sem Header, só RPG Header + Sidebar

---

## 🚀 Após a Migração:

1. O app vai parar de dar erro 500
2. O RPGHeader vai mostrar:
   - ⭐ Nível 1
   - 💜 0 XP Total
   - 🔥 0 Streak
   - 💎 0 Gems (escondido quando 0)
   - 📊 Barra de Mana (0/40min)
   - 🏆 "Novice Listener"

3. Ao assistir vídeos:
   - XP aumenta (duração × 10 × multiplicador)
   - Mana preenche
   - Badges desbloqueiam
   - Nível sobe

## 🎯 Teste Final:

1. Execute a migração SQL ✅
2. Recarregue a página no navegador
3. Abra `/daily` ou `/playlist`
4. Deve aparecer o RPG Header sem erros
5. Assista um vídeo e veja o XP subir!

---

**💡 Dica:** Se não executar a migração, o erro `column user.xp does not exist` vai continuar aparecendo!
