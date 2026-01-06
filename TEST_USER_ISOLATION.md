# 🧪 Teste de Isolamento de Dados por Usuário

## Objetivo
Verificar que 3 usuários diferentes têm cartões isolados no localStorage.

---

## 👤 Usuário 1: João Silva

### Dados de Registro:
```
Nome: João Silva
Email: joao@teste.com
Telefone: +55 11 98765-4321
Senha: senha123
```

### Passos:
1. Acesse: https://carbon-finance-a8k90jnn8-cortanas-projects-66cf4d9c.vercel.app
2. Clique em "Cadastrar"
3. Preencha os dados acima
4. Clique em "Criar conta"
5. **Agora em Home → Crie 2 cartões:**
   - Cartão 1: "Nubank João" (limite R$ 5000)
   - Cartão 2: "Inter João" (limite R$ 3000)
6. **Adicione 3 transações ao primeiro cartão**
7. **Faça logout** (clique em perfil → logout)

---

## 👤 Usuário 2: Maria Santos

### Dados de Registro:
```
Nome: Maria Santos
Email: maria@teste.com
Telefone: +55 11 97654-3210
Senha: senha456
```

### Passos:
1. Clique em "Cadastrar" novamente
2. Preencha os dados acima
3. Clique em "Criar conta"
4. **Agora em Home → Verifique:**
   - ❌ NÃO deve ver cartões de João
   - Deve estar vazio ou com dados iniciais
5. **Crie 1 cartão:**
   - Cartão: "Bradesco Maria" (limite R$ 8000)
6. **Adicione 5 transações a este cartão**
7. **Faça logout**

---

## 👤 Usuário 3: Pedro Costa

### Dados de Registro:
```
Nome: Pedro Costa
Email: pedro@teste.com
Telefone: +55 11 96543-2109
Senha: senha789
```

### Passos:
1. Clique em "Cadastrar" novamente
2. Preencha os dados acima
3. Clique em "Criar conta"
4. **Agora em Home → Verifique:**
   - ❌ NÃO deve ver cartões de João ou Maria
5. **Crie 3 cartões:**
   - Cartão 1: "Santander Pedro"
   - Cartão 2: "Itaú Pedro"
   - Cartão 3: "Caixa Pedro"
6. **Adicione 2 transações a cada cartão**
7. **Faça logout**

---

## ✅ Verificações Finais

### Teste 1: Login de João novamente
1. Clique em "Entrar"
2. Email: `joao@teste.com` | Senha: `senha123`
3. Verifique:
   - ✅ Vê 2 cartões (Nubank João + Inter João)
   - ✅ Vê as 3 transações que criou
   - ❌ NÃO vê cartões de Maria ou Pedro

### Teste 2: Login de Maria novamente
1. Faça logout
2. Email: `maria@teste.com` | Senha: `senha456`
3. Verifique:
   - ✅ Vê 1 cartão (Bradesco Maria)
   - ✅ Vê as 5 transações que criou
   - ❌ NÃO vê cartões de João ou Pedro

### Teste 3: Login de Pedro novamente
1. Faça logout
2. Email: `pedro@teste.com` | Senha: `senha789`
3. Verifique:
   - ✅ Vê 3 cartões (Santander, Itaú, Caixa)
   - ✅ Vê as 6 transações (2 por cartão)
   - ❌ NÃO vê cartões de João ou Maria

---

## 🔍 Verificação no Console (DevTools)

Para confirmar o isolamento, abra o Console (F12) e verifique:

```javascript
// Logado como João (ID 1):
localStorage.keys()
// Deve conter: "cards_data_v1_user_1"

// Logado como Maria (ID 2):
localStorage.keys()
// Deve conter: "cards_data_v1_user_2"

// Logado como Pedro (ID 3):
localStorage.keys()
// Deve conter: "cards_data_v1_user_3"
```

Cada usuário tem sua própria chave!

```javascript
// Ver dados de João:
JSON.parse(localStorage.getItem("cards_data_v1_user_1"))
// Array com 2 cartões

// Ver dados de Maria:
JSON.parse(localStorage.getItem("cards_data_v1_user_2"))
// Array com 1 cartão

// Ver dados de Pedro:
JSON.parse(localStorage.getItem("cards_data_v1_user_3"))
// Array com 3 cartões
```

---

## 📋 Checklist de Sucesso

- [x] João se registra e cria 2 cartões
- [x] Maria se registra e NÃO vê cartões de João
- [x] Pedro se registra e NÃO vê cartões de João/Maria
- [x] João faz login novamente e vê apenas seus 2 cartões
- [x] Maria faz login e vê apenas seu 1 cartão
- [x] Pedro faz login e vê apenas seus 3 cartões
- [x] localStorage tem chaves separadas por userId
- [x] Transações estão isoladas por usuário

---

## 🎯 Resultado Esperado

✅ **SUCESSO:** Cada usuário tem dados completamente isolados!
- Dados não vazam entre contas
- Logout/Login mantém isolamento
- localStorage mostra 3 chaves separadas

❌ **FALHA:** Se algum teste falhar, significa que há um bug no isolamento

---

## 💡 Dicas

- Abra DevTools (F12) em cada login para confirmar as chaves
- Limpe o localStorage se algo der errado: `localStorage.clear()`
- Se precisar resetar, faça logout, feche aba e abra nova aba
