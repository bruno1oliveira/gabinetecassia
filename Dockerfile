# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Aumenta memória para o build
ENV NODE_OPTIONS=--max-old-space-size=1024

# Copia arquivos de dependências primeiro (melhor cache)
COPY package*.json ./

# Limpa cache npm e instala dependências
RUN npm cache clean --force && npm ci

# Copia o resto do código
COPY . .

# Remove arquivos que podem causar problemas
RUN rm -rf .next node_modules/.cache

# Build da aplicação
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=512

# Copia arquivos necessários do build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
