# Plano — Suíte de Hooks GLOBAL (Claude Code + Codex), igual em todos os projetos

> **Status:** plano (read-only). Nenhuma alteração aplicada. Aguardando aprovação.
> **Complexidade:** L6 — alto (config global compartilhada, multi-ferramenta, multi-repo).
> **Data:** 2026-05-26.

---

## 1. Context (por que esta mudança)

O usuário quer **uma suíte de hooks global, idêntica em todos os projetos** — não mais hooks copiados/divergentes por repo. Hoje a melhor versão dos hooks vive **só** no gpus-site (`.claude/hooks/` + `.claude/settings.json`), e o Codex não tem hooks no gpus-site (o padrão real é per-repo `.codex/hooks.json`, ex.: neondash). Resultado: drift entre repos e zero paridade Claude↔Codex global.

**Decisões confirmadas:**
- **Mecanismo:** **user-level settings** — `~/.claude/settings.json` + `~/.claude/hooks/` (Claude) e `~/.codex/hooks.json` + `~/.codex/hooks/` (Codex). Aplica automaticamente a todo projeto.
- **Escopo:** **suíte inteira** — migrar TODOS os hooks (não só lint/format) para global.
- **Toolchain:** **auto-detect** — scripts detectam package manager (bun/npm/pnpm/yarn) + presença de `biome.json`/`.oxlintrc.json` por projeto, e fazem **no-op** quando a ferramenta não existe.
- **Lint/format (do objetivo original):** PostToolUse só format; Stop aplica **safe-autofix + re-check**; PreToolUse pede **aprovação (ask)** em flags inseguras.

**Resultado esperado:** instalar uma vez no home, e qualquer repo (com ou sem Biome/Oxlint) herda o mesmo comportamento seguro, sem arquivos de hook por projeto.

---

## 2. Codebase Findings (confiança + file:line)

| # | Achado | Evidência | Conf |
|---|---|---|---|
| F1 | `~/.claude/settings.json` (user-level) **não tem** bloco `hooks` — só permissions + statusLine | `~/.claude/settings.json:1-46` | 5 |
| F2 | gpus-site `.claude/settings.json` (project-level) tem a suíte completa: 10 eventos | `.claude/settings.json:64-202` | 5 |
| F3 | 9 scripts Python maduros, fail-open, já parametrizados por `config.json` em runtime | `.claude/hooks/*.py`; `README.md:5-7` | 5 |
| F4 | `ultracite.py` PostToolUse = `bunx biome format <file> --write` (cosmético); lint-fix fora do PostToolUse de propósito (cascata `noUnusedImports`) | `.claude/hooks/ultracite.py:13-23,57-74` | 5 |
| F5 | `ultracite.py` Stop = `bunx oxlint <modified>` (check, bloqueia), honra `stop_hook_active`, trunca (30 linhas/2KB) | `.claude/hooks/ultracite.py:80-119` | 5 |
| F6 | `smart_bash_approver.py` é **PM-agnóstico** (bun/npm/pnpm/yarn) mas não barra `--unsafe`/`--fix-suggestions`/`--fix-dangerously`/global installs | `README.md:52-82` | 4 |
| F7 | `protect_files.py` já tem defaults genéricos + lê `config.json::protectedFiles` (degrada sem config) | `README.md:18,84-93` | 5 |
| F8 | Hardcodes de PM no `ultracite.py`: usa `bunx` fixo (precisa detectar runner para ser global) | `.claude/hooks/ultracite.py:69,103` | 5 |
| F9 | Codex: **sem** `~/.codex/hooks.json` global; `config.toml` só tem `[hooks.state]` (hashes per-repo) | `~/.codex/config.toml:279-363`; Glob | 5 |
| F10 | Padrão Codex per-repo: `.codex/hooks.json` events **PascalCase**, matcher `apply_patch\|Edit\|Write`, comando `python .codex/hooks/<proj>_hooks.py <subcomando>` (dispatcher único) | `F:\Projetos\neondash\.codex\hooks.json:1-103` | 5 |
| F11 | Plugin oficial Codex usa `${CLAUDE_PLUGIN_ROOT}` para path absoluto em comando de hook | `~/.codex/plugins/cache/openai-codex/codex/1.0.4/hooks/hooks.json:9` | 5 |
| F12 | Codex global: `approval_policy=never`, `sandbox_mode=danger-full-access` → guardrail PreToolUse é a única defesa | `~/.codex/config.toml:8-18` | 5 |
| F13 | Outros repos com hooks per-repo (double-run risk com global): neondash, Marketing-GPUS, raiox-neondash | `~/.codex/config.toml:299-348` | 5 |
| F14 | gpus-site: bun + Biome 2.4.9 + Oxlint 1.57.0; `lint:fix` usa `--fix-suggestions` (contradiz safe-only) | `package.json:16,39-43` | 5 |

