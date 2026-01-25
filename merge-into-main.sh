#!/usr/bin/env bash
set -euo pipefail

# merge-into-main.sh
# - Faz merge de uma branch remota para a main, roda testes/build e deleta a branch remota/local.
# - Uso:
#    ./merge-into-main.sh [--source branch] [--target branch] [--auto]
# Ex: ./merge-into-main.sh --source ci/supabase-key-check --target main --auto

SOURCE_BRANCH="ci/supabase-key-check"
TARGET_BRANCH="main"
AUTO=false

show_help() {
  cat <<EOF
Uso: $0 [--source branch] [--target branch] [--auto]

--source  Branch remota a ser mesclada (padrão: ci/supabase-key-check)
--target  Branch alvo (padrão: main)
--auto    Modo não interativo: faz stash automático, executa testes/build e deleta branches sem prompts
--help    Exibe esta ajuda
EOF
}

# parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --source)
      SOURCE_BRANCH="$2"; shift 2 ;;
    --target)
      TARGET_BRANCH="$2"; shift 2 ;;
    --auto)
      AUTO=true; shift ;;
    --help)
      show_help; exit 0 ;;
    *)
      echo "Argumento desconhecido: $1"; show_help; exit 1 ;;
  esac
done

# Helpers
err() { echo "ERROR: $*" >&2; exit 1; }
run() { echo "+ $*"; "$@"; }
confirm() {
  if [ "$AUTO" = true ]; then
    return 0
  fi
  read -r -p "$1 [y/N]: " answer
  case "$answer" in
    [yY][eE][sS]|[yY]) return 0 ;;
    *) return 1 ;;
  esac
}

# 1) checar git
command -v git >/dev/null 2>&1 || err "git não encontrado. Instale e adicione ao PATH."
[ -d .git ] || err "Este diretório não parece ser um repositório git. Rode na raiz do projeto."

echo "Fonte: $SOURCE_BRANCH -> Alvo: $TARGET_BRANCH"

# 2) fetch
run git fetch origin || err "git fetch falhou"

# 3) existe branch remota?
if ! git ls-remote --heads origin "$SOURCE_BRANCH" | grep -q "$SOURCE_BRANCH"; then
  err "Branch remota origin/$SOURCE_BRANCH não encontrada"
fi

# 4) working tree limpo
STATUS=$(git status --porcelain)
if [ -n "$STATUS" ]; then
  echo "Existem alterações locais não commitadas:"; echo "$STATUS"
  if [ "$AUTO" = true ]; then
    echo "Auto-mode: realizando stash automático"
    run git stash push -m "autostash before merge-script"
  else
    if confirm "Deseja criar um stash automático antes do merge?"; then
      run git stash push -m "autostash before merge-script"
    else
      echo "Continuando sem stashing (riscos de conflito)"
    fi
  fi
fi

# 5) checkout target e pull
run git checkout "$TARGET_BRANCH" || err "Falha ao trocar para $TARGET_BRANCH"
run git pull origin "$TARGET_BRANCH" || err "Falha ao puxar $TARGET_BRANCH"

# 6) merge
echo "Mesclando origin/$SOURCE_BRANCH em $TARGET_BRANCH..."
if ! git merge --no-ff --no-edit "origin/$SOURCE_BRANCH"; then
  echo "⚠️ Merge com conflitos. Abortando operação automática." >&2
  git merge --abort || true
  err "Resolve conflitos manualmente, depois: git add <files> && git commit && git push origin $TARGET_BRANCH"
fi

# 7) executar testes/build
if [ "$AUTO" = true ]; then
  echo "Auto-mode: rodando testes e build"
  if ! npm run test --silent; then err "Testes falharam. Abortando em modo Auto."; fi
  if ! npm run build --silent; then err "Build falhou. Abortando em modo Auto."; fi
else
  if confirm "Executar testes e build antes do push?"; then
    if ! npm run test --silent; then
      if ! confirm "Testes falharam. Prosseguir com push?"; then err "Abortado por falha nos testes."; fi
    fi
    if ! npm run build --silent; then
      if ! confirm "Build falhou. Prosseguir com push?"; then err "Abortado por falha no build."; fi
    fi
  fi
fi

# 8) push
run git push origin "$TARGET_BRANCH" || err "Falha ao dar push em $TARGET_BRANCH"

# 9) deletar branch remota
if [ "$AUTO" = true ] || confirm "Deletar origin/$SOURCE_BRANCH?"; then
  echo "Deletando origin/$SOURCE_BRANCH..."
  if ! git push origin --delete "$SOURCE_BRANCH"; then echo "Falha ao deletar origin/$SOURCE_BRANCH (verifique permissões)" >&2; fi
fi

# 10) deletar local
if git rev-parse --verify --quiet "$SOURCE_BRANCH" >/dev/null; then
  if [ "$AUTO" = true ] || confirm "Deletar branch local $SOURCE_BRANCH?"; then
    git branch -d "$SOURCE_BRANCH" || echo "Falha ao deletar local (use -D para forçar)" >&2
  fi
fi

echo "\n✅ Merge concluído e push realizado. Verifique deploy no Vercel."
exit 0
