# Análise de Migração de Hooks — F:\Projetos → Suíte Global

> Data: 2026-05-26. Scan de 13 repositórios em `F:\Projetos`.
> Objetivo: decidir, por repo, o que **remover** (redundante com a suíte global) vs **manter** (project-specific não coberto pelo global).
> Suíte global instalada em: `~/.agent-hooks/` + `~/.claude/hooks/` + `~/.claude/settings.json` + `~/.codex/hooks/` + `~/.codex/hooks.json`.

---

## O que o GLOBAL cobre

**Claude:** SessionStart · PreToolUse(Bash/Edit·Write/Agent) · PostToolUse(format) · Stop(safe-autofix+recheck) · Notification · TeammateIdle · SubagentStart · SubagentStop · TaskCompleted.
**Codex:** SessionStart · PreToolUse · PermissionRequest · PostToolUse · Stop.
**Engine:** Biome+Oxlint auto-detect (no-op sem toolchain), nunca flags inseguras.

**O global NÃO tem (decisão consciente):**
- `PermissionRequest` auto-allow (Claude) — concede permissão amplamente; teu `~/.claude/settings.json` já tem `defaultMode:auto` + `skipAutoPermissionPrompt:true`, que cobrem. Remover dos repos = perder só esse auto-allow (sem impacto prático).
- `PreCompact` / `SessionEnd` — nos repos que têm, apontam para `claude-memory-compiler/` (subprojeto **por-repo**) → **project-specific, não globalizável**.
- `UserPromptSubmit` (agent routing) — orquestração específica do neondash.

---

## Duas gerações de suíte (causa do drift)

| Geração | PostToolUse/Stop | SubagentStop | Repos |
|---|---|---|---|
| **Unificada (NOVA = global)** | `ultracite.py` (1 script, 2 branches) | `subagent_stop.py` (consolidado) | gpus-site, calculadora-isca, otb-usa, trintae3, raiox-neondash, gpus-site-padrao |
| **Split (ANTIGA)** | `ultracite_fix.py` + `ultracite_check.py` | `subagent_log.py` + `evaluator_escalation.py` + `background_cleanup.py` | AutoGPUS, missao-amazonica, neondash |

A geração split é **funcionalmente equivalente** à unificada → redundante com o global.

---

## Veredito por repositório

| Repo | Toolchain | Claude hooks | Codex | Veredito |
|---|---|---|---|---|
| **gpus-site** | bun·biome·oxlint | — (removido ✅) | — | **FEITO** — usa global |
| **calculadora-isca** | bun·biome | std9 + PermissionRequest | — | **REMOVER** → global (perde só PermissionRequest) |
| **otb-usa** | bun·biome | std9 + PermissionRequest | — | **REMOVER** → global |
| **trintae3** | bun·biome·oxlint | std9 + PermissionRequest | — | **REMOVER** → global |
| **raiox-neondash** | bun·biome | std9 + PermissionRequest | 9 scripts | **REMOVER** Claude → global; Codex: trocar p/ global (revisar) |
| **missao-amazonica** | bun·**sem linter** | split-gen 12 + PermissionRequest | — | **REMOVER** → global (lint no-op de qualquer forma) |
| **ota-dubai** | bun·**sem linter** | só PostToolUse + local SessionStart, 0 scripts | — | **REMOVER** → global (mínimo) |
| **namesa** | bun·biome | 6 eventos, **0 scripts** (refs quebradas) | — | **REVISAR/REMOVER** — hooks apontam p/ scripts inexistentes; global conserta |
| **AutoGPUS** | biome·oxlint | split-gen + **PreCompact/SessionEnd** (memory-compiler) | — | **TRIM** — manter só PreCompact/SessionEnd; remover o resto (redundante) |
| **neondash** | bun·biome·oxlint | **UserPromptSubmit** + PreCompact/SessionEnd + session_baseline + split-gen | **rico** (UserPromptSubmit orchestration) | **MANTER** (mais rico que global); opcional remover só lint/subagent redundantes |
| **gpus-site-padrao** | bun·biome | std9 + **plan_validator** + _hook_utils | — | **MANTER** se é template ativo; `plan_validator` é candidato a **adicionar ao global** |
| **Marketing-GPUS** | bun·biome | Claude mínimo (só _hook_utils) | **11 scripts** | **REVISAR** — lógica está no Codex, não no Claude |

---

## Hooks únicos — globalizar ou manter?

| Hook | Onde | Genérico? | Recomendação |
|---|---|---|---|
| `plan_validator.py` (warn em plano malformado) | gpus-site-padrao | Sim | **Candidato a adicionar ao global** (PreToolUse Write) |
| `agent_routing_hint.py` / UserPromptSubmit | neondash | Parcial (tunado p/ neondash) | Manter no neondash; globalizar depois se quiser |
| `PreCompact` + `SessionEnd` (claude-memory-compiler) | neondash, AutoGPUS | **Não** (depende de subprojeto por-repo) | **Manter per-repo** |
| `session_baseline.py` (/verify Phase 8) | neondash | Não (workflow neondash) | Manter no neondash |
| `ultracite_fix/check`, `subagent_log`, `evaluator_escalation`, `background_cleanup` | split-gen | Sim (= global unificado) | **Remover** (global cobre) |
| `PermissionRequest` auto-allow | quase todos | Sim, mas concede permissão | **Não globalizar**; aceitar perda (defaultMode:auto cobre) |

---

## Plano de ação recomendado