---

## 3. Assumptions & Unknowns

- `[ASSUMED]` Claude Code executa hooks **user-level + project-level juntos** (merge aditivo) → migrar pra global exige **remover** o bloco `hooks` dos projetos pra evitar dupla execução.
- `[ASSUMED]` Fixes "seguros" = Biome `check --write` sem `--unsafe` + Oxlint `--fix` default (sem `--fix-suggestions`/`--fix-dangerously`).
- `[VERIFY na execução]` Codex descobre `~/.codex/hooks.json` (user-level) automaticamente e o trata como **trusted** (sem prompt de trust, por ser config do próprio usuário). Ref pack lista `~/.codex/hooks.json` como local de descoberta.
- `[VERIFY na execução]` Expansão de path no comando de hook no Windows: usar `$CLAUDE_PROJECT_DIR` (project) e, para o home, `${HOME}`/`$HOME` se suportado; senão path absoluto do usuário. *Path absoluto = machine-specific* (trade-off do user-level; plugin seria cross-machine — rejeitado por escolha do usuário).
- `[VERIFY na execução]` Se Codex expõe `stop_hook_active`. Se não → loop-guard via sentinela por projeto.
- `[VERIFY na execução]` Ler `F:\Projetos\neondash\.codex\hooks\neondash_hooks.py` para espelhar **parsing de payload Codex + formato de decisão JSON** (allow/deny/ask).

---

## 4. Layer Map (cadeia de dependência)

- Data / Service / Router / Client / Presentation // **N/A** — nenhuma mudança de runtime de aplicação.
- **Cross-cutting (todo o trabalho):**
  - **Engine compartilhado global:** `~/.agent-hooks/lint_core.py` (novo, neutro — importado por Claude e Codex; resolve a importação cross-dir).
  - **Claude global:** `~/.claude/hooks/*.py` (9 scripts, project-agnostic) + `~/.claude/settings.json` (bloco `hooks`).
  - **Codex global:** `~/.codex/hooks/agent_hooks.py` (dispatcher) + `~/.codex/hooks.json`.
  - **Migração:** remover bloco `hooks` dos projetos (gpus-site primeiro; outros repos `[REQUIRES APPROVAL]` por repo).
- **Verification:** `py_compile`, testes stdin, `/hooks` (Claude e Codex), gate de um repo COM toolchain (gpus-site) e de um repo SEM Biome/Oxlint (no-op).

**Auth scope:** edição de `~/.claude/settings.json` e `~/.codex/*` = **config global compartilhada** → `[REQUIRES APPROVAL]` (afeta todos os projetos; ExitPlanMode é o gate). Hooks não acessam segredos/rede.

---

## 5. Recommended Approach

**Instalar a suíte madura do gpus-site no home, tornando os scripts project-agnostic, com um engine de lint compartilhado neutro.** (LEVER: copiar o que já é robusto, não reescrever.)

