---
description: Captura aprendizados após tarefas bem-sucedidas, aprimora skills e AGENTS.md para evitar erros recorrentes
---

# /evolve — Captura de Aprendizados

**ARGUMENTS**: $ARGUMENTS

---

## 1. PRIMEIRA AÇÃO: Analisar Contexto

Analise a conversa atual para extrair aprendizados. Não depende de skills externas.

---

## 2. FLUXO DE CAPTURA

### 2.1 Coletar Contexto da Sessão

Analise a conversa atual para identificar:

```markdown
## Contexto Identificado

### Tarefa Realizada
[Breve descrição do que foi feito]

### Problema Encontrado
[Descrição do bug/erro/issue]

### Root Cause
[Causa raiz identificada]

### Solução Aplicada
[Código ou mudanças específicas]

### Validação
[Comandos executados: check, lint, test, etc.]
```

### 2.2 Persistir em MEMORY.md

Documente o aprendizado no arquivo MEMORY.md do projeto:

```markdown
### [Data: YYYY-MM-DD] [Título do Aprendizado]

**Problema:** [descrição]
**Root Cause:** [causa raiz]
**Solução:** [fix aplicado]
**Arquivos:** [lista de arquivos modificados]
```

---

## 3. SELEÇÃO DE SKILLS (Semi-Automática)

### 3.1 Mapear Domínio Afetado

Com base nos arquivos/modificações, sugerir skills relevantes:

| Domínio | Arquivos | Skill Principal | Skill Complementar |
|---------|----------|-----------------|-------------------|
| Astro Components | `src/components/*.astro` | `astro` | `debugger` |
| React Islands | `src/components/*.tsx` | `astro` (islands-architecture) | `debugger` |
| Content Collections | `src/content/**/*.json` | `astro` (content-collections) | — |
| Styling / Tailwind v4 | `src/styles/global.css` | `astro` (styling-tailwind) | `gpus-theme` |
| Layouts / View Trans. | `src/layouts/*.astro` | `astro` (view-transitions) | — |
| Config / Build | `astro.config.mjs` | `astro` (configuration) | — |
| Performance | Otimizações gerais | `performance-optimization` | `astro` (performance) |
| Design Tokens | `src/styles/global.css` | `gpus-theme` | `astro` (styling-tailwind) |

### 3.2 Perguntar ao Usuário

```
Com base na tarefa realizada, sugiro aprimorar:

1. debugger (Astro/React components)
2. AGENTS.md (Project rules)
3. performance-optimization (se aplicável)

Quais deseja atualizar? [1,2,3 ou Enter para todos marcados]
```

---

## 4. APRIMORAR SKILLS

### 4.1 Template de Atualização

Para cada skill selecionada, adicionar em `references/` ou seção do SKILL.md:

```markdown
## Caso: [Nome do Bug/Problema]

**Sintoma:** [O que o usuário percebe]
**Root Cause:** [Causa técnica]
**Fix:** [Solução aplicada]
**Arquivos:** `[lista de arquivos]`
**Validação:** `bunx astro check && bun run build`

### Anti-Pattern Descoberto

```typescript
// ❌ ERRADO: [descrição]
[código problemático]

// ✅ CORRETO: [descrição]
[código correto]
```
```

### 4.2 Tipos de Atualização

| Tipo | Onde Adicionar | Quando Usar |
|------|----------------|-------------|
| **Stability Rule** | Seção dedicada | Regras para evitar crashes |
| **Anti-Pattern** | Seção existente | Padrões problemáticos |
| **Known Case** | `references/` | Casos complexos documentados |
| **Quick Reference** | Tabela existente | Dicas rápidas |

---

## 5. APRIMORAR AGENTS.md

### 5.1 Selecionar Arquivos

Com base nos arquivos modificados, sugerir AGENTS.md relevantes:

| Arquivo Modificado | AGENTS.md Alvo |
|--------------------|----------------|
| `src/components/*.astro` | `AGENTS.md` |
| `src/components/*.tsx` | `AGENTS.md` |
| `src/content/**` | `AGENTS.md` |

### 5.2 Template de Atualização

Adicionar seção ao AGENTS.md selecionado:

```markdown
### [Data: YYYY-MM-DD] [Título do Aprendizado]

> Adicionado após correção de bug em `[arquivo]`.

**Problema:** [Descrição]
**Causa:** [Root cause]
**Solução:** [Fix aplicado]

```typescript
// ❌ EVITAR
[código problemático]

// ✅ PADRÃO CORRETO
[código correto]
```
```

---

## 6. SINCRONIZAR COM NOTEBOOKLM (Opcional)

Se configurado, adicione o aprendizado ao NotebookLM:

```typescript
// Apenas se o usuário tiver NotebookLM configurado
notebooklm_notebook_add_text({
  notebook_id: "<notebook-id-if-configured>",
  title: `Fix - ${slug}`,
  content: `## Problema
[descrição]

## Root Cause
[causa]

## Solução
[fix]

## Validação
[bunx astro check && bun run build]`,
});
```

---

## 7. RESUMO FINAL

```
Aprendizado capturado com sucesso!

- MEMORY.md atualizado
- Skills aprimoradas: [lista]
- AGENTS.md atualizados: [lista]
```

---

## Astro Anti-Patterns Comuns para Documentar

Ao evoluir skills com aprendizados do Astro, priorize documentar:

| Anti-Pattern | Referência Astro Skill |
|--------------|----------------------|
| `client:*` em componentes `.astro` | islands-architecture.md |
| Passar `CollectionEntry` direto para React | content-collections.md |
| Usar `ViewTransitions` em vez de `ClientRouter` | view-transitions.md |
| Criar `src/content/config.ts` no Astro 6 | content-collections.md |
| Hardcoded hex em vez de `@theme` tokens | styling-tailwind.md |
| `tailwind.config.js` com Tailwind v4 | styling-tailwind.md |
| Animar `width/height/top/left` | performance.md |
| `loading="lazy"` em imagem LCP | performance.md |

## Referências

- **astro**: `.claude/skills/astro/SKILL.md` — Referência completa Astro 6
- **skill-creator**: `.claude/skills/skill-creator/SKILL.md`
- **NotebookLM**: `.claude/skills/planning/SKILL.md`
