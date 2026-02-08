# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Aumenta memória para o build
ENV NODE_OPTIONS=--max-old-space-size=1024

# Build args para variáveis de ambiente do Supabase
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Define as variáveis de ambiente durante o build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o resto do código
COPY . .

# Remove cache que pode causar problemas
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