**5.1 Engine neutro `~/.agent-hooks/lint_core.py`** — funções puras, sem payload:
- `project_root()` → `git rev-parse --show-toplevel` || `$CLAUDE_PROJECT_DIR` || CWD.
- `detect_runner(root)` → bun.lock→`bunx` · pnpm-lock→`pnpm dlx` · yarn.lock→`yarn dlx` · package-lock/default→`npx`.
- `has_biome(root)` / `has_oxlint(root)` → checa `biome.json(c)` / `.oxlintrc.json|oxlint.config.*`.
- `format_file(path)` → `<runner> biome format <path> --write` (só se `has_biome`).
- `modified_lint_files(root)` → `git diff --name-only --diff-filter=ACM`, filtra TS/JS, cap 20.
- `safe_autofix(files)` → `<runner> biome check <files> --write` (sem `--unsafe`) + `<runner> oxlint <files> --fix` (sem suggestions/dangerous), cada um guardado por has_*.
- `recheck(files)` → `biome check` + `oxlint` (sem write) → `(error_count, truncated)`.
- **No-op total** quando nem biome nem oxlint existem. Tudo fail-open.

**5.2 Claude global (`~/.claude/`)** — copiar os 9 scripts do gpus-site, ajustar:
- `ultracite.py`: importar `lint_core` (via `sys.path` → `~/.agent-hooks`); PostToolUse = `format_file`; **Stop = `safe_autofix` → `recheck` → block se sobrar erro** (Q2); guard `stop_hook_active` mantido.
- `smart_bash_approver.py`: **+tier "ask"** para `--unsafe`/`--fix-suggestions`/`--fix-dangerously`/global installs (Q3); mantém deny de destrutivos; `bun run lint:fix` continua allow (vê nome do script).
- Demais (`session_context`, `protect_files`, `task_routing_guard`, `subagent_*`, `task_completed`, `notify`): já agnósticos; garantir fallback quando `$CLAUDE_PROJECT_DIR/.claude/config.json` ausente. Logs em `$CLAUDE_PROJECT_DIR/.claude/logs/`.
- `~/.claude/settings.json`: adicionar bloco `hooks` apontando para `~/.claude/hooks/*.py` (paths via `$HOME`/absoluto — ver VERIFY).

**5.3 Codex global (`~/.codex/`)** — dispatcher único `agent_hooks.py` (espelha neondash_hooks.py) importando o mesmo `lint_core`:
- `post-tool` → `format_file`; `stop` → loop-guard + `safe_autofix`+`recheck`+block; `pre-tool` → destrutivos deny + flags inseguras **ask** (crítico sob `approval_policy=never`, F12); `session-start` opcional.
- `~/.codex/hooks.json` (user-level, novo): events PascalCase, matchers `Bash` e `apply_patch|Edit|Write`, comandos `python <home>/.codex/hooks/agent_hooks.py <subcomando>`.

**5.4 Migração / de-dup:** remover bloco `hooks` do `gpus-site/.claude/settings.json` (passa a herdar do global). Outros repos com hooks per-repo (F13): fornecer **checklist** de remoção, executado por repo com `[REQUIRES APPROVAL]` (não auto-editar outros repos neste plano).

### Alternativas rejeitadas
- **Plugin compartilhável** (cross-machine, versionado) — mais portável, mas o usuário escolheu user-level. *Trade-off:* user-level é machine-specific (re-instalar por máquina). Anotado.
- **`.agent-hooks/` dentro de cada repo** — volta ao drift per-repo. Rejeitado; o neutro vai no **home** (`~/.agent-hooks/`).
- **Reescrever scripts do zero** — desperdiça a suíte madura. Rejeitado (LEVER).

---

## 6. Atomic Task Plan (sprints)

### Sprint 1 — Engine compartilhado
**Done when:** `lint_core.py` importável, detecta runner+linters, no-op sem toolchain, fail-open.

#### TASK-01: `~/.agent-hooks/lint_core.py`
- **Layer:** cross-cutting · **Risk:** Medium · **Approval:** Sim (cria dir global)
- **Goal:** Engine neutro de detecção + format/safe-fix/check.
- **Files:** `~/.agent-hooks/lint_core.py` (novo). Origem da lógica: `.claude/hooks/ultracite.py:57-119`.
- **Subtasks:** `- [ ]` implementar `project_root`, `detect_runner`, `has_biome`, `has_oxlint`, `format_file`, `modified_lint_files`, `safe_autofix`, `recheck` (§5.1). `- [ ]` no-op quando sem biome/oxlint. `- [ ]` fail-open em tudo.
- **Validation:** `python -m py_compile ~/.agent-hooks/lint_core.py`; REPL: `detect_runner` num repo bun→`bunx`, npm→`npx`.
- **Rollback:** remover `~/.agent-hooks/`.
- **Acceptance:** funções isoladas; no-op comprovado em dir sem configs.

