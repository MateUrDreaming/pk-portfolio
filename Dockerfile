# Stage 1: The Build Stage
FROM node:18-alpine AS builder

# Set up the working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache openssl

# Set up pnpm
RUN corepack enable pnpm

# Copy package files and install all dependencies
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Pass build arguments and set environment variables
ARG RESEND_API_KEY
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG BETTER_AUTH_URL
ARG BETTER_AUTH_SECRET
ARG ADDITIONAL_TRUSTED_ORIGINS
ARG DATABASE_URL

ENV RESEND_API_KEY=$RESEND_API_KEY \
    GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID \
    GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET \
    GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID \
    GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET \
    BETTER_AUTH_URL=$BETTER_AUTH_URL \
    ADDITIONAL_TRUSTED_ORIGINS=$ADDITIONAL_TRUSTED_ORIGINS \
    BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET \
    DATABASE_URL=$DATABASE_URL

# Generate the Prisma client and build the app
RUN pnpm prisma generate
RUN pnpm run build

# Stage 2: The Production Runtime
FROM node:18-alpine AS runner

# Set up user and group for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set up the working directory and permissions
WORKDIR /app
USER nextjs

# Set environment variables for runtime
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

# Copy only essential files from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/entrypoint.sh ./entrypoint.sh

# Expose the port and set the command
EXPOSE 3000
CMD ["/app/entrypoint.sh"]