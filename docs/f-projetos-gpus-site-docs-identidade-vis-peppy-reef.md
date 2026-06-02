# Plano — Identidade Visual & Integração de Fotos (Home · Sobre · Autoridade · OG)

## Context

O site institucional `grupous.com.br` é forte em tipografia/motion mas **pobre em fotografia**: o hero da home não tem presença de fundadora, `AboutPreview` usa um **SVG placeholder** (`/images/team/sacha.svg`), `public/og/` está **vazia** (9 previews sociais caem só no fallback) e os retratos editoriais premium da marca estão **subutilizados** — em especial `IMG_5243` (Dra. Sacha em blazer **navy + joia gold**, o match exato da paleta) e `IMG_6380` (creme, horizontal), ambos **sem uso**.

A pasta `docs/identidade-visual/` contém o material-fonte: 4 retratos editoriais da Dra. Sacha + 2 do Prof. Maurício (camiseta Grupo US), PDF de marca, e biblioteca Instagram (majoritariamente **grafismos de logo** — monograma "US" em navy/creme —, não fotos). Pool fotográfico real = **Sacha (4) + Maurício (2)**. Não há fotos dos 9 depoentes nem dos outros 12 membros do time → essas lacunas **não** serão preenchidas com foto (decisão consciente, não falha).

**Objetivo:** aprimorar e integrar a fotografia da marca nas superfícies de maior impacto (Home + /sobre), gerar variantes WebP otimizadas (o repo não tem pipeline de imagem — `<img>` cru + `public/`), e produzir 9 OG cards branded — tudo dentro do contrato estático Astro + tokens Navy/Gold, honrando `prefers-reduced-motion` e CLS=0.

## Decisões travadas (usuário)

1. **Hero = split com retrato** — texto+CTAs à esquerda, retrato navy/gold da Dra. Sacha (`IMG_5243`) emoldurado à direita. Reformula o hero tipográfico recém-redesenhado.
2. **Escopo = Home + Sobre + Autoridade** (sem landings de produto nesta rodada).
3. **OG = gerar 9 cards branded** 1200×630 (navy/gold + monograma "US" + retrato + título).

## Restrições (cardinais — inegociáveis)

- **Sem mudança de schema:** `team.photo` / `product.image` / `site…visual.src` já são `string`. `src/content.config.ts` (protegido) **não** é tocado — só troca de valor nos JSON.
- **Sem `astro:assets`/`<Image>`:** manter convenção atual (`<img>` cru + `public/`). Otimização via script `sharp` → `public/` (outputs commitados).
- **Sem hex** fora de `global.css @theme`; molduras/overlays reusam tokens/`color-mix` existentes. **Bun only.** LF. Estático MPA (sem SSR/SPA).
- Toda `<img>` nova: `width`+`height` explícitos (CLS=0), `alt` descritivo pt-BR, `loading`/`fetchpriority` por posição. Hero portrait = `eager`+`fetchpriority="high"` (vira o LCP). Demais = `lazy`+`low`.
- Backdrops fora da paleta (`IMG_5875` teal, `IMG_5492` tan) entram **sempre emoldurados** (borda gold + overlay gradiente navy/gold) — reusar o frame de `AboutPreview.astro:43-69`.
- Fontes-fonte (`docs/identidade-visual/**`, incl. `.MOV` e PDF) **não** vão para `public/` — só os outputs otimizados selecionados.

## Mapa foto → seção

| Asset fonte | Tratamento | Destino |
|---|---|---|
| `fotos/IMG_5243` (navy+gold) | crop 4/5 vertical → WebP ~800×1000 | **Hero split** (novo) + reforço autoridade |
| `fotos/IMG_6380` (creme, horizontal) | crop 3/4 → WebP | **AboutPreview** (substitui `sacha.svg`) |
| `fotos/IMG_5875` (teal, riso) | regen WebP alta qualidade | Narrative ch3 (`/images/sacha-about.webp`) |
| `fotos/IMG_5492` (luz/spotlight) | regen WebP alta qualidade | Narrative ch4 (`/images/sacha-hero.webp`) + acento CTA |
| `fotos/IMG_5243` ou `5875` | crop quadrado (rosto) → WebP | **Founders** `team/sacha.json.photo` (round 192) |
| `fotos/ROMÃO_MESACERTA_*` (Maurício) | crop quadrado (rosto) → WebP | **Founders** `team/mauricio.json.photo` (round 192) |

TeamGrid (outros 12) **permanece SVG** — distinção de hierarquia intencional (fundadores = foto, time = avatar). Depoentes **permanecem iniciais** (sem assets).

## Fase 1 — Pipeline de imagens (`scripts/build-images.mjs`)

Novo script Node + `sharp` (já instalado, v0.34.5; convenção espelha `scripts/lighthouse-audit.mjs`). Lê de `docs/identidade-visual/fotos/` (tratar caminhos UTF-8/acentos), grava em `public/images/` e `public/og/`. Idempotente, re-rodável (`bun run images`). Outputs commitados; script não roda em CI.