### Sprint 2 — Claude global
**Done when:** `~/.claude/hooks/` populado e agnóstico; `~/.claude/settings.json` dispara a suíte; gpus-site ainda passa nos gates.

#### TASK-02: Copiar 9 scripts para `~/.claude/hooks/` e tornar agnósticos
- **Layer:** cross-cutting · **Risk:** Medium · **Approval:** Sim (home global)
- **Files:** `~/.claude/hooks/{session_context,smart_bash_approver,protect_files,task_routing_guard,ultracite,subagent_start,subagent_stop,task_completed,notify}.py` + `README.md`. Fonte: `F:\Projetos\gpus-site\.claude\hooks\*`.
- **Subtasks:** `- [ ]` copiar. `- [ ]` garantir fallback sem `config.json`. `- [ ]` `ultracite.py` importa `lint_core` (sys.path→`~/.agent-hooks`). `- [ ]` validar logs em `$CLAUDE_PROJECT_DIR/.claude/logs`.
- **Dependencies:** TASK-01
- **Validation:** `python -m py_compile ~/.claude/hooks/*.py`; testes stdin (README:104-124).
- **Rollback:** remover `~/.claude/hooks/`.
- **Acceptance:** todos compilam; rodam num projeto sem `config.json` sem erro.

#### TASK-03: Upgrade Stop (safe-autofix + re-check) em `ultracite.py`
- **Layer:** cross-cutting · **Risk:** Medium · **Approval:** No (Q2 dado)
- **Files:** `~/.claude/hooks/ultracite.py` (branch Stop).
- **Subtasks:** `- [ ]` manter guard `stop_hook_active`. `- [ ]` `files=modified_lint_files()` → `safe_autofix(files)` → `count,out=recheck(files)` → block se `count>0`. `- [ ]` PostToolUse continua `format_file`. `- [ ]` atualizar docstring.
- **Dependencies:** TASK-01, TASK-02
- **Validation:** `echo '{"hook_event_name":"Stop"}' | python ~/.claude/hooks/ultracite.py`; teste com TS auto-fixável → conserta; com erro residual → block truncado.
- **Rollback:** `git`/backup do arquivo.
- **Acceptance:** Stop escreve só safe fixes e bloqueia só em erro residual.

#### TASK-04: Tier "ask" em flags inseguras (`smart_bash_approver.py`)
- **Layer:** cross-cutting · **Risk:** Low · **Approval:** No (Q3 dado) · **Parallel:** `[PARALLEL]` com TASK-03
- **Files:** `~/.claude/hooks/smart_bash_approver.py`.
- **Subtasks:** `- [ ]` ask em `--unsafe`/`--fix-suggestions`/`--fix-dangerously`/`add -g`/`install -g`/`--global`. `- [ ]` confirmar `bun run lint:fix`→allow. `- [ ]` não duplicar deny existente.
- **Dependencies:** TASK-02
- **Validation:** `echo '{"tool_input":{"command":"bunx biome check src --write --unsafe"}}' | python ~/.claude/hooks/smart_bash_approver.py`→ask; `bun run lint:fix`→allow.
- **Rollback:** restaurar arquivo.
- **Acceptance:** flags inseguras→ask; seguros inalterados.

#### TASK-05: Bloco `hooks` em `~/.claude/settings.json`
- **Layer:** cross-cutting · **Risk:** High (config global) · **Approval:** **Sim**
- **Files:** `~/.claude/settings.json` (adicionar `hooks`, espelhando `.claude/settings.json:64-202` com paths `~/.claude/hooks/`).
- **Subtasks:** `- [ ]` mapear 10 eventos. `- [ ]` resolver path do home (`$HOME`/absoluto — VERIFY). `- [ ]` preservar permissions/statusLine existentes.
- **Dependencies:** TASK-02..04
- **Validation:** JSON válido; `/hooks` no Claude (qualquer projeto) lista os eventos.
- **Rollback:** remover bloco `hooks` do settings global.
- **Acceptance:** hooks disparam em projeto novo sem nenhum `.claude/hooks/` local.

