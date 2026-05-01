# Plan: Refatorar `.claude/hooks/` — alinhar a docs oficiais e cortar custo de contexto

**Complexity:** L4 — refactor multi-arquivo (hooks Python + `settings.json` + README), risco baixo (escopo `.claude/`), impacto alto em consumo de contexto.
**Layers:** harness/hooks · config · docs.
**Assumptions:**
- Docs oficiais Claude Code (hooks) usadas como referência: `SessionStart` → `additionalContext` é injetado no system prompt todo turno (cada caractere conta); hooks devem ser silenciosos a menos que precisem bloquear; cada hook tem timeout, captura exceções, e falha aberto (não bloqueia em erro do hook).
- `claudeMd` mechanism já carrega `AGENTS.md` + `.claude/CLAUDE.md` + `.claude/rules/*.md` automaticamente (visível em qualquer turno em `<system-reminder>` `# claudeMd`).
- Manter Bun + comandos POSIX (sem `wsl -e bash -c`, sem `cmd /c`).

---

## Context

`.claude/hooks/` está em **Python 3** (✓) e cobre `SessionStart`, `PreToolUse`, `PostToolUse`, `Stop`, `SubagentStart`, `SubagentStop`, `TaskCompleted`, `Notification`. Auditoria detectou três problemas:

1. **`session_context.py` despeja `AGENTS.md` inteiro** em `additionalContext` toda sessão (`startup`, `resume`, `compact`). Output persistido **51KB** (preview do hook neste turno). Mas o **mesmo `AGENTS.md`** já é carregado pelo runtime via `claudeMd` (bloco `# claudeMd` no system reminder). É **duplicação**, custo permanente de contexto por turno.

2. **Hooks redundantes** no `SubagentStop`: `subagent_log.py` + `evaluator_escalation.py` rodam em sequência, ambos abrem o mesmo `agent_transcript_path`, ambos fazem regex/contagem. Dá pra unificar num único `subagent_stop.py` (uma leitura de transcript, dois efeitos).

3. **Arquivo morto**: `background_cleanup.py` existe em `.claude/hooks/` mas **não está registrado** em `settings.json` (`Stop` só chama `ultracite_check.py`). Está apenas escrevendo `.claude/logs/background-cleanup.log` se for chamado manualmente. Sem valor.

Objetivo: aplicar boas práticas oficiais (output mínimo no `SessionStart`, hooks silenciosos no `Stop`/`SubagentStop`, fail-open em erro), consolidar hooks parecidos, remover mortos, manter Python único, manter funcionalidade essencial (proteção de arquivos, aprovador de bash, format/lint, notificação, escalation, log de teammate).

---

## Recommended approach (final)

### Phase 1 — `session_context.py`: cortar dump de `AGENTS.md` [SEQUENTIAL]

Manter SOMENTE o tag de prefixo (`[PROJECT] Bun | branch:X | gates: check+lint+test`) como `additionalContext`. Remover leitura/inclusão de `AGENTS.md` e do overlay `CLAUDE-overlay.md` — esses já vêm via `claudeMd` do runtime.

- [ ] `.claude/hooks/session_context.py` — remover `agents_content`, `overlay_content`, blocos de leitura de `AGENTS.md` e `${overlay}/CLAUDE-overlay.md`. Manter `get_git_branch()`, `load_project_config()` (só pra montar tag), e o switch `prefixes` por `source` (`startup`/`resume`/`compact`). Retornar `additionalContext = context_prefix` (uma linha curta, ~80 chars).
- [ ] Validar: `echo '{"source":"startup"}' | python .claude/hooks/session_context.py` → output JSON com `additionalContext` ≤ 150 chars.

**Ganho estimado:** ~50KB de contexto por sessão (cada `startup`/`resume`/`compact`).

### Phase 2 — Mesclar `subagent_log.py` + `evaluator_escalation.py` em `subagent_stop.py` [SEQUENTIAL]

Criar único hook que (1) lê o transcript uma vez, (2) loga em `subagent-events.jsonl` se `transcript_lines >= 20`, (3) detecta sinal de falha via `FAIL_PATTERN`, incrementa contador `evaluator-failure-count.txt`, escreve `evaluator-escalation.jsonl`, e emite escalation `stderr` ao atingir limiar 2.

- [ ] `.claude/hooks/subagent_stop.py` — novo arquivo. Estrutura:
  - `read_input()` (igual aos demais).
  - `SKIP_TYPES = {"Explore", "general-purpose", "Bash"}` (carry de `subagent_log.py`).
  - `MONITORED_AGENTS = {…}` (carry de `evaluator_escalation.py`, exclui `evaluator`).
  - `FAIL_PATTERN` regex.
  - Uma só leitura do transcript (`Path(transcript_path).read_text(errors="replace")`).
  - Log condicional + escalation condicional, ambos `try/except` fail-open.
  - `sys.exit(0)` no fim — silencioso por padrão.
