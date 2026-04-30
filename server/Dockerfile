# Backend Express + MongoDB para Happy Roomie
# Build: docker build -t happyroomie-server .
# Run local: docker run -p 3001:3001 --env-file .env.local happyroomie-server

FROM node:24-alpine AS base
WORKDIR /app

# ---- deps stage: instalar dependencias en cache layer ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev=false

# ---- runtime stage ----
FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=3001

# Copiar deps de la stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig.json ./
COPY index.ts ./
COPY src ./src
COPY api-docs ./api-docs

# Healthcheck simple
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:'+process.env.PORT+'/api/propiedades-renta', (r) => process.exit(r.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))"

EXPOSE 3001

# tsx ejecuta TS directo sin build step (mismo runner que dev)
CMD ["npx", "tsx", "index.ts"]