### Sprint 3 — Codex global
**Done when:** `~/.codex/hooks.json` + `agent_hooks.py` ativos; `/hooks` no Codex lista; no-op em repo sem toolchain.

#### TASK-06: Dispatcher `~/.codex/hooks/agent_hooks.py`
- **Layer:** cross-cutting · **Risk:** Medium · **Approval:** Sim (home global)
- **Files:** `~/.codex/hooks/agent_hooks.py` (novo). Referência: `F:\Projetos\neondash\.codex\hooks\neondash_hooks.py` (`[VERIFY]` ler primeiro).
- **Subtasks:** `- [ ]` import `lint_core` (sys.path→`~/.agent-hooks`, fallback no-op). `- [ ]` `post-tool`→`format_file`. `- [ ]` `stop`→loop-guard (sentinela se sem `stop_hook_active`)+`safe_autofix`+`recheck`+block. `- [ ]` `pre-tool`→deny destrutivos + ask flags inseguras (F12). `- [ ]` formato de decisão Codex espelhado de neondash.
- **Dependencies:** TASK-01
- **Validation:** `echo '{}' | python ~/.codex/hooks/agent_hooks.py stop`→exit 0; testes por subcomando.
- **Rollback:** remover `~/.codex/hooks/`.
- **Acceptance:** subcomandos rodam; stop aplica safe-fix+block; pre-tool faz ask.

#### TASK-07: `~/.codex/hooks.json` (user-level)
- **Layer:** cross-cutting · **Risk:** High (config global) · **Approval:** **Sim**
- **Files:** `~/.codex/hooks.json` (novo). Espelhar `neondash/.codex/hooks.json` (PascalCase, matchers).
- **Subtasks:** `- [ ]` `PostToolUse`(`apply_patch|Edit|Write`)→post-tool. `- [ ]` `Stop`→stop. `- [ ]` `PreToolUse`(`Bash` e `apply_patch|Edit|Write`)→pre-tool. `- [ ]` path home absoluto/`${...}` (F11/VERIFY).
- **Dependencies:** TASK-06
- **Validation:** **manual** — Codex em qualquer repo → `/hooks` lista; confirmar trust (VERIFY: user-level pode não pedir).
- **Rollback:** remover `~/.codex/hooks.json`.
- **Acceptance:** `/hooks` no Codex lista; dispara em repo arbitrário.

### Sprint 4 — Migração + docs
**Done when:** gpus-site herda do global sem double-run; checklist de outros repos pronto; docs atualizadas.

#### TASK-08: Remover bloco `hooks` do gpus-site
- **Layer:** cross-cutting · **Risk:** Medium · **Approval:** **Sim** (decisão de remover hooks ativos)
- **Files:** `F:\Projetos\gpus-site\.claude\settings.json` (remover só o bloco `hooks`; manter permissions/statusLine). `.claude/hooks/*` podem ficar como seed/BOOTSTRAP (não removidos por padrão).
- **Dependencies:** TASK-05 (global ativo antes de remover local)
- **Validation:** `/hooks` no gpus-site mostra os hooks vindos do global (não duplicados); `bun run lint && bunx astro check && bun run build`.
- **Rollback:** restaurar bloco `hooks` do settings do projeto.
- **Acceptance:** sem dupla execução; comportamento idêntico via global.

#### TASK-09: Checklist de migração dos outros repos `[REQUIRES APPROVAL]`
- **Layer:** cross-cutting · **Risk:** Medium · **Approval:** **Sim por repo**
- **Files:** docs (checklist). Repos: neondash, Marketing-GPUS, raiox-neondash (F13) — remover `.claude/settings.json::hooks` e `.codex/hooks.json` por repo, com aprovação individual.
- **Dependencies:** TASK-05, TASK-07
- **Validation:** por repo, `/hooks` mostra só os globais.
- **Rollback:** restaurar arquivos do repo.
- **Acceptance:** nenhum repo com double-run após migração aprovada.

