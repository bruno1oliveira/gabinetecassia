# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Aumenta memória para o build
ENV NODE_OPTIONS=--max-old-space-size=1024

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia o resto do código
COPY . .

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
