# -------- Stage 1: Full Dependencies (for build) --------
FROM node:18-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Ensure node owns directory BEFORE install
RUN chown -R node:node /app
USER node

COPY --chown=node:node package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile


# -------- Stage 2: Build --------
FROM node:18-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

RUN chown -R node:node /app
USER node

COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

RUN pnpm run build


# -------- Stage 3: Production Dependencies ONLY --------
FROM node:18-alpine AS prod-deps

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

RUN chown -R node:node /app
USER node

COPY --chown=node:node package.json pnpm-lock.yaml ./

# ONLY production deps
RUN pnpm install --prod --frozen-lockfile


# -------- Stage 4: Runtime (Zero Waste) --------
FROM node:18-alpine AS runtime

WORKDIR /app

# Set production env
ENV NODE_ENV=production

# Copy ONLY what is needed
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./

# Use non-root user
USER node

EXPOSE 8080

CMD ["node", "dist/index.js"]