- [ ] Atualizar `.claude/settings.json` `SubagentStop`: substituir os 2 hooks por 1 entrada chamando `subagent_stop.py` (timeout 10).
- [ ] Apagar `.claude/hooks/subagent_log.py` e `.claude/hooks/evaluator_escalation.py`.
- [ ] Validar:
  - `echo '{"agent_type":"debugger","agent_transcript_path":""}' | python .claude/hooks/subagent_stop.py` → exit 0, sem stdout.
  - Smoke com transcript fake (>20 linhas, com palavra "error") → grava entrada em `subagent-events.jsonl` E em `evaluator-escalation.jsonl`.

### Phase 3 — Remover `background_cleanup.py` (morto) [PARALLEL com Phase 4]

Não está em `settings.json`; só escreve log redundante. Apagar.

- [ ] Deletar `.claude/hooks/background_cleanup.py`.
- [ ] Confirmar via `grep -r background_cleanup .claude/settings.json` → vazio.

### Phase 4 — Sincronizar `subagent_start.py` com matcher do `settings.json` [PARALLEL com Phase 3]

Hoje:
- Matcher em `settings.json::SubagentStart`: `debugger|evaluator|explorer-agent|explorer|frontend-specialist|librarian|mobile-developer|performance-optimizer|project-planner|verification`.
- AGENT_CONTEXT em `subagent_start.py`: cobre `frontend-specialist`, `debugger`, `performance-optimizer`, `explorer-agent`, `explorer`, `project-planner`, `mobile-developer`, `orchestrator` (não está no matcher), `evaluator`, `librarian`. **Falta `verification`**.

- [ ] `.claude/hooks/subagent_start.py` — remover entrada `orchestrator` (não disparada), adicionar entrada `verification` curta (`"Verify UI flows | Playwright MCP | screenshots+console+network evidence | end with ## Context Handoff"`). Comprimir cada string para ≤ 120 chars (atual médio 130–200) — `additionalContext` injetado por turno do subagente.
- [ ] Validar: `echo '{"agent_type":"verification"}' | python .claude/hooks/subagent_start.py` → JSON com contexto curto.

### Phase 5 — Atualizar `README.md` [SEQUENTIAL após 1–4]

Refletir hooks finais:
- `SessionStart` → `session_context.py` (apenas tag de projeto).
- `PreToolUse` → `smart_bash_approver.py` (Bash), `protect_files.py` (Edit|Write), `task_routing_guard.py` (Agent).
- `PostToolUse` → `ultracite_fix.py` (Write|Edit).
- `Stop` → `ultracite_check.py`.
- `SubagentStart` → `subagent_start.py`.
- `SubagentStop` → `subagent_stop.py` (consolidado).
- `TaskCompleted` → `task_completed.py`.
- `Notification` → `notify.py`.

- [ ] `.claude/hooks/README.md` — reescrever seção "Configured hooks" + diagrama, remover referências a `background_cleanup.py`, `subagent_log.py`, `evaluator_escalation.py`. Notar que `AGENTS.md` é carregado pelo runtime, não pelo hook.

### Phase 6 — Limpeza final [SEQUENTIAL]

- [ ] `rm -rf .claude/hooks/__pycache__` (regenerado quando necessário).
- [ ] Smoke test global:
  - `python .claude/hooks/session_context.py < /dev/null` (POSIX) ou stdin vazio (PowerShell) → JSON pequeno.
  - `echo '{"tool_input":{"command":"bun test"}}' | python .claude/hooks/smart_bash_approver.py` → `permissionDecision: allow`.
  - `echo '{"tool_input":{"command":"rm -rf /"}}' | python .claude/hooks/smart_bash_approver.py` → `deny`.
  - `echo '{"tool_input":{"file_path":".env"}}' | python .claude/hooks/protect_files.py` → `deny`.
  - `echo '{"tool_input":{"subagent_type":"explorer","run_in_background":false}}' | python .claude/hooks/task_routing_guard.py` → `deny` (background-required).
  - `echo '{}' | python .claude/hooks/subagent_stop.py` → exit 0 silencioso.

---

## Critical files modified

| Path | Change |
|---|---|
| `.claude/hooks/session_context.py` | Cortar dump `AGENTS.md` + overlay; manter só tag `[PROJECT] Bun \| branch:X \| gates:...` |
| `.claude/hooks/subagent_stop.py` | **Novo** — merge de `subagent_log.py` + `evaluator_escalation.py` |
| `.claude/hooks/subagent_log.py` | **Deletar** |
| `.claude/hooks/evaluator_escalation.py` | **Deletar** |
| `.claude/hooks/background_cleanup.py` | **Deletar** |
| `.claude/hooks/subagent_start.py` | Remover `orchestrator`; adicionar `verification`; comprimir strings |
| `.claude/hooks/README.md` | Atualizar lista de hooks + diagrama + nota sobre `AGENTS.md` via runtime |
| `.claude/settings.json` | `SubagentStop`: substituir 2 hooks por 1 (`subagent_stop.py`, timeout 10) |
| `.claude/hooks/__pycache__/` | Limpar |

