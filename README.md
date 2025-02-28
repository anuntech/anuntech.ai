# Anuntech AI

Uma aplicação RAG (Retrieval Augmented Generation) que utiliza Next.js, Node.js, Bun e MySQL para criar um assistente de chat com memória contextual. A aplicação permite upload de documentos para base de conhecimento e consultas contextuais.

## Características

- Interface de chat moderna com React e Tailwind CSS
- Suporte a formatação Markdown nas respostas
- Highlight de código com botões de cópia
- Upload de documentos para base de conhecimento
- Armazenamento de embeddings para busca semântica
- RAG (Retrieval Augmented Generation) para respostas baseadas em contexto
- Resumo automático de contextos muito extensos
- Segurança aprimorada com rate limiting e headers de segurança
- Tratamento robusto de erros

## Tecnologias

- **Frontend**: Next.js, React, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express, Bun
- **Banco de Dados**: MySQL
- **AI**: OpenAI API (embeddings e chat)
- **Segurança**: Helmet, CORS, Rate Limiting

## Estrutura do Projeto

```
├── config/             # Configurações (banco de dados)
├── public/             # Arquivos estáticos
├── scripts/            # Scripts de utilidade
│   ├── setup_db.sql    # Script de configuração do banco de dados
│   └── start-production.sh # Script para iniciar em produção
├── src/                # Código-fonte
│   ├── app/            # Páginas Next.js
│   ├── components/     # Componentes React
│   ├── lib/            # Bibliotecas e utilitários
│   ├── middleware/     # Middlewares de segurança e outros
│   ├── models/         # Modelos de dados
│   ├── routes/         # Rotas da API
│   ├── services/       # Serviços
│   └── utils/          # Utilitários
└── uploads/            # Diretório temporário para uploads
```

## Pré-requisitos

- Node.js 18+ ou Bun
- MySQL 8+
- Chave de API da OpenAI

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/anuntech-ai.git
   cd anuntech-ai
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou usando Bun
   bun install
   ```

3. Configure o ambiente:
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. Configure o banco de dados:
   ```bash
   # Execute o script SQL para criar as tabelas necessárias
   npm run setup:db
   ```

5. Inicie os servidores em modo de desenvolvimento:
   ```bash
   # Inicie o servidor da API
   npm run dev
   
   # Em outro terminal, inicie o servidor Next.js
   npm run next:dev
   ```

## Uso em Produção

1. Construa a aplicação:
   ```bash
   npm run build
   ```

2. Inicie a aplicação em modo de produção:
   ```bash
   npm run prod:start
   ```

3. Para parar a aplicação:
   ```bash
   npm run prod:stop
   ```

## Segurança

A aplicação implementa várias camadas de segurança:

- **Rate Limiting**: Limita o número de requisições por IP
- **CORS**: Controla quais domínios podem acessar a API
- **Headers de Segurança**: Implementa headers como Content-Security-Policy, X-XSS-Protection, etc.
- **Validação de Entrada**: Valida todas as entradas do usuário
- **Sanitização de Saída**: Sanitiza as respostas para evitar XSS

## Manutenção

- Limpar arquivos temporários:
  ```bash
  npm run clean:temp
  ```

- Executar linting:
  ```bash
  npm run lint
  ```

- Executar testes:
  ```bash
  npm run test
  ```

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato

- Email: contato@anuntech.com.br
- Website: [anuntech.com.br](https://anuntech.com.br)

## Como Testar a Aplicação Anuntech AI

Para testar a aplicação após as otimizações implementadas, siga estes passos:

## 1. Configuração do Ambiente

Primeiro, você precisa configurar o ambiente:

```bash
# Crie um arquivo .env com as configurações necessárias
cp .env.example .env
```

Edite o arquivo `.env` para incluir:
- Sua chave da API OpenAI
- Configurações do banco de dados MySQL
- Outras variáveis de ambiente necessárias

## 2. Configuração do Banco de Dados

Certifique-se de que o MySQL está instalado e em execução. Em seguida:

```bash
# Execute o script SQL para criar as tabelas necessárias
mysql -u seu_usuario -p < scripts/setup_db.sql
```

Se o script `setup_db.sql` não existir, você precisará criar as tabelas manualmente. A tabela principal deve ser chamada `documents` e deve conter campos para o texto e o embedding.

## 3. Instalação das Dependências

Instale todas as dependências do projeto:

```bash
# Usando npm
npm install

# Ou usando Bun
bun install
```

## 4. Iniciando os Servidores

Inicie os servidores de desenvolvimento:

```bash
# Inicie o servidor da API (em um terminal)
npm run dev

# Inicie o servidor Next.js (em outro terminal)
npm run next:dev
```

O servidor da API deve iniciar na porta 3000 e o servidor Next.js na porta 3001.

## 5. Testando a Aplicação

Agora você pode testar a aplicação:

1. **Interface de Chat**:
   - Acesse `http://localhost:3001` no navegador
   - Digite mensagens no campo de entrada e envie
   - Verifique se as respostas são exibidas corretamente

2. **Upload de Documentos**:
   - Clique no botão "Upload" no cabeçalho do chat
   - Faça upload de arquivos de texto para alimentar a base de conhecimento
   - Verifique se o sistema confirma o processamento do arquivo

3. **Teste de RAG**:
   - Após fazer upload de documentos, faça perguntas relacionadas ao conteúdo
   - Verifique se o sistema recupera informações relevantes dos documentos

4. **Teste de Formatação**:
   - Teste a formatação Markdown enviando mensagens com:
     - Blocos de código (```código```)
     - Texto em negrito (**texto**)
     - Listas (- item1, - item2)

## 6. Depuração

Se encontrar problemas:

1. Verifique os logs do servidor no terminal
2. Verifique o console do navegador para erros de JavaScript
3. Confirme se todas as dependências estão instaladas corretamente
4. Verifique se o banco de dados está configurado e acessível

## 7. Limpeza de Arquivos Temporários

Para limpar arquivos temporários de upload:

```bash
npm run clean:temp
```

Isso garantirá que a pasta `uploads/` não acumule arquivos desnecessários.

Agora você deve conseguir testar completamente a aplicação Anuntech AI com todas as otimizações implementadas!