#### TASK-10: Docs `~/.claude/hooks/README.md`
- **Layer:** cross-cutting · **Risk:** Low · **Approval:** No
- **Files:** `~/.claude/hooks/README.md` (instalação global, auto-detect, Stop safe-fix, ask flags, paridade Codex, migração).
- **Dependencies:** TASK-03..08
- **Validation:** revisão manual.
- **Acceptance:** README descreve a suíte global real.

#### TASK-11 (Opcional) Reconciliar `lint:fix` safe/suggest `[REQUIRES APPROVAL]`
- **Files:** `gpus-site/package.json` (**protegido**) — split `lint:fix` (seguro) vs `lint:fix:suggest` (`--fix-suggestions` opt-in). Replicar padrão nos demais repos.
- **Approval:** **Sim** (arquivo protegido).

---

## 7. Validation Plan (somente comandos existentes)

1. **Compile:** `python -m py_compile ~/.agent-hooks/lint_core.py ~/.claude/hooks/*.py ~/.codex/hooks/agent_hooks.py`.
2. **Stdin (padrão README:104-124):** ultracite Stop; bash approver (unsafe→ask, `bun run lint:fix`→allow); `agent_hooks.py stop`→exit 0.
3. **Repo COM toolchain (gpus-site):** `bun run lint` · `bunx astro check` · `bun run build` → ok. Stop conserta safe + bloqueia residual.
4. **Repo SEM Biome/Oxlint:** abrir um projeto sem essas configs → hooks de lint **no-op** (Stop não bloqueia).
5. **Claude `/hooks`:** num projeto sem `.claude/hooks/` local → eventos aparecem (vêm do global).
6. **Codex `/hooks`:** num repo arbitrário → eventos listados; trust (VERIFY).
7. **De-dup:** gpus-site após TASK-08 → `/hooks` sem duplicatas.
8. **Loop:** Stop 2× → respeita `stop_hook_active` (Claude) / sentinela (Codex).

*Sem CI no gpus-site; sem test runner (`tooling.testRunner` vazio) → validação por compile + stdin + gate manual.*

---

## 8. Risks & Rollback (top 5)

| # | Risco | Mitigação | Rollback |
|---|---|---|---|
| R1 | Double-run global+project até migrar todos os repos | Migrar gpus-site junto (TASK-08); checklist aprovado por repo (TASK-09) | restaurar `hooks` no projeto OU remover bloco global |
| R2 | Hook global roda em repo sem Biome/Oxlint e quebra/bloqueia | `lint_core` no-op total quando `has_biome`/`has_oxlint`=false; fail-open | remover `~/.agent-hooks/` |
| R3 | Path do home não expande no comando de hook (Windows) → hook não roda | VERIFY `$HOME`/`${...}`; fallback path absoluto; testar `/hooks` antes de migrar | reverter settings global |
| R4 | Stop escreve safe fixes pós-turno inesperados | só safe (sem `--unsafe`/suggestions); escopo git-modificados; loop guard | reverter TASK-03/06 |
| R5 | Codex `approval_policy=never`+sandbox aberto: pre-tool é guardrail, não garantia | manter destrutivos em deny duro; ask só flags; documentar limite | revogar `~/.codex/hooks.json` |

**Loop prevention:** Claude `stop_hook_active` (mantido); Codex sentinela+cap; PostToolUse format-only (não re-dispara); nenhum hook roda repo inteiro nem suíte de testes.

---

## 9. Acceptance Criteria

