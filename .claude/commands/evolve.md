---
description: Autoresearch objetivo para otimizar skills/prompts (EVOLVE_AUTORESEARCH) quando houver pedido estruturado; em seguida captura aprendizados, memory, GSD e session-report
---

# /evolve — Autoresearch + Captura de Aprendizados

**ARGUMENTS**: $ARGUMENTS

---

## Fluxo em duas fases

| Fase | Quando roda | Objetivo |
|------|-------------|----------|
| **1 — Autoresearch** | O usuário fornece um bloco `<evolve_request>...</evolve_request>` válido (em `$ARGUMENTS` ou na mensagem) **ou** pede explicitamente otimização de uma skill/prompt com os mesmos campos | Otimizar **somente o texto** do `target_skill_prompt` com evals objetivos, baseline obrigatório, harness **imutável** durante o run, múltiplas amostras e decisão **keep \| discard** por iteração |
| **2 — Captura** | **Sempre** após a Fase 1, se ela rodou; **ou** sozinha se não houver autoresearch | Simplify (se código), quality gates, memory, GSD, skills/AGENTS, session-report |

**Restrições constitucionais (nível prompt/skill):**

- **Superfície editável:** apenas o `target_skill_prompt` em modo autoresearch.
- **Superfície imutável durante o run:** critérios binários, fórmula de score, conjunto de casos de teste e regras de plateau — fixados após a definição inicial; mudança = **novo run**.
- **Baseline primeiro:** avaliar o prompt atual antes de qualquer mutação; registrar no `<experiment_log>`.
- **Sem métricas subjetivas** (“vibes”) como score principal.
- **Nunca** promover candidato com score agregado **inferior** ao melhor atual.
- **Nunca** assumir ferramentas inexistentes; lacunas vão em `<knowledge_gaps>`.

---

## Fase 1 — Autoresearch (condicional)

### 1.1 Detecção

- Procure `<evolve_request>` bem formado com campos obrigatórios: `target_skill_name`, `target_skill_prompt`, `task_domain`, `eval_constraints`, `resources/max_iterations`, `resources/samples_per_iteration`.
- Se faltar campo obrigatório ou `eval_constraints` for ambíguo: faça **uma** pergunta objetiva (preferência múltipla escolha) e **não** inicie o loop até resposta.

### 1.2 Execução

1. Carregue e siga a skill **`evolve-autoresearch`** (meta-skill `EVOLVE_AUTORESEARCH`): `.claude/skills/evolve-autoresearch/SKILL.md`.
2. Opcionalmente invoque `Skill("evolve-autoresearch")` com o conteúdo do request se o ambiente suportar.
3. Produza **primeiro** a saída completa em `<evolve_response>...</evolve_response>` conforme o schema da skill (incluindo `eval_design`, `experiment_log` com **todas** as iterações, `candidate_id`, `score`, `delta_vs_baseline`, `decision` **keep \| discard**, `hypothesis` quando `store_rationale`, `changes_summary`, `knowledge_gaps`, `next_actions`).
4. **Status:** `success` se houve melhora clara e critérios estáveis; `partial` em plateau ou orçamento; `failed` se inputs inválidos ou bloqueio total.

