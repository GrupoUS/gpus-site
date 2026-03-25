# Claude Code Hooks - Na Mesa Certa

## Visão Geral

Este projeto usa hooks Claude Code para aumentar autonomia de agentes enquanto mantém guardrails de segurança.

## Hooks Configurados

### SessionStart

- **session-context.sh**: Injeta contexto do projeto (branch, último commit, qualidade gates)

### PreToolUse

- **smart-bash-approver.sh**: Auto-aprova comandos seguros, bloqueia perigosos
- **protect-files.sh**: Bloqueia modificação de arquivos sensíveis
- **task-routing-guard.sh**: Bloqueia subagent inválido e reforça Task com roteamento correto

### PermissionRequest

- Auto-aprova Read/Grep/Glob/Serena tools
- Usa smart-bash-approver para Bash

### PostToolUse

- **ultracite-fix.sh**: Após `Write`/`Edit`, roda **Biome** `check --write` e **oxlint** `--fix` só em arquivos do escopo do projeto:
  - Biome: `src/**` e `astro.config.mjs` (`*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.json`, `*.astro`, `*.css`, `*.mjs`)
  - oxlint (Oxc): `src/**` com `*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.mjs`
  - Arquivos fora desse escopo (ex.: `package.json` na raiz) são ignorados para não falhar com “nenhum arquivo processado”.
- `file_path` é lido via `python3` + JSON (mesmo padrão que `protect-files.sh`). Falha de Biome/oxlint retorna exit code ≠ 0 (visível no transcript).

### Stop

- **ultracite-check.sh**: Executa `bun run lint` (Biome + oxlint, sem `--write`) antes de encerrar a sessão. Se o lint falhar, o hook falha.

### Notification

- **notify.sh**: Notificações desktop (WSL/Linux)

### Não registrados em `settings.json`

Hooks como `SubagentStop`, `TeammateIdle` ou `background-cleanup.sh` podem ser adicionados depois; não há scripts correspondentes no repositório neste momento.

---

## Git (Lefthook)

- **`lefthook.yml`**: em commits que tocam `src/**` ou `astro.config.mjs`, o `pre-commit` roda `bun run lint`.
- Instalação: `bun install` dispara `prepare` → `lefthook install`.

---

## Comandos Seguros (Auto-aprovados)

```bash
# Git
git status, git diff, git log, git branch, git fetch

# File system
ls, cat, head, tail, grep, find, which, pwd, echo

# Bun/Node
bun test, bun run check, bun run lint, bun install, bun x, bun run build
bunx astro check, bunx astro build
bunx oxlint, bunx biome, bunx ultracite

# Version checks
python3 --version, node --version, bun --version
```

---

## Comandos Bloqueados (Sempre)

```bash
# Destructive
rm -rf /, rm -rf ~, rm -rf *, rm -rf $HOME

# Database
DROP DATABASE, DROP TABLE, TRUNCATE

# Git dangerous
git push --force main, git push --force master, git reset --hard HEAD~

# System
chmod -R 777 /, dd if=... of=/dev/, :(){ :|:& };:
sudo rm, truncate -s 0
```

---

## Arquivos Protegidos

Estes arquivos não podem ser editados via hooks:

| Pattern                              | Razão           |
| ------------------------------------ | --------------- |
| `.env*`                              | Credenciais     |
| `credentials`, `secrets`, `api-keys` | Dados sensíveis |
| `.git/`                              | Repositório     |
| `package-lock.json`, `bun.lockb`     | Lockfiles       |

---

## Testando Hooks

```bash
# Testar aprovação de comando seguro
echo '{"tool_name":"Bash","tool_input":{"command":"bun test"}}' | .claude/hooks/smart-bash-approver.sh
# Expected: {"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow"}}

# Testar bloqueio de comando perigoso
echo '{"tool_name":"Bash","tool_input":{"command":"rm -rf /"}}' | .claude/hooks/smart-bash-approver.sh
# Expected: {"hookSpecificOutput":{"...permissionDecision":"deny"...}}

# Testar proteção de arquivo
echo '{"tool_name":"Edit","tool_input":{"file_path":"./.env"}}' | .claude/hooks/protect-files.sh
echo $?
# Expected: Exit code 2, error message on stderr

# PostToolUse: arquivo no escopo Biome/oxlint
echo '{"tool_name":"Write","tool_input":{"file_path":"src/components/CountdownTimer.tsx"}}' | .claude/hooks/ultracite-fix.sh
# Expected: biome + oxlint rodam; exit 0 se limpo

# Stop: lint completo
.claude/hooks/ultracite-check.sh
# Expected: exit 0 se bun run lint passar
```

---

## Debug

```bash
# Ver hooks ativos no Claude Code
/hooks

# Debug mode (ver execução de hooks)
claude --debug

# Verbose mode (output de hooks no transcript)
Ctrl+O
```

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    HOOK FLOW                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SessionStart ──► session-context.sh ──► Prime contexto     │
│                                                              │
│  PreToolUse ────► smart-bash-approver.sh                    │
│               └─► protect-files.sh                          │
│                       │                                      │
│                       ▼                                      │
│              ┌─────────────────┐                             │
│              │ ALLOW / DENY /  │                             │
│              │     ASK         │                             │
│              └─────────────────┘                             │
│                                                              │
│  PermissionRequest ──► Auto-approve read tools              │
│                       └─► smart-bash-approver for Bash      │
│                                                              │
│  PostToolUse ───► ultracite-fix.sh (biome --write + oxlint --fix)│
│                                                              │
│  Stop ──────────► ultracite-check.sh (bun run lint)         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Rollback

Se hooks causarem problemas:

```bash
# Quick disable: remover hooks section do settings.json

# Full rollback (exemplo — preferir git checkout dos arquivos):
git checkout .claude/settings.json
git checkout .claude/hooks/
rm -rf .claude/logs
```

---

## Impacto

| Métrica                       | Antes   | Depois         |
| ----------------------------- | ------- | -------------- |
| Aprovações manuais/dia        | ~50     | ~10            |
| Tempo em permissões           | ~15min  | ~3min          |
| Risco de comandos perigosos   | Médio   | Baixo          |
| Lint no commit (Lefthook)     | Não     | `bun run lint` |
