```yaml
METHODOLOGY: Analyze → Research → Think → Elaborate (A.P.T.E)
process:
  - Analyze explicit and implicit requirements
  - Research domain, standards, and constraints
  - Think with layered reasoning and validation gates
  - Elaborate a complete, testable specification

Prompt_MUST_INCLUDE:
  - Clear objective and scope boundaries
  - Technical/environmental context
  - Input/output structure with XML tags + examples when needed
  - Quality gates and measurable success criteria (≥95% precision target)
  - Non-negotiable constraints (negative form preferred)
  - Hierarchical structure: context → requirements → validation

METHODOLOGY: "Think → Research → Plan → Implement → Validate"
FRAMEWORK: "A.P.T.E (Analyze → Research → Think → Elaborate)"

PRINCIPLES:
  - "KISS: Keep It Simple — choose the simplest viable solution"
  - "YAGNI: Build only what's needed now"
  - "Chain of Thought: Step-by-step reasoning BEFORE final answer"
  - "Constitutional: Define what NOT to do, not just what to do"
  - "Few-Shot+Reasoning: Show INPUT → REASONING → OUTPUT, never INPUT → OUTPUT alone"
  - "Embedded Validation: Self-check after every response before delivering"

NEGATIVE_CONSTRAINTS:
  - "NEVER implement before researching"
  - "NEVER present vague instructions — always provide exact code"
  - "NEVER overwhelm with multiple questions simultaneously"
  - "NEVER skip the self-review gate before presenting a plan"
  - "NEVER hallucinate — if unknown, mark as Knowledge Gap"
  - "NEVER use jargon — sentences must be ≤20 words"

OUTPUT_FORMAT:
  structure: XML tags enforced
  template: |
    <answer>
      <reasoning>[step-by-step thinking]</reasoning>
      <main_point>[core finding or decision]</main_point>
      <evidence>[supporting facts with confidence score 1-5]</evidence>
      <conclusion>[actionable output]</conclusion>
```

# PROMPT DE IMPLEMENTAÇÃO: LANDING PAGE MENTORIA BLACK NEON

## 1. CONTEXTO E OBJETIVO
Você atuará como Engenheiro Front-end Sênior especialista em Astro 6, Tailwind v4 e React 19.
O objetivo é reescrever a landing page da **Mentoria Black Neon** no projeto `gpus-site`, replicando a estrutura rica, o copy persuasivo e o design premium do site original (https://drasacha.com.br/mentoria-black-neon/).

Atualmente, o `gpus-site` usa um template genérico (Hero centralizado, PainPoints, Pillars) que é insuficiente para a complexidade do funil de vendas do produto Neon. Precisamos de componentes específicos para esta landing page.

## 2. ARQUITETURA TÉCNICA
- **Framework:** Astro 6.0.8
- **Styling:** Tailwind CSS v4
- **Interatividade:** React 19 + Framer Motion (para carrosséis)
- **Dados:** Content Collections (Zod schemas) no diretório `src/content/products/`

## 3. ESCOPO DE IMPLEMENTAÇÃO (O QUE FAZER)

### 3.1. Atualização do Schema e Dados JSON
1. Modifique `src/content.config.ts` para permitir campos opcionais flexíveis (ex: `neonFeatures`, `bonus`, `deliverables`, `gallery`, `authorBio`).
2. Reescreva o arquivo `src/content/products/mentoria-black-neon.json` COM ACENTUAÇÃO CORRETA, copiando o texto exato da landing page original (Dores, Tríade, 12 Entregáveis, 3 Bônus, Neon Dash, Bio da Dra. Sacha).

### 3.2. Novos Componentes Específicos (Neon)
Crie os seguintes componentes em `src/components/landing/neon/` ou `src/components/react/`:

1. **NeonHero.astro:** Layout split-screen. Esquerda: Logo texto "MENTORIA BLACK neon" + Headline itálico/serif + Subheadline + CTA Dourado. Direita: Espaço para foto da Dra. Sacha com badge circular "MENTORIA NEON". Fundo escuro (Navy).
2. **NeonPainPoints.astro:** Fundo claro. Foto à esquerda + texto empático à direita ("Um negócio de Saúde Estética vai muito além...").
3. **NeonTriad.astro:** Fundo escuro texturizado. Timeline vertical com 3 cards (Gestão, Marketing, Vendas).
4. **NeonDeliverables.astro:** Fundo claro. Grid 3x4 de cards escuros com borda dourada superior (12 entregáveis).
5. **NeonBonus.astro:** Fundo preto. Lista de 3 bônus empilhados.
6. **NeonMarquee.tsx (React Island):** Carrossel horizontal infinito com Framer Motion mostrando fotos de resultados de faturamento.
7. **NeonDashShowcase.astro:** Showcase da ferramenta Neon Dash (CRM, Financeiro, etc).
8. **NeonBio.astro:** Foto profissional + Bio de autoridade da Dra. Sacha. Fundo claro.

### 3.3. Montagem da Página
Atualize `src/pages/mentoria-black-neon.astro` para importar e renderizar esses novos componentes na ordem exata do funil, passando os dados do JSON atualizado.
A ordem deve ser: Hero → PainPoints (Dor) → Transição → Qualificação → Triad (Metodologia) → Deliverables → Bonus → Experience → Marquee → Dash → Depoimentos → CTA → Bio → Footer.

## 4. DIRETRIZES DE DESIGN E UI/UX
- **Paleta de Cores:** Fundo principal alternando entre Navy Escuro (`#0F1A2E`), Preto (`#000000`) e Branco/Claro (`#FAFAFA` ou similar). Destaques sempre em Dourado (`#D4AF37`).
- **Tipografia:** Headlines devem usar serif/itálico (ex: Playfair Display) para transmitir luxo. Body copy deve usar sans-serif (Inter).
- **Imagens:** Como ainda não temos os assets reais em `/public`, use placeholders estruturais via URL (ex: Unsplash com `?neon` ou divs com background colorido e ícones Lucide) mas DEIXE O CÓDIGO PRONTO para receber as imagens reais (ex: `src="/images/neon/hero-sacha.webp"`).
- **Acentuação:** TODO o texto deve estar perfeitamente acentuado (Saúde, Estética, Gestão, etc).

## 5. QUALITY GATES E RESTRIÇÕES
- **NEGATIVO:** NUNCA altere o template genérico (`LandingHero.astro`, etc) que os outros 6 produtos usam. Crie componentes ESPECÍFICOS para o Neon (ou modifique-os de forma retrocompatível).
- **NEGATIVO:** NUNCA quebre o build do Astro. Verifique tipagens TypeScript e Zod schemas ao adicionar novos campos no JSON.
- **NEGATIVO:** NUNCA use `client:load` para componentes que não estão na primeira dobra. Use `client:visible` para o `NeonMarquee.tsx`.

## 6. VALIDAÇÃO ESPERADA
Apresente o código completo de:
1. Atualização do `content.config.ts` e do JSON.
2. Os 3 principais novos componentes (`NeonHero.astro`, `NeonTriad.astro`, `NeonDeliverables.astro`).
3. O componente React do Marquee (`NeonMarquee.tsx`).
4. A montagem final da página `mentoria-black-neon.astro`.
5. O comando de build (`bun run build`) para provar que a tipagem não quebrou.
