# Diff: plano original × plano aprofundado

**Arquivo A (original):** `.cursor/plans/namesa_otb_redirect_sync_f4600afc.plan.md`  
**Arquivo B (aprofundado):** [`namesa-otb-external-products-deepened.md`](namesa-otb-external-products-deepened.md)

**Comando:** `diff -u A B` (trecho inicial; arquivos diferem em estrutura e tamanho).

---

## Resumo executivo

| Aspecto | Plano original (A) | Plano aprofundado (B) |
|--------|---------------------|-------------------------|
| **Frontmatter** | YAML Cursor (`todos`, `overview`, status) | Markdown livre; sem todos embutidos |
| **Topo do doc** | — | **Enhancement Summary** (data, fontes, 4 melhorias-chave, considerações novas) |
| **Estado do código** | Assume `na-mesa-certa.astro` e `otb.astro` existentes | Secção **Estado atual** descreve implementação real (páginas removidas, redirects, sitemap) |
| **Contexto / fases** | Texto corrido + links para ficheiros | Mesmo conteúdo marcado como *original* ou *preservado*, intercalado com **Research Insights** |
| **Decisão A/B/C** | Tabela + recomendação B ou C | Tabela referenciada + nota **implementado: híbrido C** e edge cases (campanhas, UTMs) |
| **Fase 3 redirects** | Prefer astro.config + fallback edge | Igual + explicação **meta refresh vs HTTP 301** e referências Astro/docs |
| **SEO / sitemap** | Excluir ou canonical | Igual + notas JSON-LD futuro e sitemap do destino externo |
| **Diagrama Mermaid** | Sim | Preservado |
| **Fim** | — | Tabela **P0–P2** de próximas ações |

---

## O que foi *adicionado* em B (além de A)

1. Esclarecimento de que **SSG Astro** não emite 301 HTTP por si — só HTML de redirect.
2. Correção de **desatualização**: landings `.astro` já não existem no repo após a implementação.
3. Checklist explícito de **três pontos de URL** (`externalSiteUrl`, `cta.url`, `redirects`).
4. Links para documentação / issues Astro sobre redirects estáticos.
5. Priorização **P0/P1/P2** pós-implementação.

## O que só existe em A

- Metadados de **todos** concluídos (útil no Cursor Plans UI).
- Links clicáveis relativos ao repo nos bullets iniciais (em B parte dos caminhos foi simplificada para texto).

## Como reproduzir o diff completo

```bash
diff -u .cursor/plans/namesa_otb_redirect_sync_f4600afc.plan.md \
  docs/plans/namesa-otb-external-products-deepened.md | less
```

*(O ficheiro A está fora do repo em alguns clones; nesse caso copiar o plano do Cursor para `docs/plans/original-snapshot.md` e comparar.)*
