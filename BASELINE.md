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

## 📚 Development Guidelines - Práticas Seguras

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

## 💻 Ambiente de Desenvolvimento

### Restrições de Admin (Importante!)

Se você tem um **admin externo de empresa** com restrições:
- ❌ Alguns scripts npm podem exigir permissões especiais
- ❌ Instalação de packages via `npm install` pode travar
- ⚠️ `npm audit fix --force` pode exigir um ambiente menos restrito

**Solução:** Use o Node.js portátil (sem instalação):

```powershell
# Configure o PATH na sessão do PowerShell
$env:PATH="C:\Users\Alanderson.Barros\OneDrive - SODEXO\Documentos\node-v24.12.0-win-x64\node-v24.12.0-win-x64;" + $env:PATH

# Depois pode usar normalmente
npm install
npm run dev
npm run build
```

⚠️ **Lembrete:** Em cada nova sessão de terminal, você precisa reexecutar o comando do PATH acima antes dos comandos npm.

### Versões Atualizadas (11 de Janeiro)

- **Vite:** Atualizado para **7.3.1** (via `npm audit fix --force`)
- **esbuild:** Atualizado (dependência do Vite 7)
- **react-router-dom:** Atualizado com fix de XSS
- **Vulnerabilidades:** Reduzidas de 5 para 0 ✅
- **Build:** Testado e funcionando (exit code 0)

⚠️ Se notar algo diferente no `npm run dev` ou `npm run build` após esse upgrade, entre em contato. O Vite 7 é compatível com o projeto, mas qualquer comportamento inesperado deve ser reportado.

### Commits de Segurança

- **c8d9285** - "chore: npm audit fix router" (apenas fix seguro)
- **007c1f6** - "chore: audit fix --force (vite 7)" (upgrade major de Vite)

### Commits de Funcionalidades (11 de Janeiro)

- **495f67b** - "feat: adicionar grafico de pizza com gastos por cartao no dashboard"
- **0bcab4f** - "feat: redesenhar grafico de pizza para gastos por categoria com cores amarelo e cinza"
- **8debc84** - "feat: adicionar auto-login com usuario demo para facilitar acesso"
- **3c05f1d** - "feat: permitir login com um clique sem preencher credenciais (demo mode)"

## 🔐 Modo Demo & Login Simplificado

### Auto-Login Automático

O sistema possui **auto-login automático** para facilitar demos e testes:

- ✅ Ao abrir a aplicação pela primeira vez (sem sessão), faz login automaticamente
- ✅ Usuário Demo pré-configurado (ID: 1, Email: demo@carbonfinance.com)
- ✅ Dados persistem no localStorage

### Login com Um Clique

Na tela de Login (`/login`):
- Deixe os campos **email e senha vazios**
- Clique em **"Entrar"**
- Sistema usa credenciais demo e redireciona para Dashboard

**Credenciais Demo:**
```
Email: demo@carbonfinance.com
Nome: Demo User
Telefone: +55 11 99999-9999
Token: demo_token_123456789
```

⚠️ **Nota:** Este modo é ideal para demos e desenvolvimento. Para produção real, desabilite o auto-login no `AuthContext.tsx`.

## ✅ Checklist QA — Controle de Assinaturas

Use esta checklist antes de enviar alterações relacionadas a assinaturas para o repositório remoto e para validar deploys em staging:

1. Ambiente
   - Abra a aplicação em modo dev (`npm run dev`) ou use o modo Demo (auto-login) se não houver Node local.
   - Abra DevTools → Application → `Local Storage` para observar a chave `carbon_finance_subscriptions` e `carbon_finance_serviceColors`.

2. Fluxos principais (manuais)
   - Adicionar: Clique em **Nova Assinatura**, preencha `nome`, `valor`, `categoria` e `cor` e confirme. Verifique:
     - A nova assinatura aparece na lista.
     - `localStorage` contém o novo item.
     - Toast de sucesso é exibido.
   - Editar: No menu do serviço → **Editar**, altere campos e salve. Verifique:
     - Os valores da linha são atualizados imediatamente.
     - `serviceColors` é atualizado (se o nome mudou, o mapa reflete a nova chave).
     - Toast de confirmação é exibido.
   - Pausar / Reativar: Use o menu → **Pausar/Reativar**. Verifique:
     - Status visual (Badge) muda entre `Ativa` e `Pausada`.
     - Total mensal (`TOTAL MENSAL`) é recalculado corretamente.
     - Toast de status é exibido.
   - Excluir: Menu → **Excluir** → confirmar no diálogo. Verifique:
     - Item é removido da lista.
     - `localStorage` não contém mais o item.
     - Toast de exclusão (variant `destructive`) aparece.

3. Validação e UX
   - Tente submeter o modal com `nome` vazio → deve mostrar mensagem inline e foco no campo.
   - Informe `valor` = 0 ou texto inválido → mensagem inline e foco no campo de valor.
   - Não selecione `categoria` → mensagem inline e foco no seletor.

4. Recovery / Baseline
   - Se encontrar comportamento incorreto após alterações, restaure o baseline estável localmente ou peça a um colaborador com Git disponível para executar:
     ```bash
     git reset --hard f5efe5f
     git push -f
     ```
   - No Vercel, verifique o deployment estável (`5sLtHnnhT`) e, se necessário, promova manualmente ou desabilite deploys automáticos para produção.

5. Limpeza
   - Para testes repetidos, remova a chave `carbon_finance_subscriptions` em DevTools → Application → Local Storage, ou use o modo incognito.

Observação: a persistência atual usa `localStorage` (MVP). Para produção, extraia a lógica para um serviço/API e adicione autenticação/controle de acesso.

## 📊 Dashboard - Novas Funcionalidades

### Gráfico de Gastos por Categoria

Adicionado ao Dashboard um **gráfico de pizza (donut)** que mostra:

- 📈 Distribuição de gastos por categoria (Alimentação, Transporte, Lazer, Outros)
- 🎨 Cores da paleta Carbon Finance (amarelo: `#FFCA3A`, cinzas: `#6B7280`, `#9CA3AF`, `#D1D5DB`)
- 🔄 Dropdown de filtro por período (Semanal/Mensal/Anual)
- 💰 Total faturado com breakdown detalhado
- 📋 Legenda clara com valores e percentuais

**Categorização Automática:**
- Analisa descrições das transações
- Mapeia palavras-chave para categorias
- Suporta transações de todos os cartões

## 🔗 Links Importantes

- **Código-Fonte:** https://github.com/cortanaautomatizar-hub/carbon-finance
- **Vercel Project:** https://vercel.com/cortanas-projects-66cf4d9c/carbon-finance-vqbg
- **Produção:** https://carbon-finance-vqbg.vercel.app

---

**Última Atualização:** 11 de Janeiro de 2026
**Responsável:** Alanderson Barros
