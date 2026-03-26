---
id: SEED-001
status: dormant
planted: 2026-03-26
planted_during: "meta-improvement session — antigravity-kit + everything-claude-code patterns"
trigger_when: "quando criar ou revisar qualquer command em .claude/commands/ ou .claude/agents/"
scope: Small
---

# SEED-001: WHY rationale parenthético em templates de commands/agents

## Why This Matters

A análise EVOLVE_AUTORESEARCH em `delegate.md` mostrou que o único gap nos critérios binários era C4 (WHY rationale ausente). Adicionar `*(agents without context rediscover what you already know — fill every field)*` inline no header da seção aumentou o score de 12/15 → 15/15 sem adicionar complexidade.

Templates com campos obrigatórios que não explicam o custo de pular são ignorados por agentes sob pressão de tokens. O WHY inline, em itálico parenthético, é o mecanismo mais leve para garantir adesão.

## When to Surface

**Trigger:** quando criar um novo command `.claude/commands/*.md` ou agent `.claude/agents/*.md` com template de campos obrigatórios — ou ao revisar um command existente.

Apresentar durante `/gsd:new-milestone` quando o escopo incluir:
- Criação de novos commands ou agents para o projeto
- Refatoração ou revisão de commands existentes
- Adição de seções com campos obrigatórios a qualquer prompt

## Scope Estimate

**Small** — é um checklist de revisão, não uma fase. Aplicar como lembrete ao criar/revisar commands: "cada campo obrigatório tem WHY rationale inline?".

## Breadcrumbs

Arquivos relevantes no repositório:

- `.claude/commands/delegate.md` — padrão aplicado: CONTEXT header com parenthetical WHY
- `.claude/agents/orchestrator.md` — Mandatory Context block já tem `> MANDATORY CONTEXT RULE:` como rationale
- `.claude/commands/debug.md` — Investigation Strategy table (sem WHY nas colunas — candidato para próxima rodada)
- `.claude/commands/plan.md` — Socratic Gate (seção já tem texto explicativo, não precisa de WHY adicional)
- `evals/delegate/runs/20260326T030818Z/` — log completo do EVOLVE_AUTORESEARCH que descobriu esse padrão

## Notes

Padrão descoberto via EVOLVE_AUTORESEARCH no run `20260326T030818Z`. O critério C4 (WHY rationale) falhou em 100% dos test cases no baseline porque o CONTEXT section não explicava o custo de pular os campos. Candidate-A (parenthetical inline) foi o único keep do run.

Aplicar de forma consistente a todos os commands que tenham templates com campos `[placeholder]` obrigatórios.
