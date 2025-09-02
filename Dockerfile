# Dockerfile for Next.js application

# 1. Installer Stage: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json* ./
# Install dependencies
RUN npm install

# 2. Builder Stage: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run the build script
RUN npm run build

# 3. Runner Stage: Run the application
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy the standalone output from the builder
COPY --from=builder /app/.next/standalone ./
# Copy the public and static assets
COPY --from=builder /app/.next/static ./.next/static
# Copy the data directory
COPY --from=builder /app/data ./data

EXPOSE 3000

ENV PORT 3000

# Start the app
CMD ["node", "server.js"]
