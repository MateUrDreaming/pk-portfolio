# Use Node.js 22 Alpine consistently across all stages
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM node:22-alpine AS deps
WORKDIR /app

# Install system dependencies required for Prisma
RUN apk add --no-cache libc6-compat openssl

# Copy package files and Prisma schema
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma

# Enable pnpm and install dependencies
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:22-alpine AS builder
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Enable pnpm
RUN corepack enable pnpm

# Generate Prisma client with correct binary target
RUN pnpm prisma generate

# Build arguments
ARG RESEND_API_KEY
ARG GOOGLE_CLIENT_ID  
ARG GOOGLE_CLIENT_SECRET
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG BETTER_AUTH_SECRET
ARG DATABASE_URL

# Set environment variables for build
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID
ENV GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV DATABASE_URL=$DATABASE_URL

# Build the application
RUN pnpm run build

# Production image, copy all the files and run next
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install runtime dependencies
RUN apk add --no-cache libc6-compat openssl netcat-openbsd

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Copy the generated Prisma client
COPY --from=builder --chown=nextjs:nodejs /app/src/generated/prisma ./src/generated/prisma

# Enable pnpm in production stage
RUN corepack enable pnpm

# Create and copy startup script
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Change to nextjs user
USER nextjs

EXPOSE 3000
ENV PORT=3000

# Use custom entrypoint
CMD ["./docker-entrypoint.sh"]