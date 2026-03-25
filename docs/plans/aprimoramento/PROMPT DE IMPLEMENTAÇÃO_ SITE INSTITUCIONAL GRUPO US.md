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

# PROMPT DE IMPLEMENTAÇÃO: SITE INSTITUCIONAL GRUPO US

## 1. CONTEXTO E OBJETIVO
Você atuará como Engenheiro Front-end Sênior especialista em Astro 6 e UI/UX. O objetivo é desenvolver o site institucional do **Grupo US** (ecossistema educacional de Saúde Estética Avançada), unificando a apresentação corporativa e seu portfólio de 6 produtos principais, substituindo a abordagem atual centrada exclusivamente na persona da fundadora (drasacha.com.br).

O projeto será implementado no repositório `gpus-site`, aproveitando o scaffold Astro 6 já existente e o tema base (`gpus-theme`).

## 2. ARQUITETURA TÉCNICA
- **Framework:** Astro 6 (SSG) com Islands Architecture (zero JS por padrão).
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin (sem `tailwind.config.js`).
- **Interatividade:** React 19 (para componentes interativos via `client:visible` / `client:load`) e Framer Motion.
- **Gerenciamento de Conteúdo:** Astro Content Collections com Zod schemas (JSON/Markdown) para Produtos, Equipe e Depoimentos.
- **Design System (UI/UX Pro Max):**
  - **Pattern:** Enterprise Gateway (Hero corporativo, Soluções/Produtos, Logos, CTAs claros).
  - **Estilo:** Premium Dark & Gold (Liquid Glass).
  - **Cores (gpus-theme):** Navy Dark (`#0F1A2E` / HSL 211 49% 10%) e Gold (`#D4AF37` / HSL 38 60% 45%).
  - **Tipografia:** Playfair Display (Headings) e Inter (Body) para transmitir sofisticação e autoridade médica/corporativa.

## 3. ESCOPO E ESTRUTURA DE PÁGINAS

### 3.1. Content Collections (`src/content/`)
Criar schemas rigorosos usando Zod para:
1. `products`: ID, nome, resumo, público, formato, investimento, link_venda, icone.
2. `team`: ID, nome, cargo, bio, foto_url, ordem_exibicao.
3. `testimonials`: ID, autor, texto, produto_id.

### 3.2. Estrutura da Landing Page (`src/pages/index.astro`)
A página deve seguir o funil de conversão corporativo:
1. **Header:** Logo Grupo US, navegação âncora, CTA "Fale com Assessoria".
2. **Hero Section:** Proposta de valor ("Transformar profissionais da saúde em referências..."), vídeo/imagem de fundo em alta qualidade com overlay escuro, CTA primário.
3. **Sobre Nós (Manifesto):** Missão, Visão e Valores Inegociáveis (Clareza, Olhar de Dono, etc.).
4. **Ecossistema de Produtos (Jornada do Aluno):** Grid interativo ou timeline mostrando a progressão (Auriculoterapia → Comunidade → TRINTAE3 → Black Neon → OTB).
5. **Liderança (Pessoas-Chave):** Cards elegantes para Dra. Sacha Gualberto, Prof. Maurício Magalhães e Dra. Raquel Quintanilha.
6. **Social Proof:** Depoimentos reais de alunos (carrossel React Island).
7. **Footer:** Links úteis, contatos (suporte@drasacha.com.br, WhatsApp), CNPJ, copyright.

## 4. DIRETRIZES DE IMPLEMENTAÇÃO (STEP-BY-STEP)

**Passo 1: Setup e Configuração Base**
- Verifique e atualize `astro.config.mjs` para garantir o uso de `@astrojs/react` e Tailwind v4.
- Configure as fontes no layout base usando o Astro 6 Fonts API built-in ou `@fontsource/playfair-display`.

**Passo 2: Definição de Dados (Content Collections)**
- Crie o arquivo `src/content/config.ts` com os schemas Zod.
- Popule os arquivos JSON baseados nos dados oficiais do Grupo US (TRINTAE3, Black Neon, OTB, Comunidade, Evento, Auriculoterapia).

**Passo 3: Componentes de Layout e UI (Astro Puro)**
- Crie `Layout.astro` com meta tags, SEO e CSS global importando o `gpus-theme`.
- Desenvolva os componentes estáticos: `Hero.astro`, `About.astro`, `ProductsGrid.astro`, `Team.astro`, `Footer.astro`.

**Passo 4: Componentes Interativos (React Islands)**
- Crie `TestimonialCarousel.tsx` usando Framer Motion.
- Crie `ProductModal.tsx` ou `ProductTabs.tsx` para exibir detalhes dos cursos.
- Integre-os no `index.astro` com diretivas `client:visible`.

## 5. QUALITY GATES E RESTRIÇÕES
- **NEGATIVO:** NUNCA use `client:load` em componentes abaixo da dobra. Use `client:visible`.
- **NEGATIVO:** NUNCA escreva estilos inline. Use exclusivamente classes do Tailwind.
- **NEGATIVO:** NUNCA adicione JavaScript puro no Astro a menos que seja estritamente necessário (prefira React para interatividade complexa).
- **MÉTRICA:** Lighthouse score deve ser ≥ 98 em Performance.
- **DESIGN:** Garanta contraste mínimo de 4.5:1 no dark mode. Evite animações bruscas (respeite `prefers-reduced-motion`).

## 6. VALIDAÇÃO ESPERADA
Para cada passo executado, você deve fornecer o código completo (com paths exatos) e o comando de teste para validação local (`bun run dev` ou `bun run build`).