**Lote A — REMOVER bloco hooks (redundante, baixo risco):**
`calculadora-isca`, `otb-usa`, `trintae3`, `missao-amazonica`, `ota-dubai`, `namesa`, `raiox-neondash` (Claude).
→ Cada um passa a herdar 100% do global. Perda única: PermissionRequest auto-allow (coberto pelo global posture).

**Lote B — TRIM (manter só o project-specific):**
`AutoGPUS` → manter só `PreCompact`+`SessionEnd`; remover o resto.

**Lote C — MANTER (mais rico que o global):**
`neondash` (orquestração + memory-compiler). Opcional: remover só os lint/subagent redundantes p/ evitar double-run, mantendo UserPromptSubmit/PreCompact/SessionEnd/session_baseline.

**Lote D — REVISAR caso a caso:**
`gpus-site-padrao` (é template?), `Marketing-GPUS` (Codex 11 scripts), Codex de `raiox-neondash`.

**Melhoria opcional do global:** adicionar `plan_validator` (genérico e útil).

---

## Plano de aprimoramento do global (✅ IMPLEMENTADO — 2026-05-26)

Objetivo: tornar o global um **superset** absorvendo os hooks genéricos hoje presos em repos específicos, pra que **todos** possam herdar só do global.

> **Status: CONCLUÍDO (2026-05-26).** Global = superset: Claude 12 eventos · Codex 8 eventos · **100% Python** (zero comandos de shell). Orquestração rica do neondash globalizada no `agent_routing_hint.py` compartilhado (Claude + Codex). **Todos os 12 repos migrados** (blocos locais removidos → herdam global); neondash mantém só `claude-memory-compiler/` (o delegador global o invoca). Codex em paridade total com Claude (UserPromptSubmit, session_baseline, plan_validator, memory_compiler_delegate, SessionEnd, PreCompact). Marketing-GPUS Codex já estava inerte (events vazio).

### Hooks a ABSORVER (generificados)

| # | Hook | Origem | Generificável? | Como |
|---|---|---|---|---|
| 1 | **UserPromptSubmit** `agent_routing_hint.py` | neondash | **Sim** — stdlib, mapa keyword→agente-padrão, só emite lembrete (<200ms, nunca spawna) | Copiar verbatim → `~/.claude/hooks/` + wire UserPromptSubmit (Claude e Codex) |
| 2 | **SessionStart** `session_baseline.py` | neondash | **Sim** — snapshot git (branch/SHA/dirty) p/ `/verify`; fail-open, idempotente, qualquer repo git | Copiar verbatim → 2º hook do SessionStart |
| 3 | **PreToolUse(Write)** `plan_validator.py` | gpus-site-padrao | **Sim** — warn-only em `docs/plans/*.md` | Copiar + **inline** dos helpers `_hook_utils` (get_log_dir/log_hook_error) |
| 4 | **PreCompact + SessionEnd** `memory_compiler_delegate.py` | neondash, AutoGPUS | **Sim (delegador condicional)** | NOVO script: roda `<repo>/claude-memory-compiler/hooks/{pre-compact,session-end,session-start}.py` via `uv run` **se existir**; no-op senão. Conserta ref quebrada do AutoGPUS |

### NÃO globalizar
- **PermissionRequest auto-allow** — concede permissão; coberto por `defaultMode:auto` + `skipAutoPermissionPrompt` global.
- **O tool `claude-memory-compiler/`** em si (dados/knowledge por-repo) — fica no repo; só a **invocação** vira global (delegador #4).

### Veredito atualizado (com global = superset)

Depois dos 4 absorvidos, **todos os repos podem remover o bloco local** e herdar do global:
- **neondash** → vira redundante (UserPromptSubmit, session_baseline, PreCompact/SessionEnd cobertos). Mantém só o diretório `claude-memory-compiler/` (o global o invoca).
- **AutoGPUS** → idem; PreCompact/SessionEnd quebrados são consertados pelo delegador.
- **gpus-site-padrao** → `plan_validator` absorvido; o "template" agora É o global.
- **Lote A** → remover (como antes).
- **Marketing-GPUS** (Codex 11 scripts) → revisar na fase Codex.

### Ordem de execução (após teu OK)
1. `~/.claude/hooks/`: copiar `agent_routing_hint.py`, `session_baseline.py`; criar `plan_validator.py` (helpers inline) + `memory_compiler_delegate.py`.
2. `~/.codex/hooks/agent_hooks.py`: adicionar handler `user-prompt-submit` (mesma lógica de routing, genérica).
3. `py_compile` + testes stdin.
4. Wire `~/.claude/settings.json` (UserPromptSubmit, SessionStart+session_baseline, PreToolUse+plan_validator, PreCompact, SessionEnd) + `~/.codex/hooks.json` (UserPromptSubmit).
5. Atualizar `~/.claude/hooks/README.md`.
6. Migrar repos (remover blocos locais), 1-a-1.

---

## Notas

- Double-run (global + project) é **inofensivo** (redundante, mais lento) — não é urgente, mas o objetivo "só global" pede a limpeza.
- Repos sem biome/oxlint (`missao-amazonica`, `ota-dubai`): os hooks de lint do global já fazem **no-op** — migrar não muda lint, só unifica as guardas (protect_files, bash approver, etc.).
- Edições em `.claude/settings.json` por repo são **self-modification** → exigem aprovação explícita (classifier). Migração 1-a-1 conforme acordado.
