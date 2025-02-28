FROM node:18-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat

# Criar diretório de trabalho
WORKDIR /app

# Instalar o Bun
RUN npm install -g bun

# Camada de dependências
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Camada de build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Construir a aplicação Next.js
RUN npm run next:build

# Camada de produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copiar arquivos necessários
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder --chown=nextjs:nodejs /app/config ./config
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Criar diretório de uploads
RUN mkdir -p uploads && chown -R nextjs:nodejs uploads

# Expor portas
EXPOSE 3000
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "run", "prod:start"] 