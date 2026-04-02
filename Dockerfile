# LiteMessenger Frontend Dockerfile (Angular SSR)
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG NG_APP_API_URL=http://localhost:5000
ARG NG_APP_WS_URL=http://localhost:5000

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 angular

COPY --from=builder --chown=angular:nodejs /app/dist/lite-messenger.web-ui/browser ./dist/lite-messenger.web-ui/browser
COPY --from=builder --chown=angular:nodejs /app/dist/lite-messenger.web-ui/server ./dist/lite-messenger.web-ui/server

USER angular

EXPOSE 4000

CMD ["node", "dist/lite-messenger.web-ui/server/server.mjs"]
