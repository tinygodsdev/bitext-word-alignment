# syntax=docker/dockerfile:1

# Debian-based image: @resvg/resvg-js ships linux-x64-gnu binaries (Alpine/musl is a separate optional dep).
FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY svelte.config.js tsconfig.json vite.config.ts ./
RUN npm ci

COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production

# adapter-node: HOST defaults to 0.0.0.0; PORT is read from the environment (Railway injects PORT).
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

RUN chown -R node:node /app
USER node

EXPOSE 3000

CMD ["node", "build"]
