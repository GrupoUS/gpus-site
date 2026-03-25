---
date: 2026-03-25
topic: aprimorar-ecossistema-externo
status: open-questions-resolved
---

# Aprimorar o que já temos — ecossistema Grupo US + sites externos

## What We're Building

Evolução **incremental** em cima da integração já feita: produtos **Na Mesa Certa** e **OTB** com `externalSiteUrl`, links no grid/header/footer, redirects estáticos em `astro.config.mjs`, sitemap filtrado e copy OTB alinhado ao repo OTB-DUBAI. O objetivo do brainstorm é decidir **o que ainda vale melhorar** (conteúdo, SEO técnico, DX, analytics, domínios de produção) sem reabrir um redesign completo.

## Why This Approach

O núcleo (híbrido C) já resolve duplicação de landing e unifica CTAs para os apps canônicos. Próximos passos devem seguir **YAGNI**: atacar gaps reais (URL definitiva do OTB, espelhamento do repo namesa, HTTP 301 no edge) em vez de generalizar para “framework de redirects” antes de existir um segundo caso.

## Key Decisions

| Decisão | Racional |
|--------|-----------|
| **Fonte única de URLs** | Hoje há três lugares (JSON `externalSiteUrl` + `cta.url` + `redirects`). Reduzir drift com constante compartilhada ou script de verificação em CI, ou documentar checklist em AGENTS (já há learnings). |
| **301 no edge vs meta refresh** | Build estático Astro gera HTML com meta refresh + `canonical` + `noindex` nas rotas de redirect — aceitável para bookmarks; para SEO agressivo, preferir **redirect HTTP no Caddy/Railway/Cloudflare** para `/otb` e `/na-mesa-certa`. |
| **Repo namesa** | Clone falhou (privado). Copy Na Mesa Certa ainda não espelha o app; próximo passo é acesso ao repo ou export de texto do deploy. |
| **Nova aba nos links externos** | Mantido: `target="_blank"` + `rel="noopener noreferrer"` no grid/nav/footer; `sr-only` no card da home. Política explícita: **nova aba** para não perder o contexto do institucional. |

## Resolved Questions (2026-03-25)

Respostas fechadas para desbloquear **P0**; revisar se marketing mudar domínio ou funil.

1. **URL canônica do deck OTB (institucional)**  
   **Resposta:** Canônica **atual** = `https://ota-dubai.lovable.app/` — alinhada em `externalSiteUrl`, `cta.url` e `astro.config.mjs` `redirects["/otb"]`.  
   **Quando** existir domínio definitivo (ex. Railway, `otb.*.com.br`), atualizar **os três** no mesmo PR. Até lá, Lovable é a fonte de verdade operacional.

2. **Inscrição / WhatsApp vs URL do deck**  
   **Resposta:** **Funil duplo, papéis distintos:**  
   - **Link principal (grid, nav, `cta.url`):** deck interativo (hoje Lovable).  
   - **WhatsApp:** canal separado via `whatsappMessage` + fluxos em `/contato` / CTAs WhatsApp — não precisa ser o mesmo URL que `cta.url`.  
   Não é obrigatório apontar `cta.url` para `drasacha.com.br/otb`; se no futuro o funil principal for o site da Dra., trocar `cta.url` + `externalSiteUrl` + redirect em conjunto.

3. **UTM / métricas nos links externos**  
   **Resposta:** **Padrão recomendado** quando marketing ativar atribuição:  
   `?utm_source=grupous&utm_medium=referral&utm_campaign=product_<slug>`  
   (ex.: `product_otb`, `product_na-mesa-certa`).  
   **Até decisão explícita de marketing:** manter URLs **sem** UTM (estado atual), para não poluir analytics do destino sem governança.

4. **Mais produtos externos**  
   **Resposta:** **YAGNI** — extrair módulo único (`path` → `destination`, lista para sitemap filter) apenas quando houver **3.º** produto com `externalSiteUrl` ou mais de dois redirects externos. Até lá, duplicação documentada nos JSON + `astro.config` é aceitável.

## Open Questions (só o que ainda depende de fora)

- **Domínio final do OTB** (data exata da troca Lovable → produção): owner = deploy/infra + marketing.  
- **Sincronização de copy Na Mesa Certa** com o repo **namesa**: owner = acesso GitHub ou export do app.

## Approaches (2–3 opções para próxima iteração)

### A — Mínimo (recomendado primeiro)

- Documentar URLs finais quando o deploy OTB mudar; atualizar JSON + `astro.config` em um único PR.
- Obter acesso ao **namesa** e fazer diff de copy no `na-mesa-certa.json` apenas.

**Pros:** baixo risco, rápido. **Cons:** não melhora SEO de redirect.

### B — SEO / infra

- Adicionar regras **HTTP 301** no host (Caddy/Railway) para `/na-mesa-certa` e `/otb`, mantendo Astro como fallback ou removendo páginas de redirect do `dist` se o edge cobrir tudo.

**Pros:** melhor sinal para buscadores. **Cons:** depende do provedor e de deploy coordenado.

### C — Automação

- Script `bun run check:external-urls` que lê JSON e compara com `redirects` e responde HEAD nas URLs.

**Pros:** evita drift. **Cons:** mais manutenção e possível flakiness em CI.

## Next Steps

→ Usar o plano aprofundado em [`docs/plans/namesa-otb-external-products-deepened.md`](../plans/namesa-otb-external-products-deepened.md) para priorizar tarefas.

→ Com **Resolved Questions** acima, o próximo passo é execução **A** (URLs + copy) ou **B** (301 no edge) conforme prioridade.

## Handoff — o que você quer fazer agora?

1. **Ver diff** — [`docs/plans/plan-diff-summary.md`](../plans/plan-diff-summary.md) (original × aprofundado)
2. **Seguir para implementação mínima (A)** — atualizar URLs + copy namesa quando houver acesso
3. **Investigar SEO no edge (B)** — documentar snippet Caddy/Railway
4. **Parar por aqui** e retomar quando o deploy OTB estiver definitivo
