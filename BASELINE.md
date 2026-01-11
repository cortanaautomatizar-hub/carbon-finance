# 🔧 Baseline do Projeto - Ponto de Partida

## Status Atual ✅

**Este é o estado funcional de referência do projeto Carbon Finance.**

### Informações do Commit

- **Hash:** `f5efe5f`
- **Mensagem:** "Update: Adicionar calendario dark theme em Assinaturas e melhorar CardsSummary com Dialog"
- **Data:** Janeiro 6, 2026
- **Status:** Totalmente funcional

### Vercel Deployment

- **ID do Deployment:** `5sLtHnnhT`
- **Ambiente:** Production
- **Status:** Ready ✅
- **URL de Produção:** https://carbon-finance-vqbg.vercel.app
- **Duração do Build:** 14s

## ⚠️ Histórico de Problemas

### Commits com Erro ❌
- Commits posteriores a `f5efe5f` (especialmente os das 19h de janeiro 11) causaram **tela preta ao carregar**
- Erro identificado manualmente testando cada deployment
- **Solução:** Deletados do Vercel, mantido apenas `5sLtHnnhT`

### Raiz do Problema
- Provavelmente modificações em:
  - `App.tsx` (rotas/imports)
  - `main.tsx` (inicialização)
  - `index.css` (estilos)
- Necessário testar localmente ANTES de fazer push para evitar quebra em produção

## 🚀 Como Usar Este Baseline

### Se Algo Quebrar
1. Volta para este commit: `git reset --hard f5efe5f`
2. Faz push forçado: `git push -f`
3. Vercel pode desativar auto-deploy (verifique Settings > Git)

### Antes de Fazer Alterações
1. ✏️ Edita o código localmente
2. 🧪 Testa em http://localhost:5173 (dev)
3. ✅ Verifica se login funciona
4. 💾 Só depois faz commit
5. 🚀 Push para GitHub
6. 📊 Monitora o deployment no Vercel

### Configuração Recomendada do Vercel
- **Automatic Deployments:** Desabilitado para Production
- **Require Promotion:** Ativado (manual only)
- Assim evita quebras automáticas

## 📋 Estado Verificado

```
✅ Login funciona
✅ Tela de cadastro funciona
✅ Recuperação de senha funciona
✅ Dashboard carrega normalmente
✅ Cartões, transações, empréstimos funcionam
✅ Calendário com tema dark funciona
✅ Notificações funcionam
✅ Sem tela preta
✅ Sem erros no console
```

## � Development Guidelines - Práticas Seguras

### ✅ Checklist Antes de Fazer Commit

```bash
# 1. Testar localmente
npm run dev
# Verificar no browser: http://localhost:5173

# 2. Ver o que vai ser commitado
git status
git diff

# 3. Fazer stage APENAS dos arquivos desejados (NUNCA usar git add .)
git add arquivo1.tsx arquivo2.ts
# NÃO FAZER: git add .

# 4. Revisar novamente
git diff --staged

# 5. Commitar com mensagem clara
git commit -m "Feature: descrição clara da mudança"

# 6. Revisar o commit
git log --oneline -1

# 7. Push para GitHub
git push
```

### ⚠️ Evitar ao Máximo

- ❌ `git add .` sem revisar - pega arquivos acidentalmente alterados
- ❌ Usar formatadores automáticos sem cuidado (podem alterar URLs críticas)
- ❌ Fazer push sem testar localmente
- ❌ Editar `index.html`, `README.md`, `vite.config.ts`, `vercel.json` sem razão explícita
- ❌ Quebras de linha e reformatações acidentais

### 🔒 Proteção Contra Quebras

**Configuração Vercel (IMPORTANTE):**
1. Ir para: https://vercel.com/cortanas-projects-66cf4d9c/carbon-finance-vqbg/settings/git
2. Em "Deployments", desabilitar "Automatic Deployments" PARA PRODUCTION
3. OU ativar "Require Promotion" (fazer deploy manual)

**Resultado:** Novos commits não quebram produção automaticamente.

### 🛡️ Pre-commit Hook

Um arquivo `.husky/pre-commit` foi configurado para:
- ✅ Prevenir `git add .` acidental
- ✅ Avisar sobre arquivos críticos sendo modificados
- ✅ Verificar sintaxe de commits

Execute uma única vez para instalar:
```bash
npm run prepare
```

## �🔗 Links Importantes

- **Código-Fonte:** https://github.com/cortanaautomatizar-hub/carbon-finance
- **Vercel Project:** https://vercel.com/cortanas-projects-66cf4d9c/carbon-finance-vqbg
- **Produção:** https://carbon-finance-vqbg.vercel.app

---

**Última Atualização:** 11 de Janeiro de 2026
**Responsável:** Alanderson Barros
