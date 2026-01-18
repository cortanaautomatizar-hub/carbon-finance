# 💳 Carbon Finance

> Aplicação web moderna para gestão financeira pessoal com controle de cartões de crédito e transações

[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://carbon-finance-vqbg.vercel.app)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6.svg)
![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)

**🌐 [Ver Demo ao Vivo](https://carbon-finance-vqbg.vercel.app)**

---

## ✨ Features

### Autenticação
- ✅ Login e cadastro de usuários
- ✅ Proteção de rotas com redirecionamento automático
- ✅ Seletor de país com bandeiras (via Twemoji)
- ✅ Validação de telefone internacional
- ✅ Recuperação de senha
- ✅ Persistência de sessão (localStorage)

### Gestão de Cartões
- ✅ Listagem de cartões com resumo (limite, gasto, disponível)
- ✅ Criação rápida de novos cartões
- ✅ Edição de nome e limite
- ✅ Remoção de cartões com confirmação
- ✅ Página de detalhe por cartão
- ✅ Visualização de progresso de consumo

### Transações
- ✅ Adicionar transações a cartões específicos
- ✅ Remoção de transações
- ✅ Histórico completo de transações
- ✅ Validação de formulário em tempo real (react-hook-form + zod)
- ✅ Foco automático e UX otimizada

### Faturas
- ✅ Visualização de fatura atual
- ✅ Pagamento de fatura (zera transações)
- ✅ Histórico de faturas pagas
- ✅ Cálculo automático de totais

---

## 🛠️ Tech Stack

**Frontend:**
- [React 18.3](https://react.dev/) - Biblioteca UI
- [TypeScript 5.6](https://www.typescriptlang.org/) - Tipagem estática
- [Vite 5.4](https://vitejs.dev/) - Build tool & dev server
- [React Router 7.1](https://reactrouter.com/) - Roteamento SPA
- [TanStack Query 6.8](https://tanstack.com/query) - Gerenciamento de estado assíncrono

**UI & Styling:**
- [Tailwind CSS 3.4](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI (Radix + Tailwind)
- [Lucide React](https://lucide.dev/) - Ícones modernos

**Validação & Formulários:**
- [React Hook Form 7.54](https://react-hook-form.com/) - Gerenciamento de forms
- [Zod 3.24](https://zod.dev/) - Schema validation

**Persistência:**
- LocalStorage (MVP) - Armazenamento client-side
- Seed inicial em `src/data/cards.ts`

---

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+ (testado com v24.12.0)
- npm ou bun

### Instalação

```bash
# Clone o repositório
git clone https://github.com/cortanaautomatizar-hub/carbon-finance.git
cd carbon-finance

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em **http://localhost:8080/**

---

## 📜 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento (Vite)
npm run build        # Build de produção
npm run preview      # Preview do build de produção
npm run lint         # Executa ESLint
```

---

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── CreditCard.tsx  # Card de crédito visual
│   ├── Header.tsx      # Cabeçalho com logout
│   ├── Layout.tsx      # Layout principal
│   ├── NewTransactionForm.tsx
│   ├── TransactionHistory.tsx
│   └── ...
├── contexts/           # React Context (Auth)
│   └── AuthContext.tsx
├── data/              # Dados estáticos/seed
│   ├── cards.ts
│   └── subscriptions.ts
├── hooks/             # Custom hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/               # Utilidades
│   └── utils.ts
├── pages/             # Páginas principais
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ForgotPassword.tsx
│   ├── Index.tsx       # Dashboard
│   ├── CardsSummary.tsx
│   ├── CreditCard.tsx
│   ├── CardDetail.tsx
│   └── ...
├── services/          # Camada de serviços
│   ├── auth.ts        # Mock auth (localStorage)
│   └── cards.ts       # CRUD de cartões
├── App.tsx            # Root component
└── main.tsx           # Entry point
```

---

## 🎯 Roadmap

### Curto Prazo
- [ ] Validações avançadas de telefone (libphonenumber-js)
- [ ] Temas claro/escuro
- [ ] Exportar transações (CSV/PDF)
- [ ] Gráficos de gastos (Recharts)

### Médio Prazo
- [ ] Integração com API backend (REST/GraphQL)
- [ ] Autenticação JWT/OAuth (Google, GitHub)
- [ ] Testes unitários (Jest + Testing Library)
- [ ] Testes E2E (Playwright)

### Longo Prazo
- [ ] PWA (Service Workers)
- [ ] Notificações push
- [ ] Multi-tenancy
- [ ] Deploy automatizado (Vercel/Netlify + GitHub Actions)
- [ ] Monitoramento (Sentry, Analytics)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👤 Autor

**Alanderson Barros**

- GitHub: [@cortanaautomatizar-hub](https://github.com/cortanaautomatizar-hub)
- Repositório: [carbon-finance](https://github.com/cortanaautomatizar-hub/carbon-finance)

---

## 🙏 Agradecimentos

- [shadcn/ui](https://ui.shadcn.com/) pelos componentes incríveis
- [Tailwind CSS](https://tailwindcss.com/) pelo framework de estilo
- [Vite](https://vitejs.dev/) pela experiência de desenvolvimento rápida
- [Twemoji](https://twemoji.twitter.com/) pelas bandeiras emoji

---

<p align="center">Feito com ❤️ e ☕</p>
**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Controle de Assinaturas

Descrição rápida:

- Gerencie serviços recorrentes: adicionar, editar, pausar/reativar e excluir assinaturas.
- Estado persistido no `localStorage` (chave: `carbon_finance_subscriptions`) para uso em modo local/demo.

Fluxo de uso (UI):

- Clique em **Nova Assinatura** para adicionar um serviço (nome, valor, categoria, cor).
- Em cada linha do serviço, abra o menu (•••) para **Pausar/Reativar**, **Editar** ou **Excluir**.
- Ao editar, um modal pré-preenche os campos; salvando, os dados são atualizados e persistidos.
- Excluir abre um diálogo de confirmação antes de remover.

Validações principais:

- `nome` é obrigatório.
- `valor` deve ser numérico e maior que 0.
- `categoria` deve ser selecionada.

Comandos locais (se tiver Node):

```bash
# instalar dependências
npm install

# rodar em dev
npm run dev

# build de produção
npm run build
```

Sem Node no PC (alternativas):

- Use o modo demo (auto-login) disponível no app para testes rápidos sem backend.
- Ou use Node portátil (veja `BASELINE.md`) ou GitHub Codespaces para desenvolvimento sem instalar localmente.

Observações:

- As alterações de assinaturas são salvas no `localStorage` do navegador; para limpar, remova a chave `carbon_finance_subscriptions` no DevTools -> Application.
- Para trabalhar em equipe/produzir mudanças no repositório remoto, siga o fluxo seguro descrito em `BASELINE.md` (criar branch a partir do baseline estável, testar, abrir PR).


# Anotações - Work

**Status do fluxo (automação)**

- Concluído — status:
	- **Branch atual:** `feat/subscriptions-ui`.
	- **Stashes restantes:** 2 (não apliquei o `stash pop` para evitar prompts).
	- **Alterações:** não havia alterações não comitadas a enviar (já commitadas em `fbcf3af`).
	- **Push:** `feat/subscriptions-ui` atualizado no remoto.

