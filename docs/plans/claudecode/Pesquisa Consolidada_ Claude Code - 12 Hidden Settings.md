# Pesquisa Consolidada: Claude Code - 12 Hidden Settings

## Fonte Principal
- Vídeo: https://www.youtube.com/watch?v=pDoBe4qbFPE (AI LABS)
- Documentação Oficial: https://code.claude.com/docs/

## Sugestões Identificadas do Vídeo

### 1. Permissões e Prompts
- **Problema**: Claude solicita permissão constantemente
- **Solução**: Configurar `permissions.allow` em `~/.claude/settings.json`
- **Benefício**: Reduz fricção e acelera desenvolvimento

### 2. Retenção de Histórico
- **Problema**: Histórico de conversas deletado após 30 dias
- **Solução**: Ajustar `cleanupPeriodDays` em `~/.claude/settings.json`
- **Padrão**: 30 dias (pode ser aumentado ou reduzido)

### 3. Limites de Leitura de Saída
- **Problema**: Claude ignora informações longas silenciosamente
- **Solução**: Aumentar `BASH_MAX_OUTPUT_LENGTH` e `CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS`
- **Impacto**: Garante processamento completo de arquivos grandes

### 4. Regras Específicas de Caminho
- **Problema**: Claude ignora convenções de projeto
- **Solução**: Criar regras em `.claude/rules/` em vez de sobrecarregar `CLAUDE.md`
- **Benefício**: Melhor organização e manutenção

### 5. Leitura de Arquivos Grandes
- **Técnica**: Usar `offset` e `limit` para ler em blocos
- **Comando**: Verificar contagem de linhas antes de ler
- **Benefício**: Evita omissão silenciosa de conteúdo

### 6. Auto-Compactação
- **Configuração**: `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` para ~75%
- **Objetivo**: Manter qualidade de saída
- **Impacto**: Otimiza contexto sem perder informação

### 7. Sub-Agentes (--agent flag)
- **Uso**: Delegar tarefas a sub-agentes específicos
- **Opções**: `skills`, `effort`, `isolation`
- **Benefício**: Controle refinado e paralelização

### 8. Gerenciamento de Perfis
- **Ferramenta**: `claudectx` (código aberto)
- **Uso**: Gerenciar múltiplos perfis de configuração
- **Benefício**: Flexibilidade para diferentes projetos

### 9. Atribuição em Commits
- **Problema**: Claude se adiciona como coautor
- **Solução**: Configurar `attribution` em `settings.json`
- **Exemplo**: Customizar mensagem de commit

### 10. Privacidade e Telemetria
- **Flags**: `disableTelemetry` e `disableErrorReporting`
- **Escopo**: Desativa envio de dados
- **Benefício**: Maior privacidade

### 11. Configuração de Permissões Granulares
- **Sintaxe**: `Tool(specifier)` para controle fino
- **Exemplos**: 
  - `Bash(npm run *)` - permite npm run
  - `Read(./.env)` - nega leitura de .env
  - `WebFetch(domain:github.com)` - permite fetch apenas em GitHub

### 12. Hooks e Automação
- **Uso**: Configurar ações automáticas em eventos
- **Localização**: `.claude/hooks/` ou `settings.json`
- **Benefício**: Automação de workflows

## Estrutura de Configuração Oficial

### Hierarquia de Escopos
1. **Managed** (mais alta) - Políticas organizacionais
2. **Command line** - Overrides temporários
3. **Local** - `.claude/settings.local.json` (gitignored)
4. **Project** - `.claude/settings.json` (compartilhado)
5. **User** (mais baixa) - `~/.claude/settings.json`

### Arquivos de Configuração
- `~/.claude/settings.json` - Configurações do usuário
- `.claude/settings.json` - Configurações do projeto
- `.claude/settings.local.json` - Overrides locais (não versionado)
- `~/.claude.json` - Preferências, OAuth, MCP servers

## Permissões: Sintaxe Completa

### Regras de Permissão
- **Allow**: Permite sem aprovação
- **Ask**: Solicita confirmação
- **Deny**: Bloqueia (precedência máxima)

### Padrões de Especificador
- `Bash(npm run *)` - Wildcard em qualquer posição
- `Read(~/.zshrc)` - Caminho home expandido
- `Edit(/docs/**)` - Recursivo com **
- `WebFetch(domain:example.com)` - Domínio específico
- `Agent(AgentName)` - Sub-agentes específicos

## Sub-Agentes: Configuração

### Frontmatter Suportado
- `name`: Identificador único
- `description`: Descrição para delegação automática
- `model`: Modelo específico (Sonnet, Haiku, etc)
- `tools`: Lista de ferramentas permitidas
- `permissions`: Regras de permissão específicas
- `memory`: Diretório de memória persistente

### Padrões de Uso
- Isolamento de operações de alto volume
- Pesquisa paralela
- Encadeamento de sub-agentes
- Reutilização de configurações

## Melhores Práticas Consolidadas

1. **Organização**: Separar configurações por escopo (user/project/local)
2. **Segurança**: Usar deny rules com precedência
3. **Performance**: Aumentar limites para arquivos grandes
4. **Automação**: Usar hooks para workflows repetitivos
5. **Privacidade**: Desabilitar telemetria se necessário
6. **Delegação**: Usar sub-agentes para paralelização
7. **Versionamento**: Compartilhar `.claude/settings.json`, ignorar `.local.json`
