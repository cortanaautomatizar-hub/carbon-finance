# Admin setup — Aplicar variáveis no Vercel (seguro)

Este documento explica como um administrador pode aplicar as variáveis do Supabase e usar o workflow automático criado no repositório.

## 1) Criar um token no Vercel (Team/Project scope)
- Vercel → Avatar → Tokens → New Token
- Nome sugerido: `apply-env-carbon-finance`
- Expiração: 30 dias (ou menos)
- Copie o token **uma vez**.

## 2) Adicionar o secret no GitHub
- Repositório → Settings → Secrets → Actions → New repository secret
- Name: `VERCEL_TOKEN`
- Value: (cole o token do passo 1)

## 3) Usar o workflow manualmente
- Vá para Actions → `Apply Vercel Env` → Run workflow
- Preencha (opcional) `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com os valores adequados.
- Run workflow. Quando concluído, as variáveis serão aplicadas ao projeto Vercel (target: Preview + Production).

> Observação: após a execução, acione um **Redeploy** na UI do Vercel, caso o workflow não tenha disparado o deploy automaticamente.

## 4) Segurança
- Revogue o token no Vercel após uso, se for temporário.
- Evite expor a `service_role` em variáveis públicas — use somente a `anon` key (prefixo `pk_`).

## 5) Fallback UI
- O PR também adiciona um pequeno banner que será exibido na aplicação quando as variáveis estiverem faltando ou houver erro de autenticação, facilitando o diagnóstico para usuários não-admins.

Se preferir, posso abrir o PR agora (já preparado) e incluir você como reviewer. Quer que eu abra o PR?