> Inspiração de loop: projeto Karpathy [autoresearch](https://github.com/karpathy/autoresearch) — um artefato mutável, harness fixo, baseline, keep/discard por métrica.

**Se não houver `<evolve_request>` válido:** pule a Fase 1 e vá direto para a Fase 2.

---

## Fase 2 — Captura (pós-autoresearch ou standalone)

### 0. PRIMEIRA AÇÃO: Simplify (Qualidade de Código)

**Quando houver código modificado nesta sessão**, antes de capturar aprendizados, revise o código.

Execute `Skill("simplify")` passando os arquivos alterados nesta sessão como contexto. O simplify revisa automaticamente:

- Reutilização de funções/componentes já existentes
- Complexidade desnecessária
- Oportunidades de composição ou extração
- Eficiência e legibilidade

> Se a sessão foi **apenas** otimização de prompt (Fase 1 sem arquivos de código tocados), documente isso no resumo e **pule** o simplify.

Após o simplify resolver problemas (quando aplicável), **re-execute as quality gates**:

```bash
bun run lint && bunx astro check && bun run build
```

---

### 1. Analisar Contexto da Sessão

Analise a conversa atual para extrair aprendizados. Inclua, se a Fase 1 rodou, um resumo do autoresearch (status, melhor candidato, plateau). Identifique:

```markdown
## Contexto Identificado

### Tarefa Realizada
[Breve descrição do que foi feito]

### Problema Encontrado
[Descrição do bug/erro/issue — se houver]

### Root Cause
[Causa raiz identificada]

### Solução Aplicada
[Código ou mudanças específicas]

### Validação
[Comandos executados: check, lint, build, etc.]
```

---

### 2. FLUXO DE CAPTURA

### 2.1 Persistir em Memory (auto memory)

O sistema de memória fica em `/home/mauricio/.claude/projects/-home-mauricio-gpus/memory/` e é carregado automaticamente pelo **Claude Code**, **Cursor** e **GSD** a cada nova conversa. Ele tem dois artefatos que devem ser mantidos sincronizados:

| Artefato | Propósito | Carregado por |
|----------|-----------|---------------|
| `MEMORY.md` | Índice de ponteiros — uma linha por memória | Claude Code (auto-load), Cursor, GSD |
| `<tipo>_<slug>.md` | Arquivo individual com o conteúdo completo | Lido sob demanda quando relevante |

**MEMORY.md é truncado após 200 linhas** — mantenha cada entrada em até ~150 caracteres.

#### Passo 1: Criar ou atualizar o arquivo de memória individual

Escolha o tipo correto:

- **`feedback_<slug>.md`** — padrão de código, correção de anti-pattern, preferência de abordagem
- **`project_<slug>.md`** — decisão de arquitetura, mudança de convenção, contexto de milestone
- **`user_<slug>.md`** — preferência do usuário, perfil de trabalho
- **`reference_<slug>.md`** — ponteiro para recurso externo (URL, Linear, Slack)

Formato do arquivo:

```markdown
---
name: [título curto — mesmo texto usado no MEMORY.md]
description: [uma linha — usada para decidir relevância em conversas futuras]
type: feedback | project | user | reference
---

[Regra ou fato principal]

**Why:** [motivação — incidente passado, preferência forte ou decisão técnica]
**How to apply:** [quando/onde essa orientação entra em jogo]
```

> Se o arquivo já existe, **atualize-o** — não duplique. Verifique primeiro com Read.

#### Passo 2: Atualizar MEMORY.md (índice)

Após criar/atualizar o arquivo individual, adicione ou atualize a linha correspondente em `MEMORY.md`:

```markdown
- [Título da Memória](nome_do_arquivo.md) — gancho em uma linha que explica quando é relevante
```

Regras do índice:
- Uma linha por memória, máximo ~150 caracteres
- O gancho deve responder: "quando devo carregar este arquivo?"
- Se a memória foi **atualizada** (não criada), atualize o gancho se mudou de escopo
- Se a memória foi **removida** (obsoleta), remova a linha do índice também
- Nunca escreva conteúdo de memória direto no `MEMORY.md` — só ponteiros

Exemplo de entrada bem escrita:
```markdown
- [Nunca reverter cegamente](feedback_never_revert_blindly.md) — sempre ler/verificar antes de reverter ou deletar arquivos
```

### 2.2 GSD: Capturar Notas e Seeds

Use os comandos GSD para persistir aprendizados no contexto do projeto:

**Para aprendizados imediatos e acionáveis:**

```
/gsd:note "Aprendizado: [descrição concisa do que foi descoberto]"
```

**Para melhorias que devem ser aplicadas no próximo milestone ou fase relevante:**

```
/gsd:plant-seed "Quando [condição/trigger], aplicar [melhoria descoberta nesta sessão]"
```

Exemplos de seeds úteis:
- `"Quando iniciar nova landing page, rodar /gsd:ui-phase antes de qualquer código"`
- `"Quando tocar produtos externos, verificar astro.config.mjs redirects + check:external-urls"`
- `"Quando criar novo React island, justificar explicitamente por que não pode ser .astro"`

**Para tarefas pendentes identificadas durante a sessão:**

```
/gsd:add-todo "[tarefa identificada que ficou fora do escopo desta sessão]"
```

---

### 3. SELEÇÃO DE SKILLS (Semi-Automática)

### 3.1 Mapear Domínio Afetado

Com base nos arquivos/modificações, identificar skills relevantes:

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
| Commands / Workflows | `.claude/commands/*.md` | — | — |
| Autoresearch / otimização de prompts | `.claude/skills/**/SKILL.md` | `evolve-autoresearch` | `skill-creator` |

### 3.2 Perguntar ao Usuário

```
Com base na tarefa realizada, sugiro aprimorar:

1. debugger (Astro/React components)
2. AGENTS.md (Project rules)
3. performance-optimization (se aplicável)
4. evolve-autoresearch (se houve Fase 1 nesta sessão)

Quais deseja atualizar? [1,2,3,4 ou Enter para todos marcados]
```

---

### 4. APRIMORAR SKILLS

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

### 5. APRIMORAR AGENTS.md

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

### 6. GSD: Session Report e Contexto Cross-Session

### 6.1 Gerar Session Report

Sempre ao final do /evolve, gere um relatório da sessão para registrar o trabalho realizado:

```
/gsd:session-report
```

O session-report captura: estimativa de tokens, resumo do trabalho, outcomes, e o que ficou pendente.

### 6.2 Persistir Contexto Cross-Session (se necessário)

Se a tarefa desta sessão **continua em sessões futuras** ou tem dependências que outras sessões precisam conhecer:

```
/gsd:thread "contexto: [o que foi feito e o que ainda precisa ser feito]"
```

Use threads para:
- Trabalho que será continuado após `context reset`
- Decisões arquiteturais que devem ser comunicadas na próxima sessão
- Estado intermediário de uma feature multi-sessão

---

### 7. RESUMO FINAL

```
Evolve concluído!

[Fase 1] Autoresearch: [executado — status | omitido — sem <evolve_request>]
✅ Simplify executado quando aplicável (qualidade validada)
✅ Quality gates passando quando código foi tocado
✅ Memory atualizada (feedback/project)
✅ GSD notes/seeds capturados
✅ Skills aprimoradas: [lista]
✅ AGENTS.md atualizados: [lista]
✅ Session report gerado
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

- **evolve-autoresearch / EVOLVE_AUTORESEARCH:** `.claude/skills/evolve-autoresearch/SKILL.md`
- **simplify**: skill built-in do Claude Code — revisa código para reuso, qualidade e eficiência
- **astro**: `.claude/skills/astro/SKILL.md` — Referência completa Astro 6
- **skill-creator**: `.claude/skills/skill-creator/SKILL.md`
- **GSD commands**: `/gsd:note`, `/gsd:plant-seed`, `/gsd:add-todo`, `/gsd:session-report`, `/gsd:thread`
- **Karpathy autoresearch (inspiração de loop):** [github.com/karpathy/autoresearch](https://github.com/karpathy/autoresearch)