- Crops/resizes definidos por destino (acima), WebP `quality 78-82`, `<150KB` alvo por arquivo.
- Novos arquivos: `/images/sacha-hero-portrait.webp` (hero), `/images/sacha-about-portrait.webp` (AboutPreview); **regenera** `sacha-hero.webp` + `sacha-about.webp` (mantém nomes → zero edição de JSON da narrativa); `team/sacha.webp` + `team/mauricio.webp` (quadrados rosto).
- Adicionar script `"images"` em `package.json` (**arquivo protegido → confirmar antes de editar**; alternativa: rodar via `bunx` sem registrar).

## Fase 2 — Integração Home

- **`src/components/home/Hero.astro`** — converter centro→**split**: `grid lg:grid-cols-[6fr_5fr]`, coluna texto (badge, h1 `sr-only`+camada animada, subhead, CTAs) à esquerda dentro do `HeroEntrance`; coluna retrato à direita = `<img src="/images/sacha-hero-portrait.webp" eager fetchpriority="high" width height>` em frame gold+overlay (reusar padrão AboutPreview). Mobile: empilha (retrato abaixo do texto ou topo reduzido). Manter `hero-backdrop`/filaments/Spotlight. Ajustar clamp do headline (`--text-display`→pode cair p/ `--text-h1` na coluna estreita).
- **`src/components/home/AboutPreview.astro:55`** — trocar `src="/images/team/sacha.svg"` → `"/images/sacha-about-portrait.webp"` (frame/parallax já existem; só o `src` + `alt` afinado).
- **`src/components/home/CTASection.astro`** — acento de fundadora opcional: `IMG_5492` emoldurado lateral ao glass-card OU camada atmosférica sutil (não competir com `LampBackdrop`/`cta-halo`). Honra reduced-motion.
- **Narrative** — sem edição de código/JSON; ch3/ch4 melhoram automaticamente via regen dos webp de mesmo nome. (Opcional deferido: dar imagem ao ch2 "Método" usando `IMG_5243`.)

## Fase 3 — Integração Sobre/Autoridade

- **`src/content/team/sacha.json`** + **`mauricio.json`** — campo `photo` → `/images/team/sacha.webp` / `/images/team/mauricio.webp` (fotos reais). `Founders.astro` (order≤2) passa a exibir retratos reais redondos; nenhuma mudança de componente.
- **`TeamGrid.astro`** — sem mudança (SVG mantidos por consistência de hierarquia).
- Verificar `src/components/about/Culture.astro` — se houver slot natural para foto de ambiente/time, avaliar (opcional; sem assets de ambiente → provável manter).

## Fase 4 — OG cards (9× 1200×630) → `public/og/`

Gerados no mesmo `scripts/build-images.mjs`. Template SVG branded (fundo `--color-navy`, monograma "US" gold, régua gold, título da página em serif, `grupous.com.br`) compositado com retrato via `sharp`. Páginas: `home, sobre, contato, termos, privacidade, 404, curso-auriculo, mentoria-black-neon, otb` (slugs já referenciados nos `ogImage` props).

**Risco-chave:** renderização de texto/fonte no SVG via `sharp` (librvips/fontconfig no Windows pode não honrar Playfair). **Mitigação:** embutir a fonte serif como base64 `@font-face` no SVG; validar **1 card primeiro**; se a fonte não renderizar, fallback = template portrait-forward com texto mínimo, ou avaliar `@resvg/resvg-js` (**dep nova → confirmar antes**). Sem fonte garantida, não gerar os 9 às cegas.

## Arquivos críticos

- Novo: `scripts/build-images.mjs` · outputs em `public/images/*`, `public/images/team/*`, `public/og/*.png`
- Edita: `src/components/home/Hero.astro`, `src/components/home/AboutPreview.astro`, `src/components/home/CTASection.astro`, `src/content/team/sacha.json`, `src/content/team/mauricio.json`
- Possível (confirmar): `package.json` (script `images`)
- **Não** edita: `src/content.config.ts`, `astro.config.mjs`, `src/lib/whatsapp.ts` (protegidos); `home-narrative.json` (regen por nome evita)

## Verificação (end-to-end)

1. `bun run images` (ou `bunx`) → confere `public/images/*.webp` (<150KB cada) + `public/og/*.png` (1200×630) gerados; inspeção visual de 1 OG card antes dos 9.
2. Gates: `bun run lint && bunx astro check && bun run build` (0 erros; 9 páginas).
3. Smoke: hex scan nos arquivos tocados = 0 fora de `@theme`; toda `<img>` nova com `width/height/alt`.
4. `bun run dev` — visual: hero split (retrato nítido, LCP rápido, sem CLS ao carregar), AboutPreview com foto real, /sobre Founders com retratos reais Sacha+Maurício, OG cards via preview/meta. Mobile: hero empilha sem quebra. Reduced-motion: animações novas zeram.
5. (Opcional) `bun run lighthouse:audit` — confirmar LCP do hero portrait < 2.5s, CLS≈0.

## Deferidos (fora desta rodada)

- Fotos de depoentes/12 membros do time (sem assets) → manter iniciais/SVG.
- Landings de produto (curso-auriculo/mentoria/otb) — fora do escopo escolhido.
- Texturas de marca a partir do Instagram (grafismos navy/creme) como backdrop sutil.
- PDF `01-idvisual-Sacha.pdf` não renderizou aqui (sem poppler) — direção de marca inferida dos assets; se quiser extração literal de páginas, converter/apontar páginas específicas.
