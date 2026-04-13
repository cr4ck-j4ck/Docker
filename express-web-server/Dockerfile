FROM node:18-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . ./

RUN pnpm run build

FROM node:18-alpine AS runtime

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./


EXPOSE 8080

ENTRYPOINT [ "npm","start" ]
