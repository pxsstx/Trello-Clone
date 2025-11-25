# Use Bun image
FROM oven/bun:latest AS base
USER root

RUN apt-get update -y && apt-get install -y openssl wait-for-it

# Dependencies stage
FROM base AS deps
WORKDIR /app

COPY package.json bun.lock* ./
COPY prisma ./prisma/

RUN bun install --frozen-lockfile
RUN bunx --bun prisma generate

# Build stage
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://postgres:postgres@db:5432/trello_clone

COPY --from=builder /app ./

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

EXPOSE 3000
CMD ["./entrypoint.sh"]