- [ ] Suíte completa roda via `~/.claude/settings.json` + `~/.claude/hooks/` em **qualquer** projeto, sem arquivos de hook locais.
- [ ] Codex roda a mesma política via `~/.codex/hooks.json` + `~/.codex/hooks/agent_hooks.py`.
- [ ] Engine único `~/.agent-hooks/lint_core.py` usado por Claude e Codex (sem duplicação).
- [ ] Auto-detect: bun/npm/pnpm/yarn + biome/oxlint; **no-op** quando ausente.
- [ ] PostToolUse = format-only; Stop = safe-autofix + re-check (bloqueia só erro residual); nenhuma flag insegura automática.
- [ ] PreToolUse: flags inseguras→ask; destrutivos→deny; `bun run lint:fix`→allow.
- [ ] gpus-site sem double-run; gates (`lint`/`astro check`/`build`) passam.
- [ ] Loop guard funciona em Claude e Codex.

---

## 10. Implementation Order

```
Sprint 1: TASK-01 (engine)
Sprint 2: TASK-02 → (TASK-03 ∥ TASK-04) → TASK-05 (settings global)
Sprint 3: TASK-06 → TASK-07 (Codex)
Sprint 4: TASK-08 (migra gpus-site) → TASK-09 (outros repos, approval) → TASK-10 (docs)
Opcional: TASK-11 (lint:fix, approval)
```
Gates globais (`~/.claude/settings.json`, `~/.codex/hooks.json`) só após os scripts validados. Migração (TASK-08/09) só com o global confirmado funcionando.

---

## 11. Context Handoff

```markdown
## Context Handoff
- Status: COMPLETED
- Confidence: 4
- Artifacts:
  - { path: "~/.agent-hooks/lint_core.py", action: "create (engine compartilhado, auto-detect)" }
  - { path: "~/.claude/hooks/*.py (9) + README.md", action: "create (copiar de gpus-site, agnostic)" }
  - { path: "~/.claude/hooks/ultracite.py", action: "edit (Stop safe-autofix+recheck)" }
  - { path: "~/.claude/hooks/smart_bash_approver.py", action: "edit (ask flags inseguras)" }
  - { path: "~/.claude/settings.json", action: "edit (add hooks block) [REQUIRES APPROVAL]" }
  - { path: "~/.codex/hooks/agent_hooks.py", action: "create (dispatcher reusa engine)" }
  - { path: "~/.codex/hooks.json", action: "create (user-level) [REQUIRES APPROVAL]" }
  - { path: "gpus-site/.claude/settings.json", action: "edit (remover hooks block) [REQUIRES APPROVAL]" }
  - { path: "outros repos", action: "remover hooks per-repo [REQUIRES APPROVAL por repo]" }
- Quality gates:
  - { name: "py_compile (todos)", status: PENDING }
  - { name: "gpus-site lint/astro check/build", status: PENDING }
  - { name: "no-op em repo sem toolchain", status: PENDING }
  - { name: "Claude+Codex /hooks", status: PENDING (manual) }
- Decisions:
  - { what: "user-level global", why: "decisão Q1 — igual em todo projeto automaticamente" }
  - { what: "suíte inteira migrada", why: "decisão Q2" }
  - { what: "auto-detect + no-op", why: "decisão Q3 — portável a qualquer stack" }
  - { what: "engine neutro em ~/.agent-hooks", why: "resolve import cross-dir Claude↔Codex sem duplicar" }
  - { what: "safe-autofix no Stop, não PostToolUse", why: "cascata noUnusedImports" }
- Risks:
  - { desc: "double-run até migrar repos", mitigation: "migrar gpus-site + checklist aprovado por repo" }
  - { desc: "path home no Windows", mitigation: "VERIFY $HOME/absoluto antes de ativar gates" }
- Next agent: executor via /implement (tooling — sem frontend-specialist)
- Resume hint: começar TASK-01 (~/.agent-hooks/lint_core.py); ler neondash_hooks.py antes da Sprint 3.
```

---

### Notas
- `~/.claude/settings.json` e `~/.codex/*` = config global compartilhada → todas as edições marcadas `[REQUIRES APPROVAL]`; ExitPlanMode é o gate de aprovação do plano.
- Trade-off do user-level: **machine-specific** (re-instalar por máquina). Plugin seria cross-machine — rejeitado por escolha.
- Nenhuma flag insegura roda automaticamente em nenhum ponto, nem o repo inteiro / suíte de testes.
```
