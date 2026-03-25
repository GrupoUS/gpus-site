---
title: "Rotas de produto externo no Astro estático (Grupo US)"
category: integration-issues
tags:
  - astro
  - astro-ssg
  - redirects
  - sitemap
  - content-collections
  - grupous
  - external-urls
module: gpus
symptom: "Duplicar landings longas no domínio institucional enquanto a experiência canónica vive em apps separados (Na Mesa Certa, OTB Dubai deck); bookmarks em /slug devem continuar válidos."
root_cause: "Conteúdo e UX principais migraram para hosts externos; o site Astro precisava encaminhar tráfego sem SPA e sem duplicar manutenção de copy."
date: 2026-03-25
related:
  - ../../brainstorms/2026-03-25-aprimorar-ecossistema-externo-brainstorm.md
  - ../../plans/namesa-otb-external-products-deepened.md
  - ../../plans/plan-diff-summary.md
---

# Astro estático: produtos com `externalSiteUrl` + redirects + sitemap

## Contexto

O site **gpus** (Astro 6, `output: static`) expõe vários produtos via Content Collections. Dois produtos passaram a ter a **experiência canónica** fora de `grupous.com.br` (site Na Mesa Certa e deck OTB Dubai). Era necessário:

- Links no **grid da home**, **header** e **footer** para o destino externo.
- Rotas internas **`/na-mesa-certa`** e **`/otb`** ainda úteis para links antigos e campanhas.
- **Sitemap** sem URLs que só existem para redirect com `noindex`.
- **Sem** React islands nem SPA (MPA, `<a href>`).

## Sintomas / requisitos

- Visitante clica "Saiba mais" → deve abrir o site/deck oficial em nova aba (política escolhida).
- `https://grupous.com.br/otb` digitado ou bookmark → deve chegar ao deck.
- Não listar essas rotas no `sitemap.xml` como páginas a indexar no domínio institucional.

## Causa raiz (decisão de arquitetura)

Landings Astro longas duplicavam apps que já são a fonte de verdade (copy rica, interação). O modelo **híbrido (C)** unifica: navegação direta para o externo + páginas de redirect estáticas para `/slug`.

## Solução implementada

### 1. Schema e dados (`src/content.config.ts` + JSON do produto)

Campo opcional:

```ts
externalSiteUrl: z.string().url().optional(),
```

Em `na-mesa-certa.json` e `otb.json`: preencher `externalSiteUrl` com a URL canónica (com barra final consistente com o resto do projeto).

Manter **`cta.url`** alinhado ao mesmo destino quando o CTA principal for "ver apresentação / site do produto".

### 2. Navegação e grid

- [`src/lib/productsNav.ts`](../../../src/lib/productsNav.ts): `href = entry.data.externalSiteUrl ?? \`/${slug}\``; flag `external` para atributos de link.
- [`src/components/home/ProductsGrid.astro`](../../../src/components/home/ProductsGrid.astro): passa `external` para [`Card.astro`](../../../src/components/shared/Card.astro) (`target="_blank"`, `rel="noopener noreferrer"`) + `sr-only` para leitores de tela.
- [`Header.astro`](../../../src/components/layout/Header.astro) / [`Footer.astro`](../../../src/components/layout/Footer.astro): mesmo padrão nos links de produto.

### 3. Redirects estáticos ([`astro.config.mjs`](../../../astro.config.mjs))

```js
redirects: {
  "/na-mesa-certa": "https://namesacerta.com.br/",
  "/otb": "https://ota-dubai.lovable.app/",
},
```

**Comportamento Astro SSG:** gera HTML com `<meta http-equiv="refresh">`, `<link rel="canonical">` para o destino e `noindex` — **não** é HTTP 301 no servidor. Para SEO agressivo em `/slug`, ver secção [Redirect HTTP no edge](#redirect-http-no-edge-opcional).

### 4. Sitemap ([`@astrojs/sitemap`](../../../astro.config.mjs))

```js
filter: (page) => {
  const pathname = new URL(page).pathname.replace(/\/$/, "") || "/";
  if (pathname === "/na-mesa-certa" || pathname === "/otb") return false;
  return true;
},
```

### 5. Remoção de páginas `.astro` dedicadas

Eliminadas `src/pages/na-mesa-certa.astro` e `src/pages/otb.astro` — as rotas passam a ser só redirect gerado a partir de `redirects`.

## Investigação / notas

- Repositório **OTB-DUBAI** (público): copy espelhada nos campos do JSON `otb.json`.
- **GrupoUS/namesa**: clone falhou (privado); copy Na Mesa Certa pode ser refinada quando houver acesso.

## Prevenção e manutenção

| Risco | Mitigação |
|-------|-----------|
| **Drift** entre JSON e `redirects` | Comentário em `astro.config.mjs`; learnings em `AGENTS.md`; script `bun run check:external-urls` (valida alinhamento). |
| Troca de domínio (ex. sair do Lovable) | Um único PR atualizando `externalSiteUrl`, `cta.url` e `redirects` para o mesmo destino. |
| UTMs | Padrão acordado em brainstorm: `utm_source=grupous&utm_medium=referral&utm_campaign=product_<slug>` quando marketing ativar. |

## Alias `@/` e `cn` (shadcn)

Componentes em `src/components/ui/` importam `@/lib/utils`. Foi adicionado [`src/lib/utils.ts`](../../../src/lib/utils.ts) com `cn()` mínima (sem `clsx`/`tailwind-merge`) e [`tsconfig.json`](../../../tsconfig.json) com `paths`: `"@/*": ["src/*"]` para `bunx astro check` resolver esses imports.

## Verificação

```bash
bun run check:external-urls
bunx astro check
bun run build
```

Inspecionar `dist/na-mesa-certa/index.html` e `dist/otb/index.html`: devem conter refresh + canonical para o URL externo.

## Redirect HTTP no edge (opcional)

Quando o host permitir (Caddy na Railway, Cloudflare, Netlify, Vercel), preferir **301** para `/otb` e `/na-mesa-certa` e, se o edge cobrir 100% do tráfego, avaliar remover entradas redundantes do `redirects` no Astro para evitar duplo salto.

Exemplo conceitual **Caddy** (ajustar ao teu `Caddyfile` real):

```caddy
@legacy_otb path /otb /otb/*
redir @legacy_otb https://ota-dubai.lovable.app{uri} 301

@legacy_nam path /na-mesa-certa /na-mesa-certa/*
redir @legacy_nam https://namesacerta.com.br{uri} 301
```

*(Sintaxe exata depende da versão e do path; validar com documentação Caddy e do teu deploy.)*

## Referências

- [Astro — Configuring Astro — redirects](https://docs.astro.build/en/guides/configuring-astro/#redirects)
- [Astro — static redirect / SSR differences](https://docs.astro.build/en/reference/errors/static-redirect-not-available/)
- Discussão: [withastro/docs#8917](https://github.com/withastro/docs/issues/8917)

## Cross-references internas

- Brainstorm com **Resolved Questions**: [`docs/brainstorms/2026-03-25-aprimorar-ecossistema-externo-brainstorm.md`](../../brainstorms/2026-03-25-aprimorar-ecossistema-externo-brainstorm.md)
- Plano aprofundado: [`docs/plans/namesa-otb-external-products-deepened.md`](../../plans/namesa-otb-external-products-deepened.md)