---

## Reused utilities (não recriar)

- `read_input()` — padrão repetido em todos hooks (stdin JSON + try/except). Mantém duplicação inline (5 linhas cada) — extrair para módulo só vale com >5 hooks adicionais; YAGNI.
- `get_git_branch()`, `load_project_config()` (em `session_context.py`) — preservados.
- `whatsappUrlWithText()` etc. — N/A (escopo de hooks).

---

## Risks

- **R1: SessionStart prefixo curto perde info útil.** Mitigação: manter tag `[PROJECT] Bun | branch:X | gates: check+lint+test` (~80 chars) já é a parte que orienta o agente; `AGENTS.md` continua acessível via `claudeMd`. Sem perda funcional.
- **R2: `subagent_stop.py` consolidado tem comportamento alterado em borderline (transcript = 19 linhas com palavra "error").** Mitigação: preservar exatos limiares (`>=20` lines pra log, threshold 2 pra escalation), e ler transcript uma vez só evita janela de inconsistência.
- **R3: Apagar `background_cleanup.py` quebra workflow externo.** Mitigação: nada referencia ele em `settings.json` nem em scripts/comandos do projeto (verificar via grep antes de deletar). Log `.claude/logs/background-cleanup.log` deixa de ser escrito — sem dependentes conhecidos.
- **R4: Hook que falha trava sessão.** Mitigação: todos os hooks já fazem `try/except: pass` + `sys.exit(0)` em erro (fail-open). Manter padrão no `subagent_stop.py` novo.

---

## Verification (end-to-end)

```bash
# 1. Sintaxe Python
python -m py_compile .claude/hooks/*.py

# 2. SessionStart minimal
echo '{"source":"startup"}' | python .claude/hooks/session_context.py | python -c "import json,sys; o=json.load(sys.stdin); ctx=o['hookSpecificOutput']['additionalContext']; assert len(ctx) < 200, f'context too long: {len(ctx)}'; print('OK', len(ctx), 'chars')"

# 3. PreToolUse Bash — allow/deny/ask
echo '{"tool_input":{"command":"bun test"}}'      | python .claude/hooks/smart_bash_approver.py   # expect allow
echo '{"tool_input":{"command":"rm -rf /"}}'      | python .claude/hooks/smart_bash_approver.py   # expect deny
echo '{"tool_input":{"command":"foo bar baz"}}'   | python .claude/hooks/smart_bash_approver.py   # expect ask

# 4. PreToolUse Edit — protected file
echo '{"tool_input":{"file_path":".env"}}'        | python .claude/hooks/protect_files.py         # expect deny
echo '{"tool_input":{"file_path":"src/x.ts"}}'    | python .claude/hooks/protect_files.py         # expect exit 0

# 5. Agent routing
echo '{"tool_input":{"subagent_type":"explorer","run_in_background":false}}' | python .claude/hooks/task_routing_guard.py   # expect deny
echo '{"tool_input":{"subagent_type":"debugger"}}' | python .claude/hooks/task_routing_guard.py                              # expect allow

# 6. SubagentStart — verification entry
echo '{"agent_type":"verification"}' | python .claude/hooks/subagent_start.py   # expect JSON with short context

# 7. SubagentStop merged — silent on empty
echo '{}' | python .claude/hooks/subagent_stop.py   # expect exit 0, no stdout

# 8. Lint+build do projeto (sanity)
bun run lint
bunx astro check
bun run build

# 9. Live test: rodar uma sessão Claude Code com /hooks e confirmar:
#    - SessionStart message não traz mais AGENTS.md inteiro
#    - SubagentStop dispara apenas subagent_stop.py
#    - Nenhuma referência a background_cleanup / subagent_log / evaluator_escalation em settings
grep -E 'background_cleanup|subagent_log|evaluator_escalation' .claude/settings.json   # expect empty
```

---

## Out of scope

- Reescrever `smart_bash_approver.py` patterns (já cobre o uso atual; refactor sem ganho claro).
- Adicionar novos hooks (`UserPromptSubmit`, `PreCompact`, `SessionEnd`) — não solicitados; introduzir só com motivo concreto.
- Migrar para `uv`/`hatch` ou empacotar como script — Python 3 stdlib basta, sem deps.

---

Next: aprovar plan → executar com `/implement` (toca 8 arquivos, 1 deleção dupla, 1 hook novo, 1 settings.json patch, 1 README rewrite).
