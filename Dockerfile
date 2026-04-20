# syntax=docker/dockerfile:1

# App lives in bitext/. Debian image: @resvg/resvg-js uses linux-x64-gnu (not musl).
FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY bitext/package.json bitext/package-lock.json ./
COPY bitext/svelte.config.js bitext/tsconfig.json bitext/vite.config.ts ./
RUN npm ci

COPY bitext/ .
RUN npm run build && npm prune --omit=dev

FROM node:22-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production

# adapter-node: HOST defaults to 0.0.0.0; Railway sets PORT.
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

RUN chown -R node:node /app
USER node

EXPOSE 3000

CMD ["node", "build"